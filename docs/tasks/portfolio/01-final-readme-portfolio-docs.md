# portfolio TASK-01: Final README and Portfolio Docs

## Status

done

## Goal

Prepare the project for portfolio review.

## Scope

- README setup instructions
- Architecture overview
- Screenshots or GIF placeholders
- Scoring formula explanation
- PostGIS usage notes
- AI/tooling usage note

## Acceptance Criteria

- Reviewer can understand and run the project quickly.
- README explains what makes the project GIS-focused.

## Verification

- Fresh setup walkthrough or documented limitation

## Completion Notes

- Status: done
- Changed: Rewrote `README.md` in Korean as a portfolio-ready overview with setup steps, architecture, PostGIS notes, scoring formula, API summary, actual screen capture, sample data notes, and AI/tooling usage note. Removed demo-flow/local-demo wording and internal position-alignment notes. Updated this task and the task index status.
- Verification:
  - `npm.cmd run build` from `frontend`: passed.
  - `docker compose config`: not run because `docker` is not installed or not available on PATH in this environment.
  - `gradle test` from `backend`: not run because `gradle` is not installed or not available on PATH, and this repository does not include a Gradle wrapper.
- Notes: `backend TASK-05` and `frontend TASK-05` are still marked `todo` in the task index, so the README records the current verification limitations for portfolio review.

