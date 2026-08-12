"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";

// Icon Discord Kustom
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.213.385-.444.905-.608 1.315a18.27 18.27 0 0 0-5.648 0c-.164-.41-.4-.93-.615-1.315A19.736 19.736 0 0 0 3.67 4.37C.533 9.046-.319 13.608.106 18.11a19.98 19.98 0 0 0 6.002 3.03c.49-.67.924-1.38 1.293-2.13-.71-.27-1.39-.61-2.04-1.01.17-.125.337-.255.5-.39 3.93 1.84 8.18 1.84 12.06 0 .164.135.33.265.5.39-.65.4-1.33.74-2.04 1.01.37.75.8 1.46 1.29 2.13a19.98 19.98 0 0 0 6.006-3.03c.5-5.22-.85-9.74-3.36-13.74ZM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
    </svg>
  );
}

// Icon Google Kustom
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.24 10.285V13.4h6.887c-.283 1.812-2.128 5.311-6.887 5.311-4.14 0-7.518-3.431-7.518-7.661 0-4.23 3.378-7.661 7.518-7.661 2.355 0 3.93.996 4.832 1.859l2.455-2.383C17.95 1.503 15.33 0 12.24 0 5.48 0 0 5.48 0 12.25s5.48 12.25 12.24 12.25c7.062 0 11.758-4.957 11.758-11.966 0-.805-.083-1.418-.184-2.025H12.24z" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Integrasi authentikasi ke Backend Laravel kelak di sini
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white flex flex-col justify-between">
      <div>

        <main className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card/60 p-8 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            {/* Header Form */}
            <div className="text-center">
              <Link 
                href="/" 
                className="inline-flex items-center gap-1 font-mono text-2xl font-black tracking-wider text-text-primary"
              >
                DAILY<span className="text-brand-crimson">DICTION</span>
                <span className="h-2 w-2 rounded-full bg-brand-crimson animate-pulse" />
              </Link>
              <h1 className="mt-4 text-xl font-bold font-mono text-text-primary uppercase tracking-tight">
                Selamat Datang Kembali
              </h1>
              <p className="mt-1 text-xs text-text-muted">
                Masuk ke akun kamu untuk akses fitur komentar & komunitas.
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 space-y-3 font-mono text-xs">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-dark-border bg-dark-bg py-2.5 text-text-primary transition-all hover:border-[#5865F2] hover:bg-[#5865F2]/10"
              >
                <DiscordIcon className="h-4 w-4 fill-[#5865F2]" />
                <span>Lanjut dengan Discord</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-dark-border bg-dark-bg py-2.5 text-text-primary transition-all hover:border-brand-cyan hover:bg-brand-cyan/10"
              >
                <GoogleIcon className="h-4 w-4 fill-white" />
                <span>Lanjut dengan Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-dark-border" />
              <span className="absolute bg-dark-card px-3 text-[10px] font-mono uppercase text-text-muted">
                Atau Email
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-lg border border-dark-border bg-dark-bg pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-crimson focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-text-muted uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#" className="text-[11px] font-mono text-brand-cyan hover:underline">
                    Lupa Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-dark-border bg-dark-bg pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-crimson focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-crimson py-3 text-xs font-mono font-bold uppercase tracking-wider text-white transition-all hover:bg-brand-crimson/90 hover:shadow-[0_0_20px_rgba(255,62,62,0.4)] active:scale-95"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Footer Registration Link */}
            <div className="mt-6 text-center text-xs text-text-muted font-mono">
              <span>Belum punya akun? </span>
              <a href="#" className="font-bold text-brand-crimson hover:underline">
                Daftar Gratis
              </a>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] font-mono text-text-muted/70 pt-4 border-t border-dark-border/40">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-cyan" />
              <span>Sistem terenkripsi aman</span>
            </div>

          </motion.div>
        </main>
      </div>
    </div>
  );
}