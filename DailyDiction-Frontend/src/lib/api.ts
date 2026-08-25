export interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  type?: "article" | "review" | "tech" | string;
  category?: string | string[];
  category_input?: string | string[];
  categories?: { id?: number; name: string }[] | any[];
  category_color?: string;
  summary: string;
  content?: string | any[];
  platform?: string | string[];
  thumbnail?: string;
  thumbnail_url?: string;
  image?: string;
  image_url?: string;
  image_full_url?: string;
  banner_image?: string;
  read_time?: string;
  created_at?: string;
  author?: string;
  prev?: ArticleItem | null;
  next?: ArticleItem | null;
}

export interface AdvertisementItem {
  id: number;
  title: string;
  banner_image?: string;
  url_link?: string;
  is_active?: boolean;
}

// FIX UTAMA: Arahin paksa ke XAMPP lokal lu biar nyambung sama database yang barusan lu edit!
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

// Helper Format Gambar Terpusat
export function formatImageUrl(
  imageUrl: string | null | undefined,
  fallback: string = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800"
): string {
  if (!imageUrl || typeof imageUrl !== "string") return fallback;

  const clean = imageUrl.trim();

  if (clean.includes("/storage/http://") || clean.includes("/storage/https://")) {
    return clean.replace(/^https?:\/\/[^\/]+\/storage\/(https?:\/\/)/i, "$1");
  }

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  const cleanPath = clean.replace(/^\/+/, "");
  
  // Kalau lagi jalan di localhost, tembak gambar ke local XAMPP juga
  if (API_BASE_URL.includes("127.0.0.1") || API_BASE_URL.includes("localhost")) {
      return `http://127.0.0.1:8000/storage/${cleanPath}`;
  }

  return `https://dailydiction.id/storage/${cleanPath}`;
}

// 1. Ambil Data Iklan
export async function getAdvertisements(): Promise<{ data: AdvertisementItem[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/advertisements`, {
      headers: { Accept: "application/json" },
      cache: "no-store", // Matiin cache
    });

    if (!res.ok) return { data: [] };
    const json = await res.json();
    return {
      data: Array.isArray(json.data)
        ? json.data
        : Array.isArray(json)
        ? json
        : [],
    };
  } catch (error) {
    console.warn("Gagal mengambil data iklan:", error);
    return { data: [] };
  }
}

// 2. Fetch Berita / Artikel (Type: article)
export async function getArticles(): Promise<{ data: ArticleItem[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles?type=article`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return { data: [] };
    const json = await res.json();
    const allData: ArticleItem[] = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json)
      ? json
      : [];

    return {
      data: allData.filter((item) => !item.type || item.type === "article"),
    };
  } catch (error) {
    console.error("Gagal mengambil articles:", error);
    return { data: [] };
  }
}

// 3. Fetch Single Article by Slug
export async function getArticleBySlug(slug: string): Promise<ArticleItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json || null;
  } catch (error) {
    console.error("Gagal mengambil article detail:", error);
    return null;
  }
}

// 4. Fetch Game Reviews
export async function getGameReviews(): Promise<ArticleItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
      if (data.length > 0) return data;
    }

    // Fallback jika route /reviews tidak tersedia
    const fallbackRes = await fetch(`${API_BASE_URL}/articles?type=review`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (fallbackRes.ok) {
      const fbJson = await fallbackRes.json();
      return Array.isArray(fbJson.data)
        ? fbJson.data
        : Array.isArray(fbJson)
        ? fbJson
        : [];
    }

    return [];
  } catch (error) {
    console.error("Gagal mengambil game reviews:", error);
    return [];
  }
}

// 5. Fetch Single Review by Slug
export async function getGameReviewBySlug(slug: string): Promise<ArticleItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/${slug}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const result = json.data || json;
      if (result && result.title) return result;
    }

    // Fallback ke endpoint /articles/{slug}
    const fallbackRes = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (fallbackRes.ok) {
      const fbJson = await fallbackRes.json();
      return fbJson.data || fbJson || null;
    }

    return null;
  } catch (error) {
    console.error("Gagal mengambil review detail:", error);
    return null;
  }
}

// 6. Fetch Sponsors
export async function getSponsors(): Promise<{ data: any[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/sponsors`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return { data: [] };
    const json = await res.json();
    return { data: Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [] };
  } catch (error) {
    console.error("Gagal mengambil data sponsors:", error);
    return { data: [] };
  }
}