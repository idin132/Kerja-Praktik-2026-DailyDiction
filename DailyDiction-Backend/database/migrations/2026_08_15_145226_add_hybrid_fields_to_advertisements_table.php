<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            // Nambahin kolom tipe iklan (banner / script)
            $table->string('type')->default('banner')->after('title');
            // Nambahin kolom untuk nyimpen script Google Ads
            $table->text('script_code')->nullable()->after('url_link');
            
            // Bikin gambar dan link jadi opsional (karena kalau Google Ads kan ga butuh ini)
            $table->string('banner_image')->nullable()->change();
            $table->string('url_link')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropColumn(['type', 'script_code']);
            $table->string('banner_image')->nullable(false)->change();
            $table->string('url_link')->nullable(false)->change();
        });
    }
};