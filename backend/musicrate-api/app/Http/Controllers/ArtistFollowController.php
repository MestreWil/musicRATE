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

        // Get artist info from Spotify
        $spotifyService = app(SpotifyService::class);
        $artistData = null;
        try {
            $artistData = $spotifyService->getArtist($artistSpotifyId);
        } catch (\Exception $e) {
            \Log::error('Error fetching artist info when following', ['error' => $e->getMessage()]);
        }

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
            $existingFollow->active = 'Y';
            if ($artistData) {
                $existingFollow->artist_name = $artistData['name'] ?? null;
                $existingFollow->artist_image_url = isset($artistData['images'][0]['url']) ? $artistData['images'][0]['url'] : null;
            }
            $existingFollow->save();
        } else {
            // Create new follow
            ArtistFollow::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'artist_spotify_id' => $artistSpotifyId,
                'artist_name' => $artistData ? ($artistData['name'] ?? null) : null,
                'artist_image_url' => $artistData && isset($artistData['images'][0]['url']) ? $artistData['images'][0]['url'] : null,
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

        $spotifyService = app(SpotifyService::class);
        $artistsWithDetails = [];

        foreach ($follows as $follow) {
            // Use cached data from database if available
            if ($follow->artist_name && $follow->artist_image_url) {
                $artistsWithDetails[] = [
                    'spotify_artist_id' => $follow->artist_spotify_id,
                    'artist_name' => $follow->artist_name,
                    'artist_image_url' => $follow->artist_image_url,
                    'followed_at' => $follow->created_at,
                ];
            } else {
                // Fetch from Spotify if not cached
                try {
                    $artistData = $spotifyService->getArtist($follow->artist_spotify_id);
                    
                    if ($artistData) {
                        $artistName = $artistData['name'] ?? 'Unknown Artist';
                        $artistImage = isset($artistData['images'][0]['url']) ? $artistData['images'][0]['url'] : null;
                        
                        // Update cache in database
                        $follow->update([
                            'artist_name' => $artistName,
                            'artist_image_url' => $artistImage
                        ]);
                        
                        $artistsWithDetails[] = [
                            'spotify_artist_id' => $follow->artist_spotify_id,
                            'artist_name' => $artistName,
                            'artist_image_url' => $artistImage,
                            'followed_at' => $follow->created_at,
                        ];
                    } else {
                        $artistsWithDetails[] = [
                            'spotify_artist_id' => $follow->artist_spotify_id,
                            'artist_name' => 'Unknown Artist',
                            'artist_image_url' => null,
                            'followed_at' => $follow->created_at,
                        ];
                    }
                } catch (\Exception $e) {
                    \Log::error('Error fetching artist from Spotify', [
                        'artist_id' => $follow->artist_spotify_id,
                        'error' => $e->getMessage()
                    ]);
                    $artistsWithDetails[] = [
                        'spotify_artist_id' => $follow->artist_spotify_id,
                        'artist_name' => 'Unknown Artist',
                        'artist_image_url' => null,
                        'followed_at' => $follow->created_at,
                    ];
                }
            }
        }

        return response()->json([
            'artists' => $artistsWithDetails,
            'count' => count($artistsWithDetails)
        ], 200);
    }
}
