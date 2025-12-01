<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Services\SpotifyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    private SpotifyService $spotifyService;

    public function __construct(SpotifyService $spotifyService)
    {
        $this->spotifyService = $spotifyService;
    }

    /**
     * Lista todas as reviews (com paginação)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        
        $reviews = Review::with('user:id,name,email')
            ->latest()
            ->paginate($perPage);

        return response()->json($reviews);
    }

    /**
     * Lista reviews de um álbum específico
     */
    public function byAlbum(string $spotifyAlbumId): JsonResponse
    {
        $reviews = Review::with('user:id,name,email')
            ->byAlbum($spotifyAlbumId)
            ->latest()
            ->get();

        $stats = [
            'total' => $reviews->count(),
            'average_rating' => round($reviews->avg('rating'), 2),
            'rating_distribution' => $this->getRatingDistribution($reviews),
        ];

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }

    /**
     * Lista reviews de um usuário
     */
    public function byUser(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        
        $reviews = Review::where('user_id', $userId)
            ->latest()
            ->paginate(20);

        return response()->json($reviews);
    }

    /**
     * Cria uma nova review
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'spotify_album_id' => 'required|string|max:50',
            'rating' => 'required|integer|min:1|max:10',
            'review_text' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        // Verificar se já existe review deste usuário para este álbum
        $existingReview = Review::where('user_id', $request->user()->id)
            ->where('spotify_album_id', $request->spotify_album_id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'error' => 'Você já avaliou este álbum. Use PUT para atualizar.'
            ], 409);
        }

        // Buscar dados do álbum no Spotify para cache
        $token = $request->attributes->get('spotify_token');
        $albumData = $this->spotifyService
            ->setAccessToken($token)
            ->getAlbum($request->spotify_album_id);

        $review = Review::create([
            'user_id' => $request->user()->id,
            'spotify_album_id' => $request->spotify_album_id,
            'album_name' => $albumData['name'] ?? null,
            'artist_name' => $albumData['artists'][0]['name'] ?? null,
            'album_image_url' => $albumData['images'][0]['url'] ?? null,
            'rating' => $request->rating,
            'review_text' => $request->review_text,
        ]);

        return response()->json([
            'message' => 'Review criada com sucesso',
            'review' => $review->load('user:id,name,email'),
        ], 201);
    }

    /**
     * Exibe uma review específica
     */
    public function show(Review $review): JsonResponse
    {
        return response()->json($review->load('user:id,name,email'));
    }

    /**
     * Atualiza uma review
     */
    public function update(Request $request, Review $review): JsonResponse
    {
        // Verificar se é o dono da review
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'error' => 'Você não tem permissão para editar esta review'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|required|integer|min:1|max:10',
            'review_text' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $review->update($request->only(['rating', 'review_text']));

        return response()->json([
            'message' => 'Review atualizada com sucesso',
            'review' => $review->fresh()->load('user:id,name,email'),
        ]);
    }

    /**
     * Deleta uma review
     */
    public function destroy(Request $request, Review $review): JsonResponse
    {
        // Verificar se é o dono da review
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'error' => 'Você não tem permissão para deletar esta review'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deletada com sucesso'
        ]);
    }

    /**
     * Estatísticas gerais
     */
    public function stats(): JsonResponse
    {
        $totalReviews = Review::count();
        $averageRating = round(Review::avg('rating'), 2);
        $totalUsers = Review::distinct('user_id')->count();
        $totalAlbums = Review::distinct('spotify_album_id')->count();

        $topRatedAlbums = Review::select('spotify_album_id', 'album_name', 'artist_name', 'album_image_url')
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->groupBy('spotify_album_id', 'album_name', 'artist_name', 'album_image_url')
            ->having('review_count', '>=', 3)
            ->orderByDesc('avg_rating')
            ->limit(10)
            ->get();

        $recentReviews = Review::with('user:id,name')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'total_reviews' => $totalReviews,
            'average_rating' => $averageRating,
            'total_users' => $totalUsers,
            'total_albums_reviewed' => $totalAlbums,
            'top_rated_albums' => $topRatedAlbums,
            'recent_reviews' => $recentReviews,
        ]);
    }

    /**
     * Helper para distribuição de ratings
     */
    private function getRatingDistribution($reviews): array
    {
        $distribution = [];
        for ($i = 1; $i <= 10; $i++) {
            $distribution[$i] = $reviews->where('rating', $i)->count();
        }
        return $distribution;
    }
}
