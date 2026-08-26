"use client";

import { Tweet } from "react-tweet";

export default function TweetRenderer({ content }: { content: string }) {
  // Regex buat mendeteksi link tweet: https://x.com/user/status/123456789 atau twitter.com
  const tweetUrlRegex = /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/gi;

  const matches = [...content.matchAll(tweetUrlRegex)];

  if (matches.length > 0) {
    // Ambil Tweet ID pertama yang dapet
    const tweetId = matches[0][2];

    return (
      <div className="my-6 flex justify-center light-theme-tweet">
        <Tweet id={tweetId} />
      </div>
    );
  }

  return null;
}