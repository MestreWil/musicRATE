<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    private const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
    private const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
    private const TOKEN_CACHE_PREFIX = 'spotify_token_';

    public function redirectToSpotify()
    {
        $clientId = config('services.spotify.client_id');
        $redirectUri = config('services.spotify.redirect_uri');
        $scopes = config('services.spotify.scopes', 'user-read-private user-read-email');

        $queryParams = http_build_query([
            'response_type' => 'code',
            'client_id' => $clientId,
            'scope' => $scopes,
            'redirect_uri' => $redirectUri,
            'state' => $this->generateState(),
        ]);

        return redirect(self::SPOTIFY_AUTH_URL . '?' . $queryParams);
    }

    public function handleSpotifyCallback(Request $request): JsonResponse
    {
        // Validar erro do Spotify
        if ($request->has('error')) {
            Log::warning('Spotify auth error', ['error' => $request->input('error')]);
            return response()->json([
                'error' => 'Autenticação cancelada ou negada'
            ], 401);
        }

        // Validar presença do código
        if (!$request->has('code')) {
            return response()->json([
                'error' => 'Código de autorização não encontrado'
            ], 400);
        }

        // Validar state (proteção CSRF)
        if (!$this->validateState($request->input('state'))) {
            return response()->json([
                'error' => 'State inválido. Possível ataque CSRF'
            ], 403);
        }

        try {
            $response = Http::asForm()->post(self::SPOTIFY_TOKEN_URL, [
                'grant_type' => 'authorization_code',
                'code' => $request->input('code'),
                'redirect_uri' => config('services.spotify.redirect_uri'),
                'client_id' => config('services.spotify.client_id'),
                'client_secret' => config('services.spotify.client_secret'),
            ]);

            if ($response->failed()) {
                Log::error('Spotify token request failed', [
                    'status' => $response->status(),
                    'body' => $response->json()
                ]);

                return response()->json([
                    'error' => 'Falha ao obter token do Spotify'
                ], 500);
            }

            $data = $response->json();

            // Validar resposta
            if (!isset($data['access_token'], $data['expires_in'])) {
                return response()->json([
                    'error' => 'Resposta inválida do Spotify'
                ], 500);
            }

            // Armazenar token no cache (mais eficiente que sessão)
            $userId = $request->user()?->id ?? 'guest_' . $request->ip();
            $cacheKey = self::TOKEN_CACHE_PREFIX . $userId;

            Cache::put($cacheKey, [
                'access_token' => $data['access_token'],
                'refresh_token' => $data['refresh_token'] ?? null,
                'expires_at' => now()->addSeconds($data['expires_in']),
            ], $data['expires_in']);

            return response()->json([
                'message' => 'Autenticação realizada com sucesso',
                'access_token' => $data['access_token'],
                'expires_in' => $data['expires_in']
            ]);

        } catch (\Exception $e) {
            Log::error('Spotify callback exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Erro interno ao processar autenticação'
            ], 500);
        }
    }

    private function generateState(): string
    {
        $state = bin2hex(random_bytes(16));
        Cache::put('spotify_state_' . $state, true, 600); // 10 minutos
        return $state;
    }

    private function validateState(?string $state): bool
    {
        if (!$state) {
            return false;
        }

        $cacheKey = 'spotify_state_' . $state;
        if (Cache::has($cacheKey)) {
            Cache::forget($cacheKey);
            return true;
        }

        return false;
    }

    public function getToken(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 'guest_' . $request->ip();
        $cacheKey = self::TOKEN_CACHE_PREFIX . $userId;

        $tokenData = Cache::get($cacheKey);

        if (!$tokenData) {
            return response()->json([
                'error' => 'Token não encontrado. Faça login novamente'
            ], 401);
        }

        return response()->json([
            'access_token' => $tokenData['access_token'],
            'expires_at' => $tokenData['expires_at']
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 'guest_' . $request->ip();
        $cacheKey = self::TOKEN_CACHE_PREFIX . $userId;

        Cache::forget($cacheKey);

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }

    /**
     * Obtém token via Client Credentials (para acesso público)
     */
    public static function getClientCredentialsToken(): ?string
    {
        $cacheKey = 'spotify_client_credentials_token';

        return Cache::remember($cacheKey, 3500, function () {
            try {
                $response = Http::asForm()->post(self::SPOTIFY_TOKEN_URL, [
                    'grant_type' => 'client_credentials',
                    'client_id' => config('services.spotify.client_id'),
                    'client_secret' => config('services.spotify.client_secret'),
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    return $data['access_token'] ?? null;
                }

                Log::error('Failed to get Spotify client credentials token', [
                    'status' => $response->status(),
                    'body' => $response->json()
                ]);

                return null;
            } catch (\Exception $e) {
                Log::error('Exception getting Spotify client credentials', [
                    'message' => $e->getMessage()
                ]);

                return null;
            }
        });
    }
}