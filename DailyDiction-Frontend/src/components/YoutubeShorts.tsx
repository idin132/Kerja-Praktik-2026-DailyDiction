"use client";

import { useState, useRef } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

export default function YoutubeShorts({ videos = [] }: { videos?: any[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const shortsLimit = videos.slice(0, 15);
  if (!shortsLimit || shortsLimit.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft <= 10) {
        scrollRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: -clientWidth / 2, behavior: "smooth" });
      }
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: clientWidth / 2, behavior: "smooth" });
      }
    }
  };

  const getThumbnail = (snippet: any) => {
    return snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || "";
  };

  return (
    <section className="flex flex-col gap-4">
      {/* ================= HEADER SHORTS ================= */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-black text-white">
          Daily Diction Shorts
        </h2>
        <a
          href="https://www.youtube.com/@DailyDictionID/shorts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#FFD700] hover:text-white transition-colors flex items-center gap-1"
        >
          Lihat Semua &rarr;
        </a>
      </div>

      {/* ================= SLIDER SHORTS ================= */}
      <div className="relative group">
        {shortsLimit.length > 2 && (
          <button
            onClick={scrollLeft}
            className="absolute -left-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/80 p-2.5 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-[#FFD700] hover:text-black hover:scale-110 group-hover:opacity-100 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-dark-border"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Container Scroll */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {shortsLimit.map((short: any) => (
            <div
              key={short.id}
              className="w-[calc(50%-8px)] md:w-[calc(33.33%-10.66px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-12.8px)] flex-shrink-0 snap-start group/short relative aspect-[9/16] overflow-hidden rounded-xl border border-dark-border bg-dark-card shadow-lg"
            >
              {playingId === short.id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${short.id}?autoplay=1`}
                  title={short.snippet.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div 
                  className="w-full h-full cursor-pointer"
                  onClick={() => setPlayingId(short.id)}
                >
                  <img
                    src={getThumbnail(short.snippet)}
                    alt={short.snippet.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/short:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/short:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700] text-black backdrop-blur-sm shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                      <Play className="h-5 w-5 ml-1 fill-black" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-sm font-bold text-white line-clamp-3 leading-snug group-hover/short:text-[#FFD700] transition-colors">
                      {short.snippet.title}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {shortsLimit.length > 2 && (
          <button
            onClick={scrollRight}
            className="absolute -right-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/80 p-2.5 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-[#FFD700] hover:text-black hover:scale-110 group-hover:opacity-100 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-dark-border"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
        
        <style jsx global>{`
          ::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}