import {
  radiusOptions,
  type RadiusMeters,
  useSearchStore,
} from "../store/searchStore";

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
        className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-cafe-ink transition hover:border-cafe-leaf hover:text-cafe-leaf"
        onClick={useCurrentLocation}
        type="button"
      >
        Current location
      </button>
      <div className="flex rounded-md border border-stone-300 bg-stone-100 p-1">
        {radiusOptions.map((radius: RadiusMeters) => (
          <button
            className={`rounded px-3 py-1.5 text-sm font-medium transition ${
              radiusMeters === radius
                ? "bg-cafe-leaf text-white shadow"
                : "text-slate-700 hover:bg-white"
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
