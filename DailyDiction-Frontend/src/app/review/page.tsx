"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Trophy, Gamepad2 } from "lucide-react";
import Link from "next/link";

interface ReviewItem {
  id: number;
  title: string;
  slug: string;
  platform?: string | string[];
  category_input?: string | string[];
  category?: string | string[];
  categories?: any[];
  summary: string;
  content: string;
  image_url?: string;
  image_full_url?: string;
  created_at: string;
  type?: string;
}

// Helper untuk format URL Gambar
function formatImageUrl(
  imageUrl: string | null | undefined,
  fallback: string,
): string {
  if (!imageUrl) return fallback;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    if (imageUrl.includes("127.0.0.1:8000/storage/http")) {
      return imageUrl.replace(
        /http:\/\/127\.0\.0\.1:8000\/storage\/(https?:\/\/)/,
        "$1",
      );
    }
    return imageUrl;
  }
  return `https://dailydiction.id/storage/${imageUrl}`;
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [reviewsRes, articlesRes] = await Promise.all([
          fetch("https://dailydiction.id/api/v1/reviews").catch(() => null),
          fetch("https://dailydiction.id/api/v1/articles").catch(() => null),
        ]);

        let fetchedReviews: ReviewItem[] = [];

        if (reviewsRes && reviewsRes.ok) {
          const revJson = await reviewsRes.json();
          fetchedReviews = Array.isArray(revJson)
            ? revJson
            : revJson.data || [];
        }

        // Fallback: Jika endpoint reviews kosong, ambil dari articles yang berkategori/bertipe Review
        if (fetchedReviews.length === 0 && articlesRes && articlesRes.ok) {
          const artJson = await articlesRes.json();
          const rawArticles: ReviewItem[] = artJson.data || [];

          fetchedReviews = rawArticles.filter((item) => {
            if (
              item.type?.toLowerCase() === "review" ||
              item.type?.toLowerCase() === "reviews"
            ) {
              return true;
            }
            const cats = [
              ...(Array.isArray(item.category_input)
                ? item.category_input
                : [item.category_input]),
              ...(Array.isArray(item.category)
                ? item.category
                : [item.category]),
              ...(Array.isArray(item.categories)
                ? item.categories.map((c: any) => c.name)
                : []),
            ]
              .filter(Boolean)
              .map((c) => String(c).toUpperCase());

            return cats.some(
              (cat) => cat.includes("REVIEW") || cat.includes("ULASAN"),
            );
          });
        }

        if (isMounted) {
          setReviews(fetchedReviews);
        }
      } catch (err) {
        console.error("Gagal mengambil data review:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper parser array platform super aman
  const getPlatformsArray = (review: ReviewItem): string[] => {
    const raw = review.platform || review.category || ["PC"];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        return raw.startsWith("[") ? JSON.parse(raw) : [raw];
      } catch {
        return [raw];
      }
    }
    return ["PC"];
  };

  // Filter Data berdasarkan Platform Button & Search Bar
  const filteredReviews = reviews.filter((review) => {
    const plats = getPlatformsArray(review).map((p) => String(p).toUpperCase());

    const matchPlatform =
      selectedPlatform === "ALL" ||
      plats.some(
        (p) => p.includes(selectedPlatform) || selectedPlatform.includes(p),
      );

    const matchSearch =
      (review.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (review.summary?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    return matchPlatform && matchSearch;
  });

  // Featured Review diambil dari data awal ketika belum difilter (atau dari item pertama)
  const featuredReview = reviews.length > 0 ? reviews[0] : null;

  const filterButtons = ["ALL", "PC", "PS5", "SWITCH", "XBOX"];

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white flex flex-col justify-between font-sans">
      <div>
        <Navbar />

        <main className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
          {/* ============ HEADER ============ */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-dark-border/50 pb-8">
            <div>
              <span className="mb-2 flex w-max items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold tracking-wider text-yellow-500 font-mono">
                <Trophy className="h-4 w-4" />
                ULASAN JUJUR & INDEPENDEN
              </span>
              <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl font-mono">
                Game Reviews
              </h1>
              <p className="mt-4 max-w-2xl text-text-muted text-sm font-mono">
                Analisis mendalam, kelebihan, kekurangan, serta penilaian
                objektif untuk game-game konsol & PC terbaru oleh tim redaksi
                Daily Diction.
              </p>
            </div>
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari judul game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-card py-2.5 pl-10 pr-4 text-xs text-white placeholder-text-muted/50 focus:border-brand-cyan focus:outline-none transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* ============ FEATURED REVIEW (CARD BESAR ATAS) ============ */}
          {isLoading ? (
            <div className="h-80 md:h-96 rounded-2xl border border-dark-border bg-dark-card/50 animate-pulse mb-12" />
          ) : featuredReview ? (
            <div className="mb-12">
              <Link
                href={`/artikel/${featuredReview.slug}`}
                className="group block overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-colors hover:border-brand-cyan/50 shadow-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                  <div className="relative aspect-video md:aspect-auto lg:col-span-3 overflow-hidden">
                    <img
                      src={formatImageUrl(
                        featuredReview.image_url ||
                          featuredReview.image_full_url,
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
                      )}
                      alt={featuredReview.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded bg-brand-crimson px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg font-mono">
                      Featured Review
                    </span>
                  </div>

                  <div className="flex flex-col justify-center p-6 md:p-8 lg:col-span-2 lg:p-12">
                    <div className="flex flex-wrap items-center gap-2 mb-4 font-mono">
                      {getPlatformsArray(featuredReview).map((plat, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1.5 rounded bg-brand-cyan/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-cyan border border-brand-cyan/30"
                        >
                          <Gamepad2 className="h-3.5 w-3.5" />
                          {plat}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-brand-cyan transition-colors line-clamp-2">
                      {featuredReview.title}
                    </h2>
                    <p className="mt-4 text-text-muted text-xs line-clamp-3 leading-relaxed">
                      {featuredReview.summary}
                    </p>

                    <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-cyan transition-colors font-mono">
                      BACA ULASAN LENGKAP &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : null}

          {/* ============ FILTER BUTTONS ============ */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 font-mono">
            <span className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-widest mr-2 shrink-0">
              FILTER:
            </span>
            {filterButtons.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedPlatform(filter)}
                className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  selectedPlatform === filter
                    ? "bg-brand-crimson text-white shadow-[0_0_15px_rgba(255,62,62,0.4)]"
                    : "bg-dark-card border border-dark-border text-text-muted hover:border-brand-crimson/50 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* ============ GRID REVIEW DI BAWAHNYA ============ */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-64 rounded-xl border border-dark-border bg-dark-card/50 animate-pulse"
                />
              ))}
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredReviews.map((review) => {
                const platforms = getPlatformsArray(review);

                return (
                  <Link
                    key={review.id}
                    href={`/artikel/${review.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-all hover:border-brand-cyan/50 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-dark-border/50 shrink-0">
                      <img
                        src={formatImageUrl(
                          review.image_url || review.image_full_url,
                          "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
                        )}
                        alt={review.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 font-mono">
                        {platforms.map((plat, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-black/60 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-cyan backdrop-blur-sm border border-brand-cyan/30"
                          >
                            {plat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-2">
                          {review.title}
                        </h3>
                        <p className="mt-2 text-xs text-text-muted line-clamp-3 leading-relaxed">
                          {review.summary}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-dark-border/60 pt-4 font-mono">
                        <span className="text-[10px] text-text-muted">
                          {new Date(
                            review.created_at || Date.now(),
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">
                          Baca Review &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dark-border bg-dark-card p-12 text-center font-mono">
              <p className="text-sm text-text-muted">
                Tidak ada ulasan game yang ditemukan untuk filter "
                {selectedPlatform}".
              </p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
