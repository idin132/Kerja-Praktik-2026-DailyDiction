"use client";

import React from "react";
import { Tweet } from "react-tweet";

export default function TweetRenderer({ htmlContent }: { htmlContent: string }) {
  if (!htmlContent) return null;

  // Ganti link X / Twitter (baik berupa <p><a href="..."></a></p>, <a href="..."></a>, atau URL mentah)
  // dengan marker unik ___TWEET_BLOCK_ID___
  const marker = "___TWEET_BLOCK_";
  const markerEnd = "___";

  const replacedHtml = htmlContent.replace(
    /<p[^>]*>\s*<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"]*"[^>]*>.*?<\/a>\s*<\/p>|<p[^>]*>\s*https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*\s*<\/p>|<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"]*"[^>]*>.*?<\/a>|https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*/gi,
    (match, id1, id2, id3, id4) => {
      const tweetId = id1 || id2 || id3 || id4;
      return `${marker}${tweetId}${markerEnd}`;
    }
  );

  // Split HTML berdasarkan marker
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
    <div className="animate-fade-up-2 rich-text-content prose prose-invert prose-brand-crimson max-w-none text-text-primary text-justify leading-relaxed space-y-4 mb-12">
      {parts.map((part, index) => {
        if (part.startsWith("TWEET_ID:")) {
          const tweetId = part.replace("TWEET_ID:", "");
          return (
            <div
              key={`tweet-${index}-${tweetId}`}
              className="tweet-container my-10 flex w-full justify-center dark not-prose"
            >
              <div className="w-full max-w-lg">
                <Tweet id={tweetId} />
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

      {/* OVERRIDE CSS AGAR AVATAR TWEET RAPI & VIDEO BISA DIPLAY SMOOTH */}
      <style jsx global>{`
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