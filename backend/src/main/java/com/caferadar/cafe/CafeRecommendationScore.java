package com.caferadar.cafe;

import java.util.List;

public record CafeRecommendationScore(
        int recommendationScore,
        CafeScoreBreakdown scoreBreakdown,
        List<String> reasons
) {
}
