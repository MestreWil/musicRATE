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
        Schema::table('artists_follows', function (Blueprint $table) {
            $table->string('artist_name')->nullable()->after('artist_spotify_id');
            $table->text('artist_image_url')->nullable()->after('artist_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artists_follows', function (Blueprint $table) {
            $table->dropColumn(['artist_name', 'artist_image_url']);
        });
    }
};
