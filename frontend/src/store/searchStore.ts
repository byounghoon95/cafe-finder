import { create } from "zustand";

export type RadiusMeters = 300 | 500 | 1000;

export type CafeSort = "recommendation" | "distance" | "rating" | "reviews" | "quiet";

export type SearchPoint = {
  lat: number;
  lng: number;
};

export const defaultCenter: SearchPoint = {
  lat: 37.5446,
  lng: 127.0559,
};

export const radiusOptions = [300, 500, 1000] as const;

type SearchState = {
  selectedPoint: SearchPoint | null;
  radiusMeters: RadiusMeters;
  sort: CafeSort;
  selectedCafeId: number | null;
  setSelectedPoint: (selectedPoint: SearchPoint) => void;
  setRadiusMeters: (radiusMeters: RadiusMeters) => void;
  setSort: (sort: CafeSort) => void;
  setSelectedCafeId: (selectedCafeId: number | null) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  selectedPoint: null,
  radiusMeters: 500,
  sort: "distance",
  selectedCafeId: null,
  setSelectedPoint: (selectedPoint) => set({ selectedPoint, selectedCafeId: null }),
  setRadiusMeters: (radiusMeters) => set({ radiusMeters, selectedCafeId: null }),
  setSort: (sort) => set({ sort, selectedCafeId: null }),
  setSelectedCafeId: (selectedCafeId) => set({ selectedCafeId }),
}));
