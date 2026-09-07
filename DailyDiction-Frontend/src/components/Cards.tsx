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
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-all hover:border-[#FFD700]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
    >
      {/* Gambar dengan rasio tetap */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-dark-border/50 shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge Kategori */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
          {catList.map((cat, idx) => (
            <span
              key={idx}
              className="rounded-md px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFD700] text-black"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Konten Text */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="text-base font-bold text-text-primary transition-colors group-hover:text-[#FFD700] line-clamp-2 min-h-[3rem] leading-snug">
            <Link href={`/artikel/${slug}`} className="before:absolute before:inset-0 before:z-10 focus:outline-none">
              {title}
            </Link>
          </h3>
          <p className="mt-2 text-xs text-text-muted line-clamp-2 min-h-[2.5rem] leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Footer Card */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-dark-border/60 pt-4 text-[10px] md:text-xs font-mono text-text-muted">
          <div className="flex items-center gap-1.5 relative z-20">
            <User className="h-3.5 w-3.5 text-[#FFD700]" />
            <span className="font-semibold text-white truncate max-w-[120px]">
              {author || "Redaksi"}
            </span>
          </div>

          <span className="text-dark-border hidden sm:inline-block">•</span>

          {createdAt ? (
            <div className="flex items-center gap-1.5 relative z-20">
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
            <span className="relative z-20">Baru saja</span>
          )}
        </div>
      </div>
    </motion.article>
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
    <motion.div
      whileHover={{ x: 4 }}
      className="group relative flex items-center gap-4 h-full rounded-xl border border-dark-border bg-dark-card p-3 transition-all hover:border-[#FFD700]/50 cursor-pointer"
    >
      <img
        src={imageUrl}
        alt={title}
        className="h-20 w-24 rounded-lg object-cover shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1.5 mb-1.5 relative z-20">
          {platformList.map((plat, idx) => (
            <span
              key={idx}
              className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFD700]/10 border border-[#FFD700]/30 font-mono font-bold uppercase tracking-wider text-[#FFD700]"
            >
              {plat}
            </span>
          ))}
        </div>
        <h4 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-[#FFD700] transition-colors">
          <Link href={`/review/${slug}`} className="before:absolute before:inset-0 before:z-10 focus:outline-none">
            {title}
          </Link>
        </h4>
      </div>
    </motion.div>
  );
}