<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use App\Models\Reel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ArticleController extends Controller
{
    // Get all published articles (Bisa filter Berita atau Review)
    public function index(Request $request)
    {
        $type = $request->get('type', 'all');
        $page = $request->get('page', 1);
        $cacheKey = "articles_index_{$type}_page_{$page}";

        return Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Article::with('categories')
                ->where('is_published', true);

            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            return response()->json($query->latest()->paginate(10));
        });
    }

    // Get detail artikel/review berdasarkan slug
    public function show($slug)
    {
        $cacheKey = "article_detail_{$slug}";

        return Cache::remember($cacheKey, 300, function () use ($slug) {
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

            $type = $article->type ?? 'article';

            // 2. Cari Konten Sebelumnya (Hanya select kolom yang pasti ada di DB)
            $prevArticle = Article::where('is_published', true)
                ->where(function ($q) use ($type) {
                    $q->where('type', $type)->orWhereNull('type');
                })
                ->where('id', '<', $article->id)
                ->orderBy('id', 'desc')
                ->first(['id', 'slug', 'title', 'image_url', 'image']);

            // 3. Cari Konten Selanjutnya (Hanya select kolom yang pasti ada di DB)
            $nextArticle = Article::where('is_published', true)
                ->where(function ($q) use ($type) {
                    $q->where('type', $type)->orWhereNull('type');
                })
                ->where('id', '>', $article->id)
                ->orderBy('id', 'asc')
                ->first(['id', 'slug', 'title', 'image_url', 'image']);

            // 4. Ubah object jadi array
            $articleData = $article->toArray();

            // 5. Selipin data prev dan next
            $articleData['prev'] = $prevArticle ? [
                'slug' => $prevArticle->slug,
                'title' => $prevArticle->title,
                'thumbnail' => $prevArticle->image_url ?? $prevArticle->image ?? null,
            ] : null;

            $articleData['next'] = $nextArticle ? [
                'slug' => $nextArticle->slug,
                'title' => $nextArticle->title,
                'thumbnail' => $nextArticle->image_url ?? $nextArticle->image ?? null,
            ] : null;

            return response()->json([
                'status' => 'success',
                'data' => $articleData
            ]);
        });
    }

    // Get featured articles (untuk Hero Section)
    public function featured()
    {
        return Cache::remember('articles_featured', 600, function () {
            $featured = Article::with('categories')
                ->where('is_published', true)
                ->where('is_featured', true)
                ->where('type', 'article')
                ->latest()
                ->take(5)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $featured
            ]);
        });
    }

    // Get list of Technology & Hardware
    public function technologies(Request $request)
    {
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 8);

        return Cache::remember("articles_tech_p{$page}_l{$perPage}", 300, function () use ($perPage) {
            $technologies = Article::with('categories')
                ->where('is_published', true)
                ->where('type', 'technology')
                ->latest()
                ->paginate($perPage);

            return response()->json($technologies);
        });
    }

    // 1. Endpoint Like Anonim (Siapa Saja)
    public function like($id)
    {
        $article = Article::findOrFail($id);
        $article->increment('likes_count');

        Cache::forget("article_detail_{$article->slug}");

        return response()->json([
            'status' => 'success',
            'likes_count' => $article->likes_count
        ]);
    }

    // 2. Ambil Komentar Berdasarkan Artikel
    public function getComments($id)
    {
        $comments = Comment::with(['user:id,name,role'])
            ->where('article_id', $id)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $comments
        ]);
    }

    // 3. Post Komentar (Wajib Token / Auth Login)
    public function storeComment(Request $request, $id)
    {
        $request->validate([
            'comment' => 'required|string|max:1000'
        ]);

        $comment = Comment::create([
            'article_id' => $id,
            'user_id' => auth()->id(),
            'comment' => $request->comment
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $comment->load('user:id,name,role')
        ], 201);
    }

    // Get list of Reels
    public function reels()
    {
        return Cache::remember('articles_reels', 300, function () {
            $reels = Reel::where('is_published', true)
                ->latest()
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $reels
            ]);
        });
    }

    // 1. Toggle Like / Unlike (Anonim / Siapa Saja)
    public function toggleLike(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:like,unlike'
        ]);

        $article = Article::findOrFail($id);

        if ($request->action === 'like') {
            $article->increment('likes_count');
        } else {
            if ($article->likes_count > 0) {
                $article->decrement('likes_count');
            }
        }

        Cache::forget("article_detail_{$article->slug}");

        return response()->json([
            'status' => 'success',
            'likes_count' => (int) $article->likes_count
        ]);
    }

    // 2. Hapus Komentar
    public function destroyComment(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        $user = $request->user();

        $isOwner = (int) $comment->user_id === (int) $user->id;

        $role = strtolower($user->role ?? '');
        $isSuperAdmin = in_array($role, ['superadmin', 'admin'])
            || (method_exists($user, 'isSuperAdmin') && $user->isSuperAdmin());

        if (!$isOwner && !$isSuperAdmin) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Hanya pemilik atau Superadmin yang dapat menghapus komentar ini.'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Komentar berhasil dihapus.'
        ]);
    }

    public function reviews(Request $request)
    {
        $limit = $request->get('limit', 12);
        $page = $request->get('page', 1);

        return Cache::remember("articles_reviews_p{$page}_l{$limit}", 300, function () use ($limit) {
            $reviews = Article::query()
                ->where('type', 'review')
                ->where('is_published', true)
                ->with('categories')
                ->latest()
                ->paginate($limit);

            return response()->json([
                'status' => 'success',
                'data' => $reviews->items(),
                'meta' => [
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage(),
                    'total' => $reviews->total(),
                ],
            ]);
        });
    }
}