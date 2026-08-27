<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Models\Sponsor;
use App\Models\Advertisement;
use App\Models\Category;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\YoutubeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// SEMUA ROUTE DI BAWAH INI PUNYA PREFIX /v1/
Route::prefix('v1')->group(function () {
    // Cuma butuh 3 baris ini untuk artikel & review!
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/featured', [ArticleController::class, 'featured']);
    Route::get('/articles/{slug}', [ArticleController::class, 'show']);

    Route::get('/reviews', [ArticleController::class, 'reviews']);
    Route::get('/reviews/{slug}', [ArticleController::class, 'showReview']);

    Route::get('/categories', function () {
        return response()->json([
            'data' => Category::whereHas('articles', function ($q) {
                $q->where('type', 'review');
            })
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
        ]);
    });

    Route::get('/reels', [ArticleController::class, 'reels']);

    Route::get('/youtube-videos', [YoutubeController::class, 'getVideos']);
    Route::get('/youtube-shorts', [YoutubeController::class, 'getShorts']);

    Route::get('/technologies', [ArticleController::class, 'technologies']);

    Route::get('/proxy-image', function (\Illuminate\Http\Request $request) {
        $url = $request->query('url');

        // Validasi hanya URL Drive
        if (!str_contains($url, 'drive.google.com') && !str_contains($url, 'googleusercontent.com')) {
            abort(403);
        }

        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ])->get($url);

        return response($response->body(), 200)
            ->header('Content-Type', $response->header('Content-Type') ?? 'image/jpeg')
            ->header('Cache-Control', 'public, max-age=86400');
    });

    // Like & Get Comments (Bisa diakses siapa saja)
    Route::post('/articles/{id}/like', [ArticleController::class, 'like']);
    Route::get('/articles/{id}/comments', [ArticleController::class, 'getComments']);

    // Post Komentar (Wajib Login)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/articles/{id}/comments', [ArticleController::class, 'storeComment']);
    });

    // Auth Publik
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Auth Terproteksi
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Jembatan untuk Sponsor (Dari Rizqi)
    Route::get('/sponsors', function () {
        return response()->json([
            'data' => Sponsor::latest()->get()
        ]);
    });

    // Jembatan untuk Iklan (Dari Rizqi) - INI YANG KITA PAKE!
    Route::get('/advertisements', function () {
        return response()->json([
            'data' => Advertisement::latest()->get()
        ]);
    });
});
