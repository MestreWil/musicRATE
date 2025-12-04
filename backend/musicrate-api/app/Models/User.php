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

    /**
     * Get users that this user follows
     */
    public function following()
    {
        return $this->belongsToMany(
            User::class,
            'user_followers',
            'follower_id',
            'followed_id'
        )->wherePivot('active', 'Y');
    }

    /**
     * Get users that follow this user
     */
    public function followers()
    {
        return $this->belongsToMany(
            User::class,
            'user_followers',
            'followed_id',
            'follower_id'
        )->wherePivot('active', 'Y');
    }

    /**
     * Check if this user follows another user
     */
    public function isFollowing(string $userId): bool
    {
        return $this->following()->where('users.id', $userId)->exists();
    }

    /**
     * Get all notifications for this user
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get unread notifications count
     */
    public function unreadNotificationsCount(): int
    {
        return $this->notifications()->unread()->count();
    }
}
