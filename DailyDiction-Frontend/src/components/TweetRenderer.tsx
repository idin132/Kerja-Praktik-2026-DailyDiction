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

export default function TweetRenderer({ htmlContent }: { htmlContent: string }) {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!htmlContent) return null;

  // 1. SAPU BERSIH STRING DIV LIAR & ATRIBUT BOCOR YANG MEMICU FETCH 404
  let cleaned = htmlContent
    .replace(/class="w-full h-full border-0 rounded-xl"[^>]*>/gi, "")
    .replace(/%3Cdiv%3E/gi, "")
    .replace(/%3Cdiv/gi, "")
    .replace(/div%3E%3Cdiv/gi, "");

  const marker = "___TWEET_BLOCK_";
  const markerEnd = "___";

  // 2. REGEX PEMBUNUH SPASI GAIB TWITTER (Telan tag pembungkus <p> dan <figure>)
  cleaned = cleaned.replace(
    /<figure[^>]*>\s*<oembed[^>]*url=["']https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"']*["'][^>]*>\s*<\/oembed>\s*<\/figure>/gi,
    `${marker}$1${markerEnd}`
  );
  cleaned = cleaned.replace(
    /<p[^>]*>\s*(?:<a[^>]*>)?\s*https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*(?:<\/a>)?\s*<\/p>/gi,
    `${marker}$1${markerEnd}`
  );
  cleaned = cleaned.replace(
    /(?:<a[^>]*>)?https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*(?:<\/a>)?/gi,
    (match, tweetId) => (tweetId ? `${marker}${tweetId}${markerEnd}` : match)
  );

  // 3. SPLIT STRUKTUR HTML
  const regexSplit = new RegExp(`${marker}(\\d+)${markerEnd}`, "g");
  const parts: string[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regexSplit.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleaned.substring(lastIndex, match.index));
    }
    parts.push(`TWEET_ID:${match[1]}`);
    lastIndex = regexSplit.lastIndex;
  }
  if (lastIndex < cleaned.length) {
    parts.push(cleaned.substring(lastIndex));
  }

  // JIKA BELUM MOUNT DI BROWSER, RENDER SKELETON / HTML POLOS DULU (MENGHINDARI ERROR #412 HYDRATION)
  if (!isMounted) {
    return (
      <div
        className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary text-justify leading-relaxed mb-8"
        dangerouslySetInnerHTML={{ __html: cleaned.replace(/___TWEET_BLOCK_\d+___/g, "") }}
      />
    );
  }

  return (
    <div className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary text-justify leading-relaxed mb-8">
      {parts.map((part, index) => {
        if (part.startsWith("TWEET_ID:")) {
          const tweetId = part.split(":")[1];
          return (
            <div key={`tweet-${index}`} className="flex justify-center w-full my-0 py-0 not-prose">
              <div className="w-full max-w-lg">
                <SafeTweetBoundary>
                  <Tweet id={tweetId} />
                </SafeTweetBoundary>
              </div>
            </div>
          );
        }

        const cleanPart = part.trim();
        if (!cleanPart) return null;

        return (
          <div
            key={`html-${index}`}
            dangerouslySetInnerHTML={{ __html: cleanPart }}
          />
        );
      })}

      <style jsx global>{`
        /* SINKRONISASI HEADING WARNA BACKEND DENGAN FRONTEND */
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

        /* HILANGKAN SPASI GAIB DARI REACT TWEET */
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