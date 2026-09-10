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
    public function index(Request $request)
    {
        $type = $request->get('type', 'all');
        $page = $request->get('page', 1);
        $cacheKey = "articles_index_{$type}_page_{$page}";

        return Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Article::with('categories')
                ->where('is_published', true);

            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            return response()->json($query->latest()->paginate(10));
        });
    }

    public function show($slug)
    {
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

        $prevArticle = Article::where('is_published', true)
            ->where('id', '<', $article->id)
            ->where(function ($q) use ($type) {
                $q->where('type', $type)->orWhereNull('type');
            })
            ->orderBy('id', 'desc')
            ->first(['id', 'slug', 'title', 'image_url', 'image_path']);

        if (!$prevArticle) {
            $prevArticle = Article::where('is_published', true)
                ->where('id', '<', $article->id)
                ->orderBy('id', 'desc')
                ->first(['id', 'slug', 'title', 'image_url', 'image_path']);
        }

        $nextArticle = Article::where('is_published', true)
            ->where('id', '>', $article->id)
            ->where(function ($q) use ($type) {
                $q->where('type', $type)->orWhereNull('type');
            })
            ->orderBy('id', 'asc')
            ->first(['id', 'slug', 'title', 'image_url', 'image_path']);

        if (!$nextArticle) {
            $nextArticle = Article::where('is_published', true)
                ->where('id', '>', $article->id)
                ->orderBy('id', 'asc')
                ->first(['id', 'slug', 'title', 'image_url', 'image_path']);
        }

        $articleData = $article->toArray();

        $articleData['prev'] = $prevArticle ? [
            'slug' => $prevArticle->slug,
            'title' => $prevArticle->title,
            'thumbnail' => $prevArticle->image_url ?? $prevArticle->image_path ?? null,
        ] : null;

        $articleData['next'] = $nextArticle ? [
            'slug' => $nextArticle->slug,
            'title' => $nextArticle->title,
            'thumbnail' => $nextArticle->image_url ?? $nextArticle->image_path ?? null,
        ] : null;

        return response()->json([
            'status' => 'success',
            'data' => $articleData
        ]);
    }

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

    // Increment views saat artikel dibuka
    public function trackView(string $slug)
    {
        $article = Article::where('slug', $slug)
            ->where('is_published', true)
            ->first();

        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Konten tidak ditemukan'
            ], 404);
        }

        $article->increment('views');
        $article->update(['last_viewed_at' => now()]);

        // Bust cache trending supaya data fresh
        Cache::forget('articles_trending');

        return response()->json([
            'status' => 'success',
            'views' => $article->views
        ]);
    }

    // =============================================
    // BARU: Top 5 trending (views terbanyak, 7 hari terakhir)
    // =============================================
    public function trending()
    {
        return Cache::remember('articles_trending', 300, function () {
            $articles = Article::with('categories')
                ->where('is_published', true)
                ->where('last_viewed_at', '>=', now()->subDays(7))
                ->orderBy('views', 'desc')
                ->limit(5)
                ->get();

            // Fallback: belum ada views sama sekali → pakai artikel terbaru
            if ($articles->isEmpty()) {
                $articles = Article::with('categories')
                    ->where('is_published', true)
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get();
            }

            return response()->json([
                'status' => 'success',
                'data' => $articles
            ]);
        });
    }

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
