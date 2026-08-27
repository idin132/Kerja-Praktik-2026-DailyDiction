"use client";

import { Tweet } from "react-tweet";

export default function TweetRenderer({ htmlContent }: { htmlContent: string }) {
  if (!htmlContent) return null;

  // Regex mendeteksi link Twitter/X
  const regex = /(<p[^>]*>\s*<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/\d+[^"]*"[^>]*>.*?<\/a>\s*<\/p>|<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/\d+[^"]*"[^>]*>.*?<\/a>|<p[^>]*>\s*https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/\d+[^\s<]*\s*<\/p>|https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/\d+[^\s<]*)/gi;

  const parts = htmlContent.split(regex);

  return (
    <div className="animate-fade-up-2 rich-text-content prose prose-invert prose-brand-crimson max-w-none text-text-primary text-justify leading-relaxed space-y-4 mb-12">
      {parts.map((part, index) => {
        const isTwitter = /https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)/.test(part);

        if (isTwitter) {
          const match = part.match(/status\/(\d+)/);
          const tweetId = match ? match[1] : null;

          if (tweetId) {
            return (
              <div key={index} className="tweet-container my-10 flex w-full justify-center dark not-prose">
                <div className="w-full max-w-lg">
                  <Tweet id={tweetId} />
                </div>
              </div>
            );
          }
        }

        if (part.trim()) {
          return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        }

        return null;
      })}

      {/* OVERRIDE FIX UNTUK AVATAR KEPOTONG & VIDEO PLAYER */}
      <style jsx global>{`
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
        }
        .react-tweet-theme {
          --tweet-container-margin: 0 !important;
        }
      `}</style>
    </div>
  );
}