"use client";

import { useEffect } from "react";

export default function TwitterEmbedHandler() {
  useEffect(() => {
    const loadTwitter = () => {
      if ((window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets.load();
      }
    };

    // Trigger pertama saat halaman loaded
    loadTwitter();

    // Jaga-jaga delay load script Twitter
    const timer1 = setTimeout(loadTwitter, 500);
    const timer2 = setTimeout(loadTwitter, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return null;
}