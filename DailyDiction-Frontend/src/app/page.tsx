import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import YoutubeHero from "@/components/YoutubeHero"; // <-- Import YoutubeHero ditambah di sini
import YoutubeShorts from "@/components/YoutubeShorts";
import InstagramFeed from "@/components/InstagramFeed";
import { NewsFeedCard, ReviewCard } from "@/components/Cards";
import { DiscordWidget, ReleaseRadar } from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {
  getArticles,
  getGameReviews,
  getSponsors,
  getAdvertisements,
} from "@/lib/api";
import { Flame, Star, ArrowRight } from "lucide-react";

// Memastikan Halaman Home selalu dirender ulang tanpa cache
export const revalidate = 0;

// Helper untuk membersihkan & memvalidasi URL Gambar
function formatImageUrl(
  imageUrl: string | null | undefined,
  fallback: string,
): string {
  if (!imageUrl) return fallback;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    if (imageUrl.includes("127.0.0.1:8000/storage/http")) {
      return imageUrl.replace(
        /http:\/\/127\.0\.0\.1:8000\/storage\/(https?:\/\/)/,
        "$1",
      );
    }
    return imageUrl;
  }

  return `http://127.0.0.1:8000/storage/${imageUrl}`;
}

export default async function Home() {
  const [articlesData, reviewsData, sponsorsData, adsData] = await Promise.all([
    getArticles(),
    getGameReviews(),
    getSponsors(),
    getAdvertisements(),
  ]);

  // Ekstraksi array data secara fleksibel & aman
  const articles = articlesData?.data || [];
  const reviews = Array.isArray(reviewsData)
    ? reviewsData
    : reviewsData?.data || [];
  const sponsors = sponsorsData?.data || [];
  const sidebarAd = adsData?.data?.[0] || null;

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />
      
      {/* 1. Hero Section Animasi Asli (Tetap Ada) */}
      <HeroSection />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* 2. Banner Video YouTube Panjang (Lebar Full) */}
        <YoutubeHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
          
          {/* Main Content (Kiri) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* News Feed Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-brand-crimson" />
                  <h2 className="text-lg font-black uppercase tracking-wider text-text-primary">
                    News Feed
                  </h2>
                </div>
                <a
                  href="/news"
                  className="flex items-center gap-1 text-xs font-mono font-bold text-brand-cyan hover:underline"
                >
                  <span>ALL NEWS</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((item: any) => (
                  <NewsFeedCard
                    key={item.id}
                    category={item.category}
                    categoryColor={item.category_color}
                    title={item.title}
                    summary={item.summary}
                    imageUrl={formatImageUrl(
                      item.image_url || item.image_full_url,
                      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800",
                    )}
                    slug={item.slug}
                    // 👇 TAMBAHIN DUA BARIS INI BIAR DATANYA NYAMBUNG 👇
                    author={item.author}
                    createdAt={item.created_at}
                  />
                ))}
              </div>
            </section>

            {/* Game Reviews Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <h2 className="text-lg font-black uppercase tracking-wider text-text-primary">
                    Ulasan Game Terbaru
                  </h2>
                </div>
                <a
                  href="/review"
                  className="flex items-center gap-1 text-xs font-mono font-bold text-brand-cyan hover:underline"
                >
                  <span>SEMUA REVIEW</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <ReviewCard
                      key={review.id}
                      summary={review.summary}
                      title={review.title}
                      platform={review.platform}
                      rating={review.rating}
                      imageUrl={formatImageUrl(
                        review.image_url || review.image_full_url,
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
                      )}
                      slug={review.slug}
                    />
                  ))
                ) : (
                  <p className="text-xs font-mono text-text-muted col-span-2">
                    Belum ada ulasan game yang dipublikasikan dari Admin Panel.
                  </p>
                )}
              </div>
            </section>

            {/* YouTube Shorts Section */}
            <YoutubeShorts />

            {/* Instagram Feed Section */}
            <InstagramFeed />
          </div>

          {/* Sidebar (Kanan) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="flex h-[250px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-dark-border bg-dark-bg/30 relative overflow-hidden group">
              {sidebarAd ? (
                <a
                  href={sidebarAd.url_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full block"
                >
                  <img
                    src={formatImageUrl(sidebarAd.banner_image, "")}
                    alt={sidebarAd.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2 right-3 text-[9px] text-white bg-black/50 px-1 rounded">
                    Ad
                  </span>
                </a>
              ) : (
                <>
                  <span className="absolute top-2 right-3 text-[9px] text-text-muted/50 font-mono border border-text-muted/20 px-1 rounded">
                    Ad
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    Space Iklan Google Ads
                  </span>
                  <span className="text-[10px] font-mono text-brand-crimson/50 mt-1">
                    300 x 250 px
                  </span>
                </>
              )}
            </div>

            <DiscordWidget />
            <ReleaseRadar />
          </aside>
        </div>
      </main>

      {/* Sponsor Area */}
      <section className="bg-dark-bg pt-10 pb-0 border-b border-dark-border/10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="text-xs font-mono text-text-muted mb-8 tracking-widest uppercase flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
            Sponsored by
          </div>

          <div className="w-full relative flex overflow-x-hidden">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-100%); }
              }
              .animate-marquee {
                display: flex;
                animation: marquee 20s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>

            <div className="animate-marquee whitespace-nowrap flex items-center">
              {/* Kelompok Logo 1 */}
              <div className="flex items-center justify-around min-w-full gap-16 px-8 opacity-40 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100">
                {sponsors.length > 0 ? (
                  sponsors.map((sponsor: any) => (
                    <img
                      key={`group1-${sponsor.id}`}
                      src={formatImageUrl(sponsor.logo_image, "")}
                      alt={sponsor.name}
                      className="h-10 md:h-14 object-contain"
                    />
                  ))
                ) : (
                  <h3 className="text-sm font-mono text-text-muted">
                    Belum ada sponsor
                  </h3>
                )}
              </div>

              {/* Kelompok Logo 2 */}
              <div className="flex items-center justify-around min-w-full gap-16 px-8 opacity-40 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100">
                {sponsors.length > 0 ? (
                  sponsors.map((sponsor: any) => (
                    <img
                      key={`group2-${sponsor.id}`}
                      src={formatImageUrl(sponsor.logo_image, "")}
                      alt={sponsor.name}
                      className="h-10 md:h-14 object-contain"
                    />
                  ))
                ) : (
                  <h3 className="text-sm font-mono text-text-muted">
                    Belum ada sponsor
                  </h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}