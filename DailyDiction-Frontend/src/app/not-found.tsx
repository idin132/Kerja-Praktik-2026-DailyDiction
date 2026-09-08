"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black text-[#FFD700] mb-4">404</h1>
      <p className="text-sm font-mono text-text-muted mb-6">
        Halaman tidak ditemukan atau terjadi hambatan saat memuat data.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[#FFD700] px-5 py-2.5 font-mono text-xs font-bold text-black hover:bg-[#FFD700]/90 transition-all"
        >
          Muat Ulang Halaman
        </button>
        <Link
          href="/"
          className="rounded-xl border border-dark-border bg-dark-card px-5 py-2.5 font-mono text-xs font-bold text-white hover:border-[#FFD700] transition-all"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}