<?php

namespace App\Observers;

use App\Models\Review;
use App\Models\Notification;
use Illuminate\Support\Str;

class ReviewObserver
{
    /**
     * Handle the Review "created" event.
     */
    public function created(Review $review): void
    {
        // Get all followers of the user who created the review
        $followers = $review->user->followers()->get();

        // Get review author info
        $authorName = $review->user->display_name ?? $review->user->email ?? 'Um usuário';

        // Create notification for each follower
        foreach ($followers as $follower) {
            Notification::create([
                'id' => Str::uuid(),
                'user_id' => $follower->id,
                'type' => 'review_posted',
                'message' => "{$authorName} publicou uma nova review de {$review->target_name}",
                'data' => [
                    'review_id' => $review->id,
                    'author_id' => $review->user_id,
                    'author_name' => $authorName,
                    'target_type' => $review->target_type,
                    'target_id' => $review->target_spotify_id,
                    'target_name' => $review->target_name,
                    'rating' => $review->rating,
                ],
                'read' => 'N',
            ]);
        }
    }

    /**
     * Handle the Review "updated" event.
     */
    public function updated(Review $review): void
    {
        //
    }

    /**
     * Handle the Review "deleted" event.
     */
    public function deleted(Review $review): void
    {
        //
    }

    /**
     * Handle the Review "restored" event.
     */
    public function restored(Review $review): void
    {
        //
    }

    /**
     * Handle the Review "force deleted" event.
     */
    public function forceDeleted(Review $review): void
    {
        //
    }
}
