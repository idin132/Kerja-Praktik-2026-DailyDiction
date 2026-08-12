import { Disc as DiscordIcon, Calendar, ArrowRight } from "lucide-react";

export function DiscordWidget() {
  return (
    <div className="bg-gradient-to-br from-indigo-900/60 to-purple-950/40 border border-indigo-700/50 p-6 rounded-2xl text-center shadow-xl relative overflow-hidden group">
      {/* Background Discord Icon */}
      <div className="absolute -right-8 -top-8 text-indigo-500/10 pointer-events-none transform group-hover:scale-110 transition-transform">
        <svg viewBox="0 0 24 24" className="w-40 h-40 fill-current">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.213.385-.444.905-.608 1.315a18.27 18.27 0 0 0-5.648 0c-.164-.41-.4-.93-.615-1.315A19.736 19.736 0 0 0 3.67 4.37C.533 9.046-.319 13.608.106 18.11a19.98 19.98 0 0 0 6.002 3.03c.49-.67.924-1.38 1.293-2.13-.71-.27-1.39-.61-2.04-1.01.17-.125.337-.255.5-.39 3.93 1.84 8.18 1.84 12.06 0 .164.135.33.265.5.39-.65.4-1.33.74-2.04 1.01.37.75.8 1.46 1.29 2.13a19.98 19.98 0 0 0 6.006-3.03c.5-5.22-.85-9.74-3.36-13.74ZM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
        </svg>
      </div>

      {/* Discord Icon */}
      <svg
        viewBox="0 0 24 24"
        className="w-14 h-14 fill-indigo-400 mx-auto mb-4 animate-bounce"
        aria-hidden="true"
      >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.213.385-.444.905-.608 1.315a18.27 18.27 0 0 0-5.648 0c-.164-.41-.4-.93-.615-1.315A19.736 19.736 0 0 0 3.67 4.37C.533 9.046-.319 13.608.106 18.11a19.98 19.98 0 0 0 6.002 3.03c.49-.67.924-1.38 1.293-2.13-.71-.27-1.39-.61-2.04-1.01.17-.125.337-.255.5-.39 3.93 1.84 8.18 1.84 12.06 0 .164.135.33.265.5.39-.65.4-1.33.74-2.04 1.01.37.75.8 1.46 1.29 2.13a19.98 19.98 0 0 0 6.006-3.03c.5-5.22-.85-9.74-3.36-13.74ZM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.21 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
      </svg>

      <h3 className="text-xl font-gaming font-extrabold text-white">
        TEMPAT NONGKRONG GAMER
      </h3>

      <p className="text-slate-300 text-xs mt-2 mb-6 leading-relaxed">
        Join server Discord Daily Diction buat mabar, berbagi info gacha, pamer spek
        PC, atau sekadar gibahin industri pop culture!
      </p>

      <a
        href="#"
        className="block bg-white text-indigo-900 font-bold text-sm py-3 px-6 rounded-xl hover:bg-slate-100 transition-colors shadow-md relative z-10"
      >
        Masuk Server (Gratis)
      </a>
    </div>
  );
}

export function ReleaseRadar() {
  const releases = [
    {
      title: "The First Descendant",
      date: "02 JULI",
      platform: "PC, PS5, XBOX",
    },
    {
      title: "Zenless Zone Zero",
      date: "04 JULI",
      platform: "PC, MOBILE, PS5",
    },
    { title: "Kunitsu-Gami", date: "19 JULI", platform: "MULTIPLATTFORM" },
  ];

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card p-5">
      <div className="flex items-center justify-between border-b border-dark-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
          <Calendar className="h-4 w-4 text-brand-crimson" />
          <span>RELEASE RADAR</span>
        </div>
        <span className="text-[10px] font-mono text-brand-cyan font-bold">
          JULI 2026
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {releases.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg border border-dark-border/50 bg-dark-bg/50 p-3"
          >
            <div>
              <p className="text-xs font-bold text-text-primary">
                {item.title}
              </p>
              <p className="text-[10px] font-mono text-text-muted mt-0.5">
                {item.platform}
              </p>
            </div>
            <span className="rounded bg-brand-crimson/20 border border-brand-crimson/40 px-2 py-1 text-[10px] font-mono font-bold text-brand-crimson">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
