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
        <div className="p-4 my-2 rounded-lg border border-dark-border bg-dark-card/50 text-center text-xs font-mono text-text-muted">
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
  let cleaned = htmlContent.replace(
    /class="w-full h-full border-0 rounded-xl"[^>]*>/gi,
    ""
  );

  // 2. Hapus tag <p> kosong yang membungkus URL Tweet agar tidak menghasilkan spasi raksasa
  cleaned = cleaned.replace(
    /<p[^>]*>\s*(https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\s<]+)\s*<\/p>/gi,
    "$1"
  );

  const marker = "___TWEET_BLOCK_";
  const markerEnd = "___";

  const replacedHtml = cleaned.replace(
    /<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"]*"[^>]*>.*?<\/a>|https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*/gi,
    (match, id1, id2) => {
      const tweetId = id1 || id2;
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
              className="tweet-container my-2 flex w-full justify-center dark not-prose"
            >
              <div className="w-full max-w-lg">
                <SafeTweetBoundary>
                  <Tweet id={tweetId} />
                </SafeTweetBoundary>
              </div>
            </div>
          );
        }

        const cleanPart = part
          .replace(/^(\s*<p>\s*<\/p>\s*)+|(\s*<p>\s*<\/p>\s*)+$/gi, "")
          .trim();

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

      {/* OVERRIDE HANYA UNTUK MEDIA TWEET EMBED & SPACING */}
      <style jsx global>{`
        .tweet-container {
          pointer-events: auto !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }

        .tweet-container [class*="react-tweet"],
        .tweet-container article {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
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