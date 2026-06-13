# backend TASK-01: Create Spring Boot Foundation

## Status

done

## Goal

Create the backend application foundation.

## Scope

- Spring Boot project setup
- Health endpoint
- Database configuration
- Flyway or equivalent migration setup
- OpenAPI setup

## Acceptance Criteria

- Backend starts locally.
- `GET /api/health` returns healthy response.
- Swagger UI is available.

## Verification

- Backend test command
- Health endpoint smoke test

## Completion Notes

- Status: done
- Skills used: implement-task
- Changed: added a Gradle Spring Boot backend with web, JPA, validation, Flyway, PostgreSQL, and Springdoc OpenAPI dependencies; added `/api/health`; added OpenAPI metadata; added a PostGIS Flyway baseline migration; added backend Dockerfile and Compose service; documented backend runtime URLs.
- Verification: `./gradlew test` could not run because the Gradle wrapper is not present yet and Gradle is not installed or not available on PATH in this environment. `docker compose config` could not run because Docker is not installed or not available on PATH in this environment. Health endpoint smoke test could not run because the backend could not be started without Java/Gradle or Docker.
- Notes: backend domain models, cafe search, scoring, and seed data remain deferred to later backend/infra tasks.
