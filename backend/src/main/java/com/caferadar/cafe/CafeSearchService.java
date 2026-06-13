package com.caferadar.cafe;

import java.time.Clock;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class CafeSearchService {

    private final CafeRepository cafeRepository;
    private final Clock clock;

    public CafeSearchService(CafeRepository cafeRepository) {
        this(cafeRepository, Clock.systemDefaultZone());
    }

    CafeSearchService(CafeRepository cafeRepository, Clock clock) {
        this.cafeRepository = cafeRepository;
        this.clock = clock;
    }

    public NearbyCafeResponse search(NearbyCafeSearchRequest request) {
        List<NearbyCafeResultResponse> cafes = cafeRepository
                .findWithinRadius(request.latitude(), request.longitude(), request.radiusMeters())
                .stream()
                .map(this::toResponse)
                .filter(cafe -> matchesFilters(cafe, request))
                .sorted(comparatorFor(request.sort()))
                .toList();

        return new NearbyCafeResponse(
                new NearbyCafeQueryResponse(
                        request.latitude(),
                        request.longitude(),
                        request.radiusMeters(),
                        request.sort().value()
                ),
                cafes
        );
    }

    private NearbyCafeResultResponse toResponse(CafeDistanceView cafe) {
        return new NearbyCafeResultResponse(
                cafe.getId(),
                cafe.getName(),
                cafe.getDistrict(),
                cafe.getAddress(),
                cafe.getLatitude(),
                cafe.getLongitude(),
                (int) Math.round(cafe.getDistanceMeters()),
                cafe.getRating(),
                cafe.getReviewCount(),
                cafe.getPriceLevel(),
                cafe.getOpensAt(),
                cafe.getClosesAt(),
                isOpenNow(cafe.getOpensAt(), cafe.getClosesAt()),
                Boolean.TRUE.equals(cafe.getHasWifi()),
                Boolean.TRUE.equals(cafe.getHasPower()),
                cafe.getQuietScore(),
                cafe.getSeatCount(),
                tagsAsList(cafe.getTags())
        );
    }

    private boolean matchesFilters(NearbyCafeResultResponse cafe, NearbyCafeSearchRequest request) {
        if (Boolean.TRUE.equals(request.openNow()) && !cafe.openNow()) {
            return false;
        }
        if (Boolean.TRUE.equals(request.hasWifi()) && !cafe.hasWifi()) {
            return false;
        }
        if (Boolean.TRUE.equals(request.hasPower()) && !cafe.hasPower()) {
            return false;
        }
        if (Boolean.TRUE.equals(request.quiet()) && cafe.quietScore() < 70) {
            return false;
        }
        if (!request.priceLevels().isEmpty() && !request.priceLevels().contains(cafe.priceLevel())) {
            return false;
        }
        if (!request.tags().isEmpty()) {
            Set<String> cafeTags = normalizedSet(cafe.tags());
            return request.tags().stream()
                    .map(CafeSearchService::normalize)
                    .anyMatch(cafeTags::contains);
        }
        return true;
    }

    private Comparator<NearbyCafeResultResponse> comparatorFor(CafeSearchSort sort) {
        return switch (sort) {
            case DISTANCE, RECOMMENDATION -> Comparator.comparingInt(NearbyCafeResultResponse::distanceMeters)
                    .thenComparing(Comparator.comparing(NearbyCafeResultResponse::rating).reversed());
            case RATING -> Comparator.comparing(NearbyCafeResultResponse::rating).reversed()
                    .thenComparingInt(NearbyCafeResultResponse::distanceMeters);
            case REVIEWS -> Comparator.comparingInt(NearbyCafeResultResponse::reviewCount).reversed()
                    .thenComparingInt(NearbyCafeResultResponse::distanceMeters);
            case QUIET -> Comparator.comparingInt(NearbyCafeResultResponse::quietScore).reversed()
                    .thenComparingInt(NearbyCafeResultResponse::distanceMeters);
        };
    }

    private boolean isOpenNow(LocalTime opensAt, LocalTime closesAt) {
        LocalTime now = LocalTime.now(clock);
        if (opensAt.equals(closesAt)) {
            return true;
        }
        if (opensAt.isBefore(closesAt)) {
            return !now.isBefore(opensAt) && now.isBefore(closesAt);
        }
        return !now.isBefore(opensAt) || now.isBefore(closesAt);
    }

    private static List<String> tagsAsList(String tags) {
        if (tags == null || tags.isBlank()) {
            return List.of();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isBlank())
                .toList();
    }

    private static Set<String> normalizedSet(List<String> values) {
        Set<String> normalized = new HashSet<>();
        values.forEach(value -> normalized.add(normalize(value)));
        return normalized;
    }

    private static String normalize(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }
}
