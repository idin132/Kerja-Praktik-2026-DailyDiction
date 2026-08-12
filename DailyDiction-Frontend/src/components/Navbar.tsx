"use client";

import Link from "next/link";
import { Search, Disc as DiscordIcon, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border/80 bg-dark-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 font-mono text-xl font-black tracking-wider text-text-primary"
        >
          DAILY<span className="text-brand-crimson">DICTION</span>
          <span className="h-2 w-2 rounded-full bg-brand-crimson animate-pulse" />
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
          <Link
            href="/"
            className="text-text-primary transition-colors hover:text-brand-crimson"
          >
            HOME
          </Link>
          <Link
            href="/news"
            className="transition-colors hover:text-brand-crimson"
          >
            NEWS
          </Link>
          <Link
            href="/reels"
            className="transition-colors hover:text-brand-crimson"
          >
            REELS
          </Link>
          <Link
            href="/artikel"
            className="transition-colors hover:text-brand-crimson"
          >
            LATEST POST
          </Link>
          <Link
            href="/review"
            className="transition-colors hover:text-brand-crimson"
          >
            REVIEWS
          </Link>
          <Link
            href="/komunitas"
            className="transition-colors hover:text-brand-crimson"
          >
            KOMUNITAS
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Cari artikel"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-border bg-dark-card text-text-muted transition-colors hover:border-brand-cyan hover:text-brand-cyan"
          >
            <Search className="h-4 w-4" />
          </button>

          <a
            href="http://127.0.0.1:8000/admin/login"
            className="flex items-center gap-2 rounded-lg bg-brand-crimson px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-brand-crimson/90 hover:shadow-[0_0_15px_rgba(255,62,62,0.4)]"
          >
            <User className="h-3.5 w-3.5" />
            <span>Masuk</span>
          </a>
        </div>
      </div>
    </header>
  );
}
