"use client";

import { Tweet } from "react-tweet";

export default function TweetRenderer({ htmlContent }: { htmlContent: string }) {
  if (!htmlContent) return null;

  // Regex sakti buat misahin HTML biasa dengan tag <a> yang berisi link X/Twitter
  const regex = /(<p[^>]*>\s*<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/\d+[^"]*"[^>]*>.*?<\/a>\s*<\/p>|<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/\d+[^"]*"[^>]*>.*?<\/a>|<p[^>]*>\s*https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/\d+[^\s<]*\s*<\/p>|https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/\d+[^\s<]*)/gi;

  const parts = htmlContent.split(regex);

  return (
    <div className="animate-fade-up-2 rich-text-content prose prose-invert prose-brand-crimson max-w-none text-text-primary text-justify leading-relaxed space-y-4 mb-12">
      {parts.map((part, index) => {
        // Cek apakah potongan string ini adalah link Twitter
        const isTwitter = /https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)/.test(part);

        if (isTwitter) {
          const match = part.match(/status\/(\d+)/);
          const tweetId = match ? match[1] : null;
          
          if (tweetId) {
            return (
              // Wrapper tweet dibuat not-prose biar margin Tailwind gak nabrak
              <div key={index} className="my-10 flex w-full justify-center dark not-prose">
                <div className="w-full max-w-lg">
                  <Tweet id={tweetId} />
                </div>
              </div>
            );
          }
        }

        // Kalau bukan tweet, render sebagai HTML (Teks Artikel) biasa
        if (part.trim()) {
          return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        }

        return null;
      })}
    </div>
  );
}