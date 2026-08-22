<<<<<<< HEAD
export interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  type?: "article" | "review" | string;
  category?: string | string[];
  category_color?: string;
  summary: string;
  content?: string;
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

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
  if (cleanPath.startsWith("storage/")) {
    return `https://dailydiction.id/${cleanPath}`;
  }

  return `https://dailydiction.id/storage/${cleanPath}`;
}

// 1. Ambil Data Iklan
export async function getAdvertisements(): Promise<{ data: AdvertisementItem[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/advertisements`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
=======
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

// 1. Fetch Berita / Artikel (Hanya yang type = article)
export async function getArticles() {
  try {
    // Tambahkan query param ?type=article
    const res = await fetch(`${API_BASE_URL}/articles?type=article`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (error) {
    return { data: [] };
  }
}

// 2. Fetch Game Reviews (Hanya yang type = review)
export async function getGameReviews() {
  try {
    // Ubah URL dari /reviews menjadi /articles?type=review
    const res = await fetch(`${API_BASE_URL}/articles?type=review`, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil data review");
    return await res.json();
  } catch (error) {
    console.error("Error fetching game reviews:", error);
    return { data: [] }; // Samakan format return dengan article agar map() tidak error
  }
}
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469

    if (!res.ok) return { data: [] };
    const json = await res.json();
<<<<<<< HEAD
    return { data: Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [] };
=======
    return json.data || json;
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
  } catch (error) {
    console.warn("Gagal mengambil data iklan:", error);
    return { data: [] };
  }
}

// 2. Ambil List Berita (Type: Article) -> Langsung return Array
export async function getArticles(): Promise<ArticleItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const json = await res.json();
    const allData: ArticleItem[] = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
    return allData.filter((item) => !item.type || item.type === "article");
  } catch (error) {
    console.error("Gagal mengambil articles:", error);
    return [];
  }
}

// 3. Ambil Detail Berita Berdasarkan Slug -> Langsung return ArticleItem | null
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

<<<<<<< HEAD
// 4. Ambil List Review Game (Type: Review) -> Langsung return Array
export async function getGameReviews(): Promise<ArticleItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
=======
// 6. Fetch Single Review by Slug
export async function getGameReviewBySlug(slug: string) {
  try {
    // Karena tabelnya sudah gabung, single review juga nembak ke /articles/{slug}
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, { 
      next: { revalidate: 60 } 
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
    });

    if (!res.ok) return [];
    const json = await res.json();
    const allData: ArticleItem[] = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
    return allData.filter((item) => item.type === "review");
  } catch (error) {
    console.error("Gagal mengambil game reviews:", error);
    return [];
  }
}

// 5. Ambil Detail Review Berdasarkan Slug -> Langsung return ArticleItem | null
export async function getGameReviewBySlug(slug: string): Promise<ArticleItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;
    
    const json = await res.json();
<<<<<<< HEAD
    return json.data || json || null;
=======
    return json.data || json;
>>>>>>> b5190bdb7b908a673a20e2907e37306e14a31469
  } catch (error) {
    console.error("Gagal mengambil review detail:", error);
    return null;
  }
}