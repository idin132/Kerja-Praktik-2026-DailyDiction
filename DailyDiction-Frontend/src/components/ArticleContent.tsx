"use client";

import React from "react";

export default function ArticleContent({ content }: { content: string }) {
  if (!content) {
    return (
      <div className="p-4 my-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-sm">
        Konten artikel kosong atau gagal dimuat dari server.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx global>{`
        .rich-text-content {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #d1d5db;
        }

        .rich-text-content p {
          margin-bottom: 1.25em !important;
          line-height: 1.8 !important;
          text-align: justify !important;
        }

        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3,
        .rich-text-content h4,
        .rich-text-content h5,
        .rich-text-content h6 {
          color: #FFD700 !important;
          font-weight: 900 !important;
          margin-top: 2em !important;
          margin-bottom: 0.75em !important;
          line-height: 1.3 !important;
          text-align: left !important;
          display: block !important;
          clear: both !important;
        }

        .rich-text-content figure {
          margin: 2rem 0 !important;
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          clear: both !important;
        }

        .rich-text-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.75rem !important;
          margin: 1.5rem auto !important;
          display: block !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
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
          aspect-ratio: 16 / 9 !important;
          height: auto !important;
          min-height: 360px !important;
          border-radius: 0.75rem !important;
          margin: 2rem 0 !important;
          border: 0 !important;
          display: block !important;
        }
      `}</style>
    </div>
  );
}