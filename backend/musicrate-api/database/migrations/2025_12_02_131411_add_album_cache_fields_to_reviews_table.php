<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // Adicionar campos de cache para facilitar listagens
            $table->string('spotify_album_id')->nullable()->after('target_spotify_id');
            $table->string('album_name')->nullable()->after('spotify_album_id');
            $table->string('artist_name')->nullable()->after('album_name');
            $table->string('album_image_url')->nullable()->after('artist_name');
            
            // Índice para facilitar buscas por álbum
            $table->index('spotify_album_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['spotify_album_id']);
            $table->dropColumn(['spotify_album_id', 'album_name', 'artist_name', 'album_image_url']);
        });
    }
};
