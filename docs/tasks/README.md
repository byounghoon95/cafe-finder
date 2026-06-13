# Tasks

Task specs are split by track so backend, frontend, and infrastructure work can move in parallel when dependencies allow it.

Use:

```text
foundation TASK-01
backend TASK-01
frontend TASK-01
infra TASK-01
portfolio TASK-01
```

## Status Values

- ⬜ `todo`: not started
- 🟡 `doing`: currently being implemented
- ✅ `done`: completed and verified, or completed with verification notes
- ⛔ `blocked`: cannot continue without a decision or external dependency

## Defaults

When a task is finished, update the task file with:

```md
## Completion Notes

- Status: done
- Changed: short summary of changed areas
- Verification: command and result, or reason not run
- Notes: important decisions or follow-up tasks
```

## Index

| Track Task | Status | Depends On | File |
| --- | --- | --- | --- |
| foundation TASK-01 | ✅ done | none | [01-repository-structure.md](foundation/01-repository-structure.md) |
| infra TASK-01 | ✅ done | foundation TASK-01 | [01-docker-compose-base.md](infra/01-docker-compose-base.md) |
| backend TASK-01 | ⬜ todo | foundation TASK-01, infra TASK-01 | [01-spring-boot-foundation.md](backend/01-spring-boot-foundation.md) |
| backend TASK-02 | ⬜ todo | backend TASK-01 | [02-cafe-domain-postgis.md](backend/02-cafe-domain-postgis.md) |
| backend TASK-03 | ⬜ todo | backend TASK-02 | [03-nearby-cafe-search.md](backend/03-nearby-cafe-search.md) |
| backend TASK-04 | ⬜ todo | backend TASK-03 | [04-recommendation-scoring.md](backend/04-recommendation-scoring.md) |
| backend TASK-05 | ⬜ todo | backend TASK-04 | [05-backend-tests.md](backend/05-backend-tests.md) |
| frontend TASK-01 | ⬜ todo | foundation TASK-01 | [01-react-vite-foundation.md](frontend/01-react-vite-foundation.md) |
| frontend TASK-02 | ⬜ todo | frontend TASK-01, backend TASK-03 | [02-map-search-ui.md](frontend/02-map-search-ui.md) |
| frontend TASK-03 | ⬜ todo | frontend TASK-02, backend TASK-03 | [03-cafe-results-panel.md](frontend/03-cafe-results-panel.md) |
| frontend TASK-04 | ⬜ todo | frontend TASK-03, backend TASK-04 | [04-filters-and-scoring-ui.md](frontend/04-filters-and-scoring-ui.md) |
| frontend TASK-05 | ⬜ todo | frontend TASK-04 | [05-frontend-smoke-tests.md](frontend/05-frontend-smoke-tests.md) |
| infra TASK-02 | ⬜ todo | backend TASK-02 | [02-demo-data-seed.md](infra/02-demo-data-seed.md) |
| portfolio TASK-01 | ⬜ todo | backend TASK-05, frontend TASK-05, infra TASK-02 | [01-final-readme-portfolio-docs.md](portfolio/01-final-readme-portfolio-docs.md) |

## Suggested Flow

```text
foundation TASK-01
  |
  +--> infra:    TASK-01 -> TASK-02
  +--> backend:  TASK-01 -> TASK-02 -> TASK-03 -> TASK-04 -> TASK-05
  +--> frontend: TASK-01 -> TASK-02 -> TASK-03 -> TASK-04 -> TASK-05

portfolio TASK-01 follows backend, frontend, and demo data completion.
```


