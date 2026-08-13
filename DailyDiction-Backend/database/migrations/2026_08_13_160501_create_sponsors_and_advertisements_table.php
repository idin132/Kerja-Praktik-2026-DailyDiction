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
    Schema::create('sponsors', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('logo_image');
        $table->timestamps();
    });

    Schema::create('advertisements', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('banner_image');
        $table->string('url_link');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sponsors_and_advertisements');
    }
};
