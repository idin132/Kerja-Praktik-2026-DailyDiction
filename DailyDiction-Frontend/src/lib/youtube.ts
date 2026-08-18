// src/lib/youtube.ts

const FALLBACK_VIDEOS = [
  {
    id: "gCNeDWCI0vo",
    snippet: {
      title: "Daily Diction Gaming News & Updates",
      description: "Tonton rangkuman berita dan video game terkini.",
      publishedAt: new Date().toISOString(),
      thumbnails: {
        high: {
          url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
        },
      },
    },
    contentDetails: {
      duration: "PT5M30S",
    },
  },
];

export async function getYouTubeVideos(limit = 50) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  if (!API_KEY || !CHANNEL_ID) {
    console.warn(
      "⚠️ YouTube API Key / Channel ID belum disetting di .env. Menggunakan data fallback.",
    );
    return FALLBACK_VIDEOS;
  }

  try {
    const UPLOADS_PLAYLIST_ID = CHANNEL_ID.replace(/^UC/, "UU");

    // 1. Ambil list video dari playlist uploads (Cache 5 menit / 300 detik)
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=${limit}&key=${API_KEY}`,
      { next: { revalidate: 300 } },
    );

    if (!playlistRes.ok) {
      console.warn(
        "⚠️ Gagal fetch playlist YouTube. Status:",
        playlistRes.status,
      );
      return FALLBACK_VIDEOS;
    }

    const playlistData = await playlistRes.json();
    const items = playlistData?.items || [];

    if (items.length === 0) return FALLBACK_VIDEOS;

    // Ambil ID video
    const videoIds = items
      .map((item: any) => item.contentDetails?.videoId)
      .filter(Boolean)
      .join(",");

    if (!videoIds) return FALLBACK_VIDEOS;

    // 2. Ambil detail durasi (Cache 5 menit / 300 detik)
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${API_KEY}`,
      { next: { revalidate: 300 } },
    );

    if (!videoRes.ok) {
      console.warn(
        "⚠️ Gagal fetch detail video YouTube. Status:",
        videoRes.status,
      );
      return FALLBACK_VIDEOS;
    }

    const videoData = await videoRes.json();
    const rawVideos = videoData?.items || [];

    if (rawVideos.length === 0) return FALLBACK_VIDEOS;

    // 3. KUNCI UTAMA: Urutkan ulang secara presisi dari tanggal publishedAt terbaru ke terlama
    const sortedVideos = rawVideos.sort((a: any, b: any) => {
      const dateA = new Date(a.snippet?.publishedAt || 0).getTime();
      const dateB = new Date(b.snippet?.publishedAt || 0).getTime();
      return dateB - dateA; // Descending (Terbaru di paling atas/depan)
    });

    return sortedVideos;
  } catch (error) {
    console.error("Error fetching YouTube:", error);
    return FALLBACK_VIDEOS;
  }
}
