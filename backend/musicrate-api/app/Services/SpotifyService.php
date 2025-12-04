<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SpotifyService
{
    private const BASE_URL = 'https://api.spotify.com/v1';
    private const CACHE_TTL = 3600; // 1 hora

    private ?string $accessToken;

    public function __construct(?string $accessToken = null)
    {
        $this->accessToken = $accessToken;
    }

    /**
     * Define o access token
     */
    public function setAccessToken(string $token): self
    {
        $this->accessToken = $token;
        return $this;
    }

    /**
     * Busca geral (álbuns, artistas, tracks)
     */
    public function search(string $query, array $types = ['album', 'artist', 'track'], int $limit = 20): ?array
    {
        $cacheKey = 'spotify_search_' . md5($query . implode(',', $types) . $limit);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($query, $types, $limit) {
            $response = $this->makeRequest('GET', '/search', [
                'q' => $query,
                'type' => implode(',', $types),
                'limit' => $limit,
                'market' => 'BR',
            ]);

            return $response['success'] ? $response['data'] : null;
        });
    }

    /**
     * Busca apenas álbuns
     */
    public function searchAlbums(string $query, int $limit = 20): ?array
    {
        $result = $this->search($query, ['album'], $limit);
        return $result['albums'] ?? null;
    }

    /**
     * Busca apenas artistas
     */
    public function searchArtists(string $query, int $limit = 20): ?array
    {
        $result = $this->search($query, ['artist'], $limit);
        return $result['artists'] ?? null;
    }

    /**
     * Obtém detalhes de um álbum
     */
    public function getAlbum(string $albumId): ?array
    {
        $cacheKey = "spotify_album_{$albumId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($albumId) {
            $response = $this->makeRequest('GET', "/albums/{$albumId}", [
                'market' => 'BR',
            ]);

            return $response['success'] ? $response['data'] : null;
        });
    }

    /**
     * Obtém múltiplos álbuns de uma vez
     */
    public function getAlbums(array $albumIds): ?array
    {
        $ids = implode(',', array_slice($albumIds, 0, 20)); // Máximo 20

        $response = $this->makeRequest('GET', '/albums', [
            'ids' => $ids,
            'market' => 'BR',
        ]);

        return $response['success'] ? $response['data']['albums'] : null;
    }

    /**
     * Obtém tracks de um álbum
     */
    public function getAlbumTracks(string $albumId, int $limit = 50): ?array
    {
        $cacheKey = "spotify_album_tracks_{$albumId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($albumId, $limit) {
            $response = $this->makeRequest('GET', "/albums/{$albumId}/tracks", [
                'limit' => $limit,
                'market' => 'BR',
            ]);

            return $response['success'] ? $response['data'] : null;
        });
    }

    /**
     * Obtém detalhes de um artista
     */
    public function getArtist(string $artistId): ?array
    {
        $cacheKey = "spotify_artist_{$artistId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($artistId) {
            $response = $this->makeRequest('GET', "/artists/{$artistId}");

            return $response['success'] ? $response['data'] : null;
        });
    }

    /**
     * Obtém álbuns de um artista
     */
    public function getArtistAlbums(string $artistId, int $limit = 20): ?array
    {
        $cacheKey = "spotify_artist_albums_{$artistId}_{$limit}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($artistId, $limit) {
            $response = $this->makeRequest('GET', "/artists/{$artistId}/albums", [
                'limit' => $limit,
                'market' => 'BR',
                'include_groups' => 'album,single',
            ]);

            return $response['success'] ? $response['data'] : null;
        });
    }

    /**
     * Obtém top tracks de um artista
     */
    public function getArtistTopTracks(string $artistId): ?array
    {
        $cacheKey = "spotify_artist_top_tracks_{$artistId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($artistId) {
            $response = $this->makeRequest('GET', "/artists/{$artistId}/top-tracks", [
                'market' => 'BR',
            ]);

            return $response['success'] ? $response['data']['tracks'] : null;
        });
    }

    /**
     * Obtém artistas relacionados
     */
    public function getRelatedArtists(string $artistId): ?array
    {
        $cacheKey = "spotify_related_artists_{$artistId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($artistId) {
            $response = $this->makeRequest('GET', "/artists/{$artistId}/related-artists");

            return $response['success'] ? $response['data']['artists'] : null;
        });
    }

    /**
     * Obtém detalhes de uma track
     */
    public function getTrack(string $trackId): ?array
    {
        $cacheKey = "spotify_track_{$trackId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($trackId) {
            $response = $this->makeRequest('GET', "/tracks/{$trackId}", [
                'market' => 'BR',
            ]);

            return $response['success'] ? $response['data'] : null;
        });
    }

    /**
     * Obtém novos lançamentos (filtrados por popularidade máxima)
     */
    public function getNewReleases(int $limit = 20, ?int $maxPopularity = null): ?array
    {
        $cacheKey = "spotify_new_releases_{$limit}_pop_" . ($maxPopularity ?? 'all');

        return Cache::remember($cacheKey, 1800, function () use ($limit, $maxPopularity) { // 30 min
            // Buscar mais itens para compensar filtro
            $fetchLimit = $maxPopularity ? min($limit * 3, 50) : $limit;
            
            $response = $this->makeRequest('GET', '/browse/new-releases', [
                'limit' => $fetchLimit,
                'country' => 'BR',
            ]);

            if (!$response['success'] || !isset($response['data']['albums'])) {
                return null;
            }

            $albums = $response['data']['albums'];

            // Filtrar por popularidade se especificado
            if ($maxPopularity !== null && isset($albums['items'])) {
                $albums['items'] = array_filter($albums['items'], function($album) use ($maxPopularity) {
                    // Verificar popularidade dos artistas
                    if (!empty($album['artists'])) {
                        foreach ($album['artists'] as $artist) {
                            // Buscar dados completos do artista para pegar popularidade
                            $artistData = $this->getArtist($artist['id']);
                            if ($artistData && isset($artistData['popularity'])) {
                                return $artistData['popularity'] <= $maxPopularity;
                            }
                        }
                    }
                    return true; // Manter se não tiver dados de popularidade
                });

                // Re-indexar array e limitar ao número solicitado
                $albums['items'] = array_values(array_slice($albums['items'], 0, $limit));
            }

            return $albums;
        });
    }

    /**
     * Obtém categorias
     */
    public function getCategories(int $limit = 20): ?array
    {
        $cacheKey = "spotify_categories_{$limit}";

        return Cache::remember($cacheKey, 7200, function () use ($limit) { // 2 horas
            $response = $this->makeRequest('GET', '/browse/categories', [
                'limit' => $limit,
                'country' => 'BR',
                'locale' => 'pt_BR',
            ]);

            return $response['success'] ? $response['data']['categories'] : null;
        });
    }

    /**
     * Obtém playlists de uma categoria
     */
    public function getCategoryPlaylists(string $categoryId, int $limit = 20): ?array
    {
        $cacheKey = "spotify_category_playlists_{$categoryId}_{$limit}";

        return Cache::remember($cacheKey, 3600, function () use ($categoryId, $limit) {
            $response = $this->makeRequest('GET', "/browse/categories/{$categoryId}/playlists", [
                'limit' => $limit,
                'country' => 'BR',
            ]);

            return $response['success'] ? $response['data']['playlists'] : null;
        });
    }

    /**
     * Faz requisição HTTP para API Spotify
     */
    private function makeRequest(string $method, string $endpoint, array $params = []): array
    {
        try {
            $url = self::BASE_URL . $endpoint;

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
                'Content-Type' => 'application/json',
            ])->$method($url, $method === 'GET' ? $params : [], $method !== 'GET' ? $params : []);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                ];
            }

            // Tratar erros específicos
            $statusCode = $response->status();
            $error = $response->json();

            Log::warning('Spotify API error', [
                'endpoint' => $endpoint,
                'status' => $statusCode,
                'error' => $error,
            ]);

            return [
                'success' => false,
                'error' => $error['error']['message'] ?? 'Unknown error',
                'status' => $statusCode,
            ];

        } catch (\Exception $e) {
            Log::error('Spotify API exception', [
                'endpoint' => $endpoint,
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Limpa cache de um item específico
     */
    public function clearCache(string $key): void
    {
        Cache::forget($key);
    }

    /**
     * Limpa todo cache do Spotify
     */
    public function clearAllCache(): void
    {
        Cache::flush();
    }
}
