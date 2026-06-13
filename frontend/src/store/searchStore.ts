import { create } from "zustand";

export type RadiusMeters = 300 | 500 | 1000;

type SearchState = {
  radiusMeters: RadiusMeters;
  setRadiusMeters: (radiusMeters: RadiusMeters) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  radiusMeters: 500,
  setRadiusMeters: (radiusMeters) => set({ radiusMeters }),
}));
