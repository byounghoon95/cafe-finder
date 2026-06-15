export type ScoreBreakdown = {
  ratingScore: number;
  distanceScore: number;
  workFriendlyScore: number;
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
  seatCount: number;
  tags: string[];
  recommendationScore: number;
  scoreBreakdown: ScoreBreakdown;
  reasons: string[];
};
