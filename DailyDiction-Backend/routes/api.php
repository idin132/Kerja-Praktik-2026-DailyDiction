<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Models\Sponsor;
use App\Models\Advertisement;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/featured', [ArticleController::class, 'featured']);
    Route::get('/articles/{slug}', [ArticleController::class, 'show']);
    Route::get('/reviews', [ArticleController::class, 'reviews']);  
    Route::get('/reviews/{slug}', [ArticleController::class, 'showReview']); 
    
    Route::get('/reels', [ArticleController::class, 'reels']);
    
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