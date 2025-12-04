<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Notification extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'type',
        'message',
        'data',
        'read',
    ];

    protected $casts = [
        'data' => 'array',
        'read' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who receives this notification
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get only unread notifications
     */
    public function scopeUnread(Builder $query): Builder
    {
        return $query->where('read', 'N');
    }

    /**
     * Scope to get only read notifications
     */
    public function scopeRead(Builder $query): Builder
    {
        return $query->where('read', 'Y');
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(): void
    {
        $this->update(['read' => 'Y']);
    }

    /**
     * Check if notification is unread
     */
    public function isUnread(): bool
    {
        return $this->read === 'N';
    }
}
