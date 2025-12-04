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
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->comment('ID do usuário que receberá a notificação');
            $table->string('type', 50)->comment('Tipo: review_posted, new_release');
            $table->text('message')->comment('Mensagem da notificação');
            $table->json('data')->nullable()->comment('Dados extras (IDs, links, etc)');
            $table->char('read', 1)->default('N')->comment('Y = lida, N = não lida');
            $table->timestamps();

            // Foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Índices
            $table->index(['user_id', 'read', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
