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
} from "lucide-react";

export default function HolidayRushPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "board" | "cards" | "components"
  >("all");

  const GFORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSdRaSZ6_7-4nh03nrY-WA8L3BlJfauJhkl4UisXLwhOYZKXRQ/viewform";

  const allAssets = [
    {
      name: "1 Map Board",
      file: "/image/holiday-rush/Map_Board.jpg",
      type: "board",
      desc: "Papan permainan interaktif jalur liburan Jawa - Bali.",
    },
    {
      name: "1 Buku Panduan",
      file: "/image/holiday-rush/Anak_SCBD.png",
      type: "board",
      desc: "Panduan lengkap aturan main, mekanisme, dan cara menang.",
    },
    {
      name: "32 Kartu Efek",
      file: "/image/holiday-rush/Disasarin_Setan.png",
      type: "cards",
      desc: "Kartu sabotase, jebakan, dan event gokil tak terduga.",
    },
    {
      name: "32 Kartu Langkah",
      file: "/image/holiday-rush/Pesawats.png",
      type: "cards",
      desc: "Kartu penentu pergerakan & kecepatan pion di atas board.",
    },
    {
      name: "5 Pion Karakter",
      file: "/image/holiday-rush/Gamers_Ganteng.png",
      type: "components",
      desc: "Pion karakter unik perwakilan tiap pemain di papan permainan.",
    },
    {
      name: "7 Poin Lubang Jalan",
      file: "/image/holiday-rush/Jalan_Rusak.png",
      type: "components",
      desc: "Token rintangan jalan rusak yang siap menghadang langkah musuh.",
    },
  ];

  const filteredAssets =
    activeTab === "all"
      ? allAssets
      : allAssets.filter((a) => a.type === activeTab);

  return (
    <div className="min-h-screen bg-[#0C1527] text-white font-sans selection:bg-[#00D2FF] selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#00D2FF]/20 via-[#0C1527] to-[#0C1527] pt-12 pb-20 px-4 sm:px-6 lg:px-8">
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
            {/* Teks Utama Kiri */}
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

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href={GFORM_LINK}
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
                  <span>Lihat Komponen Game</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Box Hero Kanan */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#00D2FF] via-[#FFD700] to-[#FF3E3E] opacity-40 blur-xl animate-pulse" />
                <div className="relative rounded-2xl border border-white/15 bg-[#142035] p-6 text-center shadow-2xl space-y-4">
                  <img
                    src="/image/holiday-rush/board-game.png"
                    alt="Holiday Rush Boardgame Box"
                    className="w-full h-56 object-contain hover:scale-105 transition-transform duration-500 mx-auto drop-shadow-2xl"
                  />

                  <div className="pt-2 border-t border-white/10">
                    <span className="text-xs font-mono text-[#FFD700] uppercase font-bold tracking-wider block">
                      READY STOCK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinasi Map Showcase */}
      <section className="py-12 bg-[#09101E] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
          <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-[#142035] p-6 max-w-xl w-full">
            <img
              src="/image/holiday-rush/BALI_Sign.png"
              alt="Bali Sign"
              className="h-16 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-1 text-[#00D2FF] font-mono text-xs font-bold uppercase mb-1">
                <MapPin className="h-3.5 w-3.5" /> DESTINASI
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

      {/* Galeri Komponen Game */}
      <section
        id="gallery"
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-mono font-black uppercase text-white">
            KOMPONEN & ISI BOX GAME
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-sans">
            Jelajahi semua komponen unik yang ada di dalam box Holiday Rush
            Boardgame!
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-10 font-mono text-xs font-bold uppercase">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === "all"
                ? "bg-[#00D2FF] text-black border-[#00D2FF]"
                : "bg-[#142035] text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            Semua Komponen ({allAssets.length})
          </button>
          <button
            onClick={() => setActiveTab("board")}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === "board"
                ? "bg-[#FFD700] text-black border-[#FFD700]"
                : "bg-[#142035] text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            Board & Buku (2)
          </button>
          <button
            onClick={() => setActiveTab("cards")}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === "cards"
                ? "bg-[#FF3E3E] text-white border-[#FF3E3E]"
                : "bg-[#142035] text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            Kartu (2 Jenis)
          </button>
          <button
            onClick={() => setActiveTab("components")}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === "components"
                ? "bg-emerald-400 text-black border-emerald-400"
                : "bg-[#142035] text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            Pion & Token (2 Jenis)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredAssets.map((item, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-[#142035] p-5 text-center hover:border-[#00D2FF]/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="h-40 w-full overflow-hidden rounded-xl bg-[#0C1527] mb-4 flex items-center justify-center p-4 relative">
                <img
                  src={item.file}
                  alt={item.name}
                  className="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <span className="inline-block rounded-md bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono text-[#00D2FF] mb-2 uppercase font-bold">
                {item.type}
              </span>

              <h4 className="font-mono text-sm font-bold text-white uppercase">
                {item.name}
              </h4>
              <p className="text-xs text-gray-400 font-sans mt-1.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <HolidayRushFaq />

      <HolidayRushOrderCard />

      <Footer />
    </div>
  );
}