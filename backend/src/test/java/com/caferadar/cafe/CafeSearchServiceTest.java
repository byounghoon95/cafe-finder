package com.caferadar.cafe;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class CafeSearchServiceTest {

    private final CafeRepository cafeRepository = Mockito.mock(CafeRepository.class);
    private final CafeSearchService service = new CafeSearchService(
            cafeRepository,
            new CafeRecommendationScoringService(),
            Clock.fixed(Instant.parse("2026-06-13T03:00:00Z"), ZoneId.of("Asia/Seoul"))
    );

    @Test
    void searchFiltersNearbyCafes() {
        when(cafeRepository.findWithinRadius(37.5, 127.0, 500))
                .thenReturn(List.of(
                        view(1L, "Close Cafe", 80.0, 4.6, 120, 2, true, true, "work-friendly"),
                        view(2L, "Far Cafe", 420.0, 4.9, 500, 3, true, false, "dessert"),
                        view(3L, "No Wifi", 120.0, 4.7, 90, 2, false, true, "work-friendly")
                ));

        NearbyCafeResponse response = service.search(new NearbyCafeSearchRequest(
                37.5,
                127.0,
                500,
                true,
                true,
                true,
                List.of(2),
                List.of("work-friendly"),
                CafeSearchSort.DISTANCE
        ));

        assertThat(response.cafes()).extracting(NearbyCafeResultResponse::name).containsExactly("Close Cafe");
        assertThat(response.cafes().get(0).distanceMeters()).isEqualTo(80);
        assertThat(response.cafes().get(0).openNow()).isTrue();
    }

    @Test
    void searchSortsByRating() {
        when(cafeRepository.findWithinRadius(37.5, 127.0, 1000))
                .thenReturn(List.of(
                        view(1L, "Lower Rated", 100.0, 4.1, 50, 2, true, true, "work-friendly"),
                        view(2L, "Higher Rated", 400.0, 4.8, 50, 2, true, true, "work-friendly")
                ));

        NearbyCafeResponse response = service.search(new NearbyCafeSearchRequest(
                37.5,
                127.0,
                1000,
                null,
                null,
                null,
                List.of(),
                List.of(),
                CafeSearchSort.RATING
        ));

        assertThat(response.cafes()).extracting(NearbyCafeResultResponse::name)
                .containsExactly("Higher Rated", "Lower Rated");
    }

    @Test
    void searchSortsByRecommendationScore() {
        when(cafeRepository.findWithinRadius(37.5, 127.0, 500))
                .thenReturn(List.of(
                        view(1L, "Closer Lower Score", 40.0, 3.8, 20, 2, false, false, "dessert"),
                        view(2L, "Farther Better Score", 180.0, 4.8, 500, 2, true, true, "work-friendly"),
                        view(3L, "Highest Score", 80.0, 4.8, 500, 2, true, true, "work-friendly")
                ));

        NearbyCafeResponse response = service.search(new NearbyCafeSearchRequest(
                37.5,
                127.0,
                500,
                null,
                null,
                null,
                List.of(),
                List.of(),
                CafeSearchSort.RECOMMENDATION
        ));

        assertThat(response.cafes()).extracting(NearbyCafeResultResponse::name)
                .containsExactly("Highest Score",
                        "Farther Better Score",
                        "Closer Lower Score");
        assertThat(response.cafes().get(0).recommendationScore()).isBetween(0, 100);
        assertThat(response.cafes().get(0).scoreBreakdown().ratingScore()).isEqualTo(96);
        assertThat(response.cafes().get(0).reasons()).isNotEmpty();
    }

    private CafeDistanceView view(
            Long id,
            String name,
            Double distanceMeters,
            double rating,
            int reviews,
            int priceLevel,
            boolean hasWifi,
            boolean hasPower,
            String... tags
    ) {
        return new CafeDistanceView() {
            @Override
            public Long getId() {
                return id;
            }

            @Override
            public String getName() {
                return name;
            }

            @Override
            public String getDistrict() {
                return "Seongsu";
            }

            @Override
            public String getAddress() {
                return "1 Demo-ro, Seoul";
            }

            @Override
            public BigDecimal getLatitude() {
                return BigDecimal.valueOf(37.5);
            }

            @Override
            public BigDecimal getLongitude() {
                return BigDecimal.valueOf(127.0);
            }

            @Override
            public BigDecimal getRating() {
                return BigDecimal.valueOf(rating);
            }

            @Override
            public Integer getReviewCount() {
                return reviews;
            }

            @Override
            public Integer getPriceLevel() {
                return priceLevel;
            }

            @Override
            public LocalTime getOpensAt() {
                return LocalTime.of(8, 0);
            }

            @Override
            public LocalTime getClosesAt() {
                return LocalTime.of(22, 0);
            }

            @Override
            public Boolean getHasWifi() {
                return hasWifi;
            }

            @Override
            public Boolean getHasPower() {
                return hasPower;
            }

            @Override
            public Integer getSeatCount() {
                return 48;
            }

            @Override
            public String getTags() {
                return String.join(",", tags);
            }

            @Override
            public Double getDistanceMeters() {
                return distanceMeters;
            }
        };
    }
}
