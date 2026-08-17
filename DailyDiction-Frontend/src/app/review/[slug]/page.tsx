import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAdvertisements, getGameReviewBySlug } from "@/lib/api"; 
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";
import { DiscordWidget } from "@/components/Sidebar";

// Helper buat bersihin URL Gambar
function formatImageUrl(imageUrl: string | null | undefined, fallback: string): string {
  if (!imageUrl) return fallback;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl.replace(/http:\/\/127\.0\.0\.1:8000\/storage\/(https?:\/\/)/, "$1");
  }
  return `https://dailydiction.id/storage/${imageUrl}`;
}

export default async function DetailReview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Narik data review dan iklan bebarengan
  const [reviewRes, adsData] = await Promise.all([
    getGameReviewBySlug(slug), 
    getAdvertisements().catch(() => null),
  ]);

  // Karena format JSON dari showReview tadi dibungkus 'data', kita ambil isinya
  const review = reviewRes?.data || reviewRes;

  if (!review) {
    notFound();
  }

  const sidebarAd = adsData?.data?.[0] || null;
  const prevReview = review.prev || null; 
  const nextReview = review.next || null;

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      {/* Kontainer Utama Tetap 1600px biar sejajar Navbar & Footer */}
      <main className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        
        {/* 👇 Konten baca dikunci di max-w-7xl (1280px) dan ditaruh di tengah (mx-auto) 👇 */}
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* ================= KOLOM KIRI (KONTEN UTAMA) ================= */}
            <div className="lg:col-span-8">
              <article>
                {/* Header Review */}
                <div className="mb-8 space-y-6">
                  
                  {/* Badge Platform */}
                  <div className="flex flex-wrap items-center gap-2">
                    {review.platform && (
                      <>
                        {(Array.isArray(review.platform) 
                          ? review.platform 
                          : (typeof review.platform === 'string' && review.platform.startsWith('[') 
                              ? JSON.parse(review.platform) 
                              : [review.platform])
                        ).map((plat: string, idx: number) => (
                          <span key={idx} className="flex items-center gap-1.5 rounded bg-brand-cyan/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-cyan border border-brand-cyan/30">
                            <Gamepad2 className="h-3.5 w-3.5" />
                            {plat}
                          </span>
                        ))}
                      </>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {review.title}
                  </h1>

                  {/* Summary / Kesimpulan Singkat */}
                  <p className="text-lg text-text-muted font-medium border-l-4 border-brand-crimson pl-4 bg-dark-card/30 p-4 rounded-r-lg">
                    {review.summary || "Baca ulasan lengkap game ini di bawah."}
                  </p>
                </div>

                {/* Body Konten Review */}
                <div
                  className="rich-text-content prose prose-invert prose-brand-crimson max-w-none text-text-primary leading-relaxed space-y-4 mb-12"
                  dangerouslySetInnerHTML={{
                    __html: typeof review.content === "string"
                      ? review.content
                      : Array.isArray(review.content)
                        ? review.content.map((b: any) => b.content ?? "").join("")
                        : "",
                  }}
                />
              </article>

              {/* ================= NAVIGASI NEXT / PREV REVIEW ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dark-border pt-8 mt-8">
                {/* Previous Review */}
                {prevReview ? (
                  <Link href={`/review/${prevReview.slug}`} className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-brand-crimson transition-colors">
                    <ChevronLeft className="h-6 w-6 text-text-muted group-hover:text-brand-crimson shrink-0" />
                    <div className="flex-1 min-w-0 text-right md:text-left">
                      <p className="text-xs font-mono text-text-muted mb-1">REVIEW SEBELUMNYA</p>
                      <h4 className="text-sm font-bold text-white truncate">{prevReview.title}</h4>
                    </div>
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img src={formatImageUrl(prevReview.thumbnail, "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800")} alt={prevReview.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  </Link>
                ) : <div />}

                {/* Next Review */}
                {nextReview ? (
                  <Link href={`/review/${nextReview.slug}`} className="group flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-brand-cyan transition-colors text-right">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md hidden sm:block">
                      <img src={formatImageUrl(nextReview.thumbnail, "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800")} alt={nextReview.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-text-muted mb-1">REVIEW SELANJUTNYA</p>
                      <h4 className="text-sm font-bold text-white truncate">{nextReview.title}</h4>
                    </div>
                    <ChevronRight className="h-6 w-6 text-text-muted group-hover:text-brand-cyan shrink-0" />
                  </Link>
                ) : <div />}
              </div>
            </div>

            {/* ================= KOLOM KANAN (SIDEBAR) ================= */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-24 space-y-8">
                
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
                    <span className="absolute top-2 right-3 text-[9px] text-text-muted/50 font-mono border border-text-muted/20 px-1 rounded">Ad</span>
                    <span className="text-xs font-mono text-text-muted">Space Iklan Dinamis</span>
                    <span className="text-[10px] font-mono text-brand-crimson/50 mt-1">Tinggi menyesuaikan gambar</span>
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