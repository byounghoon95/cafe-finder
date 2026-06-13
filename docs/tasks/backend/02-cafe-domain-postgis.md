# backend TASK-02: Add Cafe Domain and PostGIS Model

## Status

done

## Goal

Add the cafe data model with spatial storage.

## Scope

- Cafe entity/table
- PostGIS point column
- Repository
- Migration
- DTOs for cafe responses

## Acceptance Criteria

- Cafes can be stored with latitude, longitude, and geography point.
- Required cafe fields match `docs/SPEC.md`.

## Verification

- Repository or migration tests

## Completion Notes

- Status: done
- Changed: Added the cafe JPA entity, repository, response DTO, Flyway migration for the `cafes` table, generated PostGIS `geography(Point, 4326)` column, spatial index, and a Testcontainers repository test that verifies generated point storage.
- Verification: `git diff --check` passed with line-ending warnings for edited task docs. `gradle test` could not run because `gradle` is not installed or available on PATH. `java -version` could not run because `java` is not installed or available on PATH.
- Notes: Rebasing this task onto backend TASK-01 changed the cafe table migration to run after the PostGIS baseline migration. Skills used: none; `$implement-task` was requested, but no local `implement-task` skill was available in this session.
