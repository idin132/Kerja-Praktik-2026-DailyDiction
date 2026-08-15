import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getArticleBySlug } from "@/lib/api"; // Pastikan Idin udah bikin fungsi ini di api.ts ya!
import { notFound } from "next/navigation";

// 1. Tipe params jadi Promise
export default async function DetailArtikel({ params }: { params: Promise<{ slug: string }> }) {
  
  // 2. Ekstrak slug
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 3. Panggil API Artikel (Bukan Review, dan jangan di-comment!)
  const article = await getArticleBySlug(slug);

  // 4. Cek variabel article, bukan review
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="mb-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Label Artikel (Rating & Platform dihapus karena ini berita biasa) */}
            <span className="rounded bg-brand-cyan/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-cyan border border-brand-cyan/30">
              Berita Utama
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            {article.title}
          </h1>

          <p className="text-lg text-text-muted font-medium border-l-4 border-brand-crimson pl-4">
            {/* Catatan: Kalau di database artikel nama kolomnya bukan summary, ganti jadi excerpt atau yang sesuai */}
            {article.summary || "Simak berita selengkapnya di bawah ini."} 
          </p>
        </div>

          {/* Content Body (Gambar & Video embed otomatis dirender di sini via Tiptap) */}
          {/* <div
            className="prose prose-invert max-w-none text-text-primary leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          /> */}
          <div className="space-y-6">
            {Array.isArray(article.content) ? (
              article.content.map((block: any, idx: number) => {
                // 1. Blok Teks/Paragraf
                if (block.type === "paragraph") {
                  return (
                    <div
                      key={idx}
                      className="prose prose-invert max-w-none text-text-primary leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: block.data.body || "",
                      }}
                    />
                  );
                }

                // 2. Blok Link Gambar
                if (block.type === "image_embed") {
                  return (
                    <div
                      key={idx}
                      className="my-6 overflow-hidden rounded-xl border border-dark-border"
                    >
                      <img
                        src={block.data.url}
                        alt="Article Media"
                        className="w-full h-auto max-h-[500px] object-cover"
                      />
                    </div>
                  );
                }

                // 3. Blok Video Embed
                if (block.type === "video_embed") {
                  let embedUrl = block.data.url || "";
                  if (embedUrl.includes("youtube.com/watch?v=")) {
                    const videoId = new URL(embedUrl).searchParams.get("v");
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                  } else if (embedUrl.includes("youtu.be/")) {
                    const videoId = embedUrl.split("/").pop();
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                  }

                  return (
                    <div
                      key={idx}
                      className="my-6 aspect-video max-w-2xl mx-auto rounded-xl overflow-hidden border border-dark-border shadow-lg"
                    >
                      <iframe
                        className="w-full h-full"
                        src={embedUrl}
                        allowFullScreen
                      />
                    </div>
                  );
                }

                return null;
              })
            ) : (
              // Fallback jika artikel lama masih berupa string HTML
              <div
                className="prose prose-invert max-w-none text-text-primary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content || "" }}
              />
            )}
          </div>
        </article>

      </main>

      <Footer />

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
      `}}/>
    </div>
  );
}
