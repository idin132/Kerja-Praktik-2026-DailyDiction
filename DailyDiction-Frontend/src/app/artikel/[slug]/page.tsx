import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getArticleBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { Clock, Calendar } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const rawArticle = await getArticleBySlug(slug);

  // Antisipasi jika respons data terbungkus properti .data
  const article = rawArticle?.data || rawArticle;

  if (!article) {
    notFound(); // 404 jika artikel tidak ditemukan
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-4 font-mono text-[11px] font-bold">
            <span
              className="rounded px-2.5 py-1 text-white uppercase tracking-wider"
              style={{ backgroundColor: article.category_color || "#e11d48" }}
            >
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary mb-6">
            {article.title}
          </h1>

          {/* Meta Bar */}
          <div className="flex items-center gap-6 border-y border-dark-border py-3 mb-8 text-xs font-mono text-text-muted">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-brand-cyan" />
              <span>
                {new Date(article.created_at || Date.now()).toLocaleDateString(
                  "id-ID",
                )}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-crimson" />
              <span>{article.read_time || "1 MIN READ"}</span>
            </div>
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
    </div>
  );
}
