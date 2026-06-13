import { useQuery } from "@tanstack/react-query";
import { CafeMap } from "./components/CafeMap.jsx";
import { SearchControls } from "./components/SearchControls.jsx";
import { SearchStatus } from "./components/SearchStatus.jsx";
import { fetchNearbyCafes } from "./api/cafes.js";
import { useSearchStore } from "./store/searchStore.js";

export default function App() {
  const selectedPoint = useSearchStore((state) => state.selectedPoint);
  const radiusMeters = useSearchStore((state) => state.radiusMeters);

  const nearbyQuery = useQuery({
    queryKey: ["nearby-cafes", selectedPoint, radiusMeters],
    queryFn: () => fetchNearbyCafes({ selectedPoint, radiusMeters }),
    enabled: Boolean(selectedPoint),
  });

  return (
    <main className="h-screen overflow-hidden bg-stone-950 text-stone-950">
      <CafeMap />
      <section className="pointer-events-none absolute inset-x-0 top-0 z-10 p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-5xl flex-col gap-3 rounded-lg border border-white/70 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-coffee-700">
              CafeRadar
            </p>
            <h1 className="text-lg font-semibold text-stone-950">
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
