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

## 3. Core Scenario

1. User opens the map.
2. User clicks a point or uses browser geolocation.
3. User selects a radius: 300m, 500m, or 1000m.
4. App displays nearby cafe markers.
5. App displays a ranked list with distance, rating, tags, and amenities.
6. User filters by wifi, power outlets, quiet, open now, price level, and tags.
7. User selects a cafe and sees recommendation reasons.

## 4. Tech Stack

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

## 5. Functional Requirements

### 5.1 Map Search

- User can click a map point.
- User can use current browser location when permission is granted.
- User can choose radius: 300m, 500m, 1000m.
- App queries cafes near the selected point.

### 5.2 Cafe Results

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

### 5.3 Filtering and Sorting

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

### 5.4 Recommendation Score

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

### 5.5 Cafe Detail Panel

Selected cafe shows:

- basic info
- distance from selected point
- rating and review count
- amenities
- tags
- recommendation score
- scoring explanation

### 5.6 Demo Data

- Local demo data is seeded automatically.
- Seed data covers several Seoul cafe districts.
- No user CSV upload is required for the core demo.
- Data is synthetic and safe to commit.

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

## 6. Non-Functional Requirements

- Local environment must run with one Docker Compose command.
- App should be usable immediately after startup.
- Backend APIs must be documented with Swagger.
- Sensitive values such as Google Maps API key must use environment variables.
- Seed data must not be private, licensed, scraped, or presented as real business data.

## 7. Data Model

### cafes

| Column | Type | Note |
| --- | --- | --- |
| id | bigint | primary key |
| name | varchar |  |
| district | varchar | Seoul district or neighborhood label |
| address | varchar | synthetic display address |
| latitude | decimal |  |
| longitude | decimal |  |
| geom | geography | PostGIS point |
| rating | decimal | 0.0 to 5.0 |
| review_count | integer |  |
| price_level | integer | 1 to 4 |
| opens_at | time | local opening time |
| closes_at | time | local closing time |
| has_wifi | boolean |  |
| has_power | boolean |  |
| quiet_score | integer | 0 to 100 |
| seat_count | integer |  |
| tags | text[] or normalized table | MVP may start simple |
| created_at | timestamp |  |
| updated_at | timestamp |  |

## 8. API Spec

```text
GET /api/health
GET /api/cafes/nearby?lat=37.5&lng=127.0&radius=500
GET /api/cafes/{cafeId}
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

## 9. Frontend Pages

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

## 10. MVP Scope

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
