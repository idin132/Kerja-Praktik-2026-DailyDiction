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
          <div
            className="prose prose-invert max-w-none text-text-primary leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
