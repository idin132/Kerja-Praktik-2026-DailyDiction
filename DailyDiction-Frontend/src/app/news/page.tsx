"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Send,
  TrendingUp
} from "lucide-react";

export default function NewsPage() {
  const newsList = [
    {
      id: "1",
      slug: "gacha-berdarah-genshin-impact",
      category: "GACHA GAME",
      title: "Gacha Berdarah! Genshin Impact Rilis Banner Karakter Bintang 5 Terbaru Nasional",
      summary: "Detail lengkap mengenai update banner terbaru yang bikin tabungan primogems para gamer terkuras habis bulan ini akibat persentase drop rate yang tidak...",
      author: "Admin Daily Diction",
      time: "4 Jam Lalu",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
    },
    {
      id: "2",
      slug: "adaptasi-anime-game-hack-and-slash",
      category: "POP-CULTURE",
      title: "Adaptasi Anime dari Game Hack-and-Slash Terkenal Resmi Diumumkan Studio MAPPA",
      summary: "Studio dibalik proyek raksasa akhirnya resmi mengonfirmasi pengerjaan serial adaptasi game yang paling ditunggu tahun ini dengan visualisasi grafik yang...",
      author: "Admin Daily Diction",
      time: "6 Jam Lalu",
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
    },
    {
      id: "3",
      slug: "spesifikasi-pc-black-myth-wukong",
      category: "PC GAME",
      title: "Spesifikasi PC Black Myth: Wukong Dirilis, Butuh RAM Berapa?",
      summary: "Game action RPG bertema kera sakti ini menuntut hardware yang cukup tangguh. Berikut spek minimum dan rekomendasi resminya untuk kelancaran bermain.",
      author: "Admin Daily Diction",
      time: "1 Hari Lalu",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800",
    },
  ];

  const viralNews = [
    {
      rank: "01",
      title: "10 Emulator Nintendo Switch Terbaik di Android yang Tetap Lancar Jaya",
      views: "12.5k Pembaca",
      slug: "emulator-switch-android"
    },
    {
      rank: "02",
      title: "Kenapa Game Gacha Selalu Berhasil Memeras Isi Dompet Kita? Ini Sisi Psikologisnya!",
      views: "9.1k Pembaca",
      slug: "psikologi-game-gacha"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-8 border-b border-dark-border pb-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-2 rounded-full bg-brand-crimson" />
              <h1 className="text-2xl font-black font-mono tracking-tight text-text-primary sm:text-3xl">
                ARSIP BERITA (NEWS)
              </h1>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Content Column: News List (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              {newsList.map((item) => (
                <motion.article
                  key={item.id}
                  whileHover={{ y: -2 }}
                  className="group flex flex-col md:flex-row overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-all hover:border-brand-crimson/50"
                >
                  {/* Thumbnail Image */}
                  <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded border border-brand-cyan/40 bg-dark-bg/80 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-brand-cyan backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>

                  {/* Article Info */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <Link href={`/artikel/${item.slug}`}>
                        <h2 className="text-base sm:text-lg font-bold text-text-primary transition-colors group-hover:text-brand-cyan line-clamp-2 leading-snug">
                          {item.title}
                        </h2>
                      </Link>
                      <p className="mt-2 text-xs text-text-muted line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-4 flex items-center gap-4 text-[11px] font-mono text-text-muted border-t border-dark-border/40 pt-3">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-brand-crimson" />
                        <span>{item.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-brand-cyan" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}

              {/* Pagination */}
              <div className="mt-10 flex items-center justify-center gap-2 font-mono text-xs">
                <button className="flex items-center gap-1 rounded-lg border border-dark-border bg-dark-card px-3.5 py-2 text-text-muted transition-colors hover:border-brand-cyan hover:text-text-primary">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev</span>
                </button>
                <button className="h-9 w-9 rounded-lg bg-brand-crimson font-bold text-white">
                  1
                </button>
                <button className="h-9 w-9 rounded-lg border border-dark-border bg-dark-card text-text-muted transition-colors hover:border-brand-cyan hover:text-text-primary">
                  2
                </button>
                <button className="h-9 w-9 rounded-lg border border-dark-border bg-dark-card text-text-muted transition-colors hover:border-brand-cyan hover:text-text-primary">
                  3
                </button>
                <button className="flex items-center gap-1 rounded-lg border border-dark-border bg-dark-card px-3.5 py-2 text-text-muted transition-colors hover:border-brand-cyan hover:text-text-primary">
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right Sidebar Column (4 Columns) */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* DISCORD WIDGET (Sesuai Snippet Pengguna) */}
              <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-br from-[#121526] to-dark-card p-6 text-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-14 h-14 fill-indigo-400 mx-auto mb-4 animate-bounce"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.213.385-.444.905-.608 1.315a18.27 18.27 0 0 0-5.648 0c-.164-.41-.4-.93-.615-1.315A19.736 19.736 0 0 0 3.67 4.37C.533 9.046-.319 13.608.106 18.11a19.98 19.98 0 0 0 6.002 3.03c.49-.67.924-1.38 1.293-2.13-.71-.27-1.39-.61-2.04-1.01.17-.125.337-.255.5-.39 3.93 1.84 8.18 1.84 12.06 0 .164.135.33.265.5.39-.65.4-1.33.74-2.04 1.01.37.75.8 1.46 1.29 2.13a19.98 19.98 0 0 0 6.006-3.03c.5-5.22-.85-9.74-3.36-13.74ZM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
                </svg>

                <h3 className="text-xl font-mono font-black text-white uppercase tracking-wide">
                  TEMPAT NONGKRONG GAMER
                </h3>

                <p className="text-text-muted text-xs mt-2 mb-6 leading-relaxed">
                  Join server Discord Daily Diction buat mabar, berbagi info gacha, pamer spek PC, atau sekadar gibahin industri pop culture!
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

              {/* Game Rilis Juli 2026 Widget */}
              <div className="rounded-xl border border-dark-border bg-dark-card p-5 font-mono">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-primary border-b border-dark-border pb-3 mb-4">
                  <Calendar className="h-4 w-4 text-brand-crimson" />
                  <span>GAME RILIS JULI 2026</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-dark-border/50 bg-dark-bg/60 p-3">
                    <div>
                      <p className="text-xs font-bold text-text-primary">The First Descendant</p>
                      <p className="text-[10px] text-text-muted">PC, PS5, XBOX</p>
                    </div>
                    <span className="rounded bg-brand-crimson/20 border border-brand-crimson/40 px-2 py-1 text-[10px] font-bold text-brand-crimson">
                      02 JULI
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-dark-border/50 bg-dark-bg/60 p-3">
                    <div>
                      <p className="text-xs font-bold text-text-primary">Zenless Zone Zero</p>
                      <p className="text-[10px] text-text-muted">PC, MOBILE, PS5</p>
                    </div>
                    <span className="rounded bg-brand-crimson/20 border border-brand-crimson/40 px-2 py-1 text-[10px] font-bold text-brand-crimson">
                      04 JULI
                    </span>
                  </div>
                </div>
              </div>

              {/* Artikel Paling Viral Widget */}
              <div className="rounded-xl border border-dark-border bg-dark-card p-5 font-mono">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-primary border-b border-dark-border pb-3 mb-4">
                  <Flame className="h-4 w-4 text-brand-crimson" />
                  <span>ARTIKEL PALING VIRAL</span>
                </div>

                <div className="space-y-4">
                  {viralNews.map((article) => (
                    <Link 
                      key={article.rank} 
                      href={`/artikel/${article.slug}`}
                      className="group flex items-start gap-3 transition-colors"
                    >
                      <span className="text-xl font-black text-brand-crimson opacity-80 group-hover:opacity-100">
                        {article.rank}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-text-primary group-hover:text-brand-cyan transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <span className="text-[10px] text-text-muted mt-1 block">
                          {article.views}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </aside>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}