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
        Schema::table('articles', function (Blueprint $table) {
            // Coba hapus foreign key jika ada, abaikan jika sudah tidak ada
            try {
                $table->dropForeign(['category_id']);
            } catch (\Exception $e) {
                // Foreign key sudah terhapus / tidak ditemukan
            }

            // Hapus kolom category_id jika masih ada
            if (Schema::hasColumn('articles', 'category_id')) {
                $table->dropColumn('category_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (!Schema::hasColumn('articles', 'category_id')) {
                $table->unsignedBigInteger('category_id')->nullable();
            }
        });
    }
};