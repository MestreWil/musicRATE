<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserFollower extends Model
{
    use HasUuids;

    protected $fillable = [
        'follower_id',
        'followed_id',
        'active',
    ];

    protected $casts = [
        'active' => 'string',
    ];

    /**
     * Get the user who is following (follower)
     */
    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    /**
     * Get the user who is being followed
     */
    public function followed(): BelongsTo
    {
        return $this->belongsTo(User::class, 'followed_id');
    }

    /**
     * Check if the follow relationship is active
     */
    public function isActive(): bool
    {
        return $this->active === 'Y';
    }
}
