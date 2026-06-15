package com.caferadar.api;

import java.util.Arrays;
import java.util.List;

import com.caferadar.cafe.CafeSearchService;
import com.caferadar.cafe.CafeSearchSort;
import com.caferadar.cafe.dto.NearbyCafeResponse;
import com.caferadar.cafe.dto.NearbyCafeSearchRequest;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@Validated
@RestController
@RequestMapping("/api/cafes")
public class CafeController {

    private static final List<Integer> ALLOWED_RADII = List.of(300, 500, 1000);

    private final CafeSearchService cafeSearchService;

    public CafeController(CafeSearchService cafeSearchService) {
        this.cafeSearchService = cafeSearchService;
    }

    @GetMapping("/nearby")
    public NearbyCafeResponse nearby(
            @RequestParam("lat") @DecimalMin("-90.0") @DecimalMax("90.0") double latitude,
            @RequestParam("lng") @DecimalMin("-180.0") @DecimalMax("180.0") double longitude,
            @RequestParam int radius,
            @RequestParam(required = false) Boolean openNow,
            @RequestParam(required = false) Boolean hasWifi,
            @RequestParam(required = false) Boolean hasPower,
            @RequestParam(required = false) String priceLevel,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String sort
    ) {
        if (!ALLOWED_RADII.contains(radius)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "radius must be one of 300, 500, or 1000");
        }

        NearbyCafeSearchRequest request = new NearbyCafeSearchRequest(
                latitude,
                longitude,
                radius,
                openNow,
                hasWifi,
                hasPower,
                parsePriceLevels(priceLevel),
                parseCsv(tags),
                CafeSearchSort.from(sort)
        );

        return cafeSearchService.search(request);
    }

    private List<Integer> parsePriceLevels(String value) {
        return parseCsv(value).stream()
                .map(this::parsePriceLevel)
                .toList();
    }

    private int parsePriceLevel(String value) {
        try {
            int parsed = Integer.parseInt(value);
            if (parsed < 1 || parsed > 4) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "priceLevel values must be from 1 to 4");
            }
            return parsed;
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "priceLevel values must be integers", ex);
        }
    }

    private List<String> parseCsv(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(token -> !token.isBlank())
                .distinct()
                .toList();
    }
}
