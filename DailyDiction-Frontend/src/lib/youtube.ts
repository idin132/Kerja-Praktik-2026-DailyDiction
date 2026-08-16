// src/lib/youtube.ts

export async function getYouTubeVideos(limit = 10) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  if (!API_KEY || !CHANNEL_ID) {
    console.error("YouTube API Key atau Channel ID belum disetting di .env!");
    return [];
  }

  try {
    // 1. Ambil list video terbaru dari channel
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${limit}&order=date&type=video&key=${API_KEY}`,
      { next: { revalidate: 3600 } } // Cache 1 jam biar kuota 10.000 unit/hari super awet!
    );
    
    if (!searchRes.ok) throw new Error("Gagal fetch data search YouTube");
    const searchData = await searchRes.json();
    
    // Gabungin ID video buat ditarik detail durasinya
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    // 2. Ambil detail durasi buat misahin mana Shorts mana Video Biasa
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!videoRes.ok) throw new Error("Gagal fetch detail video YouTube");
    const videoData = await videoRes.json();

    return videoData.items; // Berisi array video lengkap dengan thumbnail & durasi
  } catch (error) {
    console.error("Error fetching YouTube:", error);
    return [];
  }
}