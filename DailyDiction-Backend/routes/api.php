<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Models\Sponsor;
use App\Models\Advertisement;
use App\Http\Controllers\YoutubeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    // Cuma butuh 3 baris ini untuk artikel & review!
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/featured', [ArticleController::class, 'featured']);
    Route::get('/articles/{slug}', [ArticleController::class, 'show']);
    
    Route::get('/reels', [ArticleController::class, 'reels']);
    Route::get('/youtube-videos', [YoutubeController::class, 'getVideos']);
    Route::get('/youtube-shorts', [YoutubeController::class, 'getShorts']);
    
    // Jembatan untuk Sponsor (Dari Rizqi)
    Route::get('/sponsors', function () {
        return response()->json([
            'data' => Sponsor::latest()->get()
        ]);
    });

    // Jembatan untuk Iklan (Dari Rizqi)
    Route::get('/advertisements', function () {
        return response()->json([
            'data' => Advertisement::latest()->get()
        ]);
    });
});