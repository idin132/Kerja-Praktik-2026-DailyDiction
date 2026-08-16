"use client";

import { useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function YoutubeHero({ videos = [] }: { videos?: any[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [startChunk, setStartChunk] = useState(0);
  const [activeLocalIndex, setActiveLocalIndex] = useState(0);

  const heroVideos = videos.slice(0, 15);
  if (!heroVideos || heroVideos.length === 0) return null;

  const nextSlide = () => {
    setStartChunk((prev) => (prev + 5) % heroVideos.length);
    setActiveLocalIndex(0);
    setPlayingId(null);
  };

  const prevSlide = () => {
    setStartChunk((prev) => (prev - 5 + heroVideos.length) % heroVideos.length);
    setActiveLocalIndex(0);
    setPlayingId(null);
  };

  const currentChunk: any[] = [];
  for (let i = 0; i < Math.min(5, heroVideos.length); i++) {
    currentChunk.push(heroVideos[(startChunk + i) % heroVideos.length]);
  }

  const mainVideo = currentChunk[activeLocalIndex];
  const sideVideos = currentChunk.filter((_, i) => i !== activeLocalIndex).slice(0, 4);

  const getThumbnail = (snippet: any) => {
    return snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || "";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ================= HEADER HERO (LATEST VIDEO) ================= */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-black text-white">
          Latest Video
        </h2>
        <a
          href="https://www.youtube.com/@WORGameID/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-brand-crimson hover:text-white transition-colors flex items-center gap-1"
        >
          Lihat Semua &rarr;
        </a>
      </div>

      {/* ================= CONTENT GRID HERO ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= MAIN VIDEO (BESAR) ================= */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={mainVideo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="group relative lg:col-span-2 aspect-video overflow-hidden rounded-2xl border border-dark-border bg-dark-card shadow-xl"
          >
            {playingId === mainVideo.id ? (
              <iframe
                src={`https://www.youtube.com/embed/${mainVideo.id}?autoplay=1`}
                title={mainVideo.snippet.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div 
                className="w-full h-full cursor-pointer"
                onClick={() => setPlayingId(mainVideo.id)}
              >
                <img
                  src={getThumbnail(mainVideo.snippet)}
                  alt={mainVideo.snippet.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-crimson/90 text-white backdrop-blur-sm transition-transform group-hover:scale-110 shadow-[0_0_30px_rgba(255,62,62,0.5)]">
                    <Play className="h-8 w-8 ml-1 fill-white" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl sm:text-3xl font-black text-white line-clamp-2 leading-tight group-hover:text-brand-cyan transition-colors">
                    {mainVideo.snippet.title}
                  </h3>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ================= SIDE VIDEOS & NAVIGASI ================= */}
        <div className="flex flex-col h-full justify-between">
          
          {/* Kolom 4 video kecil */}
          <div className="flex flex-col flex-1 justify-between gap-2 pb-4">
            {sideVideos.map((video: any) => {
              const chunkIndex = currentChunk.findIndex(v => v.id === video.id);

              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex gap-4 overflow-hidden rounded-xl border border-dark-border bg-dark-card p-2.5 cursor-pointer transition-all hover:border-brand-crimson/50 hover:bg-dark-bg h-full"
                  onClick={() => {
                    setActiveLocalIndex(chunkIndex);
                    setPlayingId(video.id);
                  }}
                >
                  <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={getThumbnail(video.snippet)}
                      alt={video.snippet.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-6 w-6 text-white fill-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center py-1">
                    <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-brand-crimson transition-colors leading-snug">
                      {video.snippet.title}
                    </h4>
                    <p className="mt-1.5 text-[10px] font-mono text-text-muted">
                      {new Date(video.snippet.publishedAt).toLocaleDateString("id-ID", { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Kontrol Navigasi Arsip */}
          {heroVideos.length > 5 && (
            <div className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-card/50 p-2 shrink-0">
              <button onClick={prevSlide} className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-bg text-text-muted transition-colors hover:bg-brand-crimson hover:text-white">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-[10px] font-mono font-bold tracking-widest text-text-muted uppercase">
                ARSIP VIDEO
              </span>
              <button onClick={nextSlide} className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-bg text-text-muted transition-colors hover:bg-brand-cyan hover:text-white">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}