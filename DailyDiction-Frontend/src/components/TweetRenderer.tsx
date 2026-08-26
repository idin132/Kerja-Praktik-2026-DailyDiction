"use client";

import { Tweet } from "react-tweet";

export default function TweetRenderer({ content }: { content: string }) {
  if (!content) return null;

  // Regex fleksibel: Nangkep ID tweet dari link biasa maupun link di dalam tag href/HTML
  const tweetRegex = /(?:twitter\.com|x\.com)\/(?:[a-zA-Z0-9_]+)\/status\/([0-9]+)/gi;

  const matches = [...content.matchAll(tweetRegex)];

  if (matches.length === 0) return null;

  // Ambil semua Tweet ID unik jika ada lebih dari 1 tweet di artikel
  const tweetIds = Array.from(new Set(matches.map((m) => m[1])));

  return (
    <div className="my-8 flex flex-col items-center gap-6 light-theme-tweet">
      {tweetIds.map((id) => (
        <div key={id} className="w-full flex justify-center">
          <Tweet id={id} />
        </div>
      ))}
    </div>
  );
}