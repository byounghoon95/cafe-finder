package com.caferadar.cafe;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

public record NearbyCafeResultResponse(
        Long id,
        String name,
        String district,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        int distanceMeters,
        BigDecimal rating,
        int reviewCount,
        int priceLevel,
        LocalTime opensAt,
        LocalTime closesAt,
        boolean openNow,
        boolean hasWifi,
        boolean hasPower,
        int quietScore,
        int seatCount,
        List<String> tags,
        int recommendationScore,
        CafeScoreBreakdown scoreBreakdown,
        List<String> reasons
) {
}
