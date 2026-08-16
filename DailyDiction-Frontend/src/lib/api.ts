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
    return json.data || json;
  } catch (error) {
    return null;
  }
}

// 6. Fetch Single Review by Slug
export async function getGameReviewBySlug(slug: string) {
  try {
    // Karena tabelnya sudah gabung, single review juga nembak ke /articles/{slug}
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return null;
    
    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.error("Error fetching review by slug:", error);
    return null;
  }
}