import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getAdvertisements,
  getGameReviewBySlug,
  getArticleBySlug,
} from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Gamepad2, User, Calendar, Clock } from "lucide-react";
import { DiscordWidget } from "@/components/Sidebar";
import TweetRenderer from "@/components/TweetRenderer";

export const revalidate = 0;

interface NavReviewItem {
  title: string;
  slug: string;
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
  platform?: string | string[];
  summary?: string;
  content?: string | any[];
  image_url?: string;
  image_full_url?: string;
  image?: string;
  thumbnail_url?: string;
  thumbnail?: string;
  created_at?: string;
  author?: string;
  read_time?: string;
  prev?: NavReviewItem | null;
  next?: NavReviewItem | null;
}

function formatImageUrl(
  imageUrl: string | null | undefined,
  fallback: string = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800"
): string {
  if (!imageUrl || typeof imageUrl !== "string") return fallback;

  const clean = imageUrl.trim();

  if (clean.includes("/storage/http://") || clean.includes("/storage/https://")) {
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

export default async function DetailReview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

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

  const parsePlatforms = (platform: string | string[] | undefined): string[] => {
    if (!platform) return [];
    if (Array.isArray(platform)) return platform;
    if (typeof platform === "string") {
      try {
        return platform.startsWith("[") ? JSON.parse(platform) : [platform];
      } catch {
        return [platform];
      }
    }
    return [];
  };

  const platforms = parsePlatforms(review.platform);

  const rawContentString =
    typeof review.content === "string"
      ? review.content
      : Array.isArray(review.content)
      ? review.content.map((b: any) => b.content ?? "").join("")
      : "";

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* ================= KOLOM KIRI (KONTEN UTAMA) ================= */}
            <div className="lg:col-span-8">
              <article>
                {/* Header Review */}
                <div className="mb-8 space-y-6">
                  {/* Badge Platform */}
                  {platforms.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {platforms.map((plat: string, idx: number) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1.5 rounded bg-[#FFD700]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFD700] border border-[#FFD700]/30"
                        >
                          <Gamepad2 className="h-3.5 w-3.5" />
                          {plat}
                        </span>
                      ))}
                    </div>
                  )}

                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {review.title}
                  </h1>

                  {/* INFO AUTHOR & TANGGAL */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted mt-4 mb-2">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-[#FFD700]" />
                      <span className="font-bold text-white">{review.author || "Redaksi"}</span>
                    </div>
                    {review.created_at && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(review.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{review.read_time || "3 MIN READ"}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-lg text-text-muted text-justify font-medium border-l-4 border-[#FFD700] pl-4 bg-dark-card/30 p-4 rounded-r-lg">
                    {review.summary || "Baca ulasan lengkap game ini di bawah."}
                  </p>
                </div>

                {/* Cover Image Utama */}
                {(review.image_url ||
                  review.image_full_url ||
                  review.image ||
                  review.thumbnail_url ||
                  review.thumbnail) && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-dark-border mb-8">
                    <img
                      src={formatImageUrl(
                        review.image_url ||
                          review.image_full_url ||
                          review.image ||
                          review.thumbnail_url ||
                          review.thumbnail,
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600"
                      )}
                      alt={review.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Body Konten Review */}
                <TweetRenderer htmlContent={rawContentString} />
              </article>

              {/* ================= NAVIGASI NEXT / PREV REVIEW ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dark-border pt-8 mt-8">
                {prevReview ? (
                  <Link
                    href={`/review/${prevReview.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-[#FFD700] transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-text-muted group-hover:text-[#FFD700] shrink-0" />
                    <div className="flex-1 min-w-0 text-right md:text-left">
                      <p className="text-xs font-mono text-text-muted mb-1">
                        REVIEW SEBELUMNYA
                      </p>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FFD700] truncate transition-colors">
                        {prevReview.title}
                      </h4>
                    </div>
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img
                        src={formatImageUrl(
                          prevReview.thumbnail_url ||
                            prevReview.thumbnail ||
                            prevReview.image_url ||
                            prevReview.image,
                          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"
                        )}
                        alt={prevReview.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextReview ? (
                  <Link
                    href={`/review/${nextReview.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-[#FFD700] transition-colors text-right"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img
                        src={formatImageUrl(
                          nextReview.thumbnail_url ||
                            nextReview.thumbnail ||
                            nextReview.image_url ||
                            nextReview.image,
                          "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800"
                        )}
                        alt={nextReview.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-text-muted mb-1">
                        REVIEW SELANJUTNYA
                      </p>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FFD700] truncate transition-colors">
                        {nextReview.title}
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
              <div className="sticky top-24 space-y-8">
                {sidebarAd ? (
                  <a
                    href={sidebarAd.url_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full max-w-[320px] mx-auto overflow-hidden rounded-xl group border border-dark-border/30 shadow-xl"
                  >
                    <img
                      src={formatImageUrl(sidebarAd.banner_image, "")}
                      alt={sidebarAd.title}
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

                <div className="w-full max-w-[320px] mx-auto">
                  <DiscordWidget />
                </div>
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
            line-height: 1.75;
            color: #d1d5db;
            text-align: justify;
          }
          .rich-text-content p { margin-bottom: 1.5em; text-align: justify; }
          .rich-text-content h2,
          .rich-text-content h3 {
            color: white;
            font-weight: 900;
            margin-top: 2em;
            margin-bottom: 0.75em;
            text-align: justify;
          }
          .rich-text-content img {
            width: 100%;
            height: auto;
            border-radius: 0.75rem;
            margin-top: 2rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .rich-text-content a {
            color: #FFD700;
            text-decoration: none;
          }
          .rich-text-content a:hover { text-decoration: underline; }
          .rich-text-content strong { color: white; }
          .rich-text-content iframe {
            width: 100%;
            aspect-ratio: 16/9;
            border-radius: 0.75rem;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
          }
        `,
        }}
      />
    </div>
  );
}