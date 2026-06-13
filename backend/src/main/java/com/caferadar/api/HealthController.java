package com.caferadar.api;

import java.time.OffsetDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public HealthResponse health() {
        return new HealthResponse("healthy", "cafe-radar-backend", OffsetDateTime.now());
    }

    public record HealthResponse(String status, String service, OffsetDateTime checkedAt) {
    }
}
