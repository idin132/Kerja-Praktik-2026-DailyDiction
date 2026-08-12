"use client";

import { motion } from "framer-motion";
import { Play, ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[550px] w-full overflow-hidden border-b border-dark-border">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center scale-100 filter brightness-125 contrast-125"
      >
        <source src="/videos/resident-evil.mp4" type="video/mp4" />
      </video>

      {/* <img
        src="/videos/elden-ring.jpg"
        alt="genshin-impact-hero"
        className="absolute inset-0 h-full w-full object-cover object-center scale-105 brightness-75"
      /> */}

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/90 via-dark-bg/40 to-transparent" />

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 rounded-full border border-brand-crimson/40 bg-brand-crimson/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest text-brand-crimson backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            <span>Berita Utama</span>
          </div> */}

          {/* Title */}
          <h1 className="mt-4 text-3xl font-black tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.1]">
            Resident Evil 4 Remake: <span className="text-brand-crimson">Kembalinya</span> Game Horor Legendaris
            {/* Temukan <span className="text-brand-crimson">Update</span> Terbaru
            <br />
            <span className="text-brand-crimson">Genshin Impact</span> di Sini */}
          </h1>

          {/* Description */}
          <p className="mt-4 text-sm sm:text-base text-text-muted line-clamp-2 leading-relaxed">
            Resident Evil 4 Remake menghadirkan pengalaman horor yang lebih mendalam dengan grafis yang memukau, 
            gameplay yang diperbarui, dan cerita yang lebih intens. Bergabunglah dalam petualangan menegangkan ini dan 
            rasakan kembali ketegangan dari game horor legendaris ini.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#baca"
              className="flex items-center gap-2 rounded-lg bg-brand-crimson px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-brand-crimson/90 hover:shadow-[0_0_20px_rgba(255,62,62,0.5)]"
            >
              <span>Baca Artikel</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            {/* <button className="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-card/60 px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-primary backdrop-blur-md transition-all hover:border-brand-cyan hover:text-brand-cyan">
              <Play className="h-4 w-4 fill-current" />
              <span>Lihat Trailer</span>
            </button> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
