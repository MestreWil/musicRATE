<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class EnsureSpotifyToken
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar se há token no header Authorization
        $authHeader = $request->header('Authorization');
        
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
            $request->attributes->set('spotify_token', $token);
            return $next($request);
        }

        // Verificar se há token no cache (sessão do usuário)
        if ($request->user()) {
            $cacheKey = 'spotify_token_' . $request->user()->id;
            $tokenData = Cache::get($cacheKey);

            if ($tokenData && isset($tokenData['access_token'])) {
                // Verificar se o token ainda é válido
                if ($tokenData['expires_at']->isFuture()) {
                    $request->attributes->set('spotify_token', $tokenData['access_token']);
                    return $next($request);
                }

                // Token expirado
                return response()->json([
                    'error' => 'Spotify token expirado. Faça login novamente.',
                    'code' => 'TOKEN_EXPIRED'
                ], 401);
            }
        }

        return response()->json([
            'error' => 'Token Spotify não encontrado. Faça autenticação primeiro.',
            'code' => 'TOKEN_MISSING',
            'auth_url' => route('auth.spotify')
        ], 401);
    }
}
