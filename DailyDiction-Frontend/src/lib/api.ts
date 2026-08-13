const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

// ... fungsi articles & reviews yang lain ...

export async function getSponsors() {
  try {
    // Pakai ${API_BASE_URL} biar otomatis masuk ke /api/v1/sponsors
    const res = await fetch(`${API_BASE_URL}/sponsors`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (error) {
    return { data: [] };
  }
}

export async function getAdvertisements() {
  try {
    // Pakai ${API_BASE_URL} biar otomatis masuk ke /api/v1/advertisements
    const res = await fetch(`${API_BASE_URL}/advertisements`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (error) {
    return { data: [] };
  }
}