package com.caferadar.cafe;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class CafeRecommendationScoringService {

    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);
    private static final BigDecimal FIVE = BigDecimal.valueOf(5);
    private static final BigDecimal RATING_WEIGHT = BigDecimal.valueOf(0.30);
    private static final BigDecimal DISTANCE_WEIGHT = BigDecimal.valueOf(0.25);
    private static final BigDecimal WORK_FRIENDLY_WEIGHT = BigDecimal.valueOf(0.20);
    private static final BigDecimal QUIET_WEIGHT = BigDecimal.valueOf(0.15);
    private static final BigDecimal POPULARITY_WEIGHT = BigDecimal.valueOf(0.10);

    public CafeRecommendationScore score(NearbyCafeResultResponse cafe, int radiusMeters) {
        int ratingScore = percentage(cafe.rating(), FIVE);
        int distanceScore = distanceScore(cafe.distanceMeters(), radiusMeters);
        int workFriendlyScore = workFriendlyScore(cafe.hasWifi(), cafe.hasPower(), cafe.seatCount());
        int quietScore = clamp(cafe.quietScore());
        int popularityScore = percentage(BigDecimal.valueOf(cafe.reviewCount()), BigDecimal.valueOf(500));

        CafeScoreBreakdown breakdown = new CafeScoreBreakdown(
                ratingScore,
                distanceScore,
                workFriendlyScore,
                quietScore,
                popularityScore
        );

        return new CafeRecommendationScore(
                weightedScore(breakdown),
                breakdown,
                reasons(cafe, distanceScore, workFriendlyScore, quietScore, popularityScore)
        );
    }

    private int weightedScore(CafeScoreBreakdown breakdown) {
        BigDecimal score = BigDecimal.ZERO
                .add(BigDecimal.valueOf(breakdown.ratingScore()).multiply(RATING_WEIGHT))
                .add(BigDecimal.valueOf(breakdown.distanceScore()).multiply(DISTANCE_WEIGHT))
                .add(BigDecimal.valueOf(breakdown.workFriendlyScore()).multiply(WORK_FRIENDLY_WEIGHT))
                .add(BigDecimal.valueOf(breakdown.quietScore()).multiply(QUIET_WEIGHT))
                .add(BigDecimal.valueOf(breakdown.popularityScore()).multiply(POPULARITY_WEIGHT));

        return clamp(score.setScale(0, RoundingMode.HALF_UP).intValue());
    }

    private int distanceScore(int distanceMeters, int radiusMeters) {
        if (radiusMeters <= 0) {
            return 0;
        }
        BigDecimal remaining = BigDecimal.valueOf(Math.max(0, radiusMeters - distanceMeters));
        return percentage(remaining, BigDecimal.valueOf(radiusMeters));
    }

    private int workFriendlyScore(boolean hasWifi, boolean hasPower, int seatCount) {
        int score = 0;
        if (hasWifi) {
            score += 40;
        }
        if (hasPower) {
            score += 40;
        }
        score += percentage(BigDecimal.valueOf(Math.max(0, seatCount)), BigDecimal.valueOf(80)) / 5;
        return clamp(score);
    }

    private int percentage(BigDecimal value, BigDecimal max) {
        if (max.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        return clamp(value.multiply(ONE_HUNDRED).divide(max, 0, RoundingMode.HALF_UP).intValue());
    }

    private List<String> reasons(
            NearbyCafeResultResponse cafe,
            int distanceScore,
            int workFriendlyScore,
            int quietScore,
            int popularityScore
    ) {
        List<String> reasons = new ArrayList<>();

        if (distanceScore >= 85) {
            reasons.add("Very close to the selected point.");
        } else if (distanceScore >= 60) {
            reasons.add("Close to the selected point.");
        }

        if (cafe.hasWifi() && cafe.hasPower()) {
            reasons.add("Wifi and power outlets make it good for working.");
        } else if (workFriendlyScore >= 50) {
            reasons.add("Work-friendly amenities are available.");
        }

        if (quietScore >= 70) {
            reasons.add("Quietness score is high for this dataset.");
        }

        if (popularityScore >= 70) {
            reasons.add("Review count is strong for this demo dataset.");
        }

        if (reasons.isEmpty()) {
            reasons.add("Balanced option based on distance, rating, and amenities.");
        }

        return reasons.stream().limit(4).toList();
    }

    private int clamp(int value) {
        return Math.max(0, Math.min(100, value));
    }
}
