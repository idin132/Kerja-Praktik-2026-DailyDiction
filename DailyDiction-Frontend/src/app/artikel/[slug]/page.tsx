import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getArticleBySlug, getAdvertisements } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Send,
} from "lucide-react";
import ShareWidget from "@/components/ShareWidget";
import ArticleInteractions from "@/components/ArticleInteractions";
import ViewTracker from "@/components/ViewTracker";
import ArticleContent from "@/components/ArticleContent";
import TrendingSection from "@/components/TrendingSection";
import LatestNewsSection from "@/components/LatestNewsSection";

export const revalidate = 60;

interface NavArticleItem {
  title: string;
  slug: string;
  type?: string;
  thumbnail_url?: string;
  thumbnail?: string;
  image_url?: string;
  image_path?: string;
  image?: string;
}

interface ArticleDetail {
  id?: number;
  title: string;
  slug: string;
  type?: string;
  category?: any;
  category_input?: any;
  categories?: any[];
  summary?: string;
  content?: any;
  image_url?: string;
  image_path?: string;
  image_full_url?: string;
  image?: string;
  thumbnail_url?: string;
  thumbnail?: string;
  created_at?: string;
  author?: any;
  read_time?: string;
  likes_count?: number;
  prev?: NavArticleItem | null;
  next?: NavArticleItem | null;
}

function safeStringify(val: any, fallback: string = ""): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val || fallback;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    if (val.name) return String(val.name);
    if (val.title) return String(val.title);
    if (val.label) return String(val.label);
    if (val.username) return String(val.username);
    if (val.slug) return String(val.slug);
  }
  return fallback;
}

/**
 * Helper universal penanganan gambar Frontend
 */
function formatImageUrl(
  item: any,
  fallback: string = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600",
): string {
  if (!item) return fallback;

  const rawUrl =
    typeof item === "string"
      ? item
      : item.image_full_url ||
        item.thumbnail_url ||
        item.image_path ||
        item.image_url ||
        item.thumbnail ||
        item.image;

  const cleanUrl = safeStringify(rawUrl);
  if (!cleanUrl) return fallback;

  const clean = cleanUrl.trim();

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    if (clean.includes("dailydiction.id/storage/http")) {
      return clean.replace(
        /https?:\/\/[^\/]+\/storage\/(https?:\/\/)/i,
        "$1",
      );
    }
    return clean;
  }

  let cleanPath = clean.replace(/^\/+/, "");
  if (!cleanPath.startsWith("storage/")) {
    cleanPath = `storage/${cleanPath}`;
  }

  return `https://dailydiction.id/${cleanPath}`;
}

function parseContentMedia(content: any): string {
  let stringContent = "";

  if (typeof content === "string") {
    stringContent = content;
  } else if (Array.isArray(content)) {
    stringContent = content
      .map((b: any) =>
        typeof b === "string"
          ? b
          : b?.content || b?.html || b?.text || b?.value || "",
      )
      .join("");
  } else if (typeof content === "object" && content !== null) {
    stringContent =
      content.content || content.html || content.text || content.value || "";
  } else {
    stringContent = String(content || "");
  }

  let cleanContent = stringContent.replace(
    /class="w-full h-full border-0 rounded-xl"[^>]*>/gi,
    "",
  );

  return cleanContent.replace(
    /<oembed\s+url=["']([^"']+)["']\s*><\/oembed>/gi,
    (match, url) => {
      if (url.includes("twitter.com") || url.includes("x.com")) {
        return match;
      }

      let embedUrl = url;

      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const regExp =
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const matches = url.match(regExp);

        if (matches && matches[2].length === 11) {
          embedUrl = `https://www.youtube.com/embed/${matches[2]}`;
        }
      }

      return `<div class="aspect-video w-full my-6 overflow-hidden rounded-xl"><iframe src="${embedUrl}" class="w-full h-full border-0 rounded-xl" allowfullscreen></iframe></div>`;
    },
  );
}

