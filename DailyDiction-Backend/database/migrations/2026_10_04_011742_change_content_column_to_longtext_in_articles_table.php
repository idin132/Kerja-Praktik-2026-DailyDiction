<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            // Mengubah kolom content & summary jadi LONGTEXT agar muat teks & gambar panjang
            $table->longText('content')->change();
            $table->longText('summary')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->text('content')->change();
            $table->text('summary')->nullable()->change();
        });
    }
};