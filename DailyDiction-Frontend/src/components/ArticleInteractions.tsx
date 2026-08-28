"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Send,
  User as UserIcon,
  Lock,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

interface CommentItem {
  id: number;
  user_id: number;
  comment: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    role?: string;
  };
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role?: string;
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
  const [isLiking, setIsLiking] = useState(false);

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

  useEffect(() => {
    // 1. Cek LocalStorage untuk status Like artikel ini
    const likedArticles = JSON.parse(
      localStorage.getItem("liked_articles") || "[]"
    );
    if (likedArticles.includes(articleId)) {
      setHasLiked(true);
    }

    // 2. Ambil data user yang sedang login
    const rawUser = localStorage.getItem("user_data");
    if (rawUser) {
      try {
        setCurrentUser(JSON.parse(rawUser));
      } catch (e) {
        setCurrentUser(null);
      }
    }

    // 3. Fetch list komentar
    fetch(`${apiUrl}/articles/${articleId}/comments`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setComments(json.data);
      })
      .catch((err) => console.error("Error fetching comments:", err));
  }, [articleId, apiUrl]);

  // Handler Toggle Like / Unlike
  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const nextState = !hasLiked;
    const action = nextState ? "like" : "unlike";

    // Optimistic UI update
    setHasLiked(nextState);
    setLikes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    // Update LocalStorage
    const likedArticles: number[] = JSON.parse(
      localStorage.getItem("liked_articles") || "[]"
    );
    if (nextState) {
      localStorage.setItem(
        "liked_articles",
        JSON.stringify([...likedArticles, articleId])
      );
    } else {
      localStorage.setItem(
        "liked_articles",
        JSON.stringify(likedArticles.filter((id) => id !== articleId))
      );
    }

    try {
      const res = await fetch(`${apiUrl}/articles/${articleId}/toggle-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setLikes(data.likes_count);
      }
    } catch (e) {
      console.error("Gagal toggle like:", e);
    } finally {
      setIsLiking(false);
    }
  };

  // Handler Kirim Komentar
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

  // Handler Hapus Komentar
  const handleDeleteComment = async (commentId: number) => {
    const result = await Swal.fire({
      title: "Hapus Komentar?",
      text: "Komentar yang dihapus tidak dapat dipulihkan kembali.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF3E3E", // Brand Crimson
      cancelButtonColor: "#1F2430", // Dark card / border
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      background: "#141721", // Dark background modal
      color: "#FFFFFF", // Warna teks modal
      iconColor: "#FF3E3E",
      customClass: {
        popup: "rounded-2xl border border-white/10 shadow-2xl font-mono",
        title: "text-lg font-bold uppercase tracking-wider text-white",
        confirmButton:
          "rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase",
        cancelButton:
          "rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase border border-white/10 text-gray-300 hover:text-white",
      },
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    setDeletingId(commentId);
    try {
      const res = await fetch(`${apiUrl}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));

        // Notifikasi Sukses
        Swal.fire({
          title: "Terhapus!",
          text: "Komentar berhasil dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#141721",
          color: "#FFFFFF",
          iconColor: "#00F0FF", // Brand Cyan
          customClass: {
            popup: "rounded-2xl border border-white/10 font-mono text-xs",
          },
        });
      } else {
        const errorData = await res.json();
        Swal.fire({
          title: "Gagal!",
          text: errorData.message || "Gagal menghapus komentar.",
          icon: "error",
          background: "#141721",
          color: "#FFFFFF",
          confirmButtonColor: "#FF3E3E",
        });
      }
    } catch (err) {
      console.error("Gagal menghapus komentar:", err);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan server saat menghapus komentar.",
        icon: "error",
        background: "#141721",
        color: "#FFFFFF",
        confirmButtonColor: "#FF3E3E",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-12 space-y-10 border-t border-dark-border pt-8">
      {/* Action Like Bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold transition-all active:scale-95 ${
            hasLiked
              ? "bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 shadow-[0_0_15px_rgba(255,62,62,0.25)]"
              : "border border-dark-border bg-dark-card text-text-muted hover:border-brand-crimson hover:text-white"
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-200 ${
              hasLiked ? "fill-brand-crimson text-brand-crimson scale-110" : ""
            }`}
          />
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
        {currentUser ? (
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
              Anda harus masuk ke akun Anda untuk ikut berkomentar di artikel
              ini.
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
          {comments.map((c) => {
            const canDelete =
              currentUser &&
              (currentUser.id === c.user_id ||
                currentUser.role === "superadmin" ||
                currentUser.role === "admin");

            return (
              <div
                key={c.id}
                className="group relative rounded-xl border border-dark-border bg-dark-card p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <UserIcon className="h-3.5 w-3.5 text-brand-cyan" />
                    <span>{c.user?.name || "Member"}</span>
                    {c.user?.role === "superadmin" && (
                      <span className="rounded bg-brand-crimson/20 border border-brand-crimson/40 px-1.5 py-0.5 text-[9px] font-bold uppercase text-brand-crimson">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span>
                      {new Date(c.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {/* Tombol Hapus */}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        disabled={deletingId === c.id}
                        title="Hapus komentar"
                        className="text-text-muted hover:text-brand-crimson transition-colors"
                      >
                        {deletingId === c.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-text-primary leading-relaxed">
                  {c.comment}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
