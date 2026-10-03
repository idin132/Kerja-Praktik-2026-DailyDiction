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

function safeContentToString(content: any): string {
  if (!content) return "";

  let rawString = "";

  if (typeof content === "string") {
    rawString = content;
  } else if (Array.isArray(content)) {
    rawString = content
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null) {
          return item.content || item.html || item.text || item.value || item.url || "";
        }
        return String(item);
      })
      .join("");
  } else if (typeof content === "object" && content !== null) {
    rawString = content.content || content.html || content.text || content.value || content.url || "";
  } else {
    rawString = String(content);
  }

  return rawString;
}

export default function ArticleContent({ content }: { content: any }) {
  const safeHtml = safeContentToString(content);

  if (!safeHtml) return null;

  return <TweetRenderer htmlContent={safeHtml} />;
}