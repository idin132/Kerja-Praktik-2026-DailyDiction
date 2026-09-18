"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Newspaper, Clock, ArrowRight } from "lucide-react";

function formatImageUrl(imageUrl: string | null | undefined): string {
  const fallback =
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800";
  if (!imageUrl || typeof imageUrl !== "string") return fallback;
  const clean = imageUrl.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  const cleanPath = clean.replace(/^\/+/, "");
  return cleanPath.startsWith("storage/")
    ? `https://dailydiction.id/${cleanPath}`
    : `https://dailydiction.id/storage/${cleanPath}`;
}

// Helper untuk format waktu relatif dinamis
function formatTimeAgo(dateString: string): string {
  if (!dateString) return "Baru saja";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mnt lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hr lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export default function LatestNewsSection() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

    // Mengambil 5 berita/artikel terbaru secara dinamis
    fetch(`${apiUrl}/articles?type=article&limit=5`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => {
        const list = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        setArticles(list.slice(0, 5));
      })
      .catch(() => setArticles([]))
      .finally(() => setIsLoading(false));
  }, []);

  const getArticleHref = (item: any): string => {
    if (item.type === "review") return `/review/${item.slug}`;
    return `/artikel/${item.slug}`;
  };

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Newspaper className="h-5 w-5 text-[#FFD700]" />
          <h2 className="text-lg font-black uppercase tracking-wider text-text-primary">
            Berita Terbaru
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="h-20 rounded-xl border border-dark-border bg-dark-card/50 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-[#FFD700]" />
          <h2 className="text-lg font-black uppercase tracking-wider text-text-primary">
            Berita Terbaru
          </h2>
        </div>
        <Link
          href="/news"
          className="text-xs font-mono font-bold text-[#FFD700] hover:underline flex items-center gap-1"
        >
          <span>LIHAT ALL</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {articles.map((item: any) => (
          <Link
            key={item.id}
            href={getArticleHref(item)}
            className="group relative flex items-center gap-4 rounded-xl border border-dark-border bg-dark-card p-3 transition-all hover:border-[#FFD700]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            {/* Thumbnail */}
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg relative">
              <img
                src={formatImageUrl(
                  item.image_url || item.image_full_url || item.thumbnail
                )}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800";
                }}
              />
            </div>

            {/* Konten */}
            <div className="flex-1 min-w-0">
              {/* Badge Kategori jika ada */}
              {item.categories && item.categories.length > 0 && (
                <span className="text-[9px] font-mono font-bold uppercase text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-1.5 py-0.5 rounded mb-1 inline-block">
                  {item.categories[0].name}
                </span>
              )}

              <h4 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-[#FFD700] transition-colors">
                {item.title}
              </h4>

              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="h-3 w-3 text-text-muted" />
                <span className="text-[10px] font-mono text-text-muted">
                  {formatTimeAgo(item.created_at)}
                </span>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-text-muted group-hover:text-[#FFD700] transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}