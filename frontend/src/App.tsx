import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNearbyCafes } from "./api/cafes";
import { CafeDetail } from "./components/CafeDetail";
import { CafeList } from "./components/CafeList";
import { CafeMap } from "./components/CafeMap";
import { SearchControls } from "./components/SearchControls";
import { useSearchStore } from "./store/searchStore";

function App() {
  const selectedPoint = useSearchStore((state) => state.selectedPoint);
  const radiusMeters = useSearchStore((state) => state.radiusMeters);
  const sort = useSearchStore((state) => state.sort);
  const filters = useSearchStore((state) => state.filters);
  const selectedCafeId = useSearchStore((state) => state.selectedCafeId);
  const setSelectedCafeId = useSearchStore((state) => state.setSelectedCafeId);

  const nearbyQuery = useQuery({
    queryKey: ["nearby-cafes", selectedPoint, radiusMeters, sort, filters],
    queryFn: () =>
      fetchNearbyCafes({ selectedPoint, radiusMeters, sort, filters }),
    enabled: Boolean(selectedPoint),
    retry: false,
  });
  const cafes = useMemo(
    () => nearbyQuery.data?.cafes ?? [],
    [nearbyQuery.data?.cafes],
  );
  const selectedCafe = useMemo(
    () => cafes.find((cafe) => cafe.id === selectedCafeId) ?? null,
    [cafes, selectedCafeId],
  );

  return (
    <main className="h-screen overflow-hidden bg-cafe-ink text-cafe-ink">
      <CafeMap
        cafes={cafes}
        selectedCafeId={selectedCafeId}
        onSelectCafe={setSelectedCafeId}
      />
      <section className="pointer-events-none absolute inset-x-0 top-0 z-10 p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-5xl flex-col gap-3 rounded-lg border border-white/70 bg-white/95 p-3 shadow-panel backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cafe-leaf">
              CafeRadar
            </p>
            <h1 className="text-lg font-semibold text-cafe-ink">
              Pick a point to search nearby cafes
            </h1>
          </div>
          <SearchControls />
        </div>
      </section>
      <aside className="pointer-events-none absolute inset-x-0 bottom-0 z-10 max-h-[58vh] p-3 sm:inset-x-auto sm:right-0 sm:w-[420px] sm:p-4">
        <div className="results-panel pointer-events-auto">
          <header className="panel-header">
            <div>
              <p className="eyebrow">CafeRadar</p>
              <h2>Nearby cafes</h2>
            </div>
            <p className="result-count">
              {nearbyQuery.isFetching ? "Searching..." : `${cafes.length} found`}
            </p>
          </header>
          <CafeList
            cafes={cafes}
            error={nearbyQuery.error}
            isError={nearbyQuery.isError}
            isLoading={nearbyQuery.isLoading}
            selectedCafeId={selectedCafeId}
            selectedPoint={
              selectedPoint
                ? {
                    latitude: selectedPoint.lat,
                    longitude: selectedPoint.lng,
                  }
                : null
            }
            onSelectCafe={setSelectedCafeId}
          />
          <CafeDetail cafe={selectedCafe} />
        </div>
      </aside>
    </main>
  );
}

export default App;
