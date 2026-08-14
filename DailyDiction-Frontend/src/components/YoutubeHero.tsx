"use client";

import { Play, PlaySquare, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface LongVideo {
  id: string;
  title: string;
  thumbnail: string;
  link: string;
}

export default function YoutubeHero() {
  const [videos, setVideos] = useState<LongVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const sliderRef = useRef<HTMLDivElement>(null); 
  const channelUrl = "https://www.youtube.com/@worgameplay";

  useEffect(() => {
    async function fetchLongVideos() {
      try {
        // Nembak langsung ke API Backend Laravel
        const res = await fetch("http://127.0.0.1:8000/api/v1/youtube-videos");
        if (res.ok) {
          const json = await res.json();
          setVideos(json.data || []);
        }
      } catch (err) {
        console.error("Gagal narik data YouTube Longform", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLongVideos();
  }, []);

  // Fungsi scroll Looping/Rewind (Tetap dipertahankan)
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { clientWidth, scrollLeft, scrollWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.75; 
      const maxScroll = scrollWidth - clientWidth; 

      if (direction === "right") {
        if (scrollLeft >= maxScroll - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: "smooth" });
        }
      } else {
        if (scrollLeft <= 10) {
          sliderRef.current.scrollTo({ left: maxScroll, behavior: "smooth" });
        } else {
          sliderRef.current.scrollTo({ left: scrollLeft - scrollAmount, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <section className="mb-12 w-full pt-8 relative z-10">
      <div className="mb-6 flex items-center justify-between border-b border-dark-border pb-4">
        <div className="flex items-center gap-3">
          <PlaySquare className="h-6 w-6 text-brand-crimson" />
          <h2 className="text-xl md:text-2xl font-black text-white">Latest Video</h2>
        </div>
        <Link href={channelUrl} target="_blank" className="text-xs md:text-sm font-bold text-text-muted hover:text-brand-crimson transition-colors">
          Kunjungi Channel →
        </Link>
      </div>

      <div className="relative group">
        
        {/* Tombol Panah KIRI */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 -translate-y-1/2 -translate-x-4 md:-translate-x-6 items-center justify-center rounded-full bg-dark-bg/90 border border-dark-border text-white opacity-0 transition-all hover:scale-110 hover:bg-brand-crimson hover:border-brand-crimson group-hover:opacity-100 shadow-xl backdrop-blur-md"
          aria-label="Geser Kiri"
        >
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
        </button>

        {/* Container Horizontal Scroll */}
        <div 
          ref={sliderRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {isLoading ? (
            // Skeleton Loading ditampilin 5 biji pas API lagi mikir
            [1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[32%] aspect-video rounded-xl bg-dark-card/50 animate-pulse border border-dark-border" />
            ))
          ) : videos.length > 0 ? (
            videos.map((video) => (
              <Link key={video.id} href={video.link} target="_blank" className="snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[32%]">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group/card relative aspect-video w-full overflow-hidden rounded-xl bg-dark-card border border-dark-border shadow-lg cursor-pointer"
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/card:opacity-100 bg-black/20">
                    <div className="flex h-14 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                      <Play className="h-7 w-7 fill-white text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-sm md:text-base font-black leading-tight text-white line-clamp-2 drop-shadow-md">
                      {video.title}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="w-full rounded-xl border border-dark-border bg-dark-card p-12 text-center">
              <p className="text-sm text-text-muted font-mono">Belum ada video terbaru atau API Key belum di-set.</p>
            </div>
          )}
        </div>

        {/* Tombol Panah KANAN */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 -translate-y-1/2 translate-x-4 md:translate-x-6 items-center justify-center rounded-full bg-dark-bg/90 border border-dark-border text-white opacity-0 transition-all hover:scale-110 hover:bg-brand-crimson hover:border-brand-crimson group-hover:opacity-100 shadow-xl backdrop-blur-md"
          aria-label="Geser Kanan"
        >
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
        </button>

      </div>
    </section>
  );
}