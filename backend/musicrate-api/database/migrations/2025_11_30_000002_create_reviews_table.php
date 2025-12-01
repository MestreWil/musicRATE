<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('target_type')->comment('Tipo: album, track, artist, playlist');
            $table->string('target_spotify_id')->comment('ID do item no Spotify');
            $table->integer('rating')->comment('Nota de 1 a 10');
            $table->text('review_text')->nullable()->comment('Texto da review');
            $table->char('active', 1)->default('Y')->comment('Y ou N');
            $table->timestamps();

            // Foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Índices
            $table->index(['target_type', 'target_spotify_id']);
            $table->index('user_id');
            $table->index('active');
            $table->index('rating');
            $table->index('created_at');

            // Constraint: Um usuário pode fazer apenas uma review por item
            $table->unique(['user_id', 'target_type', 'target_spotify_id'], 'unique_user_review');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
