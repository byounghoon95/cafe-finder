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
        지도를 누르거나 현재 위치로 주변 카페를 검색하세요.
      </div>
    );
  }

  if (isLoading) {
    return <div className="state-block">주변 카페를 불러오는 중입니다...</div>;
  }

  if (isError) {
    return (
      <div className="state-block error">
        {error?.message ?? "카페를 불러오지 못했습니다."}
      </div>
    );
  }

  if (cafes.length === 0) {
    return (
      <div className="state-block">
        선택한 위치와 반경 안에서 카페를 찾지 못했습니다.
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
                  {cafe.district} - {cafe.distanceMeters}m
                </span>
              </span>
              <span className="score-badge">
                {Math.round(cafe.recommendationScore)}
              </span>
            </span>
            <span className="cafe-meta">
              <span>{cafe.rating.toFixed(1)}</span>
              <span>리뷰 {cafe.reviewCount}개</span>
              <span>{"₩".repeat(cafe.priceLevel)}</span>
            </span>
            <span className="tag-row">
              {cafe.openNow && <span>영업 중</span>}
              {cafe.hasWifi && <span>와이파이</span>}
              {cafe.hasPower && <span>콘센트</span>}
              <span>조용함 {cafe.quietScore}</span>
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
