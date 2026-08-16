import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGameReviews } from "@/lib/api";
import { Gamepad2, Search, Trophy } from "lucide-react";
import Link from "next/link";

// Biar halamannya selalu ambil data terbaru tanpa nyangkut di cache
export const revalidate = 0;

// Helper ajaib biar gambar dari backend kebaca sempurna
function formatImageUrl(imageUrl: string | null | undefined, fallback: string): string {
  if (!imageUrl) return fallback;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    if (imageUrl.includes("127.0.0.1:8000/storage/http")) {
      return imageUrl.replace(/http:\/\/127\.0\.0\.1:8000\/storage\/(https?:\/\/)/, "$1");
    }
    return imageUrl;
  }
  return `http://127.0.0.1:8000/storage/${imageUrl}`;
}

export default async function ReviewPage() {
  const reviewsData = await getGameReviews();
  const reviews = Array.isArray(reviewsData) ? reviewsData : (reviewsData?.data || []);

  // Ambil review urutan pertama buat ditaruh di "Featured Review" (kartu paling gede)
  const featuredReview = reviews.length > 0 ? reviews[0] : null;

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        
        {/* ============ HEADER ============ */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-dark-border/50 pb-8">
          <div>
            <span className="mb-2 flex w-max items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold tracking-wider text-yellow-500">
              <Trophy className="h-4 w-4" />
              ULASAN JUJUR & INDEPENDEN
            </span>
            <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              Game Reviews
            </h1>
            <p className="mt-4 max-w-2xl text-text-muted">
              Analisis mendalam, kelebihan, kekurangan, serta penilaian objektif untuk game-game konsol & PC terbaru oleh tim redaksi Daily Diction.
            </p>
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Cari judul game..."
              className="w-full rounded-xl border border-dark-border bg-dark-card py-3 pl-10 pr-4 text-sm text-white placeholder-text-muted/50 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan"
            />
          </div>
        </div>

        {/* ============ FEATURED REVIEW (PALING ATAS) ============ */}
        {featuredReview && (
          <div className="mb-12">
            <Link href={`/review/${featuredReview.slug}`} className="group block overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-colors hover:border-brand-cyan/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                
                {/* Gambar Featured */}
                <div className="relative aspect-video md:aspect-auto lg:col-span-3 overflow-hidden">
                  <img
                    src={formatImageUrl(featuredReview.image_url || featuredReview.image_full_url, "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800")}
                    alt={featuredReview.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded bg-brand-crimson px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                    Featured Review
                  </span>
                </div>
                
                {/* Teks Featured */}
                <div className="flex flex-col justify-center p-6 md:p-8 lg:col-span-2 lg:p-12">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {/* Looping Array Platform Baru */}
                    {(Array.isArray(featuredReview.platform) 
                      ? featuredReview.platform 
                      : (typeof featuredReview.platform === 'string' && featuredReview.platform.startsWith('[') 
                          ? JSON.parse(featuredReview.platform) 
                          : [featuredReview.platform])
                    ).map((plat: string, idx: number) => (
                      <span key={idx} className="flex items-center gap-1.5 rounded bg-brand-cyan/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-cyan border border-brand-cyan/30">
                        {plat}
                      </span>
                    ))}
                    {/* Bintang Rating Dihapus di Sini */}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-white group-hover:text-brand-cyan transition-colors line-clamp-2">
                    {featuredReview.title}
                  </h2>
                  <p className="mt-4 text-text-muted line-clamp-3 leading-relaxed">
                    {featuredReview.summary}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-cyan transition-colors">
                    BACA ULASAN LENGKAP &rarr;
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ============ FILTER BUTTONS ============ */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          <span className="flex items-center gap-2 text-xs font-mono text-text-muted uppercase tracking-widest mr-2">
             FILTER:
          </span>
          {['ALL', 'PC', 'PS5', 'SWITCH', 'XBOX'].map((filter, i) => (
            <button key={i} className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${i === 0 ? 'bg-brand-crimson text-white' : 'bg-dark-card border border-dark-border text-text-muted hover:border-brand-crimson/50 hover:text-white'}`}>
              {filter}
            </button>
          ))}
        </div>

        {/* ============ GRID REVIEW BAWAH ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reviews.map((review: any) => {
            // Pengaman format data platform
            const platforms = Array.isArray(review.platform) 
              ? review.platform 
              : (typeof review.platform === 'string' && review.platform.startsWith('[') 
                  ? JSON.parse(review.platform) 
                  : [review.platform]);

            return (
              <Link key={review.id} href={`/review/${review.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-dark-border bg-dark-card transition-colors hover:border-brand-cyan/50 hover:shadow-lg">
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-dark-border/50">
                  <img
                    src={formatImageUrl(review.image_url || review.image_full_url, "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800")}
                    alt={review.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Badge Platform di Pojok Kiri Atas Gambar */}
                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {platforms.map((plat: string, idx: number) => (
                       <span key={idx} className="rounded bg-black/60 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-cyan backdrop-blur-sm border border-brand-cyan/30">
                         {plat}
                       </span>
                    ))}
                  </div>
                  {/* Bintang Rating di Kanan Atas Gambar Dihapus */}
                </div>
                
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-2">
                      {review.title}
                    </h3>
                    <p className="mt-2 text-xs text-text-muted line-clamp-3">
                      {review.summary}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-dark-border/60 pt-4">
                    <span className="text-[10px] font-mono text-text-muted">
                      {new Date(review.created_at || new Date()).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">
                      Baca Review &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}