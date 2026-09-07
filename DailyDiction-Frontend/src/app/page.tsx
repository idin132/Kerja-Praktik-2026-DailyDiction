import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import YoutubeHero from "@/components/YoutubeHero";
import YoutubeShorts from "@/components/YoutubeShorts";
import TechSection from "@/components/TechSection";
import EntertainmentSection from "@/components/EntertainmentSection";
import AdCarousel from "@/components/AdCarousel";
import { NewsFeedCard, ReviewCard } from "@/components/Cards";
import { DiscordWidget } from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { getArticles, getGameReviews, getAdvertisements } from "@/lib/api";
import { getYouTubeVideos } from "@/lib/youtube";
import { Flame, Star, ArrowRight } from "lucide-react";

export const revalidate = 0;

function formatImageUrl(
  imageUrl: string | null | undefined,
  fallback: string,
): string {
  if (!imageUrl) return fallback;

  if (imageUrl.includes("dailydiction.id/storage/")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    if (imageUrl.includes("https://dailydiction.id/storage/http")) {
      return imageUrl.replace(
        /http:\/\/127\.0\.0\.1:8000\/storage\/(https?:\/\/)/,
        "$1",
      );
    }
    return imageUrl;
  }

  return `https://dailydiction.id/storage/${imageUrl}`;
}

