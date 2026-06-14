import type { Cafe } from "../types";

type CafeDetailProps = {
  cafe: Cafe | null;
};

export function CafeDetail({ cafe }: CafeDetailProps) {
  if (!cafe) {
    return (
      <section className="detail-panel">
        <h2>카페를 선택하세요</h2>
        <p>마커나 목록을 선택하면 주소, 편의시설, 태그를 볼 수 있습니다.</p>
      </section>
    );
  }

  return (
    <section className="detail-panel">
      <div className="detail-heading">
        <div>
          <p className="eyebrow">{cafe.district}</p>
          <h2>{cafe.name}</h2>
        </div>
        <span className={cafe.openNow ? "status-pill open" : "status-pill"}>
          {cafe.openNow ? "영업 중" : "영업 종료"}
        </span>
      </div>

      <p className="address">{cafe.address}</p>

      <dl className="detail-grid">
        <div>
          <dt>거리</dt>
          <dd>{cafe.distanceMeters}m</dd>
        </div>
        <div>
          <dt>평점</dt>
          <dd>{cafe.rating.toFixed(1)} (리뷰 {cafe.reviewCount}개)</dd>
        </div>
        <div>
          <dt>영업시간</dt>
          <dd>{cafe.opensAt} - {cafe.closesAt}</dd>
        </div>
        <div>
          <dt>좌석</dt>
          <dd>{cafe.seatCount}석</dd>
        </div>
      </dl>

      <div className="amenity-row">
        <span className={cafe.hasWifi ? "on" : ""}>와이파이</span>
        <span className={cafe.hasPower ? "on" : ""}>콘센트</span>
        <span>조용함 {cafe.quietScore}</span>
        <span>{"₩".repeat(cafe.priceLevel)}</span>
      </div>

      <div className="tag-row detail-tags">
        {cafe.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <section className="score-panel" aria-label="추천 점수">
        <div className="score-summary">
          <div>
            <p className="eyebrow">추천 점수</p>
            <h3>{Math.round(cafe.recommendationScore)} / 100</h3>
          </div>
          <p>평점, 거리, 작업 편의시설, 조용함, 리뷰 수를 기준으로 계산했습니다.</p>
        </div>

        <dl className="score-grid">
          <div>
            <dt>평점</dt>
            <dd>{Math.round(cafe.scoreBreakdown.ratingScore)}</dd>
          </div>
          <div>
            <dt>거리</dt>
            <dd>{Math.round(cafe.scoreBreakdown.distanceScore)}</dd>
          </div>
          <div>
            <dt>작업</dt>
            <dd>{Math.round(cafe.scoreBreakdown.workFriendlyScore)}</dd>
          </div>
          <div>
            <dt>조용함</dt>
            <dd>{Math.round(cafe.scoreBreakdown.quietScore)}</dd>
          </div>
          <div>
            <dt>인기도</dt>
            <dd>{Math.round(cafe.scoreBreakdown.popularityScore)}</dd>
          </div>
        </dl>

        {cafe.reasons.length > 0 ? (
          <ul className="reason-list">
            {cafe.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : null}
      </section>
    </section>
  );
}
