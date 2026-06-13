import { getJson } from "./client";
import type { Cafe } from "../types";
import type { CafeSort, RadiusMeters, SearchPoint } from "../store/searchStore";

export type NearbyCafesResponse = {
  query: {
    latitude: number;
    longitude: number;
    radiusMeters: RadiusMeters;
    sort: CafeSort;
  };
  cafes: Cafe[];
};

type FetchNearbyCafesParams = {
  selectedPoint: SearchPoint | null;
  radiusMeters: RadiusMeters;
  sort: CafeSort;
};

export async function fetchNearbyCafes({
  selectedPoint,
  radiusMeters,
  sort,
}: FetchNearbyCafesParams): Promise<NearbyCafesResponse | null> {
  if (!selectedPoint) {
    return null;
  }

  const params = new URLSearchParams({
    lat: selectedPoint.lat.toFixed(6),
    lng: selectedPoint.lng.toFixed(6),
    radius: String(radiusMeters),
    sort,
  });

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5000);

  try {
    return await getJson<NearbyCafesResponse>(`/api/cafes/nearby?${params}`, {
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Nearby cafe search timed out.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
