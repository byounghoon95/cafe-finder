# CafeRadar Project Guide

## Project

This repository is a portfolio project for a GIS-based cafe discovery platform.

Before implementing any task, read:

- `docs/SPEC.md`
- `docs/tasks/README.md`
- The requested task file under `docs/tasks/`
- The track-local `AGENTS.md` for the area you are editing:
  - `backend/AGENTS.md` for backend work
  - `frontend/AGENTS.md` for frontend work
  - `infra/AGENTS.md` for Docker, Compose, deployment, and runtime work

## Behavioral Guidelines

- Prefer a small, verifiable implementation over broad speculative work.
- Keep the MVP focused on map-based cafe discovery, PostGIS radius search, cafe ranking, filters, seeded demo data, and portfolio documentation.
- Do not add payments, social networking, complex reviews, or unrelated admin features unless explicitly requested.
- Update `docs/tasks/README.md` status when work starts and finishes.
- Update the matching task file's `## Status` and append `## Completion Notes` when done.

## Status Values

- `todo`: not started
- `doing`: currently being implemented
- `done`: completed and verified, or completed with verification notes
- `blocked`: cannot continue without a decision or external dependency

## Git Conventions

Branch names:

```text
<type>/<scope>-<short-description>
```

Allowed `type` values:

- `feature`
- `fix`
- `docs`
- `chore`
- `refactor`
- `test`

Commit messages:

```text
<type>(<scope>): <imperative summary>
```

For task-based PR titles, use:

```text
<type>(<track>-task-<number>): <imperative summary>
```
