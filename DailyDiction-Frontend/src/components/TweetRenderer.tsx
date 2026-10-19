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
    "\$1"
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

  // Jika belum mounted (Server-Side Rendering / First Load Client), render HTML murni tanpa manipulasi regex
  // Ini kunci agar TIDAK TERJADI HYDRATION ERROR di browser tertentu
  if (!isMounted) {
    return (
      <div
        className="rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8"
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    );
  }

  // Cek apakah terdapat link status Tweet/X
  const hasTweet = /(?:x|twitter)\.com\/[^\/]+\/status\/\d+/i.test(cleaned);

  if (!hasTweet) {
    return (
      <div
        className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8"
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    );
  }

  const marker = "___TWEET_BLOCK_";
  const markerEnd = "___";

  let parsed = cleaned;

  // Replace oembed CKEditor
  parsed = parsed.replace(
    /<figure[^>]*>\s*<oembed[^>]*url=["']https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"']*["'][^>]*>\s*<\/oembed>\s*<\/figure>/gi,
    `${marker}$1${markerEnd}`
  );

  // Replace link paragraph/anchor/plain text beserta query params (?s=20)
  parsed = parsed.replace(
    /(?:<p[^>]*>)?\s*(?:<a[^>]*href=["'][^"']*(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"']*["'][^>]*>.*?<\/a>|https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)(?:\?[^\s<"']*)?)\s*(?:<\/p>)?/gi,
    (match, id1, id2) => {
      const tweetId = id1 || id2;
      return tweetId ? `${marker}${tweetId}${markerEnd}` : match;
    }
  );

  const parts: (string | { tweetId: string })[] = [];
  const regexSplit = new RegExp(`${marker}(\\d+)${markerEnd}`, "g");
  let lastIndex = 0;
  let match;

  try {
    while ((match = regexSplit.exec(parsed)) !== null) {
      if (match.index > lastIndex) {
        const textChunk = parsed.substring(lastIndex, match.index);
        if (textChunk) parts.push(textChunk);
      }
      if (match[1]) {
        parts.push({ tweetId: match[1] });
      }
      lastIndex = regexSplit.lastIndex;
    }

    if (lastIndex < parsed.length) {
      const remainingChunk = parsed.substring(lastIndex);
      if (remainingChunk) parts.push(remainingChunk);
    }
  } catch (err) {
    console.error("Error parsing tweet split:", err);
    return (
      <div
        className="rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8"
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    );
  }

  return (
    <div className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8">
      {parts.map((item, index) => {
        if (typeof item === "object" && item?.tweetId) {
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
            dangerouslySetInnerHTML={{ __html: String(item || "") }}
          />
        );
      })}
    </div>
  );
}