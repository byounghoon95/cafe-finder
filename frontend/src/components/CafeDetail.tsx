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
    </section>
  );
}
