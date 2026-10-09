"use client";

import React from "react";
import { ExternalLink, ShoppingCart, Sparkles, CheckCircle2 } from "lucide-react";

export default function HolidayRushOrderCard() {
  const gformUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdRaSZ6_7-4nh03nrY-WA8L3BlJfauJhkl4UisXLwhOYZKXRQ/viewform";

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      {/* Container utama dengan gaya retro ticket / card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#FFD700]/40 bg-gradient-to-br from-[#121826] via-[#1A2338] to-[#0D1322] p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        
        {/* Glow Effects Background */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#00D2FF]/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* KOLOM KIRI: Visual Box Product */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative group w-full max-w-[260px]">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#FF3E3E] to-[#00D2FF] opacity-30 blur-lg group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative rounded-2xl border border-white/10 bg-[#0C121E] p-4 text-center">
                <img
                  src="/image/holiday-rush/board-game.png"
                  alt="Holiday Rush Boardgame Box"
                  className="w-full h-auto object-contain mx-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=800";
                  }}
                />
                <span className="mt-3 inline-block rounded-md bg-[#FFD700]/15 border border-[#FFD700]/30 px-3 py-1 font-mono text-[10px] font-bold text-[#FFD700] uppercase tracking-wider">
                  OFFICIAL BOARDGAME EDITION
                </span>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Detail Penjualan, Tombol GForm & QR Code Langsung */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            
            {/* Header Batch / Tag */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="rounded-full bg-[#FF3E3E]/20 border border-[#FF3E3E]/40 px-3.5 py-1 font-mono text-xs font-black uppercase text-[#FF3E3E] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> PRE-ORDER OPEN
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-xs text-text-muted">
                PLYBOX CREATIVE
              </span>
            </div>

            {/* Judul & Harga */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tight text-white leading-none">
                HOLIDAY RUSH <span className="text-[#FFD700]">BOARDGAME</span>
              </h2>

              <div className="pt-2 flex flex-wrap items-baseline justify-center lg:justify-start gap-3">
                {/* <span className="font-mono text-sm sm:text-base text-text-muted line-through decoration-[#FF3E3E] decoration-2">
                  Rp 375.000
                </span> */}
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#00D2FF]">
                  Rp 200.000
                </span>
                {/* <span className="text-[10px] font-mono font-bold uppercase text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-2 py-0.5 rounded">
                  SPECIAL PO PRICE
                </span> */}
              </div>
            </div>

            {/* List Key Features */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs text-gray-300 pt-1 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#FFD700] shrink-0" />
                <span>Papan Map Bali & Borobudur</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#FFD700] shrink-0" />
                <span>2 - 5 Player Interactive</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#FFD700] shrink-0" />
                <span>6 Karakter Unik + Kartu</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#FFD700] shrink-0" />
                <span>Bonus Sticker Pack</span>
              </div>
            </div>

            {/* AREA AKSI PEMESANAN: TOMBOL + QR CODE TAMPIL LANGSUNG */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              
              {/* Tombol Isi Form Pre-Order */}
              <div className="flex-1 w-full space-y-2 text-center lg:text-left">
                <a
                  href={gformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FF8C00] px-6 py-4 font-mono text-xs sm:text-sm font-black uppercase text-black shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>ISI FORM PRE-ORDER</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-0.5 opacity-80" />
                </a>
                <p className="text-[11px] font-mono text-gray-400">
                  Klik tombol untuk membuka Google Form pemesanan langsung di browser.
                </p>
              </div>

              {/* QR Code Langsung di Dalam Card */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 bg-white/5 border border-white/10 p-3 rounded-2xl">
                <div className="bg-white p-2 rounded-xl shadow-md border-2 border-[#00D2FF]">
                  <img
                    src="/image/holiday-rush/qr-code.jpeg"
                    alt="Scan QR Pre-Order"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
                        encodeURIComponent(gformUrl);
                    }}
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}