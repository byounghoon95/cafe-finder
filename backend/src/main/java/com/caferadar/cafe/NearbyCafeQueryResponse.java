package com.caferadar.cafe;

public record NearbyCafeQueryResponse(
        double latitude,
        double longitude,
        int radiusMeters,
        String sort
) {
}
