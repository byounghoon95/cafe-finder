export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type RadiusMeters = 300 | 500 | 1000;

export type CafeSort = "recommendation" | "distance" | "rating" | "reviews" | "quiet";

export type ScoreBreakdown = {
  ratingScore: number;
  distanceScore: number;
  workFriendlyScore: number;
  quietScore: number;
  popularityScore: number;
};

export type Cafe = {
  id: number;
  name: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  rating: number;
  reviewCount: number;
  priceLevel: number;
  opensAt: string;
  closesAt: string;
  openNow: boolean;
  hasWifi: boolean;
  hasPower: boolean;
  quietScore: number;
  seatCount: number;
  tags: string[];
  recommendationScore: number;
  scoreBreakdown: ScoreBreakdown;
  reasons: string[];
};

export type NearbyCafeResponse = {
  query: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
    sort: CafeSort;
  };
  cafes: Cafe[];
};
