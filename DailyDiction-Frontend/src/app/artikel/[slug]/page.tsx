import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getArticleBySlug, getAdvertisements } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import ShareWidget from "@/components/ShareWidget";
import {
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Send,
} from "lucide-react";
import ArticleInteractions from "@/components/ArticleInteractions";
import ViewTracker from "@/components/ViewTracker";
import ArticleContent from "@/components/ArticleContent";
import LatestNewsSection from "@/components/LatestNewsSection";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// HELPER SANITASI TOTAL AGAR TIDAK PERNAH ADA OBJECT KEBOCOR KE REACT JSX (ANTI ERROR #60)
function safeStringify(val: any, fallback: string = ""): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    if (val.name) return String(val.name);
    if (val.title) return String(val.title);
    if (val.label) return String(val.label);
    if (val.username) return String(val.username);
    if (val.content) return safeStringify(val.content, fallback);
    if (val.html) return safeStringify(val.html, fallback);
    if (val.value) return safeStringify(val.value, fallback);
  }
  return fallback;
}

function parseCategoriesToSafeStrings(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((item) => safeStringify(item)).filter(Boolean);
  }
  if (typeof raw === "string") {
    try {
      const parsed = raw.startsWith("[") ? JSON.parse(raw) : [raw];
      if (Array.isArray(parsed)) {
        return parsed.map((item) => safeStringify(item)).filter(Boolean);
      }
    } catch {
      return [raw];
    }
  }
  if (typeof raw === "object") {
    const str = safeStringify(raw);
    return str ? [str] : [];
  }
  return [];
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
          : b?.content || b?.html || b?.text || b?.value || ""
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
    ""
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

function formatImageUrl(
  imageUrl: any,
  fallback: string = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600",
): string {
  const cleanUrl = safeStringify(imageUrl);
  if (!cleanUrl) return fallback;

  const clean = cleanUrl.trim();

  if (
    clean.includes("/storage/http://") ||
    clean.includes("/storage/https://")
  ) {
    return clean.replace(/^https?:\/\/[^\/]+\/storage\/(https?:\/\/)/i, "$1");
  }

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  const cleanPath = clean.replace(/^\/+/, "");
  if (cleanPath.startsWith("storage/")) {
    return `https://dailydiction.id/${cleanPath}`;
  }

  return `https://dailydiction.id/storage/${cleanPath}`;
}

