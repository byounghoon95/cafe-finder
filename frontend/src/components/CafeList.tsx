import type { Cafe, Coordinates } from "../types";

type CafeListProps = {
  cafes: Cafe[];
  error: Error | null;
  isError: boolean;
  isLoading: boolean;
  selectedCafeId: number | null;
  selectedPoint: Coordinates | null;
  onSelectCafe: (cafeId: number) => void;
};

export function CafeList({
  cafes,
  error,
  isError,
  isLoading,
  selectedCafeId,
  selectedPoint,
  onSelectCafe,
}: CafeListProps) {
  if (!selectedPoint) {
    return (
      <div className="state-block">
        Click the map or use your current location to search.
      </div>
    );
  }

  if (isLoading) {
    return <div className="state-block">Loading nearby cafes...</div>;
  }

  if (isError) {
    return (
      <div className="state-block error">
        {error?.message ?? "Could not load cafes."}
      </div>
    );
  }

  if (cafes.length === 0) {
    return (
      <div className="state-block">
        No cafes found for this point and radius.
      </div>
    );
  }

  return (
    <ol className="cafe-list">
      {cafes.map((cafe) => (
        <li key={cafe.id}>
          <button
            className={cafe.id === selectedCafeId ? "cafe-card selected" : "cafe-card"}
            onClick={() => onSelectCafe(cafe.id)}
            type="button"
          >
            <span className="cafe-card-topline">
              <span className="cafe-card-main">
                <strong>{cafe.name}</strong>
                <span>
                  {cafe.district} - {cafe.distanceMeters}m away
                </span>
              </span>
              <span className="score-badge">
                {Math.round(cafe.recommendationScore)}
              </span>
            </span>
            <span className="cafe-meta">
              <span>{cafe.rating.toFixed(1)}</span>
              <span>{cafe.reviewCount} reviews</span>
              <span>{"$".repeat(cafe.priceLevel)}</span>
            </span>
            <span className="tag-row">
              {cafe.openNow && <span>Open now</span>}
              {cafe.hasWifi && <span>Wifi</span>}
              {cafe.hasPower && <span>Power</span>}
              <span>Quiet {cafe.quietScore}</span>
            </span>
            {cafe.reasons.length > 0 ? (
              <span className="cafe-reason">{cafe.reasons[0]}</span>
            ) : null}
          </button>
        </li>
      ))}
    </ol>
  );
}
