"use client";

import React, { Component, ReactNode } from "react";
import { Tweet } from "react-tweet";

class SafeTweetBoundary extends Component<
  { children: ReactNode; fallbackUrl?: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallbackUrl?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("React-Tweet error caught safely:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 my-4 rounded-lg border border-dark-border bg-dark-card/50 text-center text-xs font-mono text-text-muted">
          Gagal memuat Tweet (Embed diblokir atau Tweet telah dihapus)
        </div>
      );
    }
    return this.props.children;
  }
}

export default function TweetRenderer({ htmlContent }: { htmlContent: string }) {
  if (!htmlContent) return null;

  // 1. Bersihkan sisa string atribut iframe terpotong/bocor dari database
  let sanitizedContent = htmlContent.replace(
    /class="w-full h-full border-0 rounded-xl"[^>]*>/gi,
    ""
  );

  // 2. Bersihkan tag <p> kosong hasil sisa pembungkusan URL Tweet di CKEditor
  sanitizedContent = sanitizedContent.replace(/<p>\s*<\/p>/gi, "");

  const marker = "___TWEET_BLOCK_";
  const markerEnd = "___";

  const replacedHtml = sanitizedContent.replace(
    /<p[^>]*>\s*<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"]*"[^>]*>.*?<\/a>\s*<\/p>|<p[^>]*>\s*https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*\s*<\/p>|<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"]*"[^>]*>.*?<\/a>|https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*/gi,
    (match, id1, id2, id3, id4) => {
      const tweetId = id1 || id2 || id3 || id4;
      return `${marker}${tweetId}${markerEnd}`;
    }
  );

  const regexSplit = new RegExp(`${marker}(\\d+)${markerEnd}`, "g");
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regexSplit.exec(replacedHtml)) !== null) {
    const htmlBefore = replacedHtml.substring(lastIndex, match.index);
    if (htmlBefore) {
      parts.push(htmlBefore);
    }
    parts.push(`TWEET_ID:${match[1]}`);
    lastIndex = regexSplit.lastIndex;
  }

  const htmlAfter = replacedHtml.substring(lastIndex);
  if (htmlAfter) {
    parts.push(htmlAfter);
  }

  return (
    <div className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary text-justify leading-relaxed mb-8">
      {parts.map((part, index) => {
        if (part.startsWith("TWEET_ID:")) {
          const tweetId = part.replace("TWEET_ID:", "");
          return (
            <div
              key={`tweet-${index}-${tweetId}`}
              className="tweet-container my-4 flex w-full justify-center dark not-prose"
            >
              <div className="w-full max-w-lg">
                <SafeTweetBoundary>
                  <Tweet id={tweetId} />
                </SafeTweetBoundary>
              </div>
            </div>
          );
        }

        // Jangan render jika bagian HTML hanya berisi whitespace/paragraf kosong sisa pemisahan
        const cleanPart = part.replace(/^(\s*<p>\s*<\/p>\s*)+|(\s*<p>\s*<\/p>\s*)+$/gi, "").trim();
        if (cleanPart) {
          return (
            <div
              key={`html-${index}`}
              dangerouslySetInnerHTML={{ __html: cleanPart }}
            />
          );
        }

        return null;
      })}

      <style jsx global>{`
        /* HEADING DEFAULT KUNING (#FFD700) SESUAI TAMPILAN THEME UNTUK H1-H6 */
        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3,
        .rich-text-content h4,
        .rich-text-content h5,
        .rich-text-content h6 {
          color: #FFD700 !important;
          font-weight: 900 !important;
          line-height: 1.15 !important;
          margin-top: 1.5em !important;
          margin-bottom: 0.5em !important;
        }

        /* JIKA TEKS DI DALAM HEADING MEMILIKI COLOR KUSTOM DARI CKEDITOR (SPAN STYLE), GUNAKAN WARNA TERSEBUT */
        .rich-text-content h1 span[style*="color"],
        .rich-text-content h2 span[style*="color"],
        .rich-text-content h3 span[style*="color"],
        .rich-text-content h4 span[style*="color"] {
          color: inherit !important;
        }

        .rich-text-content p {
          line-height: 1.15 !important;
          text-align: justify !important;
          margin-bottom: 1em !important;
        }

        /* HILANGKAN MARGIN DAN SPASI KOSONG PADA TWEET EMBED */
        .tweet-container {
          pointer-events: auto !important;
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
        }

        .tweet-container [class*="react-tweet"] {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }

        .tweet-container img {
          width: auto !important;
          height: auto !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
          border: none !important;
          animation: none !important;
        }

        .tweet-container video {
          width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          object-fit: contain !important;
        }

        .tweet-container button {
          cursor: pointer !important;
          pointer-events: auto !important;
        }

        .react-tweet-theme {
          --tweet-container-margin: 0 !important;
        }
      `}</style>
    </div>
  );
}