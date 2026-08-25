"use client";

import { useState, useEffect } from "react";
import { Heart, MessageSquare, Send, User as UserIcon, Lock } from "lucide-react";
import Link from "next/link";

interface CommentItem {
  id: number;
  comment: string;
  created_at: string;
  user: {
    name: string;
  };
}

export default function ArticleInteractions({
  articleId,
  initialLikes = 0,
}: {
  articleId: number;
  initialLikes?: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

  useEffect(() => {
    // 1. Cek LocalStorage untuk tanda Like Anonim
    const likedArticles = JSON.parse(localStorage.getItem("liked_articles") || "[]");
    if (likedArticles.includes(articleId)) {
      setHasLiked(true);
    }

    // 2. Cek apakah user sedang login
    const token = localStorage.getItem("auth_token");
    if (token) setIsLoggedIn(true);

    // 3. Fetch Komentar
    fetch(`${apiUrl}/articles/${articleId}/comments`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setComments(json.data);
      })
      .catch((err) => console.error(err));
  }, [articleId, apiUrl]);

  // Handler Like Anonim
  const handleLike = async () => {
    if (hasLiked) return;

    setLikes((prev) => prev + 1);
    setHasLiked(true);

    const likedArticles = JSON.parse(localStorage.getItem("liked_articles") || "[]");
    localStorage.setItem("liked_articles", JSON.stringify([...likedArticles, articleId]));

    try {
      await fetch(`${apiUrl}/articles/${articleId}/like`, { method: "POST" });
    } catch (e) {
      console.error("Gagal like:", e);
    }
  };

  // Handler Submit Komentar (Wajib Login)
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || isSubmitting) return;

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/articles/${articleId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: commentInput }),
      });

      if (res.ok) {
        const json = await res.json();
        setComments((prev) => [json.data, ...prev]);
        setCommentInput("");
      }
    } catch (err) {
      console.error("Gagal mengirim komentar:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 space-y-10 border-t border-dark-border pt-8">
      {/* Action Like Bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={hasLiked}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold transition-all ${
            hasLiked
              ? "bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40"
              : "border border-dark-border bg-dark-card text-text-muted hover:border-brand-crimson hover:text-white"
          }`}
        >
          <Heart className={`h-4 w-4 ${hasLiked ? "fill-brand-crimson text-brand-crimson" : ""}`} />
          <span>{likes} MENYUKAI</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <MessageSquare className="h-4 w-4" />
          <span>{comments.length} Komentar</span>
        </div>
      </div>

      {/* Bagian Komentar */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold font-mono text-white uppercase tracking-wide">
          DISKUSI & KOMENTAR
        </h3>

        {/* Form Komentar */}
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <textarea
              rows={3}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Tulis tanggapan atau opini Anda..."
              className="w-full rounded-xl border border-dark-border bg-dark-card p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-crimson focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !commentInput.trim()}
              className="flex items-center gap-2 rounded-xl bg-brand-crimson px-5 py-2.5 font-mono text-xs font-bold uppercase text-white hover:bg-brand-crimson/90 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Mengirim..." : "Kirim Komentar"}</span>
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-dashed border-dark-border bg-dark-card/40 p-6 text-center">
            <Lock className="mx-auto h-6 w-6 text-text-muted mb-2" />
            <p className="font-mono text-xs text-text-muted mb-3">
              Anda harus masuk ke akun Anda untuk ikut berkomentar di artikel ini.
            </p>
            <Link
              href="/login"
              className="inline-block rounded-xl bg-brand-crimson px-5 py-2 font-mono text-xs font-bold uppercase text-white hover:bg-brand-crimson/90"
            >
              Masuk Sekarang
            </Link>
          </div>
        )}

        {/* List Komentar */}
        <div className="space-y-4 pt-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-dark-border bg-dark-card p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <UserIcon className="h-3.5 w-3.5 text-brand-cyan" />
                  <span>{c.user?.name || "Member"}</span>
                </div>
                <span>
                  {new Date(c.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-text-primary leading-relaxed">{c.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}