export default async function DetailArtikel({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [articleRes, adsData] = await Promise.all([
    getArticleBySlug(slug).catch(() => null),
    getAdvertisements().catch(() => null),
  ]);

  const rawArticle = (articleRes as any)?.data || articleRes;

  if (!rawArticle || !rawArticle.title) {
    notFound();
  }

  const article = rawArticle;
  const sidebarAd =
    adsData?.data && Array.isArray(adsData.data)
      ? adsData.data[0]
      : Array.isArray(adsData)
        ? adsData[0]
        : null;

  const prevArticle = article.prev || null;
  const nextArticle = article.next || null;

  // SANITASI SELURUH VARIABEL DARI BACKEND KEDALAM TIPE DATA APLIKASI
  const articleTitle = safeStringify(article.title, "Artikel");
  const authorName = safeStringify(article.author, "Redaksi");
  const summaryText = safeStringify(
    article.summary,
    "Simak berita selengkapnya di bawah ini."
  );
  const readTimeText = safeStringify(article.read_time, "3 MIN READ");

  // PARSE CATEGORIES DEEP CLEAN
  let categoryList: string[] = parseCategoriesToSafeStrings(
    article.category_input || article.category || article.categories
  );

  // PARSE CONTENT MEDIA
  const parsedContent = parseContentMedia(article.content);

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-[#FFD700] selection:text-black">
      <Navbar />
      <ViewTracker slug={slug} />

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* ================= KOLOM KIRI (KONTEN UTAMA) ================= */}
            <div className="lg:col-span-8">
              <article>
                {/* Header Artikel */}
                <div className="animate-fade-up-1 mb-8 space-y-6">
                  {/* Badge Kategori */}
                  <div className="flex flex-wrap items-center gap-2">
                    {categoryList.length > 0 ? (
                      categoryList.map((cat, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-[#FFD700]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFD700] border border-[#FFD700]/30"
                        >
                          {safeStringify(cat, "Berita")}
                        </span>
                      ))
                    ) : (
                      <span className="rounded bg-[#FFD700]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFD700] border border-[#FFD700]/30">
                        Berita Utama
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {articleTitle}
                  </h1>

                  {/* Info Bar */}
                  <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-text-muted border-y border-dark-border py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#FFD700]" />
                      <span className="font-bold text-white">
                        {authorName}
                      </span>
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
                      <span>{readTimeText}</span>
                    </div>
                  </div>

                  {/* Thumbnail Cover */}
                  <div className="mb-10 w-full overflow-hidden rounded-2xl border border-dark-border bg-dark-card shadow-2xl">
                    <img
                      src={formatImageUrl(
                        article.image_url ||
                          article.image ||
                          article.thumbnail ||
                          article.thumbnail_url ||
                          article.banner_image ||
                          article.image_full_url,
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600",
                      )}
                      alt={articleTitle}
                      className="w-full aspect-[16/9] object-cover"
                    />
                  </div>

                  <p className="text-base sm:text-lg text-text-muted text-justify font-medium border-l-4 border-[#FFD700] pl-4 bg-dark-card/30 p-4 rounded-r-lg">
                    {summaryText}
                  </p>
                </div>

                {/* Body Artikel */}
                <ArticleContent content={parsedContent} />

                {/* Interaksi Like & Komen */}
                {article.id && (
                  <ArticleInteractions
                    articleId={article.id}
                    initialLikes={Number((article as any).likes_count) || 0}
                  />
                )}
              </article>

              {/* ================= NAVIGASI NEXT / PREV ARTIKEL ================= */}
              <div className="animate-fade-up-3 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dark-border pt-8 mt-8">
                {prevArticle ? (
                  <Link
                    href={`/artikel/${safeStringify(prevArticle.slug)}`}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-[#FFD700] transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-text-muted group-hover:text-[#FFD700] shrink-0" />
                    <div className="flex-1 min-w-0 text-right md:text-left">
                      <p className="text-xs font-mono text-text-muted mb-1">
                        ARTIKEL SEBELUMNYA
                      </p>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FFD700] truncate transition-colors">
                        {safeStringify(prevArticle.title)}
                      </h4>
                    </div>
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img
                        src={formatImageUrl(
                          prevArticle.thumbnail ||
                            prevArticle.image ||
                            prevArticle.image_url,
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
                    href={`/artikel/${safeStringify(nextArticle.slug)}`}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-[#FFD700] transition-colors text-right"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img
                        src={formatImageUrl(
                          nextArticle.thumbnail ||
                            nextArticle.image ||
                            nextArticle.image_url,
                          "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
                        )}
                        alt={safeStringify(nextArticle.title)}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-text-muted mb-1">
                        ARTIKEL SELANJUTNYA
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

            {/* ================= KOLOM KANAN (SIDEBAR) ================= */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-24 space-y-6">
                {/* 1. Widget Share */}
                <ShareWidget title={articleTitle} />

                {/* 2. Space Iklan Dinamis */}
                <div className="animate-fade-up-2">
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
                      <span className="text-[10px] font-mono text-[#FFD700]/50 mt-1">
                        Tinggi menyesuaikan gambar
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Widget Discord Komunitas */}
                <div className="animate-fade-up-3 w-full max-w-[320px] mx-auto">
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
                      <span>Masuk Server</span>
                    </a>
                  </div>
                </div>
              </div>
              <LatestNewsSection />
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes cinematicFadeUp {
            0% {
              opacity: 0;
              transform: translateY(36px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-up-1 {
            animation: cinematicFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .animate-fade-up-2 {
            animation: cinematicFadeUp 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
          }

          .animate-fade-up-3 {
            animation: cinematicFadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) 0.38s both;
          }

          .rich-text-content {
            font-size: 1.125rem;
            line-height: 1.15;
            color: #d1d5db;
          }

          .rich-text-content p {
            margin-bottom: 1.25em;
            line-height: 1.15;
            text-align: justify;
          }

          .rich-text-content h1,
          .rich-text-content h2,
          .rich-text-content h3,
          .rich-text-content h4,
          .rich-text-content h5,
          .rich-text-content h6 {
            color: #FFD700;
            font-weight: 900 !important;
            margin-top: 1.75em !important;
            margin-bottom: 0.75em !important;
            line-height: 1.15 !important;
            text-align: justify !important;
          }

          .rich-text-content p[style*="text-align: left"] { text-align: left !important; }
          .rich-text-content p[style*="text-align: center"] { text-align: center !important; }
          .rich-text-content p[style*="text-align: right"] { text-align: right !important; }
          .rich-text-content p[style*="text-align: justify"] { text-align: justify !important; }

          .rich-text-content p:has(img) {
            text-align: center !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            margin-top: 2rem;
            margin-bottom: 2rem;
          }

          .rich-text-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
            margin-left: auto !important;
            margin-right: auto !important;
            display: block !important;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .rich-text-content figure.image {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            margin-top: 2rem;
            margin-bottom: 2rem;
            text-align: center !important;
          }

          .rich-text-content figure.image img {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }

          .rich-text-content a {
            color: #FFD700;
            text-decoration: none;
          }
          .rich-text-content a:hover { text-decoration: underline; }
          .rich-text-content strong { color: white; }
          
          .rich-text-content figure.media {
            width: 100% !important;
            display: block !important;
            margin-top: 2rem;
            margin-bottom: 2rem;
          }

          .rich-text-content iframe {
            width: 100% !important;
            aspect-ratio: 16/9;
            border-radius: 0.75rem;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
            border: 0 !important;
            display: block !important;
          }
        `,
        }}
      />
    </div>
  );
}