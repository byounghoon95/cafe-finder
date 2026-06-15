package com.caferadar.cafe.dto;

import java.util.List;

public record NearbyCafeResponse(
        NearbyCafeQueryResponse query,
        List<NearbyCafeResultResponse> cafes
) {
}
