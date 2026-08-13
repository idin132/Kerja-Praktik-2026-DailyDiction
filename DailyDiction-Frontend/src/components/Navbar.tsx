"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, Flame, Clapperboard, Newspaper, Star, Users } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "HOME", href: "/", icon: Flame },
    { name: "NEWS", href: "/news", icon: Newspaper },
    { name: "REELS", href: "/reels", icon: Clapperboard, isReels: true },
    { name: "REVIEW", href: "/review", icon: Star },
    { name: "KOMUNITAS", href: "/komunitas", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1 font-mono text-xl font-black tracking-wider text-text-primary">
          ANAK<span className="text-brand-crimson">TUA</span>
          <span className="h-2 w-2 rounded-full bg-brand-crimson animate-pulse" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors hover:text-brand-crimson flex items-center gap-1.5 ${
                  isActive ? "font-bold text-text-primary" : ""
                } ${link.isReels ? "text-brand-crimson font-bold" : ""}`}
              >
                <span>{link.name}</span>
                {link.isReels && (
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-crimson animate-ping" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons & Mobile Hamburger Button */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            aria-label="Cari"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-border bg-dark-card text-text-muted transition-colors hover:border-brand-cyan hover:text-text-primary"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Login Button */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-brand-crimson px-4 py-2 text-xs font-mono font-bold uppercase text-white transition-all hover:bg-brand-crimson/90 hover:shadow-[0_0_15px_rgba(255,62,62,0.4)]"
          >
            <User className="h-3.5 w-3.5" />
            <span>MASUK</span>
          </Link>

          {/* Hamburger Menu Button (Khusus Tampilan HP / Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-border bg-dark-card text-text-primary md:hidden hover:border-brand-crimson transition-colors"
          >
            {isOpen ? <X className="h-5 w-5 text-brand-crimson" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b border-dark-border bg-dark-card/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-2 px-4 pt-3 pb-6 font-mono text-sm">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 font-bold transition-all ${
                      isActive
                        ? "bg-brand-crimson/15 border border-brand-crimson/40 text-brand-crimson"
                        : "text-text-muted hover:bg-dark-bg hover:text-text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${link.isReels ? "text-brand-crimson" : ""}`} />
                      <span>{link.name}</span>
                    </div>

                    {link.isReels && (
                      <span className="rounded bg-brand-crimson px-2 py-0.5 text-[10px] uppercase text-white">
                        HOT
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Mobile Login Button */}
              <div className="pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3 font-bold uppercase text-white shadow-md active:scale-95 transition-all"
                >
                  <User className="h-4 w-4" />
                  <span>MASUK KE AKUN</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}