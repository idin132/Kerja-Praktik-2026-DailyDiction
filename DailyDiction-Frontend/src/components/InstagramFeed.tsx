"use client";

import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

interface InstaPost {
  id: string;
  image: string;
  link: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Link Akun Instagram
  const igUrl = "https://www.instagram.com/anaktua_";

  useEffect(() => {
    async function fetchInstagram() {
      try {
        // Nanti minta Idin bikin endpoint ini di Laravel buat narik API Instagram
        const res = await fetch("http://127.0.0.1:8000/api/v1/instagram-feed");
        if (res.ok) {
          const json = await res.json();
          setPosts(json.data || []);
        }
      } catch (err) {
        console.error("Gagal narik data Instagram", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInstagram();
  }, []);

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-pink-500" />
          <h2 className="text-2xl font-black text-white">Di Instagram</h2>
        </div>
        <Link href={igUrl} target="_blank" className="text-sm font-bold text-pink-500 hover:underline">
          Follow @DailyDiction →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          // Efek Loading
          [1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-square rounded-xl bg-dark-card/50 animate-pulse border border-dark-border" />
          ))
        ) : posts.length > 0 ? (
          // Data Asli
          posts.map((post) => (
            <Link key={post.id} href={post.link} target="_blank">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group relative aspect-square overflow-hidden rounded-xl bg-dark-card border border-dark-border shadow-lg"
              >
                <img src={post.image} alt="Instagram Post" className="h-full w-full object-cover transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <div className="col-span-2 md:col-span-4 rounded-xl border border-dark-border bg-dark-card p-8 text-center">
             <p className="text-sm text-text-muted font-mono">Menunggu sinkronisasi Instagram Backend...</p>
          </div>
        )}
      </div>
    </section>
  );
}