# backend TASK-04: Add Recommendation Scoring

## Status

done

## Goal

Rank nearby cafes with an explainable score.

## Scope

- Rule-based recommendation score
- Score breakdown
- Human-readable reasons
- Unit tests for scoring edge cases

## Acceptance Criteria

- Score is 0 to 100.
- Response includes sub-scores and explanation.
- Ranking is deterministic.

## Verification

- Scoring unit tests

## Completion Notes

- Status: done
- Changed: added rule-based recommendation scoring with score breakdowns, 2-4 explanation strings, nearby response fields, and deterministic recommendation sorting by score with tie-breakers.
- Verification: `gradle test` could not run because `gradle` is not installed or available on PATH in this environment. `git diff --check` passed with only CRLF normalization warnings.
- Notes: Added focused scoring edge-case tests and service-level recommendation sort coverage. The requested local `implement-task` skill was not available in this session, so the repository task workflow was followed manually.
