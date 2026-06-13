# CafeRadar Spec

## 1. Project Summary

CafeRadar is a GIS-based web app for finding cafes around a selected location. A user clicks the map or uses their current location, selects a radius, and sees nearby cafes ranked by distance, rating, amenities, and work-friendly conditions.

The project is designed as a portfolio-friendly GIS app that is easier to demo than an admin-heavy B2B platform. It uses seeded synthetic cafe data so the app works immediately after local startup.

## 2. Target Job Fit

This project demonstrates:

- Java and Spring Boot REST API development
- React map-based UI development
- Google Maps JavaScript API integration
- PostgreSQL/PostGIS radius search and distance sorting
- Rule-based recommendation scoring
- Docker Compose local runtime
- Seeded demo data for reproducible portfolio demos
- Clear task-based engineering workflow

## 3. MVP Decisions

The first version should stay intentionally small and demoable.

- No login or admin dashboard in the MVP.
- No CSV upload in the MVP.
- No external Places API in the MVP.
- Cafe data comes from local synthetic seed data.
- User search starts from map click; browser geolocation is a nice-to-have after map click works.
- The main screen is the product, not a landing page.
- The app should work after `docker compose up -d --build` once backend and frontend services exist.

## 4. Core Scenario

1. User opens the map.
2. User clicks a point or uses browser geolocation.
3. User selects a radius: 300m, 500m, or 1000m.
4. App displays nearby cafe markers.
5. App displays a ranked list with distance, rating, tags, and amenities.
6. User filters by wifi, power outlets, quiet, open now, price level, and tags.
7. User selects a cafe and sees recommendation reasons.

## 5. Tech Stack

### Frontend

- React
- Vite
- TanStack Query
- Zustand
- Google Maps JavaScript API
- Tailwind CSS

### Backend

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Bean Validation
- Springdoc OpenAPI

### Database

- PostgreSQL
- PostGIS

### Infra

- Docker
- Docker Compose

## 6. Functional Requirements

### 6.1 Map Search

- User can click a map point.
- User can use current browser location when permission is granted.
- User can choose radius: 300m, 500m, 1000m.
- App queries cafes near the selected point.

### 6.2 Cafe Results

Each cafe includes:

- name
- address
- latitude
- longitude
- rating
- review count
- price level
- opening hours summary
- wifi availability
- power outlet availability
- quietness score
- seat count
- tags

### 6.3 Filtering and Sorting

User can filter by:

- open now
- has wifi
- has power outlets
- quiet
- price level
- tags

User can sort by:

- recommendation score
- distance
- rating
- review count
- quietness

### 6.4 Recommendation Score

The ranking model is rule-based and explainable.

```text
recommendationScore =
  ratingScore * 0.30
  + distanceScore * 0.25
  + workFriendlyScore * 0.20
  + quietScore * 0.15
  + popularityScore * 0.10
```

Score range:

- each sub-score: 0 to 100
- recommendation score: 0 to 100

Sub-score rules for MVP:

- `ratingScore`: `rating / 5 * 100`.
- `distanceScore`: 100 at 0m, linearly decreases to 0 at the selected radius.
- `workFriendlyScore`: 40 points for wifi, 40 points for power outlets, up to 20 points from seat count capped at 80 seats.
- `quietScore`: stored cafe quietness score, 0 to 100.
- `popularityScore`: review count normalized with 100 points at 500 or more reviews.

The response should include the final score, sub-scores, and 2-4 short explanation strings.

### 6.5 Cafe Detail Panel

Selected cafe shows:

- basic info
- distance from selected point
- rating and review count
- amenities
- tags
- recommendation score
- scoring explanation

### 6.6 Demo Data

- Local demo data is seeded automatically.
- Seed data covers several Seoul cafe districts.
- No user CSV upload is required for the core demo.
- Data is synthetic and safe to commit.
- Target seed size: at least 200 cafes.
- Target coverage: at least 10 Seoul cafe districts.
- Each district should have enough cafes to make 300m, 500m, and 1000m radius searches feel different.

Suggested districts:

