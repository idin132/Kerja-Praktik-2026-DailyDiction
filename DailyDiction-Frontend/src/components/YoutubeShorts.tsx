"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ShortVideo {
  id: string;
  title: string;
  thumbnail: string;
  link: string;
}

export default function YoutubeShorts() {
  const [shorts, setShorts] = useState<ShortVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Link Channel untuk tombol "Lihat Semua"
  const channelUrl = "https://www.youtube.com/@worgameplay/shorts";

  useEffect(() => {
    async function fetchShorts() {
      try {
        // Nanti minta Idin bikin endpoint ini di Laravel buat narik API YouTube
        // Sementara pakai try-catch biar web gak crash walau backend belum siap
        const res = await fetch("http://127.0.0.1:8000/api/v1/youtube-shorts"); 
        if (res.ok) {
          const json = await res.json();
          setShorts(json.data || []);
        }
      } catch (err) {
        console.error("Gagal narik data YouTube Shorts", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShorts();
  }, []);

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">WOR Shorts</h2>
        <Link href={channelUrl} target="_blank" className="text-sm font-bold text-brand-crimson hover:underline">
          Lihat Semua di YouTube →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
        {isLoading ? (
          // Efek Loading (Skeleton)
          [1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="snap-start shrink-0 h-72 w-44 rounded-xl bg-dark-card/50 animate-pulse border border-dark-border" />
          ))
        ) : shorts.length > 0 ? (
          // Data Asli dari API
          shorts.map((short) => (
            <Link key={short.id} href={short.link} target="_blank" className="snap-start shrink-0">
              <motion.div
                whileHover={{ y: -5 }}
                className="group relative h-72 w-44 overflow-hidden rounded-xl bg-dark-card border border-dark-border shadow-lg cursor-pointer"
              >
                <img src={short.thumbnail} alt={short.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-90 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                    <Play className="h-6 w-6 fill-white text-white ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-3 right-3 text-center">
                  <h3 className="text-sm font-bold leading-tight text-white line-clamp-2">
                    {short.title}
                  </h3>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          // Kalau data API masih kosong / backend belum siap
          <div className="w-full rounded-xl border border-dark-border bg-dark-card p-8 text-center">
            <p className="text-sm text-text-muted font-mono">Menunggu sinkronisasi YouTube Backend...</p>
          </div>
        )}
      </div>
    </section>
  );
}