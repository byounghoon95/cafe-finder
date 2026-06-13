import { RADIUS_OPTIONS, useSearchStore } from "../store/searchStore.js";

export function SearchControls() {
  const radiusMeters = useSearchStore((state) => state.radiusMeters);
  const setRadiusMeters = useSearchStore((state) => state.setRadiusMeters);
  const setSelectedPoint = useSearchStore((state) => state.setSelectedPoint);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setSelectedPoint({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 transition hover:border-coffee-500 hover:text-coffee-700"
        onClick={useCurrentLocation}
        type="button"
      >
        Current location
      </button>
      <div className="flex rounded-md border border-stone-300 bg-stone-100 p-1">
        {RADIUS_OPTIONS.map((radius) => (
          <button
            className={`rounded px-3 py-1.5 text-sm font-medium transition ${
              radiusMeters === radius
                ? "bg-coffee-700 text-white shadow"
                : "text-stone-700 hover:bg-white"
            }`}
            key={radius}
            onClick={() => setRadiusMeters(radius)}
            type="button"
          >
            {radius === 1000 ? "1 km" : `${radius} m`}
          </button>
        ))}
      </div>
    </div>
  );
}
