# infra TASK-02: Add Cafe Demo Data Seed

## Status

todo

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
