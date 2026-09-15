"use client";

import React, { Component, ReactNode } from "react";
import { Tweet } from "react-tweet";

// Component ErrorBoundary khusus untuk menangkap crash dari library react-tweet
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

  // FIX 1: Hapus sisa string atribut iframe yang terpotong/bocor dari database
  const sanitizedContent = htmlContent.replace(
    /class="w-full h-full border-0 rounded-xl"[^>]*>/gi,
    ""
  );

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
    <div className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary text-justify leading-relaxed space-y-4 mb-12">
      {parts.map((part, index) => {
        if (part.startsWith("TWEET_ID:")) {
          const tweetId = part.replace("TWEET_ID:", "");
          return (
            <div
              key={`tweet-${index}-${tweetId}`}
              className="tweet-container my-10 flex w-full justify-center dark not-prose"
            >
              <div className="w-full max-w-lg">
                <SafeTweetBoundary>
                  <Tweet id={tweetId} />
                </SafeTweetBoundary>
              </div>
            </div>
          );
        }

        if (part.trim()) {
          return (
            <div
              key={`html-${index}`}
              dangerouslySetInnerHTML={{ __html: part }}
            />
          );
        }

        return null;
      })}

      {/* OVERRIDE CSS: FIX HEADING KUNING PRESISI & TWEET MEDIA */}
      <style jsx global>{`
        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3,
        .rich-text-content h4 {
          color: #FFD700 !important;
          font-weight: 900 !important;
          line-height: 1.15 !important;
          margin-top: 1.75em !important;
          margin-bottom: 0.75em !important;
        }

        .rich-text-content p {
          line-height: 1.15 !important;
          text-align: justify !important;
        }

        .tweet-container {
          pointer-events: auto !important;
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