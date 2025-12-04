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
        Schema::create('user_followers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('follower_id')->comment('ID do usuário que está seguindo');
            $table->uuid('followed_id')->comment('ID do usuário sendo seguido');
            $table->char('active', 1)->default('Y')->comment('Y = seguindo, N = parou de seguir');
            $table->timestamps();

            // Foreign keys
            $table->foreign('follower_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('followed_id')->references('id')->on('users')->onDelete('cascade');

            // Índices
            $table->index(['follower_id', 'active']);
            $table->index(['followed_id', 'active']);
            
            // Garantir que um usuário não pode seguir o mesmo usuário múltiplas vezes
            $table->unique(['follower_id', 'followed_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_followers');
    }
};
