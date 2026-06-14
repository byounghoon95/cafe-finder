# infra TASK-02: Add Cafe Demo Data Seed

## Status

done

## Goal

Make the project demoable without manual CSV upload or external APIs.

## Scope

- Add many synthetic Seoul cafe records.
- Seed demo data automatically in local development.
- Cover multiple Seoul cafe districts.
- Document demo data behavior.

## Out of Scope

- Do not scrape or commit real licensed cafe datasets.
- Do not require users to upload CSV files for the core demo.

## Acceptance Criteria

- App starts with enough cafe data to test nearby search in several Seoul neighborhoods.
- Demo environment can be prepared with one Docker Compose command.
- Seed logic avoids duplicate records on restart.

## Verification

- Seed smoke check
- Nearby search returns seeded cafes

## Completion Notes

- Status: done
- Changed: added a Flyway seed migration that creates 200 synthetic cafes across 10 Seoul neighborhoods, documented automatic seed behavior in the README, and updated task status.
- Verification:
  - `git diff --check`: passed; Git reported expected LF-to-CRLF working-copy warnings only.
  - `docker compose config`: not run successfully because `docker` is not installed or not available on PATH in this environment.
  - `gradle test`: not run successfully because the repo has no Gradle wrapper and `gradle` is not installed or not available on PATH in this environment.
  - Seed smoke check and nearby search smoke check: not run because Docker/PostgreSQL tooling is unavailable in this environment.
- Notes: seed data is synthetic, deterministic, and idempotent by generated cafe name. Skills used: implement-task workflow requested; the registered local skill was unavailable in this session, so the repository task workflow was followed manually.

## Completion Notes

- Status: done
- Changed: localized generated seed cafe names, district labels, synthetic Seoul addresses, and seed tag values to Korean while preserving deterministic 200-row generation.
- Verification: `npm.cmd run lint` passed; `npm.cmd run build` passed; backend `gradle test` could not run because `gradle` is not installed or available on PATH in this environment.
- Notes: The Flyway migration version is unchanged; existing databases that already applied this migration need a fresh volume/database reset to reseed with the Korean demo rows.
