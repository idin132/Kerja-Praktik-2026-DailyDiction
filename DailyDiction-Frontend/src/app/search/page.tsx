import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NewsFeedCard } from "@/components/Cards";
import { Search, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

function formatImageUrl(
  imageUrl: string | null | undefined,
  fallback: string,
): string {
  if (!imageUrl) return fallback;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    if (imageUrl.includes("dailydiction.id/storage/http")) {
      return imageUrl.replace(
        /https:\/\/dailydiction\.id\/storage\/(https?:\/\/)/,
        "$1",
      );
    }
    return imageUrl;
  }
  return `https://dailydiction.id/storage/${imageUrl}`;
}

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const lowerQuery = query.toLowerCase();

  const [articlesRes, reviewsRes] = await Promise.all([
    fetch(`https://dailydiction.id/api/v1/articles?type=article&t=${Date.now()}`, { cache: "no-store" }).catch(() => null),
    fetch(`https://dailydiction.id/api/v1/articles?type=review&t=${Date.now()}`, { cache: "no-store" }).catch(() => null),
  ]);

  const articlesJson = articlesRes?.ok ? await articlesRes.json() : { data: [] };
  const reviewsJson = reviewsRes?.ok ? await reviewsRes.json() : { data: [] };

  const articles = articlesJson.data || [];
  const reviews = Array.isArray(reviewsJson) ? reviewsJson : (reviewsJson.data || []);

  const allPosts = [...articles, ...reviews];

  const searchResults = allPosts.filter((item: any) => {
    if (!query) return false;
    const title = (item.title || "").toLowerCase();
    const summary = (item.summary || "").toLowerCase();
    return title.includes(lowerQuery) || summary.includes(lowerQuery);
  });

  searchResults.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white flex flex-col justify-between font-sans">
      <div>
        <Navbar />

        <main className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-10 border-b border-dark-border pb-6">
            <div className="flex items-center gap-3 mb-3">
              <Search className="h-8 w-8 text-brand-cyan" />
              <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white uppercase">
                Hasil Pencarian
              </h1>
            </div>
            <p className="text-sm sm:text-base text-text-muted font-mono">
              Menampilkan hasil untuk kata kunci:{" "}
              <span className="text-brand-crimson font-bold">"{query}"</span>
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((item: any) => {
                // ==========================================
                // LOGIC KATEGORI YANG ANTI PROTES TYPESCRIPT
                // ==========================================
                let rawCategory: any = ["Berita"]; // Wadah sementara pakai 'any'
                
                if (item.type === "review") {
                  rawCategory = ["GAME REVIEW"];
                } else {
                  if (item.category_input && item.category_input.length > 0) {
                    rawCategory = item.category_input;
                  } else if (item.category && item.category.length > 0) {
                    rawCategory = item.category;
                  } else if (item.categories && item.categories.length > 0) {
                    rawCategory = item.categories.map((c: any) => c.name);
                  }
                }

                // Masukin ke wadah final yang tipe datanya strict string[]
                let finalCategory: string[] = ["Berita"];
                if (Array.isArray(rawCategory)) {
                  finalCategory = rawCategory;
                } else if (typeof rawCategory === "string") {
                  try {
                    finalCategory = rawCategory.startsWith("[")
                      ? JSON.parse(rawCategory)
                      : [rawCategory];
                  } catch {
                    finalCategory = [rawCategory];
                  }
                }

                return (
                  <NewsFeedCard
                    key={item.id}
                    category={finalCategory}
                    categoryColor={item.type === "review" ? "cyan" : (item.category_color || "crimson")}
                    title={item.title}
                    summary={item.summary}
                    imageUrl={formatImageUrl(
                      item.image_url || item.image_full_url,
                      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"
                    )}
                    slug={item.slug}
                    author={item.author}
                    createdAt={item.created_at}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-dark-border rounded-2xl bg-dark-card/30">
              <AlertCircle className="h-16 w-16 text-text-muted mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Pencarian Tidak Ditemukan</h3>
              <p className="text-text-muted font-mono max-w-md">
                Maaf, tidak ada artikel atau ulasan yang cocok dengan kata kunci <span className="text-brand-crimson">"{query}"</span>. Coba gunakan kata kunci lain.
              </p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}