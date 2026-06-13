package com.caferadar.cafe;

import java.util.List;

public record NearbyCafeResponse(
        NearbyCafeQueryResponse query,
        List<NearbyCafeResultResponse> cafes
) {
}
