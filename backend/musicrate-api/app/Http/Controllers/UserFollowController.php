<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserFollower;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserFollowController extends Controller
{
    /**
     * Follow a user
     */
    public function follow(Request $request, string $userId)
    {
        $currentUser = $request->user();

        // Can't follow yourself
        if ($currentUser->id === $userId) {
            return response()->json([
                'message' => 'Você não pode seguir a si mesmo'
            ], 400);
        }

        // Check if target user exists
        $targetUser = User::find($userId);
        if (!$targetUser) {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        // Check if already following
        $existingFollow = UserFollower::where('follower_id', $currentUser->id)
            ->where('followed_id', $userId)
            ->first();

        if ($existingFollow) {
            if ($existingFollow->active === 'Y') {
                return response()->json([
                    'message' => 'Você já segue este usuário',
                    'is_following' => true
                ], 200);
            }
            // Reactivate follow
            $existingFollow->update(['active' => 'Y']);
        } else {
            // Create new follow
            UserFollower::create([
                'id' => Str::uuid(),
                'follower_id' => $currentUser->id,
                'followed_id' => $userId,
                'active' => 'Y',
            ]);
        }

        // Create notification for the followed user
        $followerName = $currentUser->display_name ?? $currentUser->email ?? 'Um usuário';
        Notification::create([
            'id' => Str::uuid(),
            'user_id' => $userId, // The user who was followed
            'type' => 'new_follower',
            'message' => "{$followerName} começou a seguir você!",
            'data' => [
                'follower_id' => $currentUser->id,
                'follower_name' => $followerName,
                'follower_avatar' => $currentUser->avatar_url,
            ],
            'read' => 'N',
        ]);

        return response()->json([
            'message' => 'Você agora segue este usuário',
            'is_following' => true
        ], 200);
    }

    /**
     * Unfollow a user
     */
    public function unfollow(Request $request, string $userId)
    {
        $currentUser = $request->user();

        $follow = UserFollower::where('follower_id', $currentUser->id)
            ->where('followed_id', $userId)
            ->where('active', 'Y')
            ->first();

        if (!$follow) {
            return response()->json([
                'message' => 'Você não segue este usuário',
                'is_following' => false
            ], 200);
        }

        $follow->update(['active' => 'N']);

        return response()->json([
            'message' => 'Você deixou de seguir este usuário',
            'is_following' => false
        ], 200);
    }

    /**
     * Get followers of a user
     */
    public function followers(string $userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        $followers = $user->followers()
            ->select('users.id', 'users.display_name', 'users.avatar_url', 'users.spotify_id')
            ->get();

        return response()->json([
            'followers' => $followers,
            'count' => $followers->count()
        ], 200);
    }

    /**
     * Get users that a user is following
     */
    public function following(string $userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        $following = $user->following()
            ->select('users.id', 'users.display_name', 'users.avatar_url', 'users.spotify_id')
            ->get();

        return response()->json([
            'following' => $following,
            'count' => $following->count()
        ], 200);
    }

    /**
     * Check if current user follows target user
     */
    public function checkFollowing(Request $request, string $userId)
    {
        $currentUser = $request->user();
        $isFollowing = $currentUser->isFollowing($userId);

        return response()->json([
            'is_following' => $isFollowing
        ], 200);
    }

    /**
     * Get total count of following (users + artists)
     */
    public function followingTotal(string $userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        // Count users following
        $usersCount = $user->following()->count();

        // Count artists following
        $artistsCount = $user->artistsFollows()
            ->where('active', 'Y')
            ->count();

        return response()->json([
            'users_count' => $usersCount,
            'artists_count' => $artistsCount,
            'total_count' => $usersCount + $artistsCount
        ], 200);
    }
}
