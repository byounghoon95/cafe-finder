import { create } from "zustand";

export type RadiusMeters = 300 | 500 | 1000;

export type CafeSort = "recommendation" | "distance" | "rating" | "reviews" | "quiet";

export type SearchPoint = {
  lat: number;
  lng: number;
};

export type SearchFilters = {
  openNow: boolean;
  hasWifi: boolean;
  hasPower: boolean;
  quiet: boolean;
  priceLevels: number[];
  tags: string[];
};

export const defaultCenter: SearchPoint = {
  lat: 37.5446,
  lng: 127.0559,
};

export const radiusOptions = [300, 500, 1000] as const;
export const priceLevelOptions = [1, 2, 3, 4] as const;
export const tagOptions = [
  "작업하기 좋음",
  "디저트",
  "조용함",
  "스페셜티 커피",
] as const;

export const defaultFilters: SearchFilters = {
  openNow: false,
  hasWifi: false,
  hasPower: false,
  quiet: false,
  priceLevels: [],
  tags: [],
};

type SearchState = {
  selectedPoint: SearchPoint | null;
  radiusMeters: RadiusMeters;
  sort: CafeSort;
  filters: SearchFilters;
  selectedCafeId: number | null;
  setSelectedPoint: (selectedPoint: SearchPoint) => void;
  setRadiusMeters: (radiusMeters: RadiusMeters) => void;
  setSort: (sort: CafeSort) => void;
  setBooleanFilter: (
    filter: keyof Pick<SearchFilters, "openNow" | "hasWifi" | "hasPower" | "quiet">,
    value: boolean,
  ) => void;
  togglePriceLevel: (priceLevel: number) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  setSelectedCafeId: (selectedCafeId: number | null) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  selectedPoint: null,
  radiusMeters: 500,
  sort: "recommendation",
  filters: defaultFilters,
  selectedCafeId: null,
  setSelectedPoint: (selectedPoint) => set({ selectedPoint, selectedCafeId: null }),
  setRadiusMeters: (radiusMeters) => set({ radiusMeters, selectedCafeId: null }),
  setSort: (sort) => set({ sort, selectedCafeId: null }),
  setBooleanFilter: (filter, value) =>
    set((state) => ({
      filters: { ...state.filters, [filter]: value },
      selectedCafeId: null,
    })),
  togglePriceLevel: (priceLevel) =>
    set((state) => {
      const hasPriceLevel = state.filters.priceLevels.includes(priceLevel);
      return {
        filters: {
          ...state.filters,
          priceLevels: hasPriceLevel
            ? state.filters.priceLevels.filter((level) => level !== priceLevel)
            : [...state.filters.priceLevels, priceLevel].sort(),
        },
        selectedCafeId: null,
      };
    }),
  toggleTag: (tag) =>
    set((state) => {
      const hasTag = state.filters.tags.includes(tag);
      return {
        filters: {
          ...state.filters,
          tags: hasTag
            ? state.filters.tags.filter((selectedTag) => selectedTag !== tag)
            : [...state.filters.tags, tag].sort(),
        },
        selectedCafeId: null,
      };
    }),
  clearFilters: () => set({ filters: defaultFilters, selectedCafeId: null }),
  setSelectedCafeId: (selectedCafeId) => set({ selectedCafeId }),
}));
