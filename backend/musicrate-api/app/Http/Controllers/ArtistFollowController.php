<?php

namespace App\Http\Controllers;

use App\Models\ArtistFollow;
use App\Services\SpotifyService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArtistFollowController extends Controller
{
    /**
     * Follow an artist
     */
    public function follow(Request $request, string $artistSpotifyId)
    {
        $user = $request->user();

        // Check if already following
        $existingFollow = ArtistFollow::where('user_id', $user->id)
            ->where('artist_spotify_id', $artistSpotifyId)
            ->first();

        if ($existingFollow) {
            if ($existingFollow->active === 'Y') {
                return response()->json([
                    'message' => 'Você já segue este artista',
                    'is_following' => true
                ], 200);
            }
            // Reactivate follow
            $existingFollow->update(['active' => 'Y']);
        } else {
            // Create new follow
            ArtistFollow::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'artist_spotify_id' => $artistSpotifyId,
                'active' => 'Y',
            ]);
        }

        return response()->json([
            'message' => 'Você agora segue este artista',
            'is_following' => true
        ], 200);
    }

    /**
     * Unfollow an artist
     */
    public function unfollow(Request $request, string $artistSpotifyId)
    {
        $user = $request->user();

        $follow = ArtistFollow::where('user_id', $user->id)
            ->where('artist_spotify_id', $artistSpotifyId)
            ->where('active', 'Y')
            ->first();

        if (!$follow) {
            return response()->json([
                'message' => 'Você não segue este artista',
                'is_following' => false
            ], 200);
        }

        $follow->update(['active' => 'N']);

        return response()->json([
            'message' => 'Você deixou de seguir este artista',
            'is_following' => false
        ], 200);
    }

    /**
     * Check if current user follows an artist
     */
    public function checkFollowing(Request $request, string $artistSpotifyId)
    {
        $user = $request->user();
        $isFollowing = $user->followsArtist($artistSpotifyId);

        return response()->json([
            'is_following' => $isFollowing
        ], 200);
    }

    /**
     * Get artists followed by a user
     */
    public function followedArtists(Request $request, string $userId)
    {
        $follows = ArtistFollow::where('user_id', $userId)
            ->where('active', 'Y')
            ->get();

        // Get artist details from Spotify
        $spotifyService = app(SpotifyService::class);
        $artistsWithDetails = [];

        foreach ($follows as $follow) {
            try {
                $artistData = $spotifyService->getArtist($follow->artist_spotify_id);
                $artistsWithDetails[] = [
                    'spotify_artist_id' => $follow->artist_spotify_id,
                    'artist_name' => $artistData['name'] ?? 'Unknown Artist',
                    'artist_image_url' => $artistData['images'][0]['url'] ?? null,
                    'followed_at' => $follow->created_at,
                ];
            } catch (\Exception $e) {
                // If artist not found on Spotify, include basic info
                $artistsWithDetails[] = [
                    'spotify_artist_id' => $follow->artist_spotify_id,
                    'artist_name' => 'Unknown Artist',
                    'artist_image_url' => null,
                    'followed_at' => $follow->created_at,
                ];
            }
        }

        return response()->json([
            'artists' => $artistsWithDetails,
            'count' => count($artistsWithDetails)
        ], 200);
    }
}
