"use client";

import React, { Component, ReactNode, useEffect, useState } from "react";
import { Tweet } from "react-tweet";

class SafeTweetBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
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

// FUNGSI PEMBERSIH KARAKTER ANEH & POTONGAN TAG BROKEN DARI DATABASE ADMIN
function sanitizeContent(html: string): string {
  if (!html) return "";

  return html
    // 1. Bersihkan Karakter Kontrol Tersembunyi (Invisible Characters / Zero Width / Control Codes)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
    // 2. Bersihkan Potongan String Atribut Iframe / Div Bocor
    .replace(/class="w-full h-full border-0 rounded-xl"[^>]*>/gi, "")
    .replace(/%3Cdiv%3E/gi, "")
    .replace(/%3Cdiv/gi, "")
    .replace(/div%3E%3Cdiv/gi, "");
}

export default function TweetRenderer({ htmlContent }: { htmlContent: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!htmlContent) return null;

  const cleaned = sanitizeContent(htmlContent);

  // SAAT SERVER-SIDE RENDERING (SSR):
  // Render div polos tanpa logika split kompleks agar Server dan Client 100% Identik (Anti Error #412)
  if (!isMounted) {
    return (
      <div
        className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary text-justify leading-relaxed mb-8"
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    );
  }

  // SAAT CLIENT-SIDE (BROWSER):
  const hasTweet = /(?:x|twitter)\.com\/[^\/]+\/status\/\d+/i.test(cleaned);

  // Jika artikel polos tanpa Tweet (seperti mayoritas artikel mas Lendy)
  if (!hasTweet) {
    return (
      <div
        className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary text-justify leading-relaxed mb-8"
        dangerouslySetInnerHTML={{ __html: cleaned }}
      >
        <style jsx global>{`
          .rich-text-content h1,
          .rich-text-content h2,
          .rich-text-content h3,
          .rich-text-content h4,
          .rich-text-content h5,
          .rich-text-content h6 {
            color: #FFD700;
            font-weight: 900 !important;
            line-height: 1.2 !important;
            margin-top: 1.5em !important;
            margin-bottom: 0.5em !important;
          }

          .rich-text-content p {
            line-height: 1.25 !important;
            text-align: justify !important;
            margin-bottom: 1em !important;
          }
        `}</style>
      </div>
    );
  }

  // Jika artikel MEMILIKI Tweet
  const marker = "___TWEET_BLOCK_";
  const markerEnd = "___";

  let parsed = cleaned.replace(
    /<figure[^>]*>\s*<oembed[^>]*url=["']https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"']*["'][^>]*>\s*<\/oembed>\s*<\/figure>/gi,
    `${marker}$1${markerEnd}`
  );
  parsed = parsed.replace(
    /<p[^>]*>\s*(?:<a[^>]*>)?\s*https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*(?:<\/a>)?\s*<\/p>/gi,
    `${marker}$1${markerEnd}`
  );
  parsed = parsed.replace(
    /(?:<a[^>]*>)?https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*(?:<\/a>)?/gi,
    (match, tweetId) => (tweetId ? `${marker}${tweetId}${markerEnd}` : match)
  );

  const regexSplit = new RegExp(`${marker}(\\d+)${markerEnd}`, "g");
  const parts: (string | { tweetId: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regexSplit.exec(parsed)) !== null) {
    if (match.index > lastIndex) {
      const textChunk = parsed.substring(lastIndex, match.index).trim();
      if (textChunk) parts.push(textChunk);
    }
    parts.push({ tweetId: match[1] });
    lastIndex = regexSplit.lastIndex;
  }

  if (lastIndex < parsed.length) {
    const remainingChunk = parsed.substring(lastIndex).trim();
    if (remainingChunk) parts.push(remainingChunk);
  }

  return (
    <div className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary text-justify leading-relaxed mb-8">
      {parts.map((item, index) => {
        if (typeof item === "object" && item.tweetId) {
          return (
            <div key={`tweet-${index}`} className="flex justify-center w-full my-0 py-0 not-prose">
              <div className="w-full max-w-lg">
                <SafeTweetBoundary>
                  <Tweet id={item.tweetId} />
                </SafeTweetBoundary>
              </div>
            </div>
          );
        }

        return (
          <div
            key={`html-${index}`}
            dangerouslySetInnerHTML={{ __html: item as string }}
          />
        );
      })}

      <style jsx global>{`
        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3,
        .rich-text-content h4,
        .rich-text-content h5,
        .rich-text-content h6 {
          color: #FFD700;
          font-weight: 900 !important;
          line-height: 1.2 !important;
          margin-top: 1.5em !important;
          margin-bottom: 0.5em !important;
        }

        .rich-text-content p {
          line-height: 1.25 !important;
          text-align: justify !important;
          margin-bottom: 1em !important;
        }

        .react-tweet-theme {
          margin: 0 !important;
          --tweet-container-margin: 0 !important;
        }
        [class*="react-tweet-container"] {
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
}