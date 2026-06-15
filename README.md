# CafeRadar

CafeRadar is a GIS-based cafe discovery web app. Users click a point on the map, choose a search radius, and discover nearby cafes ranked by distance, rating, amenities, and work-friendly signals.

## Planned Stack

- Backend: Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Springdoc OpenAPI
- Frontend: React, Vite, TanStack Query, Zustand, Google Maps JavaScript API, Tailwind CSS
- Database: PostgreSQL, PostGIS
- Runtime: Docker Compose
- Data: local demo seed data with many synthetic cafes

## Core Demo Flow

```text
1. Start the local stack.
2. Open the web app.
3. Click a location on the map.
4. Select 300m, 500m, or 1km radius.
5. View nearby cafe markers and ranked cafe list.
6. Filter by wifi, outlets, open now, tags, and price level.
7. Select a cafe to see details and recommendation reasons.
```

## Tasks

- [Task index](docs/tasks/README.md)
- [Project spec](docs/SPEC.md)
## Local Runtime

Copy the environment template and start PostgreSQL/PostGIS, the backend API, and the frontend web app:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

The local database runs on `localhost:5432` with these defaults:

```text
POSTGRES_DB=cafe_radar
POSTGRES_USER=cafe_user
POSTGRES_PASSWORD=cafe_password
```

PostGIS is enabled by `infra/postgres/init/01-postgis.sql` on first database initialization.
Flyway applies the cafe schema and synthetic demo seed data when the backend starts. The seed creates 200 cafes across Gangnam, Seongsu, Hongdae, Yeonnam, Hapjeong, Euljiro, Jamsil, Sinchon, Itaewon, and Yeouido, and skips records whose generated names already exist so restarts do not duplicate local demo data.
The backend API runs on `http://localhost:8080` by default.
The frontend runs on `http://localhost:5173` by default and proxies `/api` requests to the backend container.

Useful backend URLs:

```text
GET http://localhost:8080/api/health
Swagger UI: http://localhost:8080/swagger-ui.html
OpenAPI JSON: http://localhost:8080/v3/api-docs
```

Run focused backend tests from the backend directory when Java and the Gradle wrapper are available:

```powershell
./gradlew test
```

## Local Frontend Development

Install and start the React/Vite app:

```powershell
cd frontend
npm install
npm run dev
```

The Vite dev app runs on `http://localhost:5173` by default. Use `frontend/.env.local` for local frontend-only values such as `VITE_API_BASE_URL` or `VITE_GOOGLE_MAPS_API_KEY`.

