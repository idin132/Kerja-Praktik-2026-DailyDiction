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

// FUNGSI KONVERSI & SANITASI KETAT AGAR BEBAS REACT ERROR #60
function safeContentToString(content: any): string {
  if (!content) return "";

  // Jika content sudah berupa string
  if (typeof content === "string") {
    return content;
  }

  // Jika content berupa Array (misal dari Block Editor / JSON API)
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null) {
          return item.content || item.html || item.text || item.value || JSON.stringify(item);
        }
        return String(item);
      })
      .join("");
  }

  // Jika content berupa Single Object
  if (typeof content === "object") {
    return content.content || content.html || content.text || content.value || "";
  }

  return String(content);
}

export default function ArticleContent({ content }: { content: any }) {
  const safeHtml = safeContentToString(content);
  return <TweetRenderer htmlContent={safeHtml} />;
}