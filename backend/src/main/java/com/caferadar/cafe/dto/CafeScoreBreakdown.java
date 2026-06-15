package com.caferadar.cafe.dto;

public record CafeScoreBreakdown(
        int ratingScore,
        int distanceScore,
        int workFriendlyScore,
        int popularityScore
) {
}
