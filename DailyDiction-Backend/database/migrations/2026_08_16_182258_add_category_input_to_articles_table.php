<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (!Schema::hasColumn('articles', 'category_input')) {
                // Pakai tipe json karena nyimpen array (bisa lebih dari 1 kategori)
                $table->json('category_input')->nullable(); 
            }
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (Schema::hasColumn('articles', 'category_input')) {
                $table->dropColumn('category_input');
            }
        });
    }
};
