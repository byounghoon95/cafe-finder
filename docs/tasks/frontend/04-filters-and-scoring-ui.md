# frontend TASK-04: Add Filters and Scoring UI

## Status

done

## Goal

Expose practical filters, sorting, and recommendation explanations.

## Scope

- Filter toolbar
- Sort control
- Score display
- Score explanation in detail panel

## Acceptance Criteria

- User can filter and sort cafes.
- Recommendation reasons are visible and understandable.

## Verification

- Browser smoke test

## Completion Notes

- Status: done
- Changed: added frontend filter state and query parameters for open now, wifi, power, quiet, price level, and tags; defaulted sorting to recommendation; added recommendation score badges, first-list reason, score breakdown, and explanation reasons in the cafe detail panel.
- Verification: `npm.cmd run lint` passed; `npm.cmd run build` passed; browser smoke test against the built app passed using a local mock `/api/cafes/nearby` response to verify filter controls, sort selection, result score display, and detail score explanations.
- Notes: `npm run ...` via PowerShell was blocked by local script execution policy, so verification used `npm.cmd`; Skills used: implement-task requested, but the local skill was unavailable in this session, so the project task workflow was followed manually.
