const API_BASE_URL = "https://dailydiction.id/api/v1";
import https from "https";

// 1. Fetch Berita / Artikel (Hanya yang type = article)
export async function getArticles() {
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, { cache: "no-store" });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (error) {
    return { data: [] };
  }
}

// 2. Fetch Game Reviews (Hanya yang type = review)
export async function getGameReviews() {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

    // Bypass SSL rejection hanya saat environment development / self-signed
    const res = await fetch(`${apiUrl}/reviews`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      // @ts-ignore
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    if (!res.ok) {
      console.warn(`Fetch reviews status: ${res.status}`);
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching game reviews:", error);
    return [];
  }
}

// 3. Fetch Sponsors
export async function getSponsors() {
  try {
    const res = await fetch(`${API_BASE_URL}/sponsors`, { cache: "no-store" });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (error) {
    return { data: [] };
  }
}

// 4. Fetch Advertisements
export async function getAdvertisements() {
  try {
    const res = await fetch(`${API_BASE_URL}/advertisements`, {
      cache: "no-store",
    });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (error) {
    return { data: [] };
  }
}

// 5. Fetch Single Article by Slug
export async function getArticleBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const json = await res.json();

    // Otomatis ekstrak 'data' jika Laravel membungkus responnya
    return json.data || json;
  } catch (error) {
    return null;
  }
}

// 6. Fetch Single Review by Slug
export async function getGameReviewBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    
    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.error("Error fetching review by slug:", error);
    return null;
  }
}
