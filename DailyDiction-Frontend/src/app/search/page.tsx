import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Frown } from "lucide-react";
import { getArticles } from "@/lib/api"; // Manggil fungsi ambil API dari Idin
import { NewsFeedCard } from "@/components/Cards"; // Manggil desain kartu berita

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';

  // 1. Ambil semua data artikel dari API Laravel
  const articlesData = await getArticles();
  const allArticles = (articlesData as any)?.data || articlesData;  

  // 2. Saring (Filter) artikel yang judul atau isinya mengandung kata kunci pencarian
  // .toLowerCase() dipakai biar huruf besar/kecil nggak ngaruh (misal "GTA" tetep ketemu biarpun nyari "gta")
  const searchResults = allArticles.filter((article: any) => 
    article.title.toLowerCase().includes(query.toLowerCase()) || 
    article.summary.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 min-h-[60vh]">
        
        {/* Header Pencarian */}
        <div className="mb-10 border-b border-dark-border pb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary mb-4 flex items-center gap-3">
            <Search className="h-8 w-8 text-brand-cyan" />
            Hasil Pencarian
          </h1>
          <p className="text-lg text-text-muted">
            Menampilkan hasil untuk kata kunci: <span className="font-bold text-brand-crimson">"{query}"</span>
          </p>
        </div>

        {/* 3. Menampilkan Hasil Pencarian */}
        {searchResults.length > 0 ? (
          // Kalau beritanya ketemu, tampilin pakai Grid dan NewsFeedCard
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((item: any) => (
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
        ) : (
          // Kalau beritanya nggak ada/nggak cocok sama kata kunci
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-dark-border rounded-xl bg-dark-card/30">
            <Frown className="h-12 w-12 text-dark-border mb-4" />
            <p className="text-text-muted font-mono text-sm text-center">
              Waduh, berita tentang <span className="text-brand-crimson font-bold">"{query}"</span> nggak ditemuin nih.
              <br />
              Coba pakai kata kunci lain ya!
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}