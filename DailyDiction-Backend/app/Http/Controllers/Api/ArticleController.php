<?php

namespace App\Http\Controllers\Api;

use App\Models\GameReview;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Reel;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // Get all published articles (dengan Pagination)
    public function index()
    {
        $articles = Article::where('is_published', true)
            ->latest()
            ->paginate(10);

        return response()->json($articles);
    }

    // Get detail artikel berdasarkan slug (untuk halaman /artikel/[slug])
    public function show($slug)
    {
        $article = Article::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $article
        ]);
    }

    // Get featured articles (untuk Hero Section / Reels)
    public function featured()
    {
        $featured = Article::where('is_published', true)
            ->where('is_featured', true)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $featured
        ]);
    }

    // Get list of Game Reviews
    public function reviews()
    {
        $reviews = GameReview::where('is_published', true)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $reviews
        ]);
    }

    // Get list of Reels
    public function reels()
    {
        $reels = Reel::where('is_published', true)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $reels
        ]);
    }

    // Get detail Game Review berdasarkan slug (untuk halaman /review/[slug])
    public function showReview($slug)
    {
        $review = GameReview::where('slug', $slug)
            ->where('is_published', true)
            ->first();

        if (!$review) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $review
        ]);
    }
}