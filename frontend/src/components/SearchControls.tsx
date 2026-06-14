import {
  priceLevelOptions,
  radiusOptions,
  tagOptions,
  type CafeSort,
  type RadiusMeters,
  useSearchStore,
} from "../store/searchStore";

const sortOptions: { value: CafeSort; label: string }[] = [
  { value: "distance", label: "거리순" },
  { value: "rating", label: "평점순" },
  { value: "reviews", label: "리뷰순" },
  { value: "quiet", label: "조용한순" },
  { value: "recommendation", label: "추천순" },
];

export function SearchControls() {
  const radiusMeters = useSearchStore((state) => state.radiusMeters);
  const sort = useSearchStore((state) => state.sort);
  const filters = useSearchStore((state) => state.filters);
  const setRadiusMeters = useSearchStore((state) => state.setRadiusMeters);
  const setSort = useSearchStore((state) => state.setSort);
  const setSelectedPoint = useSearchStore((state) => state.setSelectedPoint);
  const setBooleanFilter = useSearchStore((state) => state.setBooleanFilter);
  const togglePriceLevel = useSearchStore((state) => state.togglePriceLevel);
  const toggleTag = useSearchStore((state) => state.toggleTag);
  const clearFilters = useSearchStore((state) => state.clearFilters);

  const activeFilterCount =
    Number(filters.openNow) +
    Number(filters.hasWifi) +
    Number(filters.hasPower) +
    Number(filters.quiet) +
    filters.priceLevels.length +
    filters.tags.length;

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
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-cafe-ink transition hover:border-cafe-leaf hover:text-cafe-leaf"
          onClick={useCurrentLocation}
          type="button"
        >
          현재 위치
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
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          정렬
          <select
            className="rounded-md border border-stone-300 bg-white px-2 py-2 text-sm text-cafe-ink"
            value={sort}
            onChange={(event) => setSort(event.target.value as CafeSort)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          {[
            ["openNow", "영업 중"],
            ["hasWifi", "와이파이"],
            ["hasPower", "콘센트"],
            ["quiet", "조용함"],
          ].map(([filter, label]) => (
            <button
              className={`filter-chip ${
                filters[filter as keyof typeof filters]
                  ? "bg-cafe-leaf text-white shadow"
                  : "bg-stone-100 text-slate-700 hover:bg-white"
              }`}
              key={filter}
              onClick={() =>
                setBooleanFilter(
                  filter as "openNow" | "hasWifi" | "hasPower" | "quiet",
                  !filters[filter as keyof typeof filters],
                )
              }
              type="button"
            >
              {label}
            </button>
          ))}
          {activeFilterCount > 0 ? (
            <button
              className="rounded-md px-2 py-1.5 text-xs font-bold text-cafe-leaf underline-offset-2 hover:underline"
              onClick={clearFilters}
              type="button"
            >
              필터 초기화 {activeFilterCount}
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="min-w-10 text-xs font-bold uppercase tracking-wide text-slate-500">
            태그
          </span>
          {tagOptions.map((tag) => (
            <button
              className={`filter-chip ${
                filters.tags.includes(tag)
                  ? "bg-cafe-leaf text-white shadow"
                  : "bg-stone-100 text-slate-700 hover:bg-white"
              }`}
              key={tag}
              onClick={() => toggleTag(tag)}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="min-w-10 text-xs font-bold uppercase tracking-wide text-slate-500">
            가격대
          </span>
          {priceLevelOptions.map((priceLevel) => (
            <button
              className={`filter-chip ${
                filters.priceLevels.includes(priceLevel)
                  ? "bg-cafe-leaf text-white shadow"
                  : "bg-stone-100 text-slate-700 hover:bg-white"
              }`}
              key={priceLevel}
              onClick={() => togglePriceLevel(priceLevel)}
              type="button"
            >
              {"₩".repeat(priceLevel)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
