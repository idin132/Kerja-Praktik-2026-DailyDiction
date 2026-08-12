"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ReelItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  type: "video" | "image";
  mediaUrl: string;
}

const REELS_DATA: ReelItem[] = [
  {
    id: "1",
    slug: "resident-evil-update",
    category: "BERITA UTAMA",
    title: "Resident Evil: Update Terbaru & Panduan Survival",
    description: "Dapatkan update patch terkini, bocoran sekuel terbaru, analisis cerita mendalam, serta panduan lengkap mengenai franchise Resident Evil.",
    type: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-game-animation-of-a-robot-in-a-futuristic-city-42991-large.mp4",
  },
  {
    id: "2",
    slug: "genshin-impact-update",
    category: "UPDATE GAME",
    title: "Genshin Impact: Update Karakter Baru & Item Baru",
    description: "Temukan informasi terbaru tentang update karakter baru dan item baru di Genshin Impact. Dapatkan tips, trik, dan panduan untuk memaksimalkan pengalaman bermain Anda.",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200",
  },
  {
    id: "3",
    slug: "elden-ring-tips",
    category: "HOT TOPIC",
    title: "Elden Ring: Update Terbaru dan Tips Eksklusif untuk Pemain Setia",
    description: "Temukan berita terbaru, tips eksklusif, dan panduan lengkap untuk pemain setia Elden Ring. Dapatkan informasi terkini tentang strategi dan konten menarik.",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200",
  },
];

export default function ReelsPage() {
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cek apakah halaman sebelumnya dibuka berasal dari detail artikel
    const comingFromArticle = sessionStorage.getItem("from_article_detail");
    const savedScrollPos = sessionStorage.getItem("reels_scroll_pos");

    if (comingFromArticle === "true" && savedScrollPos && containerRef.current) {
      // Jika kembali dari halaman artikel, restore posisi scroll
      containerRef.current.scrollTop = parseInt(savedScrollPos, 10);
      // Reset flag agar tidak berimbas saat navigasi berikutnya
      sessionStorage.removeItem("from_article_detail");
    } else {
      // Jika datang dari menu navigasi/halaman lain, reset scroll ke paling atas (index 0)
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      sessionStorage.removeItem("reels_scroll_pos");
    }
  }, []);

  const handleSaveScrollPosition = () => {
    if (containerRef.current) {
      // Simpan posisi scroll saat ini
      sessionStorage.setItem("reels_scroll_pos", containerRef.current.scrollTop.toString());
      // Set flag bahwa pengguna sedang menuju ke halaman detail artikel
      sessionStorage.setItem("from_article_detail", "true");
    }
  };

  return (
    <div className="h-screen w-full bg-dark-bg text-text-primary overflow-hidden flex flex-col">
      <Navbar />

      <div 
        ref={containerRef}
        className="flex-1 w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth font-sans"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {REELS_DATA.map((item, index) => (
          <section
            key={item.id}
            className="relative h-[calc(100vh-4rem)] w-full snap-start snap-always flex flex-col justify-end overflow-hidden border-b border-dark-border"
          >
            {/* Media Background */}
            {item.type === "video" ? (
              <video
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="absolute inset-0 h-full w-full object-cover object-center filter brightness-75 scale-105"
              >
                <source src={item.mediaUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover object-center filter brightness-75"
              />
            )}

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/80 via-transparent to-transparent" />

            {/* Mute Button */}
            {item.type === "video" && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-dark-border bg-dark-card/80 text-text-primary backdrop-blur-md transition-all hover:border-brand-crimson"
                aria-label="Toggle Mute"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-brand-crimson" />}
              </button>
            )}

            {/* Content Overlay */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 sm:pb-24 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-crimson/40 bg-brand-crimson/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest text-brand-crimson backdrop-blur-md">
                  <Sparkles className="h-3 w-3" />
                  <span>{item.category}</span>
                </div>

                <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-text-primary leading-tight">
                  {item.title}
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-text-muted line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <Link
                    href={`/artikel/${item.slug}`}
                    scroll={false}
                    onClick={handleSaveScrollPosition}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-crimson px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-brand-crimson/90 hover:shadow-[0_0_20px_rgba(255,62,62,0.5)] active:scale-95"
                  >
                    <span>Baca Artikel</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>

            {index < REELS_DATA.length - 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-text-muted animate-bounce">
                <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
                <ChevronDown className="h-4 w-4 text-brand-cyan" />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}