function getCategoriesArray(article: ArticleDetail): string[] {
  let rawCats: any[] = [];

  if (article.categories && article.categories.length > 0) {
    rawCats = article.categories.map((c: any) => safeStringify(c));
  } else if (article.category_input) {
    rawCats = Array.isArray(article.category_input)
      ? article.category_input
      : [article.category_input];
  } else if (article.category) {
    if (
      typeof article.category === "string" &&
      article.category.startsWith("[")
    ) {
      try {
        rawCats = JSON.parse(article.category);
      } catch {
        rawCats = [article.category];
      }
    } else {
      rawCats = Array.isArray(article.category)
        ? article.category
        : [article.category];
    }
  }

  const validCats = rawCats.map((c) => safeStringify(c)).filter(Boolean);
  return validCats.length > 0 ? validCats : ["BERITA"];
}

export default async function DetailArtikel({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const slug = safeStringify(rawSlug);

  const [articleRes, adsData] = await Promise.all([
    getArticleBySlug(slug).catch(() => null),
    getAdvertisements().catch(() => null),
  ]);

  let article: ArticleDetail | null = (articleRes as any)?.data || articleRes;

  if (!article || !article.title) {
    notFound();
  }

  const sidebarAd =
    adsData?.data && Array.isArray(adsData.data)
      ? adsData.data[0]
      : Array.isArray(adsData)
        ? adsData[0]
        : null;

  const prevArticle = article.prev || null;
  const nextArticle = article.next || null;

  const categories = getCategoriesArray(article);
  const parsedContent = parseContentMedia(article.content);

  const authorName =
    typeof article.author === "string"
      ? article.author
      : article.author?.name || article.author?.username || "Redaksi";

  const getArticleHref = (item: NavArticleItem | null) => {
    if (!item) return "#";
    const itemSlug = safeStringify(item.slug);
    if (item.type === "review") return `/review/${itemSlug}`;
    return `/artikel/${itemSlug}`;
  };

  const articleBannerImage = formatImageUrl(
    article,
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600",
  );

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-[#FFD700] selection:text-black">
      <Navbar />
      <ViewTracker slug={slug} />
      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-8 min-w-0">
              <article>
                <div className="mb-8 space-y-6">
                  {categories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {categories.map((cat: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded bg-[#FFD700] px-3 py-1 text-xs font-bold uppercase tracking-wider text-black font-mono shadow-sm"
                        >
                          {String(cat)}
                        </span>
                      ))}
                    </div>
                  )}

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {safeStringify(article.title)}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-text-muted border-y border-dark-border py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#FFD700]" />
                      <span className="font-bold text-white">{authorName}</span>
                    </div>
                    {article.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(article.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#FFD700]" />
                      <span>
                        {safeStringify(article.read_time, "3 MIN READ")}
                      </span>
                    </div>
                  </div>

                  {article.summary && (
                    <p className="text-base sm:text-lg text-text-muted text-justify font-medium border-l-4 border-[#FFD700] pl-4 bg-dark-card/30 p-4 rounded-r-lg">
                      {safeStringify(article.summary)}
                    </p>
                  )}
                </div>

                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-dark-border mb-8 shadow-2xl">
                  <img
                    src={articleBannerImage}
                    alt={safeStringify(article.title)}
                    className="h-full w-full object-cover"
                  />
                </div>

                <ArticleContent content={parsedContent} />

                {article.id && (
                  <ArticleInteractions
                    articleId={article.id}
                    initialLikes={Number(article.likes_count) || 0}
                  />
                )}
              </article>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dark-border pt-8 mt-8">
                {prevArticle ? (
                  <Link
                    href={getArticleHref(prevArticle)}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-[#FFD700] transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-text-muted group-hover:text-[#FFD700] shrink-0" />
                    <div className="flex-1 min-w-0 text-right md:text-left">
                      <p className="text-xs font-mono text-text-muted mb-1">
                        BERITA SEBELUMNYA
                      </p>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FFD700] truncate transition-colors">
                        {safeStringify(prevArticle.title)}
                      </h4>
                    </div>
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img
                        src={formatImageUrl(
                          prevArticle,
                          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800",
                        )}
                        alt={safeStringify(prevArticle.title)}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextArticle ? (
                  <Link
                    href={getArticleHref(nextArticle)}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-[#FFD700] transition-colors text-right"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img
                        src={formatImageUrl(
                          nextArticle,
                          "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
                        )}
                        alt={safeStringify(nextArticle.title)}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-text-muted mb-1">
                        BERITA SELANJUTNYA
                      </p>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FFD700] truncate transition-colors">
                        {safeStringify(nextArticle.title)}
                      </h4>
                    </div>
                    <ChevronRight className="h-6 w-6 text-text-muted group-hover:text-[#FFD700] shrink-0" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>

            <aside className="lg:col-span-4 w-full">
              <div className="lg:sticky lg:top-24 space-y-6">
                <ShareWidget title={safeStringify(article.title)} />

                <div>
                  {sidebarAd ? (
                    <a
                      href={safeStringify(sidebarAd.url_link, "#")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block w-full max-w-[320px] mx-auto overflow-hidden rounded-xl group border border-dark-border/30 shadow-xl"
                    >
                      <img
                        src={formatImageUrl(sidebarAd.banner_image, "")}
                        alt={safeStringify(sidebarAd.title, "Ad")}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2 right-3 text-[9px] font-black tracking-widest text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                        AD
                      </span>
                    </a>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-dark-border bg-dark-bg/30 relative overflow-hidden aspect-[3/4] w-full max-w-[320px] mx-auto">
                      <span className="absolute top-2 right-3 text-[9px] text-text-muted/50 font-mono border border-text-muted/20 px-1 rounded">
                        Ad
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        Space Iklan Dinamis
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full max-w-[320px] mx-auto">
                  <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#121526] to-dark-card p-6 text-center shadow-xl">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-10 h-10 fill-indigo-400 mx-auto mb-3 animate-bounce"
                      aria-hidden="true"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.213.385-.444.905-.608 1.315a18.27 18.27 0 0 0-5.648 0c-.164-.41-.4-.93-.615-1.315A19.736 19.736 0 0 0 3.67 4.37C.533 9.046-.319 13.608.106 18.11a19.98 19.98 0 0 0 6.002 3.03c.49-.67.924-1.38 1.293-2.13-.71-.27-1.39-.61-2.04-1.01.17-.125.337-.255.5-.39 3.93 1.84 8.18 1.84 12.06 0 .164.135.33.265.5.39-.65.4-1.33.74-2.04 1.01.37.75.8 1.46 1.29 2.13a19.98 19.98 0 0 0 6.006-3.03c.5-5.22-.85-9.74-3.36-13.74ZM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
                    </svg>

                    <h3 className="text-base font-mono font-black text-white uppercase tracking-wide">
                      TEMPAT NONGKRONG GAMER
                    </h3>

                    <p className="text-text-muted text-xs mt-2 mb-5 leading-relaxed">
                      Join server Discord Daily Diction buat mabar, berbagi info
                      gacha, pamer spek PC, atau sekadar gibahin industri pop
                      culture!
                    </p>

                    <a
                      href="https://discord.com/invite/DG6Nebkex9"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 bg-white text-black font-mono font-bold text-xs uppercase py-3 px-4 rounded-xl hover:bg-white/90 transition-all shadow-lg relative z-10"
                    >
                      <Send className="h-3.5 w-3.5 fill-current" />
                      <span>Masuk Server (Gratis)</span>
                    </a>
                  </div>
                </div>

                <TrendingSection />
                <LatestNewsSection />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}