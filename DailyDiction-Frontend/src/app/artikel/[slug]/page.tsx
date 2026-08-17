import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getArticleBySlug, getAdvertisements } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DiscordWidget } from "@/components/Sidebar";
import ShareWidget from "@/components/ShareWidget";
import { User, Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

// Helper buat bersihin URL Gambar
function formatImageUrl(
  imageUrl: string | null | undefined,
  fallback: string
): string {
  if (!imageUrl) return fallback;

  // Jika sudah berupa URL lengkap (http/https), langsung return
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Jika path diawali 'storage/', hilangkan slash depan jika ada
  const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;

  if (cleanPath.startsWith("storage/")) {
    return `https://dailydiction.id/${cleanPath}`;
  }

  return `https://dailydiction.id/storage/${cleanPath}`;
}

export default async function DetailArtikel({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [article, adsData] = await Promise.all([
    getArticleBySlug(slug),
    getAdvertisements().catch(() => null),
  ]);

  if (!article) {
    notFound();
  }

  const sidebarAd = adsData?.data?.[0] || null;
  const prevArticle = article.prev || null;
  const nextArticle = article.next || null;

  // Pengaman format kategori (bisa string tunggal atau array dari tags input)
  let categoryList: string[] = [];
  if (Array.isArray(article.category)) {
    categoryList = article.category;
  } else if (typeof article.category === "string") {
    try {
      categoryList = article.category.startsWith("[")
        ? JSON.parse(article.category)
        : [article.category];
    } catch {
      categoryList = [article.category];
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {/* Konten baca dikunci di max-w-7xl (1280px) dan ditaruh di tengah */}
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* ================= KOLOM KIRI (KONTEN UTAMA) ================= */}
            <div className="lg:col-span-8">
              <article>
                {/* Header Artikel */}
                <div className="mb-8 space-y-6">
                  {/* Badge Kategori Dinamis */}
                  <div className="flex flex-wrap items-center gap-2">
                    {categoryList.length > 0 ? (
                      categoryList.map((cat, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-brand-cyan/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-cyan border border-brand-cyan/30"
                        >
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="rounded bg-brand-cyan/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-cyan border border-brand-cyan/30">
                        Berita Utama
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {article.title}
                  </h1>

                  {/* Info Bar */}
                  <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-text-muted border-y border-dark-border py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-brand-crimson" />
                      <span className="font-bold text-white">
                        {article.author || "Redaksi"}
                      </span>
                    </div>

                    {article.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(article.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}

                    {article.read_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{article.read_time}</span>
                      </div>
                    )}
                  </div>

                  {/* THUMBNAIL UTAMA ARTIKEL */}
                  <div className="mb-10 w-full overflow-hidden rounded-2xl border border-dark-border bg-dark-card shadow-2xl">
                    <img
                      src={formatImageUrl(
                        article.image_url ||
                          article.image ||
                          article.thumbnail ||
                          article.banner_image,
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600"
                      )}
                      alt={article.title}
                      className="w-full aspect-[16/9] object-cover"
                    />
                  </div>

                  <p className="text-base sm:text-lg text-text-muted font-medium border-l-4 border-brand-crimson pl-4 bg-dark-card/30 p-4 rounded-r-lg">
                    {article.summary ||
                      "Simak berita selengkapnya di bawah ini."}
                  </p>
                </div>

                {/* Body Artikel (Tiptap HTML) */}
                <div
                  className="rich-text-content prose prose-invert prose-brand-crimson max-w-none text-text-primary leading-relaxed space-y-4 mb-12"
                  dangerouslySetInnerHTML={{
                    __html:
                      typeof article.content === "string"
                        ? article.content
                        : Array.isArray(article.content)
                        ? article.content
                            .map((b: any) => b.content ?? "")
                            .join("")
                        : "",
                  }}
                />
              </article>

              {/* ================= NAVIGASI NEXT / PREV ARTIKEL ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dark-border pt-8 mt-8">
                {prevArticle ? (
                  <Link
                    href={`/artikel/${prevArticle.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-brand-crimson transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-text-muted group-hover:text-brand-crimson shrink-0" />
                    <div className="flex-1 min-w-0 text-right md:text-left">
                      <p className="text-xs font-mono text-text-muted mb-1">
                        ARTIKEL SEBELUMNYA
                      </p>
                      <h4 className="text-sm font-bold text-white truncate">
                        {prevArticle.title}
                      </h4>
                    </div>
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img
                        src={formatImageUrl(
                          prevArticle.thumbnail || prevArticle.image,
                          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"
                        )}
                        alt={prevArticle.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextArticle ? (
                  <Link
                    href={`/artikel/${nextArticle.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-brand-cyan transition-colors text-right"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img
                        src={formatImageUrl(
                          nextArticle.thumbnail || nextArticle.image,
                          "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800"
                        )}
                        alt={nextArticle.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-text-muted mb-1">
                        ARTIKEL SELANJUTNYA
                      </p>
                      <h4 className="text-sm font-bold text-white truncate">
                        {nextArticle.title}
                      </h4>
                    </div>
                    <ChevronRight className="h-6 w-6 text-text-muted group-hover:text-brand-cyan shrink-0" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>

            {/* ================= KOLOM KANAN (SIDEBAR) ================= */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-24 space-y-6">
                {/* SHARE WIDGET (DESKTOP SIDEBAR + FLOATING MOBILE) */}
                <ShareWidget title={article.title} />

                {/* Space Iklan Dinamis */}
                {sidebarAd ? (
                  <a
                    href={sidebarAd.url_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full max-w-[320px] mx-auto overflow-hidden rounded-xl group border border-dark-border/30 shadow-xl"
                  >
                    <img
                      src={formatImageUrl(sidebarAd.banner_image, "")}
                      alt={sidebarAd.title}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2 right-3 text-[9px] font-black tracking-widest text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                      AD
                    </span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-dark-border bg-dark-bg/30 relative overflow-hidden aspect-[3/4] w-full max-w-[320px] mx-auto">
                    <span className="absolute top-2 right-3 text-[9px] text-text-muted/50 font-mono border border-text-muted/20 px-1 rounded">
                      Ad
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      Space Iklan Dinamis
                    </span>
                    <span className="text-[10px] font-mono text-brand-crimson/50 mt-1">
                      Tinggi menyesuaikan gambar
                    </span>
                  </div>
                )}

                {/* Widget Discord */}
                <div className="w-full max-w-[320px] mx-auto">
                  <DiscordWidget />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .rich-text-content {
            font-size: 1.125rem;
            line-height: 1.75;
            color: #d1d5db;
          }
          .rich-text-content p { margin-bottom: 1.5em; }
          .rich-text-content h2,
          .rich-text-content h3 {
            color: white;
            font-weight: 900;
            margin-top: 2em;
            margin-bottom: 0.75em;
          }
          .rich-text-content img {
            width: 100%;
            height: auto;
            border-radius: 0.75rem;
            margin-top: 2rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .rich-text-content a {
            color: #00e5ff;
            text-decoration: none;
          }
          .rich-text-content a:hover { text-decoration: underline; }
          .rich-text-content strong { color: white; }
          .rich-text-content iframe {
            width: 100%;
            aspect-ratio: 16/9;
            border-radius: 0.75rem;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
          }
        `,
        }}
      />
    </div>
  );
}
