import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getArticleBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { Clock, Calendar, Bookmark, Flame } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound(); // Menampilkan 404 jika slug tidak ditemukan di database
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          
          {/* Category */}
          <div className="flex items-center gap-2 mb-4 font-mono text-[11px] font-bold">
            <span className="rounded bg-brand-crimson px-2.5 py-1 text-white uppercase tracking-wider">
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
              <span>{new Date(article.created_at).toLocaleDateString("id-ID")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-crimson" />
              <span>{article.read_time}</span>
            </div>
          </div>

          {/* Featured Image */}
          {article.image_full_url && (
            <div className="relative overflow-hidden rounded-xl border border-dark-border mb-8">
              <img 
                src={article.image_full_url} 
                alt={article.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          {/* Content Body */}
          {/* Content Body */}
           <div 
             className="prose prose-invert max-w-none text-text-primary leading-relaxed space-y-4"
             // Coba ambil dari .data.content dulu, jika tidak ada baru .content, dan pastikan selalu berupa string
             dangerouslySetInnerHTML={{ __html: article?.data?.content || article?.content || "" }}
           />

        </article>
      </main>

      <Footer />
    </div>
  );
}