"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  Heart, 
  Share2, 
  ArrowRight,
  Clapperboard,
  ExternalLink
} from "lucide-react";

interface ReelItem {
  id: number;
  title: string;
  type: string;
  caption: string;
  video_url?: string;
  thumbnail_url?: string;
  target_slug?: string;
  likes_count: number;
}

export default function ReelsPage() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [activeReelId, setActiveReelId] = useState<number | null>(null);
  const [likedReels, setLikedReels] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchReels() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/reels");
        if (res.ok) {
          const json = await res.json();
          const data = json.data || [];
          setReels(data);
          if (data.length > 0) {
            setActiveReelId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data reels:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReels();
  }, []);

  // Deteksi reel mana yang sedang tampil di layar
  useEffect(() => {
    if (!containerRef.current || reels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-reel-id"));
            setActiveReelId(id);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      }
    );

    const items = containerRef.current.querySelectorAll("[data-reel-id]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [reels]);

  const handleLike = (id: number) => {
    setLikedReels((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getEmbedUrl = (url: string, isActive: boolean) => {
    if (!url || !isActive) return "";

    if (url.includes("youtube.com/shorts/")) {
      const videoId = url.split("youtube.com/shorts/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&loop=1&playlist=${videoId}&modestbranding=1`;
    }

    if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      } else {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        videoId = urlParams.get("v") || "";
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&loop=1&playlist=${videoId}&modestbranding=1`;
    }

    return url;
  };

  return (
    <div className="h-screen w-screen bg-black text-text-primary overflow-hidden flex flex-col font-sans selection:bg-brand-crimson">
      <Navbar />

      {/* Main Wrapper: Memastikan pas di tinggi layar */}
      <main className="flex-1 w-full flex items-center justify-center p-2 sm:py-3 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 font-mono text-xs text-text-muted">
            <Clapperboard className="h-8 w-8 text-brand-crimson animate-bounce" />
            <span>MEMUAT REELS...</span>
          </div>
        ) : reels.length > 0 ? (
          /* RESPONSIVE CONTAINER: Menyesuaikan 100% tinggi layar laptop tanpa terpotong */
          <div 
            ref={containerRef}
            className="h-[calc(100vh-5.5rem)] aspect-[9/16] max-w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none rounded-2xl border border-dark-border bg-dark-card shadow-2xl"
          >
            {reels.map((item) => {
              const isActive = activeReelId === item.id;
              const isYouTube = item.video_url?.includes("youtube.com") || item.video_url?.includes("youtu.be");
              const embedUrl = getEmbedUrl(item.video_url || "", isActive);

              return (
                <div
                  key={item.id}
                  data-reel-id={item.id}
                  className="h-full w-full snap-start relative bg-black flex-shrink-0 flex flex-col justify-between overflow-hidden"
                >
                  {/* Media Content */}
                  <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
                    {item.video_url ? (
                      isYouTube ? (
                        isActive ? (
                          <iframe
                            src={embedUrl}
                            title={item.title}
                            className="h-full w-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="relative h-full w-full bg-dark-card flex items-center justify-center">
                            {item.thumbnail_url ? (
                              <img
                                src={`http://127.0.0.1:8000/storage/${item.thumbnail_url}`}
                                alt={item.title}
                                className="h-full w-full object-cover opacity-50"
                              />
                            ) : (
                              <div className="font-mono text-[11px] text-text-muted">Memuat Reel...</div>
                            )}
                          </div>
                        )
                      ) : (
                        <video
                          src={item.video_url}
                          poster={item.thumbnail_url ? `http://127.0.0.1:8000/storage/${item.thumbnail_url}` : undefined}
                          autoPlay={isActive}
                          loop
                          playsInline
                          ref={(el) => {
                            if (el) {
                              if (isActive) el.play().catch(() => {});
                              else el.pause();
                            }
                          }}
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <div className="relative h-full w-full">
                        <img
                          src={
                            item.thumbnail_url
                              ? `http://127.0.0.1:8000/storage/${item.thumbnail_url}`
                              : "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800"
                          }
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                        {item.target_slug && (
                          <Link
                            href={`/artikel/${item.target_slug}`}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <span className="flex items-center gap-2 rounded-xl bg-brand-crimson px-4 py-2 font-mono text-xs font-bold text-white shadow-lg">
                              <span>Buka Artikel</span>
                              <ExternalLink className="h-4 w-4" />
                            </span>
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Right Side Buttons (Like & Share) */}
                    {/* <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-3.5 font-mono text-xs text-white">
                      <button
                        onClick={() => handleLike(item.id)}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <div className={`rounded-full p-2.5 backdrop-blur-md transition-all ${
                          likedReels[item.id]
                            ? "bg-brand-crimson text-white"
                            : "bg-black/60 group-hover:bg-black/90"
                        }`}>
                          <Heart className={`h-4 w-4 ${likedReels[item.id] ? "fill-white" : ""}`} />
                        </div>
                        <span className="text-[10px]">
                          {(item.likes_count || 0) + (likedReels[item.id] ? 1 : 0)}
                        </span>
                      </button>

                      <button className="flex flex-col items-center gap-1 group">
                        <div className="rounded-full bg-black/60 p-2.5 backdrop-blur-md group-hover:bg-black/90">
                          <Share2 className="h-4 w-4" />
                        </div>
                        <span className="text-[10px]">Share</span>
                      </button>
                    </div> */}

                    {/* Bottom Metadata Overlay */}
                    <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-4 font-sans pointer-events-none">
                      <div className="pointer-events-auto">
                        <span className="inline-block rounded bg-brand-crimson px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-white tracking-wider mb-1">
                          {item.type}
                        </span>

                        <h2 className="text-sm font-bold text-white leading-snug line-clamp-1 mb-1">
                          {item.title}
                        </h2>

                        <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed mb-2">
                          {item.caption}
                        </p>

                        {item.target_slug && (
                          <Link
                            href={`/artikel/${item.target_slug}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-cyan/20 border border-brand-cyan/50 px-2.5 py-1 font-mono text-[10px] font-bold text-brand-cyan hover:bg-brand-cyan hover:text-black transition-colors"
                          >
                            <span>BACA SELENGKAPNYA</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center font-mono text-xs text-text-muted">
            Belum ada konten Reels yang dipublikasikan.
          </div>
        )}
      </main>
    </div>
  );
}