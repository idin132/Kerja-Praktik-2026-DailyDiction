"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, ArrowRight } from "lucide-react";

interface TechItem {
  id: number;
  title: string;
  slug: string;
  category_input?: string | string[];
  category?: string | string[];
  categories?: any[];
  summary: string;
  image_url?: string;
  image_full_url?: string;
  created_at: string;
}

function formatTechImage(item: TechItem): string {
  const imageUrl = item.image_url || item.image_full_url;
  const fallback = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800";
  if (!imageUrl) return fallback;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    if (imageUrl.includes("127.0.0.1:8000/storage/http")) {
      return imageUrl.replace(/http:\/\/127\.0\.0\.1:8000\/storage\/(https?:\/\/)/, "$1");
    }
    return imageUrl;
  }
  return `https://dailydiction.id/storage/${imageUrl}`;
}

function getCategoriesArray(item: TechItem): string[] {
  let rawCats: any[] = [];
  if (item.categories && item.categories.length > 0) {
    rawCats = item.categories.map((c: any) => c.name);
  } else if (item.category_input) {
    rawCats = Array.isArray(item.category_input) ? item.category_input : [item.category_input];
  } else if (item.category) {
    if (typeof item.category === "string" && item.category.startsWith("[")) {
      try { rawCats = JSON.parse(item.category); } catch { rawCats = [item.category]; }
    } else {
      rawCats = Array.isArray(item.category) ? item.category : [item.category];
    }
  }
  const validCats = rawCats.filter(Boolean).map(String);
  return validCats.length > 0 ? validCats.map((c) => c.toUpperCase()) : ["HARDWARE"];
}

export default function TechSection() {
  const [techArticles, setTechArticles] = useState<TechItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchTech() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";
        // Cukup ambil 3 artikel terbaru biar pas 1 baris
        const res = await fetch(`${apiUrl}/technologies?per_page=3`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setTechArticles(json.data || []);
        }
      } catch (err) {
        console.error("Gagal ambil data tech:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchTech();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="animate-pulse">
        <div className="h-8 w-48 bg-dark-card rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-dark-card rounded-2xl border border-dark-border"></div>
          ))}
        </div>
      </section>
    );
  }

  if (techArticles.length === 0) return null;

  return (
    <section>
      {/* Header Section (Ukurannya disamakan persis dengan Ulasan Game) */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-brand-cyan" />
          <h2 className="text-lg font-black uppercase tracking-wider text-text-primary">
            TECHNOLOGY
          </h2>
        </div>
        <Link
          href="/technology"
          className="flex items-center gap-1 text-xs font-mono font-bold text-brand-cyan hover:underline"
        >
          <span>SEMUA TECH</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid Card List (Gap disamakan persis dengan Ulasan Game) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techArticles.map((item) => {
          const categories = getCategoriesArray(item);

          return (
            <Link
              key={item.id}
              href={`/artikel/${item.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-dark-border bg-dark-card p-2.5 sm:p-3 transition-all hover:border-brand-cyan/60 hover:-translate-y-1 shadow-lg h-full"
            >
              {/* Thumbnail Kiri */}
              <div className="h-20 w-24 sm:h-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl relative border border-dark-border/50">
                <img
                  src={formatTechImage(item)}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800";
                  }}
                />
              </div>

              {/* Konten Kanan */}
              <div className="flex flex-1 flex-col justify-center pr-2">
                <div className="mb-1.5 flex flex-wrap gap-1.5">
                  <span className="rounded bg-brand-cyan/10 border border-brand-cyan/30 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase text-brand-cyan drop-shadow-sm">
                    {categories[0]}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-text-primary transition-colors group-hover:text-brand-cyan line-clamp-2 leading-snug">
                  {item.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}