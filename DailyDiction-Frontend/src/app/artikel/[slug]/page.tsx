import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getArticleBySlug } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function DetailArtikel({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <article>
          {/* Header */}
          <div className="mb-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-brand-cyan/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-cyan border border-brand-cyan/30">
                Berita Utama
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
              {article.read_time && <span>⏱ {article.read_time}</span>}
              {article.created_at && (
                <span>
                  {new Date(article.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            <p className="text-lg text-text-muted font-medium border-l-4 border-brand-crimson pl-4">
              {article.summary || "Simak berita selengkapnya di bawah ini."}
            </p>
          </div>

          {/* Content Body — Tiptap output HTML langsung */}
          <div
            className="rich-text-content prose prose-invert max-w-none
                        text-text-primary leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html:
                typeof article.content === "string"
                  ? article.content
                  : Array.isArray(article.content)
                    ? article.content.map((b: any) => b.content ?? "").join("")
                    : "",
            }}
          />
        </article>
      </main>

      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .rich-text-content {
            font-size: 1.125rem;
            line-height: 1.75;
            color: #d1d5db;
          }
          .rich-text-content p { margin-bottom: 1.5em; }
          .rich-text-content h2,
          .rich-text-content h3 {
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
          .rich-text-content a:hover { text-decoration: underline; }
          .rich-text-content strong { color: white; }
          .rich-text-content iframe {
            width: 100%;
            aspect-ratio: 16/9;
            border-radius: 0.75rem;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
          }
        `,
        }}
      />
    </div>
  );
}
