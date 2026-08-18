import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import YoutubeHero from "@/components/YoutubeHero";
import YoutubeShorts from "@/components/YoutubeShorts";
import { NewsFeedCard, ReviewCard } from "@/components/Cards";
import { DiscordWidget } from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { getArticles, getGameReviews, getAdvertisements } from "@/lib/api";
import { getYouTubeVideos } from "@/lib/youtube";
import { Flame, Star, ArrowRight } from "lucide-react";

export const revalidate = 3600;

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

  const rawArticles = articlesData?.data || [];
  let reviews = Array.isArray(reviewsData)
    ? reviewsData
    : reviewsData?.data || [];
  const sidebarAd = adsData?.data?.[0] || null;

  // Helper pemeriksa apakah konten adalah Review / Ulasan
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

  // 1. News Feed: HANYA artikel murni (bukan review)
  const newsArticles = rawArticles.filter((item: any) => !isReviewItem(item));

  // 2. Game Reviews: Jika API khusus review kosong, ambil dari rawArticles yang bertipe review
  if (reviews.length === 0) {
    reviews = rawArticles.filter((item: any) => isReviewItem(item));
  }

  // --- FILTER YOUTUBE: SHORTS VS VIDEO PANJANG ---
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
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      <HeroSection />

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <YoutubeHero videos={longVideosList} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12 mt-4">
          <div className="lg:col-span-8 2xl:col-span-9 space-y-12">
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

              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {newsArticles.map((item: any) => {
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
                      categoryColor={item.category_color || "crimson"}
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

            {/* Youtube Shorts */}
            <YoutubeShorts videos={shortsList} />
          </div>

          {/* Sidebar (Kanan) */}
          <aside className="lg:col-span-4 2xl:col-span-3 space-y-8">
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
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
