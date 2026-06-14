package com.caferadar.cafe;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.Test;

class CafeRecommendationScoringServiceTest {

    private final CafeRecommendationScoringService scoringService = new CafeRecommendationScoringService();

    @Test
    void scoreUsesWeightedBreakdownAndReasons() {
        CafeRecommendationScore score = scoringService.score(cafe(
                50,
                4.5,
                250,
                true,
                true,
                80,
                40
        ), 500);

        assertThat(score.recommendationScore()).isEqualTo(85);
        assertThat(score.scoreBreakdown()).isEqualTo(new CafeScoreBreakdown(90, 90, 90, 80, 50));
        assertThat(score.reasons()).containsExactly(
                "Very close to the selected point.",
                "Wifi and power outlets make it good for working.",
                "Quietness score is high for this dataset."
        );
    }

    @Test
    void scoreClampsEdgeCasesToZeroAndOneHundred() {
        CafeRecommendationScore score = scoringService.score(cafe(
                1200,
                6.0,
                800,
                true,
                true,
                140,
                200
        ), 1000);

        assertThat(score.recommendationScore()).isEqualTo(75);
        assertThat(score.scoreBreakdown()).isEqualTo(new CafeScoreBreakdown(100, 0, 100, 100, 100));
        assertThat(score.reasons().size()).isLessThanOrEqualTo(4);
    }

    @Test
    void scoreProvidesFallbackReasonForWeakMatches() {
        CafeRecommendationScore score = scoringService.score(cafe(
                500,
                2.0,
                5,
                false,
                false,
                30,
                10
        ), 500);

        assertThat(score.recommendationScore()).isBetween(0, 100);
        assertThat(score.reasons()).containsExactly("Balanced option based on distance, rating, and amenities.");
    }

    private NearbyCafeResultResponse cafe(
            int distanceMeters,
            double rating,
            int reviews,
            boolean hasWifi,
            boolean hasPower,
            int quietScore,
            int seatCount
    ) {
        return new NearbyCafeResultResponse(
                1L,
                "Demo Cafe",
                "Seongsu",
                "1 Demo-ro, Seoul",
                BigDecimal.valueOf(37.5),
                BigDecimal.valueOf(127.0),
                distanceMeters,
                BigDecimal.valueOf(rating),
                reviews,
                2,
                LocalTime.of(8, 0),
                LocalTime.of(22, 0),
                true,
                hasWifi,
                hasPower,
                quietScore,
                seatCount,
                List.of("work-friendly"),
                0,
                new CafeScoreBreakdown(0, 0, 0, 0, 0),
                List.of()
        );
    }
}
