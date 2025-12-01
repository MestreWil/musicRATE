<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('spotify_id')->unique()->comment('ID do usuário no Spotify');
            $table->string('display_name')->nullable()->comment('Nome de exibição do Spotify');
            $table->text('avatar_url')->nullable()->comment('URL da foto de perfil');
            $table->string('email')->nullable()->unique();
            $table->timestamps();

            $table->index('spotify_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
