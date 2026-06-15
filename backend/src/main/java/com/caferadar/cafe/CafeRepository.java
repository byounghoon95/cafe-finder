package com.caferadar.cafe;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CafeRepository extends JpaRepository<Cafe, Long> {

    @Query(value = """
            SELECT
                c.id AS id,
                c.name AS name,
                c.district AS district,
                c.address AS address,
                c.latitude AS latitude,
                c.longitude AS longitude,
                c.rating AS rating,
                c.review_count AS "reviewCount",
                c.price_level AS "priceLevel",
                c.opens_at AS "opensAt",
                c.closes_at AS "closesAt",
                c.has_wifi AS "hasWifi",
                c.has_power AS "hasPower",
                c.seat_count AS "seatCount",
                array_to_string(c.tags, ',') AS tags,
                ST_Distance(c.geom, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography) AS "distanceMeters"
            FROM cafes c
            WHERE ST_DWithin(c.geom, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radiusMeters)
            """, nativeQuery = true)
    List<CafeDistanceView> findWithinRadius(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radiusMeters") int radiusMeters);
}
