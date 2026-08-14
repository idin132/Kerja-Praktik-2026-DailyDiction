import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGameReviewBySlug } from "@/lib/api"; 
import { notFound } from "next/navigation";
import { Star, Monitor } from "lucide-react";

// 1. Tipe params diubah jadi Promise sesuai aturan Next.js terbaru
export default async function ReviewDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // 2. Ekstrak slug-nya pakai await biar nilainya dapet
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 3. Panggil data review dari API berdasarkan slug
  const review = await getGameReviewBySlug(slug);

  // 4. Kalau datanya gak ketemu (atau belum di-publish), arahin ke halaman 404
  if (!review) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* --- HEADER REVIEW --- */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded bg-brand-cyan/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-cyan border border-brand-cyan/30 flex items-center gap-2">
              <Monitor className="h-3 w-3" />
              {review.platform}
            </span>
            <span className="rounded bg-yellow-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-500 border border-yellow-500/30 flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500" />
              {review.rating} / 10
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            {review.title}
          </h1>

          <p className="text-lg text-text-muted font-medium border-l-4 border-brand-crimson pl-4">
            {review.summary}
          </p>
        </div>

        {/* --- COVER IMAGE --- */}
        <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-dark-border shadow-2xl">
          <img
            src={review.image_full_url || `http://127.0.0.1:8000/storage/${review.cover_game}`}
            alt={review.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* --- KONTEN REVIEW (RICH TEXT DARI FILAMENT) --- */}
        <article className="rich-text-content bg-dark-card/50 p-6 md:p-10 rounded-2xl border border-dark-border shadow-lg">
          <div dangerouslySetInnerHTML={{ __html: review.content }} />
        </article>

      </main>

      <Footer />

      {/* --- CSS KHUSUS BUAT NGATUR GAMBAR EMBED & TEKS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .rich-text-content {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #d1d5db; 
        }
        .rich-text-content p {
          margin-bottom: 1.5em;
        }
        .rich-text-content h2, .rich-text-content h3 {
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
        .rich-text-content a:hover {
          text-decoration: underline;
        }
        .rich-text-content strong {
          color: white;
        }
      `}} />
    </div>
  );
}