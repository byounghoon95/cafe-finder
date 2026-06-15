package com.caferadar.cafe;

import java.util.List;

import com.caferadar.cafe.dto.CafeScoreBreakdown;

public record CafeRecommendationScore(
        int recommendationScore,
        CafeScoreBreakdown scoreBreakdown,
        List<String> reasons
) {
}
