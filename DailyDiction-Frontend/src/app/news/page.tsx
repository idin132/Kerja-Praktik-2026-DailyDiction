"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  User, 
  Send,
  Search,
  Filter,
  Newspaper,
  ArrowUpRight
} from "lucide-react";

interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  category: string | string[]; // Mendukung array kategori
  category_color?: string;
  summary: string;
  content: string;
  image_full_url?: string;
  read_time: string;
  created_at: string;
  author?: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    let isMounted = true;

    async function fetchArticles() {
      try {
        const res = await fetch("https://dailydiction.id/api/v1/articles");
        if (res.ok) {
          const json = await res.json();
          setArticles(json.data || []);
        }
      } catch (err) {
        console.error("Gagal mengambil data berita:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoriesArray = (
    category: string | string[] | undefined
  ): string[] => {
    if (!category) return ["GAMING"];
    if (Array.isArray(category)) return category;
    if (typeof category === "string") {
      try {
        return category.startsWith("[") ? JSON.parse(category) : [category];
      } catch {
        return [category];
      }
    }
    return ["GAMING"];
  };

  const allCategories = articles.flatMap((item) =>
    getCategoriesArray(item.category).map((cat) => cat.toUpperCase())
  );
  const categoriesList = ["ALL", ...Array.from(new Set(allCategories))];

  const filteredArticles = articles.filter((item) => {
    const itemCats = getCategoriesArray(item.category).map((c) =>
      c.toUpperCase()
    );

    const matchCategory =
      selectedCategory === "ALL" || itemCats.includes(selectedCategory);

    const matchSearch =
      (item.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.summary?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white flex flex-col justify-between font-sans">
      <div>
        <Navbar />

        <main className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 border-b border-dark-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-6 w-2 rounded-full bg-brand-crimson" />
                <h1 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-text-primary uppercase">
                  ARSIP BERITA & KABAR GAMING
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-text-muted font-mono">
                Pusat informasi berita game, rilisan konsol, hardware PC, dan
                tren pop-culture terbaru.
              </p>
            </div>

            {/* Live Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari berita game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-card pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-crimson focus:outline-none transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12">
            {/* Left Column: News List */}
            <div className="lg:col-span-8 2xl:col-span-9 space-y-6">
              {/* Category Filter Pills */}
              {categoriesList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
                  <span className="flex items-center gap-1 text-text-muted mr-2">
                    <Filter className="h-3.5 w-3.5 text-brand-crimson" />
                    <span>KATEGORI:</span>
                  </span>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-lg px-3.5 py-1.5 font-bold uppercase transition-all ${
                        selectedCategory === cat
                          ? "bg-brand-crimson text-white shadow-[0_0_15px_rgba(255,62,62,0.4)]"
                          : "border border-dark-border bg-dark-card text-text-muted hover:border-brand-cyan hover:text-text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* News Items Loop */}
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-44 rounded-xl border border-dark-border bg-dark-card/50 animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {filteredArticles.map((item) => {
                      const itemCategories = getCategoriesArray(item.category);

                      return (
                        <motion.article
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.2 }}
                          className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-all hover:border-brand-crimson/60 shadow-lg"
                        >
                          {/* Thumbnail Image */}
                          <div className="relative h-52 md:h-auto md:w-64 lg:w-72 flex-shrink-0 overflow-hidden">
                            <img
                              // src={formatNewsImage(item)}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Looping Badge Kategori */}
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                              {itemCategories.map((cat, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md border border-brand-cyan/40 bg-dark-bg/80 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-brand-cyan backdrop-blur-md shadow-md"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Article Info */}
                          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                            <div>
                              <Link href={`/artikel/${item.slug}`}>
                                <h2 className="text-base sm:text-xl font-bold text-text-primary transition-colors group-hover:text-brand-cyan line-clamp-2 leading-snug">
                                  {item.title}
                                </h2>
                              </Link>
                              <p className="mt-2.5 text-xs text-text-muted line-clamp-2 leading-relaxed">
                                {item.summary}
                              </p>
                            </div>

                            {/* Metadata Footer */}
                            <div className="mt-5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-text-muted border-t border-dark-border/40 pt-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3.5 w-3.5 text-brand-crimson" />
                                  <span className="truncate max-w-[100px] font-semibold text-white">
                                    {item.author || "Redaksi"}
                                  </span>
                                </div>

                                {item.created_at && (
                                  <>
                                    <span className="text-dark-border hidden sm:inline-block">
                                      •
                                    </span>
                                    <div className="items-center gap-1.5 hidden sm:flex">
                                      <Calendar className="h-3.5 w-3.5 text-text-muted" />
                                      <span>
                                        {new Date(
                                          item.created_at
                                        ).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>

                              <Link
                                href={`/artikel/${item.slug}`}
                                className="flex items-center gap-1 font-bold text-brand-crimson hover:underline shrink-0 ml-2"
                              >
                                <span>BACA</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="rounded-2xl border border-dark-border bg-dark-card p-12 text-center font-mono">
                  <Newspaper className="h-10 w-10 text-text-muted mx-auto mb-3" />
                  <p className="text-sm text-text-muted">
                    Tidak ada berita yang ditemukan untuk kata kunci atau
                    kategori ini.
                  </p>
                </div>
              )}
            </div>

            {/* Right Sidebar Column */}
            <aside className="lg:col-span-4 2xl:col-span-3 space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#121526] to-dark-card p-6 text-center shadow-xl">
                <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12 fill-indigo-400 mx-auto mb-3 animate-bounce"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.213.385-.444.905-.608 1.315a18.27 18.27 0 0 0-5.648 0c-.164-.41-.4-.93-.615-1.315A19.736 19.736 0 0 0 3.67 4.37C.533 9.046-.319 13.608.106 18.11a19.98 19.98 0 0 0 6.002 3.03c.49-.67.924-1.38 1.293-2.13-.71-.27-1.39-.61-2.04-1.01.17-.125.337-.255.5-.39 3.93 1.84 8.18 1.84 12.06 0 .164.135.33.265.5.39-.65.4-1.33.74-2.04 1.01.37.75.8 1.46 1.29 2.13a19.98 19.98 0 0 0 6.006-3.03c.5-5.22-.85-9.74-3.36-13.74ZM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
                </svg>

                <h3 className="text-lg font-mono font-black text-white uppercase tracking-wide">
                  TEMPAT NONGKRONG GAMER
                </h3>

                <p className="text-text-muted text-xs mt-2 mb-5 leading-relaxed">
                  Join server Discord Daily Diction buat mabar, berbagi info
                  gacha, pamer spek PC, atau sekadar gibahin industri pop
                  culture!
                </p>

                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 bg-white text-indigo-950 font-mono font-bold text-xs uppercase py-3 px-6 rounded-xl hover:bg-slate-100 transition-all shadow-md relative z-10"
                >
                  <Send className="h-4 w-4 fill-current" />
                  <span>Masuk Server (Gratis)</span>
                </a>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
