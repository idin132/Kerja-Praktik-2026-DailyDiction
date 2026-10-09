"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HolidayRushFaq from "@/components/HolidayRushFaq";
import HolidayRushOrderCard from "@/components/HolidayRushOrderCard";
import {
  Sparkles,
  ShoppingBag,
  Users,
  Clock,
  Dices,
  ChevronRight,
  MapPin,
  ShieldAlert,
} from "lucide-react";

export default function HolidayRushPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "characters" | "events" | "items"
  >("all");

  // SEMUA 19 ASET GAMBAR LOKAL
  const allAssets = [
    // --- Karakter ---
    {
      name: "Anak SCBD",
      file: "/image/holiday-rush/Anak_SCBD.png",
      type: "characters",
      desc: "Si paling butuh liburan & kopi susu.",
    },
    {
      name: "Gamers Ganteng",
      file: "/image/holiday-rush/Gamers_Ganteng.png",
      type: "characters",
      desc: "Main Handheld Console sepanjang jalan.",
    },
    {
      name: "Gen Z",
      file: "/image/holiday-rush/Gen_Z.png",
      type: "characters",
      desc: "Headphone ON, pengen hilang dulu.",
    },
    {
      name: "Selebgram",
      file: "/image/holiday-rush/Selebgram.png",
      type: "characters",
      desc: "Otw buat konten estetik liburan.",
    },
    {
      name: "Ojol Ganteng",
      file: "/image/holiday-rush/Ojol_Ganteng.png",
      type: "characters",
      desc: "Driver andalan penembus kemacetan.",
    },
    {
      name: "Rejeki Nomplok",
      file: "/image/holiday-rush/Rejeki_Nomplok.png",
      type: "characters",
      desc: "Bapak-bapak topi fedora pembawa hoki.",
    },

    // --- Event & Rintangan ---
    {
      name: "Disasarin Setan",
      file: "/image/holiday-rush/Disasarin_Setan.png",
      type: "events",
      desc: "Kartu Sabotase: Bikin lawan nyasar!",
    },
    {
      name: "Jalan Rusak & Cones",
      file: "/image/holiday-rush/Jalan_Rusak.png",
      type: "events",
      desc: "Rintangan: Minta berhenti 1 putaran.",
    },
    {
      name: "Lampu Merah & Sign",
      file: "/image/holiday-rush/Lampu_Merah_Color.png",
      type: "events",
      desc: "Papan petunjuk jalanan warna-warni.",
    },

    // --- Vehicles & Items ---
    {
      name: "VW Bus Van",
      file: "/image/holiday-rush/Van_Holiday_Rush.png",
      type: "items",
      desc: "Mobil van merah putih khas liburan.",
    },
    {
      name: "Pesawat",
      file: "/image/holiday-rush/Pesawats.png",
      type: "items",
      desc: "Moda transportasi super cepat.",
    },
    {
      name: "Surfboard Red",
      file: "/image/holiday-rush/Surfboard_3.png",
      type: "items",
      desc: "Papan selancar garis merah.",
    },
    {
      name: "Surfboard Rockstar",
      file: "/image/holiday-rush/Surfboard_2.png",
      type: "items",
      desc: "Papan selancar kuning Rockstar.",
    },

    // --- Environment & Landmarks ---
    {
      name: "Candi Borobudur / Stupa",
      file: "/image/holiday-rush/Stupa.png",
      type: "items",
      desc: "Landmark Jawa Tengah & Jogja.",
    },
    {
      name: "Gapura Candi Bali",
      file: "/image/holiday-rush/Stupa_Gate_Bali.png",
      type: "items",
      desc: "Candi Bentar khas Pulau Dewata.",
    },
    {
      name: "Tulisan BALI",
      file: "/image/holiday-rush/BALI_Sign.png",
      type: "items",
      desc: "Ornamen ukiran nama Bali.",
    },
    {
      name: "Pohon Kelapa Rimbun",
      file: "/image/holiday-rush/Pohon.png",
      type: "items",
      desc: "Dekorasi tropis sudut pantai.",
    },
    {
      name: "Pohon Kelapa Tinggi",
      file: "/image/holiday-rush/Coconut_Tree_1.png",
      type: "items",
      desc: "Pohon kelapa tinggi menjulang.",
    },
  ];

  const filteredAssets =
    activeTab === "all"
      ? allAssets
      : allAssets.filter((a) => a.type === activeTab);

  return (
    <div className="min-h-screen bg-[#0C1527] text-white font-sans selection:bg-[#00D2FF] selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Hero Section dengan Aset Dekoratif */}
      <section className="relative bg-gradient-to-b from-[#00D2FF]/20 via-[#0C1527] to-[#0C1527] pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative Assets Melayang */}
        <img
          src="/image/holiday-rush/Pohon.png"
          alt="Pohon"
          className="absolute top-10 -left-12 w-36 sm:w-56 opacity-25 pointer-events-none"
        />
        <img
          src="/image/holiday-rush/Coconut_Tree_1.png"
          alt="Coconut Tree"
          className="absolute bottom-10 left-5 w-24 sm:w-40 opacity-20 pointer-events-none"
        />
        <img
          src="/image/holiday-rush/Pesawats.png"
          alt="Pesawat"
          className="absolute top-12 right-6 w-40 sm:w-64 opacity-30 pointer-events-none animate-pulse"
        />
        <img
          src="/image/holiday-rush/Surfboard_3.png"
          alt="Surfboard"
          className="absolute bottom-16 right-10 w-16 sm:w-28 opacity-25 pointer-events-none rotate-12"
        />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Teks Utama */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 px-4 py-1.5 font-mono text-xs font-bold text-[#FFD700] uppercase">
                <Sparkles className="h-4 w-4" />
                <span>OFFICIAL BOARDGAME HAS ARRIVED</span>
              </div>

              <div className="space-y-3">
                <img
                  src="/image/holiday-rush/HR_Logo_BG.png"
                  alt="Holiday Rush Logo"
                  className="h-20 sm:h-28 w-auto mx-auto lg:mx-0 object-contain drop-shadow-[0_10px_25px_rgba(0,210,255,0.4)]"
                />
                <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight uppercase leading-none">
                  RACE, SABOTAGE, AND{" "}
                  <span className="text-[#FF3E3E]">SURVIVE!</span>
                </h1>
              </div>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
                Adu cepat menuju destinasi liburan impian! Hadapi jebakan begal,
                jalan rusak, lampu merah colo, disasarin setan, hingga sabotase
                antar teman dalam boardgame liburan paling gokil di Indonesia.
              </p>

              {/* Game Specs Badge */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 font-mono text-xs pt-2">
                <div className="flex items-center gap-2 bg-[#17233B] border border-white/10 px-4 py-2.5 rounded-xl">
                  <Users className="h-4 w-4 text-[#00D2FF]" />
                  <span>2 - 5 Pemain</span>
                </div>
                <div className="flex items-center gap-2 bg-[#17233B] border border-white/10 px-4 py-2.5 rounded-xl">
                  <Clock className="h-4 w-4 text-[#FFD700]" />
                  <span>20 - 30 Menit</span>
                </div>
                <div className="flex items-center gap-2 bg-[#17233B] border border-white/10 px-4 py-2.5 rounded-xl">
                  <Dices className="h-4 w-4 text-[#FF3E3E]" />
                  <span>Usia 8+</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="https://tokopedia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3E3E] to-[#FF8C00] px-8 py-4 font-mono text-sm font-black uppercase text-white shadow-[0_0_25px_rgba(255,62,62,0.5)] transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>BELI SEKARANG</span>
                </a>
                <a
                  href="#gallery"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-6 py-4 font-mono text-sm font-bold uppercase text-white hover:bg-white/10 transition-all"
                >
                  <span>Lihat Semua Karakter</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Visual VW Van & Bali Sign */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#00D2FF] via-[#FFD700] to-[#FF3E3E] opacity-40 blur-xl animate-pulse" />
                <div className="relative rounded-2xl border border-white/15 bg-[#142035] p-6 text-center shadow-2xl space-y-4">
                  <img
                    src="/image/holiday-rush/Van_Holiday_Rush.png"
                    alt="VW Van Holiday Rush"
                    className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
                  />

                  <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/10">
                    <img
                      src="/image/holiday-rush/BALI_Sign.png"
                      alt="BALI Sign"
                      className="h-8 w-auto object-contain"
                    />
                    <img
                      src="/image/holiday-rush/Surfboard_2.png"
                      alt="Surfboard Rockstar"
                      className="h-10 w-auto object-contain"
                    />
                  </div>

                  <span className="text-xs font-mono text-[#FFD700] uppercase font-bold tracking-wider block">
                    READY STOCK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinasi Map Showcase (Borobudur & Bali Gate) */}
      <section className="py-12 bg-[#09101E] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-[#142035] p-6">
            <img
              src="/image/holiday-rush/Stupa.png"
              alt="Borobudur"
              className="h-20 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-1 text-[#FFD700] font-mono text-xs font-bold uppercase mb-1">
                <MapPin className="h-3.5 w-3.5" /> DESTINASI 1
              </div>
              <h3 className="text-lg font-mono font-bold text-white uppercase">
                Candi Borobudur
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Jalur darat penuh kelok, cegatan jalan rusak, dan pamer
                kecepatan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-[#142035] p-6">
            <img
              src="/image/holiday-rush/Stupa_Gate_Bali.png"
              alt="Bali Gate"
              className="h-20 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-1 text-[#00D2FF] font-mono text-xs font-bold uppercase mb-1">
                <MapPin className="h-3.5 w-3.5" /> DESTINASI 2
              </div>
              <h3 className="text-lg font-mono font-bold text-white uppercase">
                Pulau Bali
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Jalur laut, selancar di pantai, dan balapan sampai garis finish!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galeri Semua Aset Game (Interactive Showcase) */}
      <section
        id="gallery"
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-mono font-black uppercase text-white">
            KOMPONEN & KARAKTER GAME
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-sans">
            Jelajahi semua aset unik yang ada di dalam box Holiday Rush
            Boardgame!
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-10 font-mono text-xs font-bold uppercase">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === "all"
                ? "bg-[#00D2FF] text-black border-[#00D2FF]"
                : "bg-[#142035] text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            Semua Aset ({allAssets.length})
          </button>
          <button
            onClick={() => setActiveTab("characters")}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === "characters"
                ? "bg-[#FFD700] text-black border-[#FFD700]"
                : "bg-[#142035] text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            Karakter Pemain (6)
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === "events"
                ? "bg-[#FF3E3E] text-white border-[#FF3E3E]"
                : "bg-[#142035] text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            Event & Rintangan (3)
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === "items"
                ? "bg-emerald-400 text-black border-emerald-400"
                : "bg-[#142035] text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            Item & Landmark (10)
          </button>
        </div>

        {/* Grid Display Aset */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map((item, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-[#142035] p-4 text-center hover:border-[#00D2FF]/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="h-36 w-full overflow-hidden rounded-xl bg-[#0C1527] mb-3 flex items-center justify-center p-3 relative">
                <img
                  src={item.file}
                  alt={item.name}
                  className="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <span className="inline-block rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-mono text-[#00D2FF] mb-1.5 uppercase font-bold">
                {item.type}
              </span>

              <h4 className="font-mono text-xs font-bold text-white uppercase">
                {item.name}
              </h4>
              <p className="text-[11px] text-gray-400 font-sans mt-1 line-clamp-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* FAQ SECTION (YANG SERING DITANYAIN) */}
        <HolidayRushFaq />

      {/* Card Pemesanan Pre-Order Google Form */}
      <HolidayRushOrderCard />

      <Footer />
    </div>
  );
}
