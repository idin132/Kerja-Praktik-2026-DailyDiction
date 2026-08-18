<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class YoutubeController extends Controller
{
    private $apiKey;
    private $channelId;

    public function __construct()
    {
        // Narik data dari .env
        $this->apiKey = env('YOUTUBE_API_KEY');
        $this->channelId = env('YOUTUBE_CHANNEL_ID');
    }

    public function getYoutubeVideos()
    {
        // Mengambil TTL 3600 detik (1 jam) dari file .env
        $ttl = env('YOUTUBE_CACHE_TTL', 3600);

        return Cache::remember('youtube_videos_cache', $ttl, function () {
            // PERHATIKAN: URL-nya pakai playlistItems, bukan search!
            $response = Http::get('https://youtube.googleapis.com/youtube/v3/playlistItems', [
                'part' => 'snippet',
                'playlistId' => env('YOUTUBE_PLAYLIST_ID'),
                'maxResults' => 10,
                'key' => env('YOUTUBE_API_KEY')
            ]);

            return $response->json();
        });
    }
    public function getVideos()
    {
        // Cache selama 1 jam (3600 detik)
        $videos = Cache::remember('youtube_long_videos', 3600, function () {
            return $this->fetchFromYoutube(false); // false = ambil video panjang
        });

        return response()->json(['data' => $videos]);
    }

    public function getShorts()
    {
        // Cache selama 1 jam
        $shorts = Cache::remember('youtube_shorts', 3600, function () {
            return $this->fetchFromYoutube(true); // true = ambil shorts
        });

        return response()->json(['data' => $shorts]);
    }

    private function fetchFromYoutube($isShort = false)
    {
        if (!$this->apiKey || !$this->channelId) {
            return [];
        }

        // 1. Ambil 15 video terbaru dari channel
        $searchResponse = Http::get('https://www.googleapis.com/youtube/v3/search', [
            'key' => $this->apiKey,
            'channelId' => $this->channelId,
            'part' => 'snippet',
            'order' => 'date',
            'maxResults' => 15,
            'type' => 'video'
        ]);

        if (!$searchResponse->successful()) {
            return [];
        }

        $items = $searchResponse->json()['items'] ?? [];
        if (empty($items)) return [];

        // Kumpulin ID videonya buat ngecek durasi detailnya
        $videoIds = collect($items)->pluck('id.videoId')->filter()->implode(',');

        // 2. Tembak API lagi buat ngecek durasi (contentDetails)
        $videoResponse = Http::get('https://www.googleapis.com/youtube/v3/videos', [
            'key' => $this->apiKey,
            'id' => $videoIds,
            'part' => 'snippet,contentDetails'
        ]);

        $videoDetails = $videoResponse->json()['items'] ?? [];
        $formattedData = [];

        foreach ($videoDetails as $video) {
            $duration = $video['contentDetails']['duration']; // Formatnya ISO 8601 (contoh: PT1M30S)

            // Logic ngecek durasi: Kalau nggak ada huruf 'M' (menit) atau 'H' (jam), berarti cuma detik (Shorts)
            // Atau kalau persis 1 menit (PT1M / PT1M0S) juga dihitung Shorts
            $isDurationShort = (strpos($duration, 'M') === false && strpos($duration, 'H') === false) || $duration === 'PT1M' || $duration === 'PT1M0S';

            // Filter sesuai permintaan yang manggil
            if ($isShort && !$isDurationShort) continue;
            if (!$isShort && $isDurationShort) continue;

            $formattedData[] = [
                'id' => $video['id'],
                'title' => $video['snippet']['title'],
                // Ambil gambar kualitas paling tinggi (maxres), kalau ga ada pakai (high)
                'thumbnail' => $video['snippet']['thumbnails']['maxres']['url'] ?? $video['snippet']['thumbnails']['high']['url'] ?? '',
                'link' => $isShort ? 'https://www.youtube.com/shorts/' . $video['id'] : 'https://www.youtube.com/watch?v=' . $video['id'],
            ];
        }

        // Kirim 5 video aja ke Frontend biar sesuai sama Carousel yang tadi kita bikin
        return array_slice($formattedData, 0, 5);
    }
}
