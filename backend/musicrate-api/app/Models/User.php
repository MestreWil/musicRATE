<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasUuids;

    protected $fillable = [
        'spotify_id',
        'display_name',
        'avatar_url',
        'email',
    ];

    protected $hidden = [
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Relacionamento com Reviews
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Relacionamento com Artistas seguidos
     */
    public function artistsFollows()
    {
        return $this->hasMany(ArtistFollow::class);
    }

    /**
     * Verifica se o usuário segue um artista
     */
    public function followsArtist(string $artistSpotifyId): bool
    {
        return $this->artistsFollows()
            ->where('artist_spotify_id', $artistSpotifyId)
            ->where('active', 'Y')
            ->exists();
    }
}
