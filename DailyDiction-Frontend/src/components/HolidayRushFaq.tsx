"use client";

import React, { useState } from "react";
import { Plus, X, HelpCircle } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer?: string;
  items?: string[]; // Ditambahkan untuk penanganan poin-poin
}

export default function HolidayRushFaq() {
  const [openId, setOpenId] = useState<string | null>("01"); // Dibenerin: Default item 01 terbuka

  const faqs: FaqItem[] = [
    {
      id: "01",
      question: "Apa itu Holiday Rush?",
      answer:
        "Sebuah boardgame dengan genre party games yang mudah dipelajari dan seru banget untuk main bareng teman dan keluarga.",
    },
    {
      id: "02",
      question: "Kapan estimasi pengiriman?",
      answer: "1 hari setelah konfirmasi pembayaran.",
    },
    {
      id: "03",
      question: "Apa saja isi box?",
      items: [
        "1 buku panduan",
        "1 map board",
        "32 kartu efek",
        "32 kartu langkah",
        "5 pion karakter",
        "7 poin lubang jalan",
      ],
    },
    {
      id: "04",
      question: "Berapa maksimal pembelian?",
      answer: "Tidak ada minimum maupun batasan maksimal pembelian.",
    },
    {
      id: "05",
      question: "Metode pembayarannya apa saja?",
      answer: "Direct Transfer via Bank yang tertera pada Google Form pemesanan.",
    },
    {
      id: "06",
      question: "Bagaimana dengan ongkir?",
      answer:
        "Dihitung pada saat pemesanan, dengan menginformasikan alamat lengkap Anda pada tim kami.",
    },
  ];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full max-w-7xl mx-auto my-16 px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/10 bg-[#121826] p-6 sm:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* KOLOM KIRI: Judul Section */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 px-3.5 py-1 font-mono text-xs font-bold text-[#FFD700] uppercase">
              <HelpCircle className="h-4 w-4" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tight text-white leading-none">
              YANG SERING <br />
              <span className="text-[#FFD700]">DITANYAIN.</span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed max-w-md">
              Kalau jawabannya nggak ada di sini, kamu bisa langsung tanyakan via Google Form pemesanan atau kontak official kami.
            </p>
          </div>

          {/* KOLOM KANAN: Accordion List FAQ */}
          <div className="lg:col-span-7 divide-y divide-white/10 border-t border-b border-white/10">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div key={faq.id} className="py-4 transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between gap-4 text-left font-mono group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-gray-500 group-hover:text-[#00D2FF] transition-colors">
                        {faq.id}
                      </span>
                      <h3
                        className={`text-sm sm:text-base font-bold transition-colors ${
                          isOpen ? "text-[#FFD700]" : "text-white group-hover:text-[#FFD700]"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* Ikon Tombol Plus/Minus */}
                    <div
                      className={`h-7 w-7 shrink-0 rounded-lg flex items-center justify-center border transition-all ${
                        isOpen
                          ? "bg-[#FF3E3E] border-[#FF3E3E] text-white"
                          : "bg-white/5 border-white/10 text-gray-400 group-hover:border-[#FFD700] group-hover:text-[#FFD700]"
                      }`}
                    >
                      {isOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>

                  {/* Isi Jawaban */}
                  {isOpen && (
                    <div className="mt-3 pl-8 sm:pl-9 pr-4 text-xs sm:text-sm text-gray-300 font-sans leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.items ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          {faq.items.map((item, itemIdx) => (
                            <li
                              key={itemIdx}
                              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 font-mono text-xs text-gray-200"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-[#00D2FF] shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{faq.answer}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}