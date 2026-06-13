# Infra Agent Guide

## Stack

- Docker Compose
- PostgreSQL with PostGIS

## Standards

- Keep service names stable: `postgres`, `backend`, `frontend`.
- Use `.env.example` for configurable values.
- Demo data should seed automatically for local development.
- Do not commit secrets.

## Verification

Run `docker compose config` for Compose changes and smoke test the local stack when possible.
