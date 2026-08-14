const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

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
    const res = await fetch(`${API_BASE_URL}/game-reviews`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (error) {
    return { data: [] };
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