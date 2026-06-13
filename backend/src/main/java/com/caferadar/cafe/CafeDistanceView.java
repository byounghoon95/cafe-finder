package com.caferadar.cafe;

import java.math.BigDecimal;
import java.time.LocalTime;

public interface CafeDistanceView {

    Long getId();

    String getName();

    String getDistrict();

    String getAddress();

    BigDecimal getLatitude();

    BigDecimal getLongitude();

    BigDecimal getRating();

    Integer getReviewCount();

    Integer getPriceLevel();

    LocalTime getOpensAt();

    LocalTime getClosesAt();

    Boolean getHasWifi();

    Boolean getHasPower();

    Integer getQuietScore();

    Integer getSeatCount();

    String getTags();

    Double getDistanceMeters();
}
