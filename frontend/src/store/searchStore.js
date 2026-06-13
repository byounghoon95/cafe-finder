import { create } from "zustand";

export const DEFAULT_CENTER = {
  lat: 37.5446,
  lng: 127.0559,
};

export const RADIUS_OPTIONS = [300, 500, 1000];

export const useSearchStore = create((set) => ({
  selectedPoint: null,
  radiusMeters: 500,
  setSelectedPoint: (selectedPoint) => set({ selectedPoint }),
  setRadiusMeters: (radiusMeters) => set({ radiusMeters }),
}));
