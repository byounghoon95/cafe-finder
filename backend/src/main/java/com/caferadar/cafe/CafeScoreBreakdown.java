package com.caferadar.cafe;

public record CafeScoreBreakdown(
        int ratingScore,
        int distanceScore,
        int workFriendlyScore,
        int popularityScore
) {
}
