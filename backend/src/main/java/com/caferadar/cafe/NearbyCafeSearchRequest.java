package com.caferadar.cafe;

import java.util.List;

public record NearbyCafeSearchRequest(
        double latitude,
        double longitude,
        int radiusMeters,
        Boolean openNow,
        Boolean hasWifi,
        Boolean hasPower,
        Boolean quiet,
        List<Integer> priceLevels,
        List<String> tags,
        CafeSearchSort sort
) {
}
