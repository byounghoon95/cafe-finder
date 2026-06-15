package com.caferadar.cafe.dto;

import java.util.List;

import com.caferadar.cafe.CafeSearchSort;

public record NearbyCafeSearchRequest(
        double latitude,
        double longitude,
        int radiusMeters,
        Boolean openNow,
        Boolean hasWifi,
        Boolean hasPower,
        List<Integer> priceLevels,
        List<String> tags,
        CafeSearchSort sort
) {
}
