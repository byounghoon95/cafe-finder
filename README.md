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
6. Filter by wifi, outlets, quiet, open now, tags, and price level.
7. Select a cafe to see details and recommendation reasons.
```

## Tasks

- [Task index](docs/tasks/README.md)
- [Project spec](docs/SPEC.md)
## Local Database

Copy the environment template and start PostgreSQL/PostGIS:

```powershell
Copy-Item .env.example .env
docker compose up -d
```

The local database runs on `localhost:5432` with these defaults:

```text
POSTGRES_DB=cafe_radar
POSTGRES_USER=cafe_user
POSTGRES_PASSWORD=cafe_password
```

PostGIS is enabled by `infra/postgres/init/01-postgis.sql` on first database initialization.
Backend and frontend Compose services will be added when those app foundations are implemented.
## AI Tooling

This project is managed with a task-based Codex workflow. Planning and documentation use repository-local task files under `docs/tasks/`, and implementation tasks are intended to be executed with a Codex skill-style process:

```text
read project spec -> read task file -> implement scoped change -> verify -> update task notes
```

AI assistance is used for scaffolding, task planning, documentation, and implementation support. Core technical decisions, verification results, and project scope are recorded in the task files so the development process stays reviewable.

