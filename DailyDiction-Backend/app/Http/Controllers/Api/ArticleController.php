<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Reel;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // Get all published articles (Bisa filter Berita atau Review)
    public function index(Request $request)
    {
        $query = Article::with('categories')
            ->where('is_published', true);

        // Filter berdasarkan parameter '?type=' yang dikirim dari Next.js
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $articles = $query->latest()->paginate(10);

        return response()->json($articles);
    }

    // Get detail artikel/review berdasarkan slug
    public function show($slug)
    {
        // 1. Cari konten utama beserta kategorinya
        $article = Article::with('categories')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->first();

        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Konten tidak ditemukan'
            ], 404);
        }

        // 2. Cari Konten Sebelumnya (Penting: Harus satu tipe! Berita sama Berita, Review sama Review)
        $prevArticle = Article::where('is_published', true)
            ->where('type', $article->type)
            ->where('id', '<', $article->id)
            ->orderBy('id', 'desc')
            ->first();

        // 3. Cari Konten Selanjutnya (Harus satu tipe)
        $nextArticle = Article::where('is_published', true)
            ->where('type', $article->type)
            ->where('id', '>', $article->id)
            ->orderBy('id', 'asc')
            ->first();

        // 4. Ubah object jadi array
        $articleData = $article->toArray();

        // 5. Selipin data prev dan next
        $articleData['prev'] = $prevArticle ? [
            'slug' => $prevArticle->slug,
            'title' => $prevArticle->title,
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

    // Get featured articles (untuk Hero Section)
    public function featured()
    {
        $featured = Article::with('categories')
            ->where('is_published', true)
            ->where('is_featured', true)
            ->where('type', 'article') // Pastikan cuma artikel berita yang masuk featured
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $featured
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
}