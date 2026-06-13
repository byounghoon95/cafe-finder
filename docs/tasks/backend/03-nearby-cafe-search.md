# backend TASK-03: Add Nearby Cafe Search API

## Status

todo

## Goal

Return cafes near a selected point using PostGIS radius search.

## Scope

- `GET /api/cafes/nearby`
- Radius validation
- Distance calculation
- Filtering parameters
- Sorting parameters

## Acceptance Criteria

- API returns cafes within the requested radius.
- Response includes distance in meters.
- Filters and sorting work for MVP fields.

## Verification

- Controller/service tests
- PostGIS query smoke test
