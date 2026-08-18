"use client";

import { motion } from "framer-motion";
import { User, Calendar } from "lucide-react";
import Link from "next/link";

interface NewsFeedCardProps {
  category: string | string[];
  categoryColor: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
  author?: string;
  createdAt?: string;
}

export function NewsFeedCard({
  category,
  categoryColor,
  title,
  summary,
  imageUrl,
  slug,
  author,
  createdAt,
}: NewsFeedCardProps) {
  let catList: string[] = [];
  if (Array.isArray(category)) {
    catList = category;
  } else if (typeof category === "string") {
    try {
      catList = category.startsWith("[") ? JSON.parse(category) : [category];
    } catch {
      catList = [category];
    }
  }

  return (
    <Link href={`/artikel/${slug}`} className="block h-full cursor-pointer">
      <motion.article
        whileHover={{ y: -4 }}
        className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-all hover:border-brand-crimson/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        {/* Gambar dengan rasio tetap */}
        <div className="relative aspect-video w-full overflow-hidden border-b border-dark-border/50 shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge Kategori */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {catList.map((cat, idx) => (
              <span
                key={idx}
                className={`rounded-md px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${
                  categoryColor === "crimson"
                    ? "bg-brand-crimson text-white"
                    : "bg-brand-cyan text-black"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Konten Text (Atas dan Bawah Terkunci) */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            {/* Judul: Tinggi minimal dikunci setara 2 baris */}
            <h3 className="text-base font-bold text-text-primary transition-colors group-hover:text-brand-cyan line-clamp-2 min-h-[3rem] leading-snug">
              {title}
            </h3>
            {/* Deskripsi: Tinggi minimal dikunci setara 2 baris */}
            <p className="mt-2 text-xs text-text-muted line-clamp-2 min-h-[2.5rem] leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Footer Card */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-dark-border/60 pt-4 text-[10px] md:text-xs font-mono text-text-muted">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-brand-crimson" />
              <span className="font-semibold text-white truncate max-w-[120px]">
                {author || "Redaksi"}
              </span>
            </div>

            <span className="text-dark-border hidden sm:inline-block">•</span>

            {createdAt ? (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            ) : (
              <span>Baru saja</span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

interface ReviewCardProps {
  platform: string | string[];
  title: string;
  imageUrl: string;
  slug: string;
  summary: string;
}

export function ReviewCard({
  platform,
  title,
  imageUrl,
  slug,
}: ReviewCardProps) {
  let platformList: string[] = [];
  if (Array.isArray(platform)) {
    platformList = platform;
  } else if (typeof platform === "string") {
    try {
      platformList = platform.startsWith("[")
        ? JSON.parse(platform)
        : [platform];
    } catch {
      platformList = [platform];
    }
  }

  return (
    <Link href={`/review/${slug}`} className="block h-full">
      <motion.div
        whileHover={{ x: 4 }}
        className="group flex items-center gap-4 h-full rounded-xl border border-dark-border bg-dark-card p-3 transition-all hover:border-brand-cyan/50"
      >
        <img
          src={imageUrl}
          alt={title}
          className="h-20 w-24 rounded-lg object-cover shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {platformList.map((plat, idx) => (
              <span
                key={idx}
                className="text-[9px] px-1.5 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/30 font-mono font-bold uppercase tracking-wider text-brand-cyan"
              >
                {plat}
              </span>
            ))}
          </div>
          <h4 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-brand-cyan transition-colors">
            {title}
          </h4>
        </div>
      </motion.div>
    </Link>
  );
}
