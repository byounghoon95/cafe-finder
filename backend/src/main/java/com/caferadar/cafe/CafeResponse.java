package com.caferadar.cafe;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

public record CafeResponse(
        Long id,
        String name,
        String district,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal rating,
        int reviewCount,
        int priceLevel,
        LocalTime opensAt,
        LocalTime closesAt,
        boolean hasWifi,
        boolean hasPower,
        int quietScore,
        int seatCount,
        List<String> tags
) {

    public static CafeResponse from(Cafe cafe) {
        return new CafeResponse(
                cafe.getId(),
                cafe.getName(),
                cafe.getDistrict(),
                cafe.getAddress(),
                cafe.getLatitude(),
                cafe.getLongitude(),
                cafe.getRating(),
                cafe.getReviewCount(),
                cafe.getPriceLevel(),
                cafe.getOpensAt(),
                cafe.getClosesAt(),
                cafe.isHasWifi(),
                cafe.isHasPower(),
                cafe.getQuietScore(),
                cafe.getSeatCount(),
                List.of(cafe.getTags())
        );
    }
}
