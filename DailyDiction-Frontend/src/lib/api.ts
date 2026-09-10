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
  position?: "sidebar" | "horizontal" | string;
  type?: "banner" | "script" | string;
  banner_image?: string;
  image_url?: string;
  url_link?: string;
  link_url?: string;
  script_code?: string;
  is_active?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

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
  if (cleanPath.startsWith("storage/")) {
    return `https://dailydiction.id/${cleanPath}`;
  }

  return `https://dailydiction.id/storage/${cleanPath}`;
}

export async function getAdvertisements(): Promise<{ data: AdvertisementItem[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/advertisements`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return { data: [] };
    const json = await res.json();
    const rawData = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json)
      ? json
      : [];

    const formattedData = rawData.map((item: any) => ({
      ...item,
      image_url: formatImageUrl(item.banner_image || item.image_url || item.image),
      link_url: item.url_link || item.link_url || "#",
    }));

    return { data: formattedData };
  } catch (error) {
    console.warn("Gagal mengambil data iklan:", error);
    return { data: [] };
  }
}

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

export async function getArticleBySlug(slug: string): Promise<ArticleItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    
    // Unbox data dari json.data jika ada
    const result = json.data || json;

    if (!result || !result.title) return null;

    return {
      ...result,
      image_url: formatImageUrl(result.image_url || result.image_full_url || result.image || result.thumbnail),
    };
  } catch (error) {
    console.error("Gagal mengambil article detail:", error);
    return null;
  }
}

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

export async function getGameReviewBySlug(slug: string): Promise<ArticleItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/${slug}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const result = json.data || json;
      if (result && result.title) {
        return {
          ...result,
          image_url: formatImageUrl(result.image_url || result.image_full_url || result.image || result.thumbnail),
        };
      }
    }

    const fallbackRes = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (fallbackRes.ok) {
      const fbJson = await fallbackRes.json();
      const result = fbJson.data || fbJson;
      if (result && result.title) {
        return {
          ...result,
          image_url: formatImageUrl(result.image_url || result.image_full_url || result.image || result.thumbnail),
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Gagal mengambil review detail:", error);
    return null;
  }
}

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

// Dipanggil saat artikel/review dibuka
export async function trackArticleView(slug: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/articles/${slug}/view`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
  } catch {
    // Silent fail — jangan sampai ganggu UX kalau endpoint gagal
  }
}

// Ambil trending articles
export async function getTrendingArticles(): Promise<ArticleItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/trending`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }, // cache 5 menit, bukan no-store
    });

    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Gagal mengambil trending articles:", error);
    return [];
  }
}