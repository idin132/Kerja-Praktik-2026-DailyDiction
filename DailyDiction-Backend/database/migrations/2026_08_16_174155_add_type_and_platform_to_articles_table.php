<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Cek dulu apakah kolom 'type' belum ada, kalau belum baru dibikin
        if (!Schema::hasColumn('articles', 'type')) {
            Schema::table('articles', function (Blueprint $table) {
                $table->string('type')->default('article')->after('slug');
            });
        }

        // Cek dulu apakah kolom 'platform' belum ada, kalau belum baru dibikin
        // Kita buang ->after() nya biar dia otomatis ditaruh di urutan paling akhir (lebih aman)
        if (!Schema::hasColumn('articles', 'platform')) {
            Schema::table('articles', function (Blueprint $table) {
                $table->json('platform')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (Schema::hasColumn('articles', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('articles', 'platform')) {
                $table->dropColumn('platform');
            }
        });
    }
};