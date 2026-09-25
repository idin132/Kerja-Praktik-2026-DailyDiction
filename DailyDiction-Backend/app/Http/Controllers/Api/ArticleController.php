<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use App\Models\Reel;
use Illuminate\Http\Request;
use Throwable;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Article::query();

            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            $articles = $query->orderBy('created_at', 'desc')->paginate(10);

            return response()->json($articles);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($slug)
    {
        try {
            $article = Article::where('slug', $slug)->first();

            if (!$article) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Konten tidak ditemukan'
                ], 404);
            }

            $type = $article->type ?? 'article';

            $prevArticle = Article::where('id', '<', $article->id)
                ->where('type', $type)
                ->orderBy('id', 'desc')
                ->first(['id', 'slug', 'title', 'image_url', 'image_path', 'type']);

            $nextArticle = Article::where('id', '>', $article->id)
                ->where('type', $type)
                ->orderBy('id', 'asc')
                ->first(['id', 'slug', 'title', 'image_url', 'image_path', 'type']);

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
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function featured()
    {
        try {
            $featured = Article::orderBy('created_at', 'desc')->take(5)->get();

            return response()->json([
                'status' => 'success',
                'data' => $featured
            ]);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function technologies(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 8);
            $technologies = Article::where('type', 'technology')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json($technologies);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function trackView(string $slug)
    {
        try {
            $article = Article::where('slug', $slug)->first();

            if (!$article) {
                return response()->json(['status' => 'error', 'message' => 'Konten tidak ditemukan'], 404);
            }

            $article->increment('views');

            return response()->json([
                'status' => 'success',
                'views' => $article->views
            ]);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function trending()
    {
        try {
            $articles = Article::orderBy('views', 'desc')->limit(5)->get();

            if ($articles->isEmpty()) {
                $articles = Article::orderBy('created_at', 'desc')->limit(5)->get();
            }

            return response()->json([
                'status' => 'success',
                'data' => $articles
            ]);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function like($id)
    {
        try {
            $article = Article::findOrFail($id);
            $article->increment('likes_count');

            return response()->json([
                'status' => 'success',
                'likes_count' => $article->likes_count
            ]);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getComments($id)
    {
        try {
            $comments = Comment::where('article_id', $id)->latest()->get();

            return response()->json([
                'status' => 'success',
                'data' => $comments
            ]);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function storeComment(Request $request, $id)
    {
        try {
            $request->validate(['comment' => 'required|string|max:1000']);

            $comment = Comment::create([
                'article_id' => $id,
                'user_id' => auth()->id(),
                'comment' => $request->comment
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $comment
            ], 201);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function reels()
    {
        try {
            $reels = Reel::latest()->get();

            return response()->json([
                'status' => 'success',
                'data' => $reels
            ]);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function toggleLike(Request $request, $id)
    {
        try {
            $request->validate(['action' => 'required|in:like,unlike']);

            $article = Article::findOrFail($id);

            if ($request->action === 'like') {
                $article->increment('likes_count');
            } else {
                if ($article->likes_count > 0) {
                    $article->decrement('likes_count');
                }
            }

            return response()->json([
                'status' => 'success',
                'likes_count' => (int) $article->likes_count
            ]);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyComment(Request $request, $id)
    {
        try {
            $comment = Comment::findOrFail($id);
            $comment->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Komentar berhasil dihapus.'
            ]);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function reviews(Request $request)
    {
        try {
            $limit = $request->get('limit', 12);
            $reviews = Article::where('type', 'review')
                ->orderBy('created_at', 'desc')
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
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}