import Link from "next/link";
import { FaYoutube, FaTwitter } from "react-icons/fa";

// Icon Instagram kustom (karena Lucide tidak memiliki Instagram native di versi ini)
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5C22 19.55 19.55 22 16.25 22h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2Zm0 1.5C5.4 3.5 3.5 5.4 3.5 7.75v8.5C3.5 18.6 5.4 20.5 7.75 20.5h8.5c2.35 0 4.25-1.9 4.25-4.25v-8.5C20.5 5.4 18.6 3.5 16.25 3.5h-8.5Zm8.25 2.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-4.25 1a5.75 5.75 0 1 1 0 11.5 5.75 5.75 0 0 1 0-11.5Zm0 1.5a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5Z" />
    </svg>
  );
}

// Icon TikTok kustom (karena Lucide tidak memiliki TikTok native)
function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12.525 2.25c1.31 0 2.454.02 3.558.078v4.01a6.39 6.39 0 0 1-3.55-.953v8.94c0 3.328-2.697 6.025-6.025 6.025-3.328 0-6.025-2.697-6.025-6.025 0-3.328 2.697-6.025 6.025-6.025.43 0 .85.045 1.258.13V12.5a2.023 2.023 0 0 0-1.258-.415c-1.12 0-2.025.905-2.025 2.025s.905 2.025 2.025 2.025c1.12 0 2.025-.905 2.025-2.025V2.25h3.992z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-dark-border bg-dark-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Info (Spans 2 columns on medium+ screens) */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-xl font-black tracking-wider text-text-primary group"
            >
              <img
                src="/image/logo-dd.png"
                alt="Daily Diction Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex items-center gap-1">
                DAILY<span className="text-brand-yellow">DICTION</span>
                <span className="h-2 w-2 rounded-full bg-brand-yellow animate-pulse" />
              </div>
            </Link>

            <p className="max-w-sm text-sm text-text-muted leading-relaxed">
              Situs portal berita, media review jujur, dan wadah berkumpulnya
              komunitas gamer paling santai di Indonesia. Dapatkan update game &
              pop-culture harianmu di sini!
            </p>
          </div>

          {/* Navigasi Kategori */}
          <div>
            <h4 className="mb-4 text-xs font-mono font-bold uppercase tracking-widest text-text-primary">
              Kategori
            </h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li>
                <Link
                  href="/news"
                  className="transition-colors hover:text-brand-crimson"
                >
                  Berita Utama
                </Link>
              </li>
              <li>
                <Link
                  href="/review"
                  className="transition-colors hover:text-brand-crimson"
                >
                  Ulasan Komplit
                </Link>
              </li>
              {/* <li>
                <Link href="/hardware" className="transition-colors hover:text-brand-crimson">
                  Spesifikasi Hardware
                </Link>
              </li>
              <li>
                <Link href="/pop-culture" className="transition-colors hover:text-brand-crimson">
                  Kultur Pop & Anime
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="mb-4 text-xs font-mono font-bold uppercase tracking-widest text-text-primary">
              Media Sosial
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://www.youtube.com/@WORGameID"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube Daily Diction"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-border bg-dark-card text-text-muted transition-all hover:border-brand-crimson hover:text-brand-crimson"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="https://www.instagram.com/anaktua_"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-border bg-dark-card text-text-muted transition-all hover:border-brand-crimson hover:text-brand-crimson"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@sianaktua"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-border bg-dark-card text-text-muted transition-all hover:border-brand-crimson hover:text-brand-crimson"
              >
                <TiktokIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-border bg-dark-card text-text-muted transition-all hover:border-brand-crimson hover:text-brand-crimson"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-dark-border/60 pt-6 text-xs text-text-muted sm:flex-row font-mono">
          <p>© 2026 Daily Diction. All rights reserved.</p>

          {/* <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-text-primary hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-text-primary hover:underline">
              Terms of Service
            </Link>
            <Link href="/about" className="transition-colors hover:text-text-primary hover:underline">
              About Us
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
