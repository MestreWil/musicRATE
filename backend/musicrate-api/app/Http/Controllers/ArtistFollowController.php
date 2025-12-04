<?php

namespace App\Http\Controllers;

use App\Models\ArtistFollow;
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

        return response()->json([
            'artists' => $follows->map(fn($f) => [
                'artist_spotify_id' => $f->artist_spotify_id,
                'followed_at' => $f->created_at,
            ]),
            'count' => $follows->count()
        ], 200);
    }
}
