<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SpotifyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - MusicRATE
|--------------------------------------------------------------------------
| Arquitetura:
| - Público: Ver reviews, buscar no Spotify
| - Autenticado (Spotify OAuth): Criar/editar/deletar reviews
*/

// =====================================================
// ROTAS PÚBLICAS (sem autenticação)
// =====================================================

// Autenticação OAuth Spotify (precisa de sessão para OAuth flow)
Route::prefix('auth')->middleware(['web'])->group(function () {
    Route::get('/spotify', [AuthController::class, 'redirectToSpotify'])->name('auth.spotify');
    Route::get('/callback', [AuthController::class, 'handleSpotifyCallback'])->name('auth.callback');
});

// Auth check - usa Sanctum Bearer token
Route::prefix('auth')->group(function () {
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum')->name('auth.me');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('auth.logout');
});

// ROTA TEMPORÁRIA DE DEBUG
Route::get('/debug/reviews-test', function(\Illuminate\Http\Request $request) {
    $token = $request->bearerToken();
    $user = $request->user();
    
    return response()->json([
        'has_bearer_token' => $token !== null,
        'token_preview' => $token ? substr($token, 0, 20) . '...' : null,
        'authenticated' => $user !== null,
        'user_id' => $user?->id,
    ]);
})->middleware('auth:sanctum');

// ROTA TEMPORÁRIA - DESENVOLVIMENTO: Criar usuário
Route::post('/dev/users', function(\Illuminate\Http\Request $request) {
    \Log::info('Request received', ['all' => $request->all(), 'json' => $request->json()->all()]);
    
    $user = \App\Models\User::create([
        'spotify_id' => $request->input('spotify_id') ?? 'spotify_' . uniqid(),
        'display_name' => $request->input('display_name') ?? 'Test User',
        'avatar_url' => $request->input('avatar_url'),
        'email' => $request->input('email'),
    ]);
    
    return response()->json([
        'message' => 'Usuário criado com sucesso',
        'user' => $user
    ], 201);
});

// =====================================================
// ROTAS AUTENTICADAS (Spotify OAuth) - DEVEM VIR PRIMEIRO
// =====================================================

Route::middleware(['auth:sanctum'])->group(function () {
    
    // Gerenciamento de token
    Route::prefix('auth')->group(function () {
        Route::get('/token', [AuthController::class, 'getToken'])->name('auth.token');
    });

    // Reviews protegidas (criar, editar, deletar)
    Route::prefix('reviews')->group(function () {
        Route::get('/me', [ReviewController::class, 'byUser'])->name('reviews.me');
        Route::post('/', [ReviewController::class, 'store'])->name('reviews.store');
        Route::put('/{review}', [ReviewController::class, 'update'])->name('reviews.update');
        Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
    });
});

// Reviews (leitura pública)
Route::prefix('reviews')->group(function () {
    Route::get('/', [ReviewController::class, 'index'])->name('reviews.index');
    Route::get('/stats', [ReviewController::class, 'stats'])->name('reviews.stats');
    Route::get('/album/{spotifyAlbumId}', [ReviewController::class, 'byAlbum'])->name('reviews.album');
    Route::get('/{targetType}/{targetSpotifyId}', [ReviewController::class, 'byTarget'])->name('reviews.by_target')
        ->where('targetType', 'album|track|single');
    // Esta deve ser a última porque é genérica
    Route::get('/{review}', [ReviewController::class, 'show'])->name('reviews.show');
});

// Spotify API (acesso público com Client Credentials)
Route::prefix('spotify')->group(function () {
    // Busca
    Route::get('/search', [SpotifyController::class, 'search'])->name('spotify.search');
    Route::get('/search/albums', [SpotifyController::class, 'searchAlbums'])->name('spotify.search.albums');
    Route::get('/search/artists', [SpotifyController::class, 'searchArtists'])->name('spotify.search.artists');

    // Álbuns
    Route::get('/albums/{id}', [SpotifyController::class, 'getAlbum'])->name('spotify.album');
    Route::get('/albums/{id}/tracks', [SpotifyController::class, 'getAlbumTracks'])->name('spotify.album.tracks');

    // Artistas
    Route::get('/artists/{id}', [SpotifyController::class, 'getArtist'])->name('spotify.artist');
    Route::get('/artists/{id}/albums', [SpotifyController::class, 'getArtistAlbums'])->name('spotify.artist.albums');
    Route::get('/artists/{id}/top-tracks', [SpotifyController::class, 'getArtistTopTracks'])->name('spotify.artist.top');
    Route::get('/artists/{id}/related', [SpotifyController::class, 'getRelatedArtists'])->name('spotify.artist.related');

    // Tracks
    Route::get('/tracks/{id}', [SpotifyController::class, 'getTrack'])->name('spotify.track');

    // Browse
    Route::get('/browse/new-releases', [SpotifyController::class, 'getNewReleases'])->name('spotify.new.releases');
    Route::get('/browse/categories', [SpotifyController::class, 'getCategories'])->name('spotify.categories');
    Route::get('/browse/categories/{id}/playlists', [SpotifyController::class, 'getCategoryPlaylists'])->name('spotify.category.playlists');
});

Route::prefix('public')->group(function () {
    Route::get('/reviews', [ReviewController::class, 'index'])->name('public.reviews');
    Route::get('/reviews/album/{spotifyAlbumId}', [ReviewController::class, 'byAlbum'])->name('public.reviews.album');
    Route::get('/reviews/stats', [ReviewController::class, 'stats'])->name('public.reviews.stats');
});
