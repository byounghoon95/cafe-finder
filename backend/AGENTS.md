# Backend Agent Guide

## Stack

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- PostgreSQL/PostGIS
- Springdoc OpenAPI

## Standards

- Keep API responses simple and consistent.
- Use PostGIS for radius and distance queries.
- Keep recommendation scoring deterministic and explainable.
- Do not add auth/admin features in the MVP unless a task asks for them.

## Verification

Run focused backend tests for changed code. Use `./gradlew test` when available.
