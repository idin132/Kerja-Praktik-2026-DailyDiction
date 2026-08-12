const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function getArticles() {
  const res = await fetch(`${API_BASE_URL}/articles`, {
    next: { revalidate: 60 }, // Incremental Static Regeneration (ISR)
  });
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export async function getArticleBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/articles/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function getGameReviews() {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}