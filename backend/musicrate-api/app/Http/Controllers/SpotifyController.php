<?php

namespace App\Http\Controllers;

use App\Services\SpotifyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SpotifyController extends Controller
{
    private SpotifyService $spotifyService;

    public function __construct(SpotifyService $spotifyService)
    {
        $this->spotifyService = $spotifyService;
    }

    /**
     * Obtém token para acesso público (Client Credentials)
     */
    private function getPublicToken(): ?string
    {
        return AuthController::getClientCredentialsToken();
    }

    /**
     * Busca geral (álbuns, artistas, tracks)
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q');
        $types = $request->input('type', ['album', 'artist', 'track']);
        $limit = $request->input('limit', 20);

        if (!$query) {
            return response()->json(['error' => 'Query parameter "q" is required'], 400);
        }

        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $results = $this->spotifyService
            ->setAccessToken($token)
            ->search($query, is_array($types) ? $types : explode(',', $types), $limit);

        if (!$results) {
            return response()->json(['error' => 'Falha ao buscar no Spotify'], 500);
        }

        return response()->json($results);
    }

    /**
     * Busca apenas álbuns
     */
    public function searchAlbums(Request $request): JsonResponse
    {
        $query = $request->input('q');
        $limit = $request->input('limit', 20);

        if (!$query) {
            return response()->json(['error' => 'Query parameter "q" is required'], 400);
        }

        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $results = $this->spotifyService
            ->setAccessToken($token)
            ->searchAlbums($query, $limit);

        return response()->json($results ?? ['error' => 'Nenhum resultado encontrado']);
    }

    /**
     * Busca apenas artistas
     */
    public function searchArtists(Request $request): JsonResponse
    {
        $query = $request->input('q');
        $limit = $request->input('limit', 20);

        if (!$query) {
            return response()->json(['error' => 'Query parameter "q" is required'], 400);
        }

        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $results = $this->spotifyService
            ->setAccessToken($token)
            ->searchArtists($query, $limit);

        return response()->json($results ?? ['error' => 'Nenhum resultado encontrado']);
    }

    /**
     * Detalhes de um álbum
     */
    public function getAlbum(Request $request, string $id): JsonResponse
    {
        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $album = $this->spotifyService
            ->setAccessToken($token)
            ->getAlbum($id);

        if (!$album) {
            return response()->json(['error' => 'Álbum não encontrado'], 404);
        }

        return response()->json($album);
    }

    /**
     * Tracks de um álbum
     */
    public function getAlbumTracks(Request $request, string $id): JsonResponse
    {
        $limit = $request->input('limit', 50);
        
        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $tracks = $this->spotifyService
            ->setAccessToken($token)
            ->getAlbumTracks($id, $limit);

        if (!$tracks) {
            return response()->json(['error' => 'Álbum não encontrado'], 404);
        }

        return response()->json($tracks);
    }

    /**
     * Detalhes de um artista
     */
    public function getArtist(Request $request, string $id): JsonResponse
    {
        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $artist = $this->spotifyService
            ->setAccessToken($token)
            ->getArtist($id);

        if (!$artist) {
            return response()->json(['error' => 'Artista não encontrado'], 404);
        }

        return response()->json($artist);
    }

    /**
     * Álbuns de um artista
     */
    public function getArtistAlbums(Request $request, string $id): JsonResponse
    {
        $limit = $request->input('limit', 20);
        
        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $albums = $this->spotifyService
            ->setAccessToken($token)
            ->getArtistAlbums($id, $limit);

        if (!$albums) {
            return response()->json(['error' => 'Artista não encontrado'], 404);
        }

        return response()->json($albums);
    }

    /**
     * Top tracks de um artista
     */
    public function getArtistTopTracks(Request $request, string $id): JsonResponse
    {
        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $tracks = $this->spotifyService
            ->setAccessToken($token)
            ->getArtistTopTracks($id);

        if (!$tracks) {
            return response()->json(['error' => 'Artista não encontrado'], 404);
        }

        return response()->json(['tracks' => $tracks]);
    }

    /**
     * Artistas relacionados
     */
    public function getRelatedArtists(Request $request, string $id): JsonResponse
    {
        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $artists = $this->spotifyService
            ->setAccessToken($token)
            ->getRelatedArtists($id);

        if (!$artists) {
            return response()->json(['error' => 'Artista não encontrado'], 404);
        }

        return response()->json(['artists' => $artists]);
    }

    /**
     * Detalhes de uma track
     */
    public function getTrack(Request $request, string $id): JsonResponse
    {
        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $track = $this->spotifyService
            ->setAccessToken($token)
            ->getTrack($id);

        if (!$track) {
            return response()->json(['error' => 'Track não encontrada'], 404);
        }

        return response()->json($track);
    }

    /**
     * Novos lançamentos
     */
    public function getNewReleases(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 20);
        
        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $releases = $this->spotifyService
            ->setAccessToken($token)
            ->getNewReleases($limit);

        return response()->json($releases ?? ['items' => []]);
    }

    /**
     * Categorias
     */
    public function getCategories(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 20);
        
        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $categories = $this->spotifyService
            ->setAccessToken($token)
            ->getCategories($limit);

        return response()->json($categories ?? ['items' => []]);
    }

    /**
     * Playlists de uma categoria
     */
    public function getCategoryPlaylists(Request $request, string $categoryId): JsonResponse
    {
        $limit = $request->input('limit', 20);
        
        $token = $this->getPublicToken();
        if (!$token) {
            return response()->json(['error' => 'Erro ao obter token Spotify'], 500);
        }

        $playlists = $this->spotifyService
            ->setAccessToken($token)
            ->getCategoryPlaylists($categoryId, $limit);

        return response()->json($playlists ?? ['items' => []]);
    }
}
