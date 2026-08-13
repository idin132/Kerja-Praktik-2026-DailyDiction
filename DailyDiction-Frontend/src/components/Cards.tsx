"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Flame, Star } from "lucide-react";
import Link from 'next/link';

interface NewsFeedCardProps {
  category: string;
  categoryColor: "crimson" | "cyan";
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
}

export function NewsFeedCard({ category, categoryColor, title, summary, imageUrl, slug }: NewsFeedCardProps) {
  return (
    <Link href={`/artikel/${slug}`} className="block h-full cursor-pointer">
      <motion.article
        whileHover={{ y: -4 }}
        className="group relative flex flex-col overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-all hover:border-brand-crimson/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        <span className={`absolute top-3 left-3 rounded-md px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-black ${
          categoryColor === "crimson" ? "bg-brand-crimson text-white" : "bg-brand-cyan"
        }`}>
          {category}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="text-base font-bold text-text-primary transition-colors group-hover:text-brand-cyan line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="mt-2 text-xs text-text-muted line-clamp-2 leading-relaxed">
            {summary}
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-between border-t border-dark-border/60 pt-3 text-[11px] font-mono text-text-muted">
          <span>5 MIN READ</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-cyan" />
        </div>
      </div>
    </motion.article>
    </Link>
  );
}

interface ReviewCardProps {
  platform: string;
  title: string;
  rating: string;
  imageUrl: string;
  slug: string;
  summary: string;
}

export function ReviewCard({ platform, title, rating, imageUrl }: ReviewCardProps) {
  return (
    <motion.div 
      whileHover={{ x: 4 }}
      className="group flex items-center gap-4 rounded-xl border border-dark-border bg-dark-card p-3 transition-all hover:border-brand-cyan/50"
    >
      <img src={imageUrl} alt={title} className="h-20 w-24 rounded-lg object-cover" />
      
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-cyan">
          {platform}
        </span>
        <h4 className="mt-1 text-sm font-bold text-text-primary line-clamp-1 group-hover:text-brand-cyan transition-colors">
          {title}
        </h4>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-brand-crimson/30 bg-brand-crimson/10 px-3 py-2 font-mono">
        <Star className="h-3 w-3 text-brand-crimson fill-brand-crimson mb-0.5" />
        <span className="text-sm font-black text-text-primary">{rating}</span>
      </div>
    </motion.div>
  );
}