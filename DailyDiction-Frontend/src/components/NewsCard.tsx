"use client";

import Link from 'next/link';
import { motion } from "framer-motion";
import { ArrowUpRight, Flame, User, Calendar, Clock } from "lucide-react";

interface NewsCardProps {
  category: string;
  title: string;
  readTime: string;
  slug: string;
  author?: string;
  createdAt?: string;
}

export default function NewsCard({ 
  category, 
  title, 
  readTime, 
  slug, 
  author, 
  createdAt 
}: NewsCardProps) {
  return (
    <Link href={`/artikel/${slug}`} className="block h-full cursor-pointer">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative flex h-full flex-col justify-between rounded-xl border border-dark-border bg-dark-card p-6 transition-colors hover:border-[#FFD700]/50"
      >
        <div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#FFD700]">
              <Flame className="h-3.5 w-3.5 text-[#FFD700]" />
              {category}
            </span>
            <ArrowUpRight className="h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FFD700]" />
          </div>

          <h3 className="mt-4 text-xl font-bold tracking-tight text-text-primary group-hover:text-[#FFD700] transition-colors">
            {title}
          </h3>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 pt-4 border-t border-dark-border/50 text-[10px] md:text-xs font-mono text-text-muted">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-[#FFD700]" />
            <span className="font-semibold text-white truncate max-w-[100px]">
              {author || "Redaksi"}
            </span>
          </div>

          <span className="text-dark-border hidden sm:inline-block">•</span>

          {createdAt && (
            <>
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
              <span className="text-dark-border hidden sm:inline-block">•</span>
            </>
          )}

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">{readTime || "3 MIN READ"}</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}