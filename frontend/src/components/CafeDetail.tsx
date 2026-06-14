import type { Cafe } from "../types";

type CafeDetailProps = {
  cafe: Cafe | null;
};

export function CafeDetail({ cafe }: CafeDetailProps) {
  if (!cafe) {
    return (
      <section className="detail-panel">
        <h2>Select a cafe</h2>
        <p>Pick a marker or list item to view address, amenities, and tags.</p>
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
          {cafe.openNow ? "Open" : "Closed"}
        </span>
      </div>

      <p className="address">{cafe.address}</p>

      <dl className="detail-grid">
        <div>
          <dt>Distance</dt>
          <dd>{cafe.distanceMeters}m</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{cafe.rating.toFixed(1)} ({cafe.reviewCount})</dd>
        </div>
        <div>
          <dt>Hours</dt>
          <dd>{cafe.opensAt} - {cafe.closesAt}</dd>
        </div>
        <div>
          <dt>Seats</dt>
          <dd>{cafe.seatCount}</dd>
        </div>
      </dl>

      <div className="amenity-row">
        <span className={cafe.hasWifi ? "on" : ""}>Wifi</span>
        <span className={cafe.hasPower ? "on" : ""}>Power</span>
        <span>Quiet {cafe.quietScore}</span>
        <span>{"$".repeat(cafe.priceLevel)}</span>
      </div>

      <div className="tag-row detail-tags">
        {cafe.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <section className="score-panel" aria-label="Recommendation score">
        <div className="score-summary">
          <div>
            <p className="eyebrow">Recommendation</p>
            <h3>{Math.round(cafe.recommendationScore)} / 100</h3>
          </div>
          <p>Ranked from rating, distance, work amenities, quietness, and review volume.</p>
        </div>

        <dl className="score-grid">
          <div>
            <dt>Rating</dt>
            <dd>{Math.round(cafe.scoreBreakdown.ratingScore)}</dd>
          </div>
          <div>
            <dt>Distance</dt>
            <dd>{Math.round(cafe.scoreBreakdown.distanceScore)}</dd>
          </div>
          <div>
            <dt>Work</dt>
            <dd>{Math.round(cafe.scoreBreakdown.workFriendlyScore)}</dd>
          </div>
          <div>
            <dt>Quiet</dt>
            <dd>{Math.round(cafe.scoreBreakdown.quietScore)}</dd>
          </div>
          <div>
            <dt>Popularity</dt>
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