- Gangnam
- Seongsu
- Hongdae
- Yeonnam
- Hapjeong
- Euljiro
- Jamsil
- Sinchon
- Itaewon
- Yeouido

## 7. Non-Functional Requirements

- Local environment must run with one Docker Compose command.
- App should be usable immediately after startup.
- Backend APIs must be documented with Swagger.
- Sensitive values such as Google Maps API key must use environment variables.
- Seed data must not be private, licensed, scraped, or presented as real business data.

## 8. Data Model

### cafes

| Column | Type | Note |
| --- | --- | --- |
| id | bigint | primary key |
| name | varchar | required, max 120 |
| district | varchar | required, Seoul district or neighborhood label |
| address | varchar | required synthetic display address |
| latitude | decimal | required, -90 to 90 |
| longitude | decimal | required, -180 to 180 |
| geom | geography | PostGIS point |
| rating | decimal | required, 0.0 to 5.0 |
| review_count | integer | required, 0 or higher |
| price_level | integer | required, 1 to 4 |
| opens_at | time | required local opening time |
| closes_at | time | required local closing time |
| has_wifi | boolean | required |
| has_power | boolean | required |
| quiet_score | integer | required, 0 to 100 |
| seat_count | integer | required, 0 or higher |
| tags | text[] | MVP uses Postgres text array |
| created_at | timestamp |  |
| updated_at | timestamp |  |

## 9. API Spec

```text
GET /api/health
GET /api/cafes/nearby?lat=37.5&lng=127.0&radius=500
GET /api/cafes/{cafeId}
```

Nearby query parameters:

```text
lat: required decimal, -90 to 90
lng: required decimal, -180 to 180
radius: required integer, one of 300, 500, 1000
openNow: optional boolean
hasWifi: optional boolean
hasPower: optional boolean
quiet: optional boolean, maps to quiet_score >= 70
priceLevel: optional comma-separated integers from 1 to 4
tags: optional comma-separated tag values
sort: optional, one of recommendation,distance,rating,reviews,quiet
```

Nearby query filters:

```text
openNow=true
hasWifi=true
hasPower=true
quiet=true
priceLevel=1,2,3,4
tags=work-friendly,dessert
sort=recommendation,distance,rating,reviews,quiet
```

Nearby response shape:

```json
{
  "query": {
    "latitude": 37.5446,
    "longitude": 127.0559,
    "radiusMeters": 500,
    "sort": "recommendation"
  },
  "cafes": [
    {
      "id": 1,
      "name": "Seongsu Coffee Lab",
      "district": "Seongsu",
      "address": "12 Seongsui-ro, Seongdong-gu, Seoul",
      "latitude": 37.5449,
      "longitude": 127.0563,
      "distanceMeters": 72,
      "rating": 4.6,
      "reviewCount": 328,
      "priceLevel": 2,
      "opensAt": "08:00",
      "closesAt": "22:00",
      "openNow": true,
      "hasWifi": true,
      "hasPower": true,
      "quietScore": 82,
      "seatCount": 48,
      "tags": ["work-friendly", "dessert"],
      "recommendationScore": 91,
      "scoreBreakdown": {
        "ratingScore": 92,
        "distanceScore": 86,
        "workFriendlyScore": 92,
        "quietScore": 82,
        "popularityScore": 66
      },
      "reasons": [
        "Very close to the selected point.",
        "Wifi and power outlets make it good for working.",
        "Quietness score is high for this dataset."
      ]
    }
  ]
}
```

Cafe detail response may reuse the same cafe object shape used by nearby search.

## 10. Frontend Pages

### /

- full-screen map
- radius selector
- filter toolbar
- cafe result list
- selected cafe detail panel

### /about optional

- portfolio explanation
- architecture summary
- scoring formula

## 11. MVP Scope

MVP must include:

- Docker Compose with postgres, backend, frontend
- seeded cafe demo data
- map click search
- PostGIS radius query
- cafe marker rendering
- cafe result list
- filtering and sorting
- explainable recommendation score
- README with setup and architecture overview

Out of MVP:

- real user reviews
- payment
- reservations
- owner/admin dashboards
- scraping real cafe data
- machine learning recommendations

