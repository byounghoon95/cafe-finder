# frontend TASK-02: Add Map Search UI

## Status

done

## Goal

Build the main map interaction for selecting a search point.

## Scope

- Google map rendering
- Map click selection
- Current location button
- Radius selector
- Search state management

## Acceptance Criteria

- User can select a point and radius.
- Selected point is visible on the map.
- Nearby cafe API is requested when search changes.

## Verification

- Browser smoke test

## Completion Notes

- Status: done
- Changed: added a minimal React/Vite frontend foundation needed for the task, Google Maps search UI with selected-point marker/circle behavior, fallback map mode for missing API key, current-location control, radius selector, Zustand search state, and TanStack Query nearby cafe request wiring.
- Verification: `npm.cmd run lint` passed; `npm.cmd run build` passed; Browser smoke test against `npm.cmd run preview -- --host 127.0.0.1` passed for initial render, fallback map point selection, radius change to 1000 m, and nearby API request trigger.
- Notes: live Google Maps rendering requires `VITE_GOOGLE_MAPS_API_KEY`; live cafe results require backend TASK-03. With those absent, browser smoke verified the fallback map and expected failed fetch state.
- Skills used: browser:control-in-app-browser

## Completion Notes

- Status: done
- Changed: removed visible text labels from map markers and switched selected point, cafe, and selected cafe markers to color-based icon styling.
- Verification: `npm.cmd run lint` passed; `npm.cmd run build` passed; browser check against the built app confirmed the fallback map still renders and source/build output uses marker icons instead of `카`/`선` labels.
- Notes: Google Maps marker titles remain for hover/accessibility, but visible marker text is removed.
