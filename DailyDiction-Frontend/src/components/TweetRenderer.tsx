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

function sanitizeContent(html: string): string {
  if (!html) return "";

  let clean = html
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
    .replace(/class="w-full h-full border-0 rounded-xl"[^>]*>/gi, "")
    .replace(/%3Cdiv%3E/gi, "")
    .replace(/%3Cdiv/gi, "")
    .replace(/div%3E%3Cdiv/gi, "");

  clean = clean.replace(
    /https?:\/\/[^\/]+\/storage\/(https?:\/\/)/gi,
    "$1"
  );

  return clean;
}

export default function TweetRenderer({ htmlContent }: { htmlContent: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!htmlContent) return null;

  const cleaned = sanitizeContent(htmlContent);

  // Jika tidak mengandung link Tweet/X, render HTML secara langsung utuh 100%
  const hasTweet = /(?:x|twitter)\.com\/[^\/]+\/status\/\d+/i.test(cleaned);

  if (!isMounted || !hasTweet) {
    return (
      <>
        <div
          className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8"
          dangerouslySetInnerHTML={{ __html: cleaned }}
        />
        <style jsx global>{`
          .rich-text-content h1,
          .rich-text-content h2,
          .rich-text-content h3,
          .rich-text-content h4,
          .rich-text-content h5,
          .rich-text-content h6 {
            color: #FFD700;
            font-weight: 900 !important;
            line-height: 1.25 !important;
            margin-top: 1.75em !important;
            margin-bottom: 0.75em !important;
            text-align: left !important;
          }

          .rich-text-content p {
            line-height: 1.7 !important;
            text-align: justify !important;
            margin-bottom: 1.25em !important;
          }

          .rich-text-content figure {
            margin: 2rem 0 !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }

          .rich-text-content img {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            margin: 1.5rem auto !important;
            border-radius: 0.75rem !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }

          .rich-text-content figcaption {
            margin-top: 0.5rem !important;
            font-size: 0.875rem !important;
            color: #9ca3af !important;
            text-align: center !important;
            font-style: italic !important;
          }

          .rich-text-content iframe {
            width: 100% !important;
            aspect-ratio: 16/9;
            border-radius: 0.75rem;
            margin: 1.5rem 0 !important;
            border: 0 !important;
            display: block !important;
          }
        `}</style>
      </>
    );
  }

  // JIKA Terdapat Tweet
  const marker = "___TWEET_BLOCK_";
  const markerEnd = "___";

  let parsed = cleaned.replace(
    /<figure[^>]*>\s*<oembed[^>]*url=["']https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"']*["'][^>]*>\s*<\/oembed>\s*<\/figure>/gi,
    `${marker}$1${markerEnd}`
  );

  const regexSplit = new RegExp(`${marker}(\\d+)${markerEnd}`, "g");
  const parts: (string | { tweetId: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regexSplit.exec(parsed)) !== null) {
    if (match.index > lastIndex) {
      const textChunk = parsed.substring(lastIndex, match.index);
      if (textChunk) parts.push(textChunk);
    }
    parts.push({ tweetId: match[1] });
    lastIndex = regexSplit.lastIndex;
  }

  if (lastIndex < parsed.length) {
    const remainingChunk = parsed.substring(lastIndex);
    if (remainingChunk) parts.push(remainingChunk);
  }

  return (
    <>
      <div className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8">
        {parts.map((item, index) => {
          if (typeof item === "object" && item.tweetId) {
            return (
              <div key={`tweet-${index}`} className="flex justify-center w-full my-6 py-0 not-prose">
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
      </div>
      <style jsx global>{`
        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3,
        .rich-text-content h4,
        .rich-text-content h5,
        .rich-text-content h6 {
          color: #FFD700;
          font-weight: 900 !important;
          line-height: 1.25 !important;
          margin-top: 1.75em !important;
          margin-bottom: 0.75em !important;
          text-align: left !important;
        }

        .rich-text-content p {
          line-height: 1.7 !important;
          text-align: justify !important;
          margin-bottom: 1.25em !important;
        }

        .rich-text-content figure {
          margin: 2rem 0 !important;
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        .rich-text-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 1.5rem auto !important;
          border-radius: 0.75rem !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .rich-text-content figcaption {
          margin-top: 0.5rem !important;
          font-size: 0.875rem !important;
          color: #9ca3af !important;
          text-align: center !important;
          font-style: italic !important;
        }

        .rich-text-content iframe {
          width: 100% !important;
          aspect-ratio: 16/9;
          border-radius: 0.75rem;
          margin: 1.5rem 0 !important;
          border: 0 !important;
          display: block !important;
        }
      `}</style>
    </>
  );
}