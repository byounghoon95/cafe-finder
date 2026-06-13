import { getJson } from "./client";
import type { Cafe } from "../types/cafe";
import type { RadiusMeters, SearchPoint } from "../store/searchStore";

export type NearbyCafesResponse = {
  query: {
    latitude: number;
    longitude: number;
    radiusMeters: RadiusMeters;
    sort: string;
  };
  cafes: Cafe[];
};

type FetchNearbyCafesParams = {
  selectedPoint: SearchPoint | null;
  radiusMeters: RadiusMeters;
};

export async function fetchNearbyCafes({
  selectedPoint,
  radiusMeters,
}: FetchNearbyCafesParams): Promise<NearbyCafesResponse | null> {
  if (!selectedPoint) {
    return null;
  }

  const params = new URLSearchParams({
    lat: selectedPoint.lat.toFixed(6),
    lng: selectedPoint.lng.toFixed(6),
    radius: String(radiusMeters),
  });

  return getJson<NearbyCafesResponse>(`/api/cafes/nearby?${params}`);
}
