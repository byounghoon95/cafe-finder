import { create } from "zustand";

export type RadiusMeters = 300 | 500 | 1000;

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
  setSelectedPoint: (selectedPoint: SearchPoint) => void;
  setRadiusMeters: (radiusMeters: RadiusMeters) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  selectedPoint: null,
  radiusMeters: 500,
  setSelectedPoint: (selectedPoint) => set({ selectedPoint }),
  setRadiusMeters: (radiusMeters) => set({ radiusMeters }),
}));
