<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reels', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type')->default('NEWS_FLASH'); // NEWS_FLASH / GAME_REVIEW / TIPS_GUIDE / COMMUNITY
            $table->text('caption');
            $table->string('video_url'); // URL Embed / File MP4
            $table->string('thumbnail_url')->nullable();
            $table->string('target_slug')->nullable(); // Menghubungkan ke artikel/review
            $table->integer('likes_count')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reels');
    }
};
