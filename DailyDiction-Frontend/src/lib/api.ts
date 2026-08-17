const API_BASE_URL = "https://dailydiction.id/api/v1";

// 1. Fetch Berita / Artikel
export async function getArticles() {
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (error) {
    return { data: [] };
  }
}

// 2. Fetch Game Reviews
export async function getGameReviews() {
  try {
    // Pastikan URL-nya benar pakai 'reviews' (pakai s)
    // cache: 'no-store' WAJIB ADA biar Next.js selalu ambil data terbaru
    const res = await fetch("https://dailydiction.id/api/v1/reviews", {
      cache: "no-store", 
    });
    
    if (!res.ok) {
      throw new Error("Gagal mengambil data review");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching game reviews:", error);
    return []; // Kalau error, kembalikan array kosong biar web ga nge-crash
  }
}

// 3. Fetch Sponsors
export async function getSponsors() {
  try {
    const res = await fetch(`${API_BASE_URL}/sponsors`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (error) {
    return { data: [] };
  }
}

// 4. Fetch Advertisements
export async function getAdvertisements() {
  try {
    const res = await fetch(`${API_BASE_URL}/advertisements`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (error) {
    return { data: [] };
  }
}

// 5. Fetch Single Article by Slug
export async function getArticleBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null; 
    
    const json = await res.json();
    
    // Otomatis ekstrak 'data' jika Laravel membungkus responnya
    return json.data || json;
  } catch (error) {
    return null;
  }
}

export async function getGameReviewBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/${slug}`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching review by slug:", error);
    return null;
  }
}