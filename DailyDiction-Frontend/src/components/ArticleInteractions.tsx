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
  user_id?: number;
  comment: string;
  created_at?: string;
  user?: {
    id?: number;
    name?: string;
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
  const [likes, setLikes] = useState<number>(initialLikes);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentInput, setCommentInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

  // Helper aman untuk format tanggal
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Baru saja";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "Baru saja";
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Baru saja";
    }
  };

  useEffect(() => {
    if (!articleId) return;

    // 1. Cek LocalStorage untuk status Like artikel ini
    try {
      const likedArticles = JSON.parse(
        localStorage.getItem("liked_articles") || "[]"
      );
      if (Array.isArray(likedArticles) && likedArticles.includes(articleId)) {
        setHasLiked(true);
      }
    } catch (e) {
      console.warn("Gagal membaca liked_articles dari localStorage", e);
    }

    // 2. Ambil data user yang sedang login
    try {
      const rawUser = localStorage.getItem("user_data");
      if (rawUser) {
        setCurrentUser(JSON.parse(rawUser));
      }
    } catch (e) {
      setCurrentUser(null);
    }

    // 3. Fetch list komentar
    fetch(`${apiUrl}/articles/${articleId}/comments`)
      .then((res) => res.json())
      .then((json) => {
        const data = json?.data || json;
        if (Array.isArray(data)) {
          setComments(data);
        }
      })
      .catch((err) => console.error("Error fetching comments:", err));
  }, [articleId, apiUrl]);

  // Handler Toggle Like / Unlike
  const handleToggleLike = async () => {
    if (isLiking || !articleId) return;
    setIsLiking(true);

    const nextState = !hasLiked;
    const action = nextState ? "like" : "unlike";

    setHasLiked(nextState);
    setLikes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
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
    } catch (e) {
      console.warn("Gagal update localStorage liked_articles", e);
    }

    try {
      const res = await fetch(`${apiUrl}/articles/${articleId}/toggle-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data?.status === "success" && typeof data.likes_count === "number") {
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
        const newCommentObj = json?.data || json;
        if (newCommentObj) {
          setComments((prev) => [newCommentObj, ...prev]);
        }
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
      confirmButtonColor: "#FFD700",
      cancelButtonColor: "#1F2430",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      background: "#141721",
      color: "#FFFFFF",
      iconColor: "#FFD700",
      customClass: {
        popup: "rounded-2xl border border-white/10 shadow-2xl font-mono",
        title: "text-lg font-bold uppercase tracking-wider text-white",
        confirmButton:
          "rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase text-black",
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

        Swal.fire({
          title: "Terhapus!",
          text: "Komentar berhasil dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#141721",
          color: "#FFFFFF",
          iconColor: "#FFD700",
          customClass: {
            popup: "rounded-2xl border border-white/10 font-mono text-xs",
          },
        });
      } else {
        const errorData = await res.json();
        Swal.fire({
          title: "Gagal!",
          text: errorData?.message || "Gagal menghapus komentar.",
          icon: "error",
          background: "#141721",
          color: "#FFFFFF",
          confirmButtonColor: "#FFD700",
          customClass: {
            confirmButton: "text-black font-bold",
          },
        });
      }
    } catch (err) {
      console.error("Gagal menghapus komentar:", err);
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
              ? "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40 shadow-[0_0_15px_rgba(255,215,0,0.25)]"
              : "border border-dark-border bg-dark-card text-text-muted hover:border-[#FFD700] hover:text-white"
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-200 ${
              hasLiked ? "fill-[#FFD700] text-[#FFD700] scale-110" : ""
            }`}
          />
          <span>{likes} MENYUKAI</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <MessageSquare className="h-4 w-4 text-[#FFD700]" />
          <span>{comments?.length || 0} Komentar</span>
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
              className="w-full rounded-xl border border-dark-border bg-dark-card p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-[#FFD700] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting || !commentInput.trim()}
              className="flex items-center gap-2 rounded-xl bg-[#FFD700] px-5 py-2.5 font-mono text-xs font-bold uppercase text-black hover:bg-[#FFD700]/90 disabled:opacity-50 transition-all"
            >
              <Send className="h-3.5 w-3.5 fill-black" />
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
              className="inline-block rounded-xl bg-[#FFD700] px-5 py-2 font-mono text-xs font-bold uppercase text-black hover:bg-[#FFD700]/90 transition-all"
            >
              Masuk Sekarang
            </Link>
          </div>
        )}

        {/* List Komentar */}
        <div className="space-y-4 pt-4">
          {comments?.map((c) => {
            const isOwner =
              currentUser && Number(currentUser.id) === Number(c?.user_id);
            const userRole = (currentUser?.role || "").toLowerCase();
            const isSuperAdmin =
              userRole === "superadmin" || userRole === "admin";

            const canDelete = Boolean(currentUser && (isOwner || isSuperAdmin));

            return (
              <div
                key={c.id}
                className="group relative rounded-xl border border-dark-border bg-dark-card p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <UserIcon className="h-3.5 w-3.5 text-[#FFD700]" />
                    <span>{c?.user?.name || "Member"}</span>
                    {(c?.user?.role === "superadmin" ||
                      c?.user?.role === "admin") && (
                      <span className="rounded bg-[#FFD700]/20 border border-[#FFD700]/40 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#FFD700]">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span>{formatDate(c?.created_at)}</span>

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        disabled={deletingId === c.id}
                        title={
                          isSuperAdmin && !isOwner
                            ? "Hapus komentar (Superadmin)"
                            : "Hapus komentar"
                        }
                        className="text-text-muted hover:text-[#FFD700] transition-colors p-1 rounded"
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
                  {c?.comment}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}