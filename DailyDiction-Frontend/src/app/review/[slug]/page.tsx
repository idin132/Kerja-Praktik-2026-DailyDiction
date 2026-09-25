import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getAdvertisements,
  getGameReviewBySlug,
  getArticleBySlug,
} from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Gamepad2,
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

interface NavReviewItem {
  title: string;
  slug: string;
  type?: string;
  thumbnail_url?: string;
  thumbnail?: string;
  image_url?: string;
  image?: string;
}

interface ReviewItem {
  id?: number;
  title: string;
  slug: string;
  type?: string;
  platform?: any;
  summary?: string;
  content?: any;
  image_url?: string;
  image_full_url?: string;
  image?: string;
  thumbnail_url?: string;
  thumbnail?: string;
  created_at?: string;
  author?: any;
  read_time?: string;
  prev?: NavReviewItem | null;
  next?: NavReviewItem | null;
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

function formatImageUrl(
  imageUrl: string | null | undefined,
  fallback: string = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
): string {
  if (!imageUrl || typeof imageUrl !== "string") return fallback;

  const clean = imageUrl.trim();

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

function parsePlatformsSafely(platform: any): string[] {
  if (!platform) return [];

  const extractString = (item: any): string => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      return item.name || item.title || item.label || item.value || "";
    }
    return String(item);
  };

  if (Array.isArray(platform)) {
    return platform.map(extractString).filter(Boolean);
  }

  if (typeof platform === "string") {
    try {
      const parsed = platform.startsWith("[")
        ? JSON.parse(platform)
        : [platform];
      return Array.isArray(parsed)
        ? parsed.map(extractString).filter(Boolean)
        : [extractString(parsed)];
    } catch {
      return [platform];
    }
  }

  if (typeof platform === "object") {
    const extracted = extractString(platform);
    return extracted ? [extracted] : [];
  }

  return [];
}

export default async function DetailReview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const slug = safeStringify(rawSlug);

  const [reviewRes, adsData] = await Promise.all([
    getGameReviewBySlug(slug).catch(() => null),
    getAdvertisements().catch(() => null),
  ]);

  let review: ReviewItem | null = (reviewRes as any)?.data || reviewRes;

  if (!review || !review.title) {
    const articleRes = await getArticleBySlug(slug).catch(() => null);
    review = (articleRes as any)?.data || articleRes;
  }

  if (!review || !review.title) {
    notFound();
  }

  const sidebarAd =
    adsData?.data && Array.isArray(adsData.data)
      ? adsData.data[0]
      : Array.isArray(adsData)
        ? adsData[0]
        : null;

  const prevReview = review.prev || null;
  const nextReview = review.next || null;

  const platforms = parsePlatformsSafely(review.platform);
  const parsedContent = parseContentMedia(review.content);

  const authorName =
    typeof review.author === "string"
      ? review.author
      : review.author?.name || review.author?.username || "Redaksi";

  const getArticleHref = (item: NavReviewItem | null) => {
    if (!item) return "#";
    const itemSlug = safeStringify(item.slug);
    if (item.type === "review") return `/review/${itemSlug}`;
    return `/artikel/${itemSlug}`;
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-[#FFD700] selection:text-black">
      <Navbar />
      <ViewTracker slug={slug} />
      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Container Grid Utama dengan items-start agar Sticky Sidebar Berjalan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Kolom Kiri: Detail Review */}
            <div className="lg:col-span-8 min-w-0">
              <article>
                <div className="mb-8 space-y-6">
                  {/* Badge Platform Game */}
                  {platforms.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {platforms.map((plat: string, idx: number) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1.5 rounded bg-[#FFD700]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFD700] border border-[#FFD700]/30"
                        >
                          <Gamepad2 className="h-3.5 w-3.5" />
                          {String(plat)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Judul Review */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {safeStringify(review.title)}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-text-muted border-y border-dark-border py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#FFD700]" />
                      <span className="font-bold text-white">{authorName}</span>
                    </div>
                    {review.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(review.created_at).toLocaleDateString(
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
                        {safeStringify(review.read_time, "3 MIN READ")}
                      </span>
                    </div>
                  </div>

                  {/* Summary / Ringkasan Ulasan */}
                  <p className="text-base sm:text-lg text-text-muted text-justify font-medium border-l-4 border-[#FFD700] pl-4 bg-dark-card/30 p-4 rounded-r-lg">
                    {safeStringify(
                      review.summary,
                      "Baca ulasan lengkap game ini di bawah.",
                    )}
                  </p>
                </div>

                {/* Feature Image / Banner Utama Game */}
                {(review.image_url ||
                  review.image_full_url ||
                  review.image ||
                  review.thumbnail_url ||
                  review.thumbnail) && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-dark-border mb-8 shadow-2xl">
                    <img
                      src={formatImageUrl(
                        review.image_url ||
                          review.image_full_url ||
                          review.image ||
                          review.thumbnail_url ||
                          review.thumbnail,
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600",
                      )}
                      alt={safeStringify(review.title)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Teks Konten Review */}
                <ArticleContent content={parsedContent} />

                {review.id && (
                  <ArticleInteractions
                    articleId={review.id}
                    initialLikes={Number((review as any).likes_count) || 0}
                  />
                )}
              </article>

              {/* Navigasi Review Sebelum / Sesudah */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dark-border pt-8 mt-8">
                {prevReview ? (
                  <Link
                    href={getArticleHref(prevReview)}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-[#FFD700] transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-text-muted group-hover:text-[#FFD700] shrink-0" />
                    <div className="flex-1 min-w-0 text-right md:text-left">
                      <p className="text-xs font-mono text-text-muted mb-1">
                        REVIEW SEBELUMNYA
                      </p>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FFD700] truncate transition-colors">
                        {safeStringify(prevReview.title)}
                      </h4>
                    </div>
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img
                        src={formatImageUrl(
                          prevReview.thumbnail_url ||
                            prevReview.thumbnail ||
                            prevReview.image_url ||
                            prevReview.image,
                          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800",
                        )}
                        alt={safeStringify(prevReview.title)}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextReview ? (
                  <Link
                    href={getArticleHref(nextReview)}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-[#FFD700] transition-colors text-right"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img
                        src={formatImageUrl(
                          nextReview.thumbnail_url ||
                            nextReview.thumbnail ||
                            nextReview.image_url ||
                            nextReview.image,
                          "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
                        )}
                        alt={safeStringify(nextReview.title)}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-text-muted mb-1">
                        REVIEW SELANJUTNYA
                      </p>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FFD700] truncate transition-colors">
                        {safeStringify(nextReview.title)}
                      </h4>
                    </div>
                    <ChevronRight className="h-6 w-6 text-text-muted group-hover:text-[#FFD700] shrink-0" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>

            {/* Kolom Kanan: Sidebar Sticky Mulus Mengikuti Scroll */}
            <aside className="lg:col-span-4 w-full">
              <div className="lg:sticky lg:top-24 space-y-6">
                <ShareWidget title={safeStringify(review.title)} />

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

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .rich-text-content {
            font-size: 1.125rem;
            line-height: 1.6;
            color: #d1d5db;
          }

          .rich-text-content p {
            margin-bottom: 1.25em;
            line-height: 1.6;
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
            line-height: 1.25 !important;
            text-align: justify !important;
          }

          .rich-text-content p[style*="text-align: left"] { text-align: left !important; }
          .rich-text-content p[style*="text-align: center"] { text-align: center !important; }
          .rich-text-content p[style*="text-align: right"] { text-align: right !important; }
          .rich-text-content p[style*="text-align: justify"] { text-align: justify !important; }

          /* Layout Pembungkus Gambar & Caption CKEditor */
          .rich-text-content figure.image,
          .rich-text-content p:has(img) {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            margin-top: 2rem !important;
            margin-bottom: 2rem !important;
            text-align: center !important;
          }

          .rich-text-content img {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 0.75rem !important;
            margin: 0 auto !important;
            display: block !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }

          .rich-text-content figure.image img {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }

          /* Style Teks Keterangan Gambar (Caption) */
          .rich-text-content figcaption,
          .rich-text-content .image-caption {
            margin-top: 0.75rem !important;
            font-size: 0.875rem !important;
            line-height: 1.4 !important;
            color: #9ca3af !important;
            text-align: center !important;
            font-style: italic !important;
            width: 100% !important;
            max-width: 90% !important;
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