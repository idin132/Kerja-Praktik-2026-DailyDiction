import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { NewsFeedCard, ReviewCard } from "@/components/Cards";
import { DiscordWidget, ReleaseRadar } from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { getArticles, getGameReviews } from "@/lib/api";
import { Flame, Star, ArrowRight } from "lucide-react";


export default async function Home() {
  // Fetch paralel data Artikel dan Game Reviews dari Laravel
  const [articlesData, reviews] = await Promise.all([
    getArticles(),
    getGameReviews(),
  ]);

  const articles = articlesData?.data || [];

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />
      <HeroSection />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (8 Columns) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* News Feed Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-brand-crimson" />
                  <h2 className="text-lg font-black uppercase tracking-wider text-text-primary">News Feed</h2>
                </div>
                <a href="/news" className="flex items-center gap-1 text-xs font-mono font-bold text-brand-cyan hover:underline">
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
                    imageUrl={item.image_full_url || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"}
                    slug={item.slug}
                  />
                ))}
              </div>
            </section>

            {/* Game Reviews Section (Dinamis dari Laravel) */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <h2 className="text-lg font-black uppercase tracking-wider text-text-primary">Ulasan Game Terbaru</h2>
                </div>
                <a href="/review" className="flex items-center gap-1 text-xs font-mono font-bold text-brand-cyan hover:underline">
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
                      imageUrl={review.image_full_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800"}
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

          </div>

          {/* Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 space-y-8">
            <DiscordWidget />
            <ReleaseRadar />
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}