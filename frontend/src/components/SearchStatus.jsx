import { useSearchStore } from "../store/searchStore.js";

export function SearchStatus({ query }) {
  const selectedPoint = useSearchStore((state) => state.selectedPoint);
  const radiusMeters = useSearchStore((state) => state.radiusMeters);
  const cafes = query.data?.cafes || [];

  return (
    <aside className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 sm:inset-x-auto sm:right-0 sm:w-96 sm:p-4">
      <div className="pointer-events-auto rounded-lg border border-white/70 bg-white/95 p-4 shadow-lg backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-coffee-700">
          Search
        </h2>
        {selectedPoint ? (
          <div className="mt-2 space-y-2 text-sm text-stone-700">
            <p>
              Selected {selectedPoint.lat.toFixed(5)},{" "}
              {selectedPoint.lng.toFixed(5)} within {radiusMeters} m.
            </p>
            {query.isFetching ? <p>Requesting nearby cafes...</p> : null}
            {query.isError ? (
              <p className="text-red-700">{query.error.message}</p>
            ) : null}
            {query.isSuccess ? (
              <p>
                Nearby API responded with {cafes.length} cafe
                {cafes.length === 1 ? "" : "s"}.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 text-sm text-stone-700">
            Click the map or use your current location to start a nearby cafe
            request.
          </p>
        )}
      </div>
    </aside>
  );
}
