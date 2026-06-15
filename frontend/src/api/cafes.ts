import { getJson } from "./client";
import type { Cafe } from "../types";
import type {
  CafeSort,
  RadiusMeters,
  SearchFilters,
  SearchPoint,
} from "../store/searchStore";

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
  filters: SearchFilters;
};

export async function fetchNearbyCafes({
  selectedPoint,
  radiusMeters,
  sort,
  filters,
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

  if (filters.openNow) {
    params.set("openNow", "true");
  }

  if (filters.hasWifi) {
    params.set("hasWifi", "true");
  }

  if (filters.hasPower) {
    params.set("hasPower", "true");
  }

  if (filters.priceLevels.length > 0) {
    params.set("priceLevel", filters.priceLevels.join(","));
  }

  if (filters.tags.length > 0) {
    params.set("tags", filters.tags.join(","));
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5000);

  try {
    return await getJson<NearbyCafesResponse>(`/api/cafes/nearby?${params}`, {
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("주변 카페 검색 시간이 초과되었습니다.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