export default async function Home() {
  const [articlesData, reviewsData, adsData, allYouTubeVideos] =
    await Promise.all([
      getArticles().catch(() => ({ data: [] })),
      getGameReviews().catch(() => ({ data: [] })),
      getAdvertisements().catch(() => ({ data: [] })),
      getYouTubeVideos(50).catch(() => []),
    ]);

  const rawArticles = Array.isArray(articlesData)
    ? articlesData
    : articlesData?.data || [];
  let reviews = Array.isArray(reviewsData)
    ? reviewsData
    : reviewsData?.data || [];

  const adsList: any[] = adsData?.data || (Array.isArray(adsData) ? adsData : []);

  // PEMFILTERAN IKLAN PRESISI BERDASARKAN POSISI
  const horizontalBannerAds = adsList.filter(
    (ad: any) => ad.position === "horizontal"
  );

  const sidebarAds = adsList.filter(
    (ad: any) => ad.position === "sidebar"
  );

  const isReviewItem = (item: any) => {
    if (
      item.type?.toLowerCase() === "review" ||
      item.type?.toLowerCase() === "reviews"
    ) {
      return true;
    }

    const cats = [
      ...(Array.isArray(item.category_input)
        ? item.category_input
        : [item.category_input]),
      ...(Array.isArray(item.category) ? item.category : [item.category]),
      ...(Array.isArray(item.categories)
        ? item.categories.map((c: any) => c.name)
        : []),
    ]
      .filter(Boolean)
      .map((c) => String(c).toUpperCase());

    return cats.some((cat) => cat.includes("REVIEW") || cat.includes("ULASAN"));
  };

  const newsArticles = rawArticles.filter((item: any) => !isReviewItem(item));

  if (reviews.length === 0) {
    reviews = rawArticles.filter((item: any) => isReviewItem(item));
  }

  const getDurationInSeconds = (duration: string) => {
    let hours = 0,
      minutes = 0,
      seconds = 0;
    const hMatch = duration.match(/(\d+)H/);
    const mMatch = duration.match(/(\d+)M/);
    const sMatch = duration.match(/(\d+)S/);

    if (hMatch) hours = parseInt(hMatch[1]);
    if (mMatch) minutes = parseInt(mMatch[1]);
    if (sMatch) seconds = parseInt(sMatch[1]);

    return hours * 3600 + minutes * 60 + seconds;
  };

  const shortsList = allYouTubeVideos.filter((vid: any) => {
    const durationStr = vid.contentDetails?.duration || "";
    const durationSec = getDurationInSeconds(durationStr);
    const title = vid.snippet?.title?.toLowerCase() || "";
    const desc = vid.snippet?.description?.toLowerCase() || "";

    return (
      durationSec <= 180 || title.includes("#short") || desc.includes("#short")
    );
  });

  const longVideosList = allYouTubeVideos.filter((vid: any) => {
    const durationStr = vid.contentDetails?.duration || "";
    const durationSec = getDurationInSeconds(durationStr);
    const title = vid.snippet?.title?.toLowerCase() || "";
    const desc = vid.snippet?.description?.toLowerCase() || "";

    const isShort =
      durationSec <= 180 || title.includes("#short") || desc.includes("#short");

    return !isShort;
  });

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-[#FFD700] selection:text-black">
      <Navbar />
      <HeroSection />

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <YoutubeHero videos={longVideosList} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12 mt-8">
          {/* KOLOM KIRI */}
          <div className="lg:col-span-8 2xl:col-span-9 space-y-8 2xl:space-y-12">
            {/* BANNER HORIZONTAL */}
            <div className="w-full aspect-[4/1] sm:aspect-[6/1] md:aspect-[8/1] max-h-[160px] rounded-xl border border-dashed border-dark-border bg-dark-bg/30 relative overflow-hidden">
              <AdCarousel
                ads={horizontalBannerAds}
                interval={5000}
                fallbackText="Space Iklan Horizontal"
                dimensions="1200 x 250 px"
                objectFit="object-contain"
              />
            </div>

            {/* News Feed Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-[#FFD700]" />
                  <h2 className="text-lg font-black uppercase tracking-wider text-text-primary">
                    News Feed
                  </h2>
                </div>
                <a
                  href="/news"
                  className="flex items-center gap-1 text-xs font-mono font-bold text-[#FFD700] hover:underline hover:opacity-80 transition-opacity"
                >
                  <span>ALL NEWS</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {newsArticles.slice(0, 6).map((item: any) => {
                  let finalCategory = ["Berita"];

                  if (item.category_input && item.category_input.length > 0) {
                    finalCategory = item.category_input;
                  } else if (item.category && item.category.length > 0) {
                    finalCategory = item.category;
                  } else if (item.categories && item.categories.length > 0) {
                    finalCategory = item.categories.map((c: any) => c.name);
                  }

                  return (
                    <NewsFeedCard
                      key={item.id}
                      category={finalCategory}
                      categoryColor="yellow"
                      title={item.title}
                      summary={item.summary}
                      imageUrl={formatImageUrl(
                        item.image_url || item.image_full_url,
                        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800",
                      )}
                      slug={item.slug}
                      author={item.author}
                      createdAt={item.created_at}
                    />
                  );
                })}
              </div>
            </section>

            {/* Game Reviews Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#FFD700] fill-[#FFD700]" />
                  <h2 className="text-lg font-black uppercase tracking-wider text-text-primary">
                    Ulasan Game Terbaru
                  </h2>
                </div>
                <a
                  href="/review"
                  className="flex items-center gap-1 text-xs font-mono font-bold text-[#FFD700] hover:underline hover:opacity-80 transition-opacity"
                >
                  <span>SEMUA REVIEW</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <ReviewCard
                      key={review.id}
                      summary={review.summary}
                      title={review.title}
                      platform={review.platform || review.category || ["PC"]}
                      imageUrl={formatImageUrl(
                        review.image_url || review.image_full_url,
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
                      )}
                      slug={review.slug}
                    />
                  ))
                ) : (
                  <p className="text-xs font-mono text-text-muted col-span-2 2xl:col-span-3">
                    Belum ada ulasan game yang dipublikasikan dari Admin Panel.
                  </p>
                )}
              </div>
            </section>

            <TechSection />
            <EntertainmentSection />
            <YoutubeShorts videos={shortsList} />
          </div>

          {/* KOLOM KANAN (SIDEBAR) */}
          <aside className="lg:col-span-4 2xl:col-span-3 space-y-8">
            <div className="w-full h-[250px] rounded-xl border border-dashed border-dark-border bg-dark-bg/30 relative overflow-hidden group">
              <AdCarousel
                ads={sidebarAds}
                interval={5000}
                fallbackText="Space Iklan Google Ads"
                dimensions="300 x 250 px"
                objectFit="object-cover"
              />
            </div>

            <DiscordWidget />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}