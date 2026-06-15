package com.caferadar.cafe;

import java.util.Arrays;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public enum CafeSearchSort {
    RECOMMENDATION("recommendation"),
    DISTANCE("distance"),
    RATING("rating"),
    REVIEWS("reviews");

    private final String value;

    CafeSearchSort(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

    public static CafeSearchSort from(String value) {
        if (value == null || value.isBlank()) {
            return RECOMMENDATION;
        }

        return Arrays.stream(values())
                .filter(sort -> sort.value.equalsIgnoreCase(value.trim()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported sort: " + value));
    }
}
