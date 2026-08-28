<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
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

    // Get list of Technology & Hardware
    public function technologies(Request $request)
    {
        $technologies = Article::with('categories')
            ->where('is_published', true)
            ->where('type', 'technology')
            ->latest()
            ->paginate($request->get('per_page', 8));

        return response()->json($technologies);
    }

    // 1. Endpoint Like Anonim (Siapa Saja)
    public function like($id)
    {
        $article = Article::findOrFail($id);
        $article->increment('likes_count');

        return response()->json([
            'status' => 'success',
            'likes_count' => $article->likes_count
        ]);
    }

    // 2. Ambil Komentar Berdasarkan Artikel
    public function getComments($id)
    {
        $comments = Comment::with('user')
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
            'user_id' => auth()->id(), // didapat dari middleware auth:sanctum
            'comment' => $request->comment
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $comment->load('user')
        ], 201);
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
            // Cegah like bernilai minus
            if ($article->likes_count > 0) {
                $article->decrement('likes_count');
            }
        }

        return response()->json([
            'status' => 'success',
            'likes_count' => (int) $article->likes_count
        ]);
    }

    // 2. Hapus Komentar (Hanya Pemilik Komentar atau Superadmin)
    public function destroyComment(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        $user = $request->user(); // Ambil user dari token Sanctum

        // Cek apakah pemilik komentar
        $isOwner = (int) $comment->user_id === (int) $user->id;

        // Cek apakah Superadmin / Admin
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
}