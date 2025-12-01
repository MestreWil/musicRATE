<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'target_type',
        'target_spotify_id',
        'rating',
        'review_text',
        'active',
    ];

    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relacionamento com User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para reviews ativas
     */
    public function scopeActive($query)
    {
        return $query->where('active', 'Y');
    }

    /**
     * Scope para filtrar por tipo e ID do Spotify
     */
    public function scopeByTarget($query, string $targetType, string $targetSpotifyId)
    {
        return $query->where('target_type', $targetType)
                     ->where('target_spotify_id', $targetSpotifyId);
    }

    /**
     * Scope para filtrar por rating mínimo
     */
    public function scopeMinimumRating($query, int $rating)
    {
        return $query->where('rating', '>=', $rating);
    }

    /**
     * Scope para reviews recentes
     */
    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Calcula média de rating para um target específico
     */
    public static function averageRatingForTarget(string $targetType, string $targetSpotifyId): float
    {
        return static::active()
            ->byTarget($targetType, $targetSpotifyId)
            ->avg('rating') ?? 0;
    }

    /**
     * Conta total de reviews para um target
     */
    public static function countForTarget(string $targetType, string $targetSpotifyId): int
    {
        return static::active()
            ->byTarget($targetType, $targetSpotifyId)
            ->count();
    }
}
