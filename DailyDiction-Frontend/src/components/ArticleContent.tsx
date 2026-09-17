"use client";

import dynamic from "next/dynamic";

const TweetRenderer = dynamic(() => import("@/components/TweetRenderer"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4 my-8">
      <div className="h-4 bg-dark-card rounded w-3/4"></div>
      <div className="h-4 bg-dark-card rounded w-full"></div>
      <div className="h-4 bg-dark-card rounded w-5/6"></div>
    </div>
  ),
});

export default function ArticleContent({ content }: { content: string }) {
  return <TweetRenderer htmlContent={content} />;
}