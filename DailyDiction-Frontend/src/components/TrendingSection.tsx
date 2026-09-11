import Link from "next/link";
import { TrendingUp, Eye, ArrowRight } from "lucide-react";
import { getTrendingArticles, formatImageUrl } from "@/lib/api";

export default async function TrendingSection() {
  const articles = await getTrendingArticles();

  if (articles.length === 0) return null;

  const formatViews = (n: number): string =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  const getArticleHref = (item: any): string => {
    if (item.type === "review") return `/review/${item.slug}`;
    return `/artikel/${item.slug}`;
  };

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#FFD700]" />
          <h2 className="text-lg font-black uppercase tracking-wider text-text-primary">
            Trending Minggu Ini
          </h2>
        </div>
        <span className="text-[10px] font-mono text-text-muted border border-dark-border rounded-md px-2 py-1">
          7 HARI TERAKHIR
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {articles.map((item: any, index: number) => (
          <Link
            key={item.id}
            href={getArticleHref(item)}
            className="group relative flex items-center gap-4 rounded-xl border border-dark-border bg-dark-card p-3 transition-all hover:border-[#FFD700]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            {/* Nomor Ranking */}
            <span
              className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-xs font-black font-mono
                ${index === 0 ? "bg-[#FFD700] text-black" : "bg-dark-border/40 text-text-muted"}`}
            >
              {index + 1}
            </span>

            {/* Thumbnail */}
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg">
              <img
                src={formatImageUrl(
                  item.image_url || item.image_full_url || item.thumbnail,
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
              <h4 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-[#FFD700] transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Eye className="h-3 w-3 text-text-muted" />
                <span className="text-[10px] font-mono text-text-muted">
                  {formatViews(item.views ?? 0)} views
                </span>
                {item.type && item.type !== "article" && (
                  <>
                    <span className="text-dark-border">•</span>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#FFD700]/70">
                      {item.type}
                    </span>
                  </>
                )}
              </div>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-text-muted group-hover:text-[#FFD700] transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
