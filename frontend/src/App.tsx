import { useQuery } from "@tanstack/react-query";
import { fetchNearbyCafes } from "./api/cafes";
import { CafeMap } from "./components/CafeMap";
import { SearchControls } from "./components/SearchControls";
import { SearchStatus } from "./components/SearchStatus";
import { useSearchStore } from "./store/searchStore";

function App() {
  const selectedPoint = useSearchStore((state) => state.selectedPoint);
  const radiusMeters = useSearchStore((state) => state.radiusMeters);

  const nearbyQuery = useQuery({
    queryKey: ["nearby-cafes", selectedPoint, radiusMeters],
    queryFn: () => fetchNearbyCafes({ selectedPoint, radiusMeters }),
    enabled: Boolean(selectedPoint),
  });

  return (
    <main className="h-screen overflow-hidden bg-cafe-ink text-cafe-ink">
      <CafeMap />
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
      <SearchStatus query={nearbyQuery} />
    </main>
  );
}

export default App;
