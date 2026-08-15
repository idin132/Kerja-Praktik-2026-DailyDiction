"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, ArrowRight, Filter, Search } from "lucide-react";

interface ReviewItem {
  id: number;
  title: string;
  slug: string;
  platform: string;
  rating: number | string;
  summary: string;
  content: string;
  image_full_url?: string;
  created_at: string;
}

export default function GameReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/reviews");
        if (res.ok) {
          const json = await res.json();
          setReviews(json.data || []);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((item) => {
    const matchPlatform =
      selectedPlatform === "ALL" ||
      item.platform.toUpperCase().includes(selectedPlatform);
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPlatform && matchSearch;
  });

  const featuredReview = reviews[0]; 
  const platformsList = ["ALL", "PC", "PS5", "SWITCH", "XBOX"];

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-10 border-b border-dark-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest text-yellow-400 mb-3 backdrop-blur-md">
                <Trophy className="h-3.5 w-3.5" />
                <span>Ulasan Jujur & Independen</span>
              </div>
              <h1 className="text-3xl font-black font-mono tracking-tight text-text-primary sm:text-4xl">
                GAME REVIEWS
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-text-muted max-w-2xl">
                Analisis mendalam, kelebihan, kekurangan, serta penilaian objektif untuk game-game konsol & PC terbaru oleh tim redaksi Daily Diction.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari judul game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-card pl-10 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-crimson focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Featured Highlight Review */}
          {featuredReview && !searchQuery && selectedPlatform === "ALL" && (
            <section className="mb-12">
              <Link href={`/review/${featuredReview.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden rounded-2xl border border-dark-border bg-dark-card shadow-2xl flex flex-col lg:flex-row"
                >
                  <div className="relative h-64 sm:h-96 lg:h-auto lg:w-3/5 overflow-hidden">
                    <img
                      src={
                        featuredReview.image_full_url ||
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200"
                      }
                      alt={featuredReview.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-dark-card" />
                    <span className="absolute top-4 left-4 rounded-lg bg-brand-crimson px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-md">
                      FEATURED REVIEW
                    </span>
                  </div>

                  <div className="flex flex-col justify-between p-6 sm:p-8 lg:w-2/5 z-10">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="rounded-md border border-brand-cyan/40 bg-brand-cyan/10 px-2.5 py-1 text-[11px] font-mono font-bold uppercase text-brand-cyan">
                          {featuredReview.platform}
                        </span>
                        <div className="flex items-center gap-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/40 px-3 py-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-mono text-sm font-black text-yellow-400">
                            {Number(featuredReview.rating).toFixed(1)} / 10
                          </span>
                        </div>
                      </div>

                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-text-primary group-hover:text-brand-cyan transition-colors leading-snug">
                        {featuredReview.title}
                      </h2>

                      <p className="mt-3 text-xs sm:text-sm text-text-muted line-clamp-3 leading-relaxed">
                        {featuredReview.summary}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 font-mono text-xs font-bold text-brand-crimson group-hover:translate-x-1 transition-transform">
                      <span>BACA ULASAN LENGKAP</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </section>
          )}

          {/* Platform Filter Buttons */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
            <span className="flex items-center gap-1 text-text-muted mr-2">
              <Filter className="h-3.5 w-3.5 text-brand-crimson" />
              <span>FILTER:</span>
            </span>
            {platformsList.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`rounded-lg px-4 py-2 font-bold uppercase transition-all ${
                  selectedPlatform === platform
                    ? "bg-brand-crimson text-white shadow-[0_0_15px_rgba(255,62,62,0.4)]"
                    : "border border-dark-border bg-dark-card text-text-muted hover:border-brand-cyan hover:text-text-primary"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-80 rounded-xl border border-dark-border bg-dark-card/50 animate-pulse"
                />
              ))}
            </div>
          ) : filteredReviews.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredReviews.map((item) => (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="group flex flex-col overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-all hover:border-brand-crimson/50 shadow-lg"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={
                          item.image_full_url ||
                          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"
                        }
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded border border-dark-border bg-dark-bg/80 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-brand-cyan backdrop-blur-md">
                        {item.platform}
                      </span>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-dark-bg/90 border border-yellow-500/40 px-2.5 py-1 backdrop-blur-md">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-mono text-xs font-black text-yellow-400">
                          {Number(item.rating).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <Link href={`/review/${item.slug}`}>
                          <h3 className="text-base font-bold text-text-primary group-hover:text-brand-cyan transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="mt-2 text-xs text-text-muted line-clamp-3 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="mt-5 border-t border-dark-border/40 pt-3 flex items-center justify-between text-[11px] font-mono text-text-muted">
                        <span>{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
                        <Link
                          href={`/review/${item.slug}`}
                          className="font-bold text-brand-crimson hover:underline"
                        >
                          Baca Review →
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-dark-border bg-dark-card p-12 text-center font-mono">
              <p className="text-sm text-text-muted">
                Tidak ada ulasan game yang cocok untuk kategori/pencarian ini.
              </p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}