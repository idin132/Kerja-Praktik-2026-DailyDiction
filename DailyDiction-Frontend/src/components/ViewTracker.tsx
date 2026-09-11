"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  slug: string;
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    if (!slug) return;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

    fetch(`${apiUrl}/articles/${slug}/view`, {
      method: "POST",
      headers: { Accept: "application/json" },
    }).catch(() => {
      // Silent fail — jangan sampai error ini ganggu halaman
    });
  }, [slug]);

  // Komponen ini tidak render apapun ke UI
  return null;
}
