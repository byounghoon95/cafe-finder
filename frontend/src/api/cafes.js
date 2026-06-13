const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export async function fetchNearbyCafes({ selectedPoint, radiusMeters }) {
  if (!selectedPoint) {
    return null;
  }

  const params = new URLSearchParams({
    lat: selectedPoint.lat.toFixed(6),
    lng: selectedPoint.lng.toFixed(6),
    radius: String(radiusMeters),
  });

  const response = await fetch(`${API_BASE_URL}/api/cafes/nearby?${params}`);

  if (!response.ok) {
    throw new Error(`Nearby cafe request failed with ${response.status}`);
  }

  return response.json();
}
