"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  category_input?: string | string[];
  category?: string | string[];
  categories?: { id?: number; name: string }[] | any[];
  summary: string;
  thumbnail?: string;
  thumbnail_url?: string;
  image?: string;
  image_full_url?: string;
  read_time?: string;
  created_at?: string;
  contentType?: "artikel" | "review";
}

function formatHeroImage(article: ArticleItem): string {
  const rawUrl =
    article.thumbnail_url ||
    article.thumbnail ||
    article.image_full_url ||
    article.image;

  if (!rawUrl)
    return "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600";

  const clean = rawUrl.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  const cleanPath = clean.startsWith("/") ? clean.slice(1) : clean;
  if (cleanPath.startsWith("storage/")) {
    return `https://dailydiction.id/${cleanPath}`;
  }
  return `https://dailydiction.id/storage/${cleanPath}`;
}

// Helper pengambil seluruh tag kategori
function getCategoriesArray(item: ArticleItem, fallback = "NEWS"): string[] {
  if (item.contentType === "review") return ["REVIEW"];

  let rawCats: any[] = [];

  if (item.categories && item.categories.length > 0) {
    rawCats = item.categories.map((c: any) => (typeof c === "string" ? c : c.name));
  } else if (item.category_input) {
    rawCats = Array.isArray(item.category_input) ? item.category_input : [item.category_input];
  } else if (item.category) {
    if (typeof item.category === "string" && item.category.startsWith("[")) {
      try {
        rawCats = JSON.parse(item.category);
      } catch {
        rawCats = [item.category];
      }
    } else {
      rawCats = Array.isArray(item.category) ? item.category : [item.category];
    }
  }

  const validCats = rawCats.filter(Boolean).map(String);
  return validCats.length > 0 ? validCats.map((c) => c.toUpperCase()) : [fallback];
}

export default function HeroSection() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchHeroContent() {
      if (typeof window === "undefined") return;

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

        // Fetch berita dan review secara paralel
        const [articlesRes, reviewsRes] = await Promise.all([
          fetch(`${apiUrl}/articles`, {
            headers: { Accept: "application/json" },
            cache: "no-store",
          }).catch(() => null),
          fetch(`${apiUrl}/reviews`, {
            headers: { Accept: "application/json" },
            cache: "no-store",
          }).catch(() => null),
        ]);

        const articlesJson = articlesRes?.ok ? await articlesRes.json() : null;
        const reviewsJson = reviewsRes?.ok ? await reviewsRes.json() : null;

        const newsData: ArticleItem[] = (articlesJson?.data || []).map(
          (item: any) => ({
            ...item,
            contentType: "artikel",
          })
        );

        const reviewsData: ArticleItem[] = (reviewsJson?.data || []).map(
          (item: any) => ({
            ...item,
            contentType: "review",
          })
        );

        // Gabungkan dan urutkan berdasarkan created_at descending
        // Gabungkan data
        const rawCombined = [...newsData, ...reviewsData];

        // FILTER ANTI-KEMBAR: Cek ID biar gak ada yang double
        const uniqueCombined = Array.from(
          new Map(rawCombined.map((item) => [item.id, item])).values()
        );

        // Urutkan berdasarkan created_at descending
        const sortedCombined = uniqueCombined.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });

        if (isMounted) {
          setArticles(sortedCombined.slice(0, 5));
        }
      } catch (error) {
        console.warn("Gagal memuat konten Hero:", error);
        if (isMounted) {
          setArticles([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchHeroContent();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (articles.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [articles.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  if (isLoading) {
    return (
      <div className="relative w-full aspect-[16/9] sm:h-[60vh] md:h-[75vh] md:min-h-[520px] bg-dark-card animate-pulse border-b border-dark-border" />
    );
  }

  if (articles.length === 0) {
    return null;
  }

  const currentArticle = articles[currentIndex];
  const targetLink = `/${currentArticle.contentType || "artikel"}/${currentArticle.slug}`;
  const currentCategories = getCategoriesArray(currentArticle);

  return (
    <section className="relative w-full overflow-hidden border-b border-dark-border bg-black">
      <div className="relative w-full aspect-[16/10] sm:aspect-video md:aspect-auto md:h-[75vh] md:min-h-[520px] overflow-hidden">
        {/* Background Image Slider */}
        <Link href={targetLink} className="absolute inset-0 block group">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentArticle.contentType}-${currentArticle.id}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-full w-full"
            >
              <img
                src={formatHeroImage(currentArticle)}
                alt={currentArticle.title}
                className="h-full w-full object-cover object-center filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/90 via-dark-bg/30 to-transparent hidden sm:block" />
        </Link>

        {/* Konten Teks & Kontrol Overlay */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end p-4 sm:px-6 lg:px-8 pb-4 sm:pb-10 pointer-events-none">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Teks Artikel */}
            <div className="max-w-2xl pointer-events-auto">
              <Link href={targetLink} className="block group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentArticle.contentType}-${currentArticle.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {currentCategories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-brand-crimson px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold uppercase text-white shadow-sm"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    <h1 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-snug sm:leading-tight line-clamp-2 group-hover:text-brand-crimson transition-colors drop-shadow-md">
                      {currentArticle.title}
                    </h1>

                    <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-sm text-text-muted line-clamp-1 sm:line-clamp-2 leading-relaxed max-w-xl">
                      {currentArticle.summary}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </Link>

              <div className="mt-3 sm:mt-5 flex items-center gap-3">
                <Link
                  href={targetLink}
                  className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-brand-crimson px-3 py-1.5 sm:px-5 sm:py-2.5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(255,62,62,0.4)] transition-all hover:bg-brand-crimson/90 active:scale-95 pointer-events-auto"
                >
                  <span>Baca</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Link>

                <div className="flex items-center gap-1 font-mono text-[10px] sm:text-xs text-text-muted">
                  <Clock className="h-3 w-3 text-brand-cyan" />
                  <span>{currentArticle.read_time || "5 MIN READ"}</span>
                </div>
              </div>
            </div>

            {/* Navigasi & Indikator */}
            <div className="flex items-center justify-between sm:justify-end gap-3 font-mono z-20 pointer-events-auto mt-2 sm:mt-0">
              <div className="flex items-center gap-1.5">
                {articles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? "w-6 sm:w-8 bg-brand-crimson"
                        : "w-2 bg-dark-border hover:bg-text-muted"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  aria-label="Previous Slide"
                  className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-dark-border bg-dark-card/80 text-text-muted backdrop-blur-md transition-all hover:border-brand-crimson hover:text-white active:scale-95"
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next Slide"
                  className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-dark-border bg-dark-card/80 text-text-muted backdrop-blur-md transition-all hover:border-brand-crimson hover:text-white active:scale-95"
                >
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}