package com.caferadar.cafe.dto;

public record NearbyCafeQueryResponse(
        double latitude,
        double longitude,
        int radiusMeters,
        String sort
) {
}
