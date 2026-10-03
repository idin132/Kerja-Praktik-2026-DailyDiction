<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Models\Sponsor;
use App\Models\Advertisement;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\YoutubeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// SEMUA ROUTE DI BAWAH INI PUNYA PREFIX /v1/
Route::prefix('v1')->group(function () {
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/featured', [ArticleController::class, 'featured']);
    Route::get('/articles/trending', [ArticleController::class, 'trending']);
    Route::get('/articles/preview/{slug}', [ArticleController::class, 'preview'])->middleware('auth:sanctum');
    Route::post('/articles/{slug}/view', [ArticleController::class, 'trackView']);
    
    // Route Tunggal & Jamak Artikel
    Route::get('/articles/{slug}', [ArticleController::class, 'show']);
    Route::get('/article/{slug}', [ArticleController::class, 'show']);

    // Route Tunggal & Jamak Review
    Route::get('/reviews', [ArticleController::class, 'reviews']);
    Route::get('/reviews/{slug}', [ArticleController::class, 'showReview']);
    Route::get('/review/{slug}', [ArticleController::class, 'showReview']);

    Route::get('/categories', function () {
        $platforms = \App\Models\Article::where('type', 'review')
            ->whereNotNull('platform')
            ->pluck('platform')
            ->flatMap(function ($p) {
                $decoded = is_string($p) ? json_decode($p, true) : $p;
                return is_array($decoded) ? $decoded : [$p];
            })
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return response()->json([
            'data' => $platforms->map(fn($p) => ['id' => $p, 'name' => $p, 'slug' => \Illuminate\Support\Str::slug($p)])
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

    // Like & Get Comments
    Route::post('/articles/{id}/toggle-like', [ArticleController::class, 'toggleLike']);
    Route::get('/articles/{id}/comments', [ArticleController::class, 'getComments']);

    // Post Komentar (Wajib Login)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/articles/{id}/comments', [ArticleController::class, 'storeComment']);
        Route::delete('/comments/{id}', [ArticleController::class, 'destroyComment']);
    });

    // Auth Publik
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Auth Terproteksi
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Sponsor
    Route::get('/sponsors', function () {
        return response()->json([
            'data' => Sponsor::latest()->get()
        ]);
    });

    // Iklan
    Route::get('/advertisements', function () {
        return response()->json([
            'data' => Advertisement::latest()->get()
        ]);
    });
});