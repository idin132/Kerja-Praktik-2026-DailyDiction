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
        $articles = Article::with('categories')
            ->where('is_published', true)
            ->latest()
            ->paginate(10);

        return response()->json($articles);
    }

    // Get detail artikel berdasarkan slug (untuk halaman /artikel/[slug])
    public function show($slug)
    {
        $article = Article::with('categories')  // ← tambahkan ini
            ->where('slug', $slug)
            ->where('is_published', true)
            ->first();

        // 1. Cari artikel utama
        $article = Article::where('slug', $slug)
            ->where('is_published', true)
            ->first();

        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Artikel tidak ditemukan'
            ], 404);
        }

        // 2. Cari Artikel Sebelumnya (ID lebih kecil dari artikel sekarang)
        $prevArticle = Article::where('is_published', true)
            ->where('id', '<', $article->id)
            ->orderBy('id', 'desc')
            ->first();

        // 3. Cari Artikel Selanjutnya (ID lebih besar dari artikel sekarang)
        $nextArticle = Article::where('is_published', true)
            ->where('id', '>', $article->id)
            ->orderBy('id', 'asc')
            ->first();

        // 4. Ubah object artikel jadi array biar gampang diselipin data baru
        $articleData = $article->toArray();

        // 5. Selipin data prev dan next ke dalam response
        $articleData['prev'] = $prevArticle ? [
            'slug' => $prevArticle->slug,
            'title' => $prevArticle->title,
            // Sesuaikan dengan nama kolom gambar/thumbnail di database kamu (misal: image, image_url, atau thumbnail)
            'thumbnail' => $prevArticle->image_url ?? $prevArticle->image_full_url ?? $prevArticle->image ?? null,
        ] : null;

        $articleData['next'] = $nextArticle ? [
            'slug' => $nextArticle->slug,
            'title' => $nextArticle->title,
            'thumbnail' => $nextArticle->image_url ?? $nextArticle->image_full_url ?? $nextArticle->image ?? null,
        ] : null;

        return response()->json([
            'status' => 'success',
            'data' => $articleData
        ]);
    }

    // Get featured articles (untuk Hero Section / Reels)
    public function featured()
    {
        $featured = Article::with('categories')
            ->where('is_published', true)
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
        // 1. Cari review utama
        $review = GameReview::where('slug', $slug)
            ->where('is_published', true)
            ->first();

        if (!$review) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review tidak ditemukan'
            ], 404);
        }

        // 2. Cari Review Sebelumnya
        $prevReview = GameReview::where('is_published', true)
            ->where('id', '<', $review->id)
            ->orderBy('id', 'desc')
            ->first();

        // 3. Cari Review Selanjutnya
        $nextReview = GameReview::where('is_published', true)
            ->where('id', '>', $review->id)
            ->orderBy('id', 'asc')
            ->first();

        $reviewData = $review->toArray();

        // 4. Selipin data prev dan next
        $reviewData['prev'] = $prevReview ? [
            'slug' => $prevReview->slug,
            'title' => $prevReview->title,
            'thumbnail' => $prevReview->image_url ?? $prevReview->image_full_url ?? $prevReview->image ?? null,
        ] : null;

        $reviewData['next'] = $nextReview ? [
            'slug' => $nextReview->slug,
            'title' => $nextReview->title,
            'thumbnail' => $nextReview->image_url ?? $nextReview->image_full_url ?? $nextReview->image ?? null,
        ] : null;

        return response()->json([
            'status' => 'success',
            'data' => $reviewData
        ]);
    }
}
