import type { UseQueryResult } from "@tanstack/react-query";
import type { NearbyCafesResponse } from "../api/cafes";
import { useSearchStore } from "../store/searchStore";

type SearchStatusProps = {
  query: UseQueryResult<NearbyCafesResponse | null, Error>;
};

export function SearchStatus({ query }: SearchStatusProps) {
  const selectedPoint = useSearchStore((state) => state.selectedPoint);
  const radiusMeters = useSearchStore((state) => state.radiusMeters);
  const cafes = query.data?.cafes ?? [];

  return (
    <aside className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 sm:inset-x-auto sm:right-0 sm:w-96 sm:p-4">
      <div className="pointer-events-auto rounded-lg border border-white/70 bg-white/95 p-4 shadow-panel backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-cafe-leaf">
          검색
        </h2>
        {selectedPoint ? (
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            <p>
              선택 위치 {selectedPoint.lat.toFixed(5)},{" "}
              {selectedPoint.lng.toFixed(5)} 기준 반경 {radiusMeters}m입니다.
            </p>
            {query.isFetching ? <p>주변 카페를 요청하는 중입니다...</p> : null}
            {query.isError ? (
              <p className="text-red-700">{query.error.message}</p>
            ) : null}
            {query.isSuccess ? (
              <p>
                주변 검색 API가 카페 {cafes.length}곳을 반환했습니다.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-700">
            지도를 누르거나 현재 위치를 사용해 주변 카페 검색을 시작하세요.
          </p>
        )}
      </div>
    </aside>
  );
}
