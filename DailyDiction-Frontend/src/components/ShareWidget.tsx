"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FaFacebookF, 
  FaXTwitter, 
  FaWhatsapp, 
  FaInstagram, 
  FaTelegram, 
  FaLinkedinIn,
  FaShareNodes
} from "react-icons/fa6";
import { Link2, Check, X } from "lucide-react";

interface ShareWidgetProps {
  title: string;
}

export default function ShareWidget({ title }: ShareWidgetProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Tutup floating menu jika user klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
        setIsOpenMobile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent((title ? title + " - " : "") + currentUrl)}`,
      bgClass: "bg-[#25D366] text-white hover:brightness-110",
    },
    {
      name: "X (Twitter)",
      icon: FaXTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title || "")}&url=${encodeURIComponent(currentUrl)}`,
      bgClass: "bg-black text-white hover:bg-neutral-800",
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      bgClass: "bg-[#1877F2] text-white hover:brightness-110",
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title || "")}`,
      bgClass: "bg-[#229ED9] text-white hover:brightness-110",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      bgClass: "bg-[#0A66C2] text-white hover:brightness-110",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://www.instagram.com/",
      bgClass: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white",
    },
  ];

  return (
    <>
      {/* ================= TAMPILAN DESKTOP (SIDEBAR) ================= */}
      <div className="hidden lg:block w-full max-w-[320px] mx-auto rounded-2xl border border-dark-border bg-dark-card/60 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-brand-crimson animate-pulse" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted">
            Share This Website
          </h3>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {shareLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Share on ${item.name}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark-border bg-dark-bg/80 text-text-muted transition-all duration-200 hover:text-white hover:scale-105 active:scale-95"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}

          <button
            onClick={handleCopy}
            title="Salin Link"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark-border bg-dark-bg/80 text-text-muted transition-all duration-200 hover:border-brand-cyan hover:text-brand-cyan hover:scale-105 active:scale-95"
          >
            {copied ? <Check className="h-4 w-4 text-brand-cyan" /> : <Link2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ================= TAMPILAN MOBILE (SINGLE FLOATING BUTTON + POPUP) ================= */}
      <div ref={mobileRef} className="fixed right-4 bottom-24 z-[999] flex flex-col items-end lg:hidden">
        
        {/* Menu Pilihan Share yang Muncul Saat Tombol Diklik */}
        {isOpenMobile && (
          <div className="mb-3 flex flex-col gap-2.5 rounded-2xl border border-dark-border/80 bg-black/90 p-2.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
            {shareLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpenMobile(false)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform active:scale-90 shadow-md ${item.bgClass}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}

            <button
              onClick={handleCopy}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-card border border-white/20 text-white transition-transform active:scale-90"
            >
              {copied ? <Check className="h-4 w-4 text-brand-cyan" /> : <Link2 className="h-4 w-4" />}
            </button>
          </div>
        )}

        {/* Tombol Utama Mengambang (Toggle Open / Close) */}
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          aria-label="Share options"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-crimson text-white shadow-[0_0_20px_rgba(255,62,62,0.6)] border border-white/20 active:scale-90 transition-all duration-200"
        >
          {isOpenMobile ? <X className="h-5 w-5" /> : <FaShareNodes className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
}