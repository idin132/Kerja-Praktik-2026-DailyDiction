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

    // Jembatan untuk Sponsor (Dimasukkan ke v1 biar rapi)
    Route::get('/sponsors', function () {
        return response()->json([
            'data' => Sponsor::latest()->get()
        ]);
    });

    // Jembatan untuk Iklan (Dimasukkan ke v1 biar rapi)
    Route::get('/advertisements', function () {
        return response()->json([
            'data' => Advertisement::latest()->get()
        ]);
    });
});