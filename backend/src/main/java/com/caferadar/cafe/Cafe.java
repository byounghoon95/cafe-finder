package com.caferadar.cafe;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "cafes")
public class Cafe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String district;

    @NotBlank
    @Column(nullable = false)
    private String address;

    @NotNull
    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal latitude;

    @NotNull
    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal longitude;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("5.0")
    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating;

    @Min(0)
    @Column(name = "review_count", nullable = false)
    private int reviewCount;

    @Min(1)
    @Max(4)
    @Column(name = "price_level", nullable = false)
    private int priceLevel;

    @NotNull
    @Column(name = "opens_at", nullable = false)
    private LocalTime opensAt;

    @NotNull
    @Column(name = "closes_at", nullable = false)
    private LocalTime closesAt;

    @Column(name = "has_wifi", nullable = false)
    private boolean hasWifi;

    @Column(name = "has_power", nullable = false)
    private boolean hasPower;

    @Min(0)
    @Column(name = "seat_count", nullable = false)
    private int seatCount;

    @NotNull
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(nullable = false, columnDefinition = "text[]")
    private String[] tags = new String[0];

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Cafe() {
    }

    public Cafe(
            String name,
            String district,
            String address,
            BigDecimal latitude,
            BigDecimal longitude,
            BigDecimal rating,
            int reviewCount,
            int priceLevel,
            LocalTime opensAt,
            LocalTime closesAt,
            boolean hasWifi,
            boolean hasPower,
            int seatCount,
            String[] tags
    ) {
        this.name = name;
        this.district = district;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.priceLevel = priceLevel;
        this.opensAt = opensAt;
        this.closesAt = closesAt;
        this.hasWifi = hasWifi;
        this.hasPower = hasPower;
        this.seatCount = seatCount;
        this.tags = tags == null ? new String[0] : tags;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDistrict() {
        return district;
    }

    public String getAddress() {
        return address;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public int getPriceLevel() {
        return priceLevel;
    }

    public LocalTime getOpensAt() {
        return opensAt;
    }

    public LocalTime getClosesAt() {
        return closesAt;
    }

    public boolean isHasWifi() {
        return hasWifi;
    }

    public boolean isHasPower() {
        return hasPower;
    }

    public int getSeatCount() {
        return seatCount;
    }

    public String[] getTags() {
        return tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
