"use client";

import Link from 'next/link';
import { motion } from "framer-motion";
import { ArrowUpRight, Flame } from "lucide-react";

interface NewsCardProps {
  category: string;
  title: string;
  readTime: string;
  slug: string; // <-- 1. Wajib ditambahin biar kartunya tau URL beritanya
}

export default function NewsCard({ category, title, readTime, slug }: NewsCardProps) {
  return (
    // 2. Bungkus seluruh kartunya pakai <Link> di sini
    <Link href={`/artikel/${slug}`} className="block h-full cursor-pointer">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative flex h-full flex-col justify-between rounded-xl border border-dark-border bg-dark-card p-6 transition-colors hover:border-brand-crimson/50"
      >
        <div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-brand-crimson">
              <Flame className="h-3.5 w-3.5" />
              {category}
            </span>
            <span className="text-text-muted">{readTime}</span>
          </div>

          <h3 className="mt-4 text-xl font-bold tracking-tight text-text-primary group-hover:text-brand-cyan transition-colors">
            {title}
          </h3>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-dark-border/50 text-xs text-text-muted">
          <span>DailyDiction Editorial</span>
          <ArrowUpRight className="h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-cyan" />
        </div>
      </motion.article>
    </Link>
  );
}