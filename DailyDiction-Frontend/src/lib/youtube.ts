// src/lib/youtube.ts

export async function getYouTubeVideos(limit = 15) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  if (!API_KEY || !CHANNEL_ID) {
    console.error("YouTube API Key atau Channel ID belum disetting di .env!");
    return [];
  }

  try {
    // TRIK SUPER: Ambil dari Playlist "Uploads" bawaan channel.
    // Dijamin 100% urut dari yang paling baru & ngirit kuota API 99%!
    // Caranya: Ganti 2 huruf awal Channel ID (UC) jadi (UU)
    const UPLOADS_PLAYLIST_ID = CHANNEL_ID.replace(/^UC/, 'UU');

    // 1. Ambil list video dari playlist uploads
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=${limit}&key=${API_KEY}`,
      { cache: 'no-store' } // Matikan cache biar paksa tarik video terbaru
    );
    
    if (!playlistRes.ok) throw new Error("Gagal fetch data playlist YouTube");
    const playlistData = await playlistRes.json();
    
    // Gabungin ID video buat ditarik detail durasinya
    const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');

    // 2. Ambil detail durasi buat misahin mana Shorts mana Video Biasa
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${API_KEY}`,
      { cache: 'no-store' }
    );

    if (!videoRes.ok) throw new Error("Gagal fetch detail video YouTube");
    const videoData = await videoRes.json();

    return videoData.items; // Berisi array video lengkap terbaru
  } catch (error) {
    console.error("Error fetching YouTube:", error);
    return [];
  }
}