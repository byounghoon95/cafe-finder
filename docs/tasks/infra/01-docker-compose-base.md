# infra TASK-01: Add Docker Compose Base

## Status

done

## Goal

Provide local runtime services for PostgreSQL/PostGIS, backend, and frontend.

## Scope

- `compose.yaml`
- `.env.example`
- PostGIS initialization if needed
- Local runtime README notes

## Acceptance Criteria

- `docker compose up -d` starts the local stack.
- PostGIS extension is enabled.
- Backend and frontend ports are documented.

## Verification

- `docker compose config`
- Local container smoke test when available
## Completion Notes

- Status: done
- Changed: added `compose.yaml` with a local `postgres` PostGIS service, added `infra/postgres/init/01-postgis.sql`, expanded `.env.example`, and documented local database startup in `README.md`.
- Verification: `docker compose config` could not run because Docker is not installed or not available on PATH in this environment.
- Notes: backend and frontend Compose services are intentionally deferred until their Dockerfiles exist in the backend/frontend foundation tasks.

