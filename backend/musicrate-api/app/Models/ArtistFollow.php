<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArtistFollow extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'artists_follows';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'artist_spotify_id',
        'active',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Relacionamento com User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para follows ativos
     */
    public function scopeActive($query)
    {
        return $query->where('active', 'Y');
    }

    /**
     * Scope para filtrar por artista
     */
    public function scopeByArtist($query, string $artistSpotifyId)
    {
        return $query->where('artist_spotify_id', $artistSpotifyId);
    }

    /**
     * Conta quantos usuários seguem um artista
     */
    public static function countFollowersForArtist(string $artistSpotifyId): int
    {
        return static::active()
            ->byArtist($artistSpotifyId)
            ->count();
    }
}
