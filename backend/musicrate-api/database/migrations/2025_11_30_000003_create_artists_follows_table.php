<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artists_follows', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('artist_spotify_id')->comment('ID do artista no Spotify');
            $table->char('active', 1)->default('Y')->comment('Y ou N');
            $table->timestamp('created_at')->useCurrent();

            // Foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Índices
            $table->index('user_id');
            $table->index('artist_spotify_id');
            $table->index('active');

            // Constraint: Um usuário só pode seguir um artista uma vez
            $table->unique(['user_id', 'artist_spotify_id'], 'unique_user_artist');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artists_follows');
    }
};
