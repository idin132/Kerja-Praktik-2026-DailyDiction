"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
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
<<<<<<< HEAD
  type?: string;
  category: string | string[];
  category_color?: string;
  summary: string;
  content?: string;
  image_url?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  image?: string;
=======
  category_input?: string | string[]; 
  category?: string | string[];
  categories?: any[];
  category_color?: string;
  summary: string;
  content: string;
  image_url?: string;
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
  image_full_url?: string;
  read_time?: string;
  created_at?: string;
  author?: string;
}

// Helper untuk format URL gambar (Mendukung image_url, Embed URL, Storage Laravel, dan Placeholder)
function formatNewsImage(item: ArticleItem): string {
  const rawUrl =
    item.image_url ||
    item.thumbnail_url ||
    item.thumbnail ||
    item.image_full_url ||
    item.image;

  if (!rawUrl) {
    return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800";
  }

  const clean = rawUrl.trim();

  // Jika berupa Embed Link langsung (http / https)
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  // Jika berupa relative path file upload dari Laravel Storage
  const cleanPath = clean.startsWith("/") ? clean.slice(1) : clean;
  if (cleanPath.startsWith("storage/")) {
    return `https://dailydiction.id/${cleanPath}`;
  }

  return `https://dailydiction.id/storage/${cleanPath}`;
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
<<<<<<< HEAD
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

        const res = await fetch(`${apiUrl}/articles`, {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Fetch failed with status: ${res.status}`);
        }

        const json = await res.json();
        if (isMounted) {
          const rawData: ArticleItem[] = json.data || [];
          // Filter hanya artikel dengan type "article"
          const filteredData = rawData.filter(
            (item) => item.type === "article"
          );
          setArticles(filteredData);
=======
        const res = await fetch(`http://127.0.0.1:8000/api/v1/articles?type=article&t=${new Date().getTime()}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const json = await res.json();
          setArticles(json.data || []);
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
        }
      } catch (err) {
        console.warn("Gagal mengambil data berita:", err);
        if (isMounted) {
          setArticles([]);
        }
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

<<<<<<< HEAD
  const getCategoriesArray = (
    category: string | string[] | undefined
  ): string[] => {
    if (!category) return ["GAMING"];
    if (Array.isArray(category)) return category;
    if (typeof category === "string") {
      try {
        return category.startsWith("[") ? JSON.parse(category) : [category];
=======
  const getCategoriesArray = (item: ArticleItem): string[] => {
    let rawCategory: any = ["BERITA"]; 

    if (item.category_input && item.category_input.length > 0) {
      rawCategory = item.category_input;
    } else if (item.category && item.category.length > 0) {
      rawCategory = item.category;
    } else if (item.categories && item.categories.length > 0) {
      rawCategory = item.categories.map((c: any) => c.name);
    }

    if (Array.isArray(rawCategory)) return rawCategory;
    
    if (typeof rawCategory === 'string') {
      try {
        return rawCategory.startsWith('[') ? JSON.parse(rawCategory) : [rawCategory];
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
      } catch {
        return [rawCategory];
      }
    }
    return ["BERITA"];
  };

<<<<<<< HEAD
  const allCategories = articles.flatMap((item) =>
    getCategoriesArray(item.category).map((cat) => cat.toUpperCase())
=======
  const allCategories = articles.flatMap((item) => 
    getCategoriesArray(item).map(cat => cat.toUpperCase())
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
  );
  const categoriesList = ["ALL", ...Array.from(new Set(allCategories))];

  const filteredArticles = articles.filter((item) => {
<<<<<<< HEAD
    const itemCats = getCategoriesArray(item.category).map((c) =>
      c.toUpperCase()
    );

=======
    const itemCats = getCategoriesArray(item).map(c => c.toUpperCase());
    
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
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
<<<<<<< HEAD
          {/* Header Section */}
=======
          
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
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

            <div className="relative w-full md:w-80 shrink-0">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12">
<<<<<<< HEAD
            {/* Left Column: News List */}
            <div className="lg:col-span-8 2xl:col-span-9 space-y-6">
              {/* Category Filter Pills */}
=======
            
            <div className="lg:col-span-9 space-y-6">
              
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
              {categoriesList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
                  <span className="flex items-center gap-1 text-text-muted mr-2 shrink-0">
                    <Filter className="h-3.5 w-3.5 text-brand-crimson" />
                    <span>KATEGORI:</span>
                  </span>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`shrink-0 rounded-lg px-3.5 py-1.5 font-bold uppercase transition-all ${
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

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-44 rounded-xl border border-dark-border bg-dark-card/50 animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
                  <AnimatePresence>
                    {filteredArticles.map((item) => {
                      const itemCategories = getCategoriesArray(item);

                      return (
                        <motion.article
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.2 }}
                          className="group flex flex-col xl:flex-row overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-all hover:border-brand-crimson/60 shadow-lg h-full"
                        >
<<<<<<< HEAD
                          {/* Thumbnail Image */}
                          <div className="relative h-52 md:h-auto md:w-64 lg:w-72 flex-shrink-0 overflow-hidden bg-black/40">
                            <img
                              src={formatNewsImage(item)}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Looping Badge Kategori */}
=======
                          <div className="relative h-48 xl:h-auto xl:w-48 2xl:w-60 flex-shrink-0 overflow-hidden border-b xl:border-b-0 xl:border-r border-dark-border/50">
                            <img
                              src={
                                item.image_url ||
                                item.image_full_url ||
                                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"
                              }
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
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

                          <div className="flex flex-1 flex-col justify-between p-5 min-w-0 bg-dark-card">
                            <div>
<<<<<<< HEAD
                              <Link href={`/artikel/${item.slug}`} prefetch={false}>
                                <h2 className="text-base sm:text-xl font-bold text-text-primary transition-colors group-hover:text-brand-cyan line-clamp-2 leading-snug">
=======
                              <Link href={`/artikel/${item.slug}`}>
                                <h2 className="text-base lg:text-lg font-bold text-text-primary transition-colors group-hover:text-brand-cyan line-clamp-2 leading-snug">
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
                                  {item.title}
                                </h2>
                              </Link>
                              <p className="mt-2.5 text-xs text-text-muted line-clamp-2 leading-relaxed">
                                {item.summary}
                              </p>
                            </div>

                            <div className="mt-5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-text-muted border-t border-dark-border/40 pt-4">
<<<<<<< HEAD
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
=======
                              <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                                
                                <div className="flex items-center gap-1.5 shrink-0">
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
                                  <User className="h-3.5 w-3.5 text-brand-crimson" />
                                  <span className="truncate max-w-[90px] xl:max-w-[120px] font-semibold text-white">
                                    {item.author || "Redaksi"}
                                  </span>
                                </div>
<<<<<<< HEAD

                                {item.created_at && (
                                  <>
                                    <span className="text-dark-border hidden sm:inline-block">
                                      •
=======
                                
                                <span className="text-dark-border shrink-0">•</span>
                                
                                {item.created_at && (
                                  <div className="flex items-center gap-1.5 shrink-0 min-w-0">
                                    <Calendar className="h-3.5 w-3.5 text-text-muted shrink-0 hidden sm:block" />
                                    <span className="truncate whitespace-nowrap">
                                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
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
                                className="flex items-center gap-1 font-bold text-brand-crimson hover:underline shrink-0 ml-1"
                              >
                                <span className="hidden sm:inline">BACA</span>
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

<<<<<<< HEAD
            {/* Right Sidebar Column */}
            <aside className="lg:col-span-4 2xl:col-span-3 space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#121526] to-dark-card p-6 text-center shadow-xl">
=======
            <aside className="lg:col-span-3 space-y-6">
              
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#121526] to-dark-card p-5 lg:p-6 text-center shadow-xl">
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
                <svg
                  viewBox="0 0 24 24"
                  className="w-10 h-10 fill-indigo-400 mx-auto mb-3 animate-bounce"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.213.385-.444.905-.608 1.315a18.27 18.27 0 0 0-5.648 0c-.164-.41-.4-.93-.615-1.315A19.736 19.736 0 0 0 3.67 4.37C.533 9.046-.319 13.608.106 18.11a19.98 19.98 0 0 0 6.002 3.03c.49-.67.924-1.38 1.293-2.13-.71-.27-1.39-.61-2.04-1.01.17-.125.337-.255.5-.39 3.93 1.84 8.18 1.84 12.06 0 .164.135.33.265.5.39-.65.4-1.33.74-2.04 1.01.37.75.8 1.46 1.29 2.13a19.98 19.98 0 0 0 6.006-3.03c.5-5.22-.85-9.74-3.36-13.74ZM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
                </svg>

                <h3 className="text-base lg:text-lg font-mono font-black text-white uppercase tracking-wide">
                  TEMPAT NONGKRONG
                </h3>

<<<<<<< HEAD
                <p className="text-text-muted text-xs mt-2 mb-5 leading-relaxed">
                  Join server Discord Daily Diction buat mabar, berbagi info
                  gacha, pamer spek PC, atau sekadar gibahin industri pop
                  culture!
=======
                <p className="text-text-muted text-[11px] lg:text-xs mt-2 mb-5 leading-relaxed">
                  Join server Discord Daily Diction buat mabar, berbagi info gacha, atau gibahin industri pop culture!
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
                </p>

                <a
                  href="https://discord.com/invite/DG6Nebkex9"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 bg-white text-indigo-950 font-mono font-bold text-[10px] lg:text-xs uppercase py-3 px-4 rounded-xl hover:bg-slate-100 transition-all shadow-md relative z-10"
                >
                  <Send className="h-3.5 w-3.5 fill-current" />
                  <span>Join Server</span>
                </a>
              </div>
<<<<<<< HEAD
=======

>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
            </aside>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}