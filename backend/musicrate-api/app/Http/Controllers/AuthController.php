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

    public function redirectToSpotify(Request $request)
    {
        $clientId = config('services.spotify.client_id');
        $redirectUri = config('services.spotify.redirect_uri');
        $scopes = config('services.spotify.scopes', 'user-read-private user-read-email');
        
        // Armazenar return_to na sessão para preservar após callback
        $returnTo = $request->input('return_to', '/');
        $request->session()->put('oauth_return_to', $returnTo);

        $state = $this->generateState();

        $queryParams = http_build_query([
            'response_type' => 'code',
            'client_id' => $clientId,
            'scope' => $scopes,
            'redirect_uri' => $redirectUri,
            'state' => $state,
        ]);

        return redirect(self::SPOTIFY_AUTH_URL . '?' . $queryParams);
    }

    public function handleSpotifyCallback(Request $request)
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

            // Buscar dados do usuário do Spotify
            $userResponse = Http::withToken($data['access_token'])
                ->get('https://api.spotify.com/v1/me');

            if ($userResponse->failed()) {
                Log::error('Failed to fetch Spotify user data', [
                    'status' => $userResponse->status(),
                    'body' => $userResponse->body()
                ]);
                
                return response()->json([
                    'error' => 'Falha ao buscar dados do usuário no Spotify'
                ], 500);
            }

            $spotifyUser = $userResponse->json();

            // Validar dados essenciais
            if (!isset($spotifyUser['id'])) {
                Log::error('Spotify user data missing ID', [
                    'data' => $spotifyUser
                ]);
                
                return response()->json([
                    'error' => 'Dados do usuário Spotify incompletos'
                ], 500);
            }

            // Log dados recebidos para debug
            Log::info('Spotify user data received', [
                'spotify_id' => $spotifyUser['id'] ?? 'N/A',
                'has_display_name' => isset($spotifyUser['display_name']),
                'has_email' => isset($spotifyUser['email']),
                'has_images' => isset($spotifyUser['images']),
                'images_count' => isset($spotifyUser['images']) ? count($spotifyUser['images']) : 0
            ]);

            // Extrair avatar URL de forma segura
            $avatarUrl = null;
            if (isset($spotifyUser['images']) && is_array($spotifyUser['images']) && count($spotifyUser['images']) > 0) {
                $avatarUrl = $spotifyUser['images'][0]['url'] ?? null;
            }

            // Preparar dados do usuário
            $userData = [
                'display_name' => $spotifyUser['display_name'] ?? $spotifyUser['id'] ?? 'User',
                'avatar_url' => $avatarUrl,
            ];

            // Adicionar email apenas se existir (evitar problemas com unique constraint)
            if (isset($spotifyUser['email']) && !empty($spotifyUser['email'])) {
                $userData['email'] = $spotifyUser['email'];
            }

            // Criar/atualizar usuário no banco de dados
            $user = \App\Models\User::updateOrCreate(
                ['spotify_id' => $spotifyUser['id']],
                $userData
            );

            // Criar token Sanctum para o usuário
            $token = $user->createToken('spotify-auth')->plainTextToken;

            // Armazenar token na sessão (fallback)
            $request->session()->put('spotify_token', [
                'access_token' => $data['access_token'],
                'refresh_token' => $data['refresh_token'] ?? null,
                'expires_at' => now()->addSeconds($data['expires_in']),
                'user_id' => $user->id,
            ]);

            // Armazenar no cache
            $cacheKey = self::TOKEN_CACHE_PREFIX . $user->id;
            Cache::put($cacheKey, [
                'access_token' => $data['access_token'],
                'refresh_token' => $data['refresh_token'] ?? null,
                'expires_at' => now()->addSeconds($data['expires_in']),
                'sanctum_token' => $token,
            ], $data['expires_in']);

            Log::info('User authenticated successfully', [
                'user_id' => $user->id,
                'spotify_id' => $user->spotify_id,
                'has_sanctum_token' => !empty($token)
            ]);

            // Recuperar return_to da sessão
            $returnTo = $request->session()->get('oauth_return_to', '/');
            $request->session()->forget('oauth_return_to');

            // Redirecionar para o frontend com token
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            $callbackUrl = $frontendUrl . '/auth/callback?token=' . urlencode($token);
            
            // Adicionar return_to como query parameter
            if ($returnTo && $returnTo !== '/') {
                $callbackUrl .= '&return_to=' . urlencode($returnTo);
            }
            
            return redirect()->away($callbackUrl);

        } catch (\Exception $e) {
            Log::error('Spotify callback exception', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'spotify_user_data' => $spotifyUser ?? null
            ]);

            // Em desenvolvimento, mostrar mais detalhes
            $errorMessage = 'Erro interno ao processar autenticação';
            if (config('app.debug')) {
                $errorMessage .= ': ' . $e->getMessage();
            }

            return response()->json([
                'error' => $errorMessage
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
        // Revogar token Sanctum
        $request->user()?->currentAccessToken()?->delete();
        
        // Limpar sessão
        $request->session()->forget('spotify_token');
        
        // Limpar cache
        if ($request->user()) {
            $cacheKey = self::TOKEN_CACHE_PREFIX . $request->user()->id;
            Cache::forget($cacheKey);
        }

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }

    /**
     * Verifica se o usuário está autenticado e retorna seus dados
     */
    public function me(Request $request): JsonResponse
    {
        // Verificar autenticação via Sanctum
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'authenticated' => false,
                'user' => null
            ]);
        }

        // Retornar dados do usuário
        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => $user->id, // UUID do banco de dados
                'spotify_id' => $user->spotify_id, // ID do Spotify
                'name' => $user->display_name,
                'email' => $user->email,
                'avatar' => $user->avatar_url,
            ]
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