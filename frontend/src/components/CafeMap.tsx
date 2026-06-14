import { useEffect, useRef, useState } from "react";
import {
  defaultCenter,
  type SearchPoint,
  useSearchStore,
} from "../store/searchStore";
import type { Cafe } from "../types";

type LatLng = {
  lat: () => number;
  lng: () => number;
};

type MapMouseEvent = {
  latLng: LatLng;
};

type GoogleMap = {
  addListener: (
    eventName: "click",
    handler: (event: MapMouseEvent) => void,
  ) => void;
  panTo: (point: SearchPoint) => void;
};

type GoogleMarker = {
  addListener: (eventName: "click", handler: () => void) => void;
  setMap: (map: GoogleMap | null) => void;
  setPosition: (point: SearchPoint) => void;
};

type GoogleCircle = {
  setCenter: (point: SearchPoint) => void;
  setRadius: (radiusMeters: number) => void;
};

type GoogleMapsApi = {
  Map: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => GoogleMap;
  Marker: new (options: Record<string, unknown>) => GoogleMarker;
  Circle: new (options: Record<string, unknown>) => GoogleCircle;
};

declare global {
  interface Window {
    google?: {
      maps: GoogleMapsApi;
    };
    [key: `initCafeRadarMap_${number}`]: (() => void) | undefined;
  }
}

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const googleMapsLoaders = new Map<string, Promise<GoogleMapsApi>>();

const searchPointIcon = {
  fillColor: "#17211b",
  fillOpacity: 1,
  path: "M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0",
  scale: 1.25,
  strokeColor: "#ffffff",
  strokeWeight: 3,
};

const cafeIcon = {
  fillColor: "#fff7d8",
  fillOpacity: 1,
  path: "M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0",
  scale: 1.1,
  strokeColor: "#17211b",
  strokeWeight: 2,
};

const selectedCafeIcon = {
  fillColor: "#2f7d52",
  fillOpacity: 1,
  path: "M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0",
  scale: 1.35,
  strokeColor: "#ffffff",
  strokeWeight: 3,
};

type CafeMapProps = {
  cafes?: Cafe[];
  selectedCafeId?: number | null;
  onSelectCafe?: (cafeId: number) => void;
};

function loadGoogleMaps(apiKey: string | undefined): Promise<GoogleMapsApi> {
  if (!apiKey) {
    return Promise.reject(new Error("VITE_GOOGLE_MAPS_API_KEY가 설정되지 않았습니다"));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  const existingLoader = googleMapsLoaders.get(apiKey);

  if (existingLoader) {
    return existingLoader;
  }

  const loader = new Promise<GoogleMapsApi>((resolve, reject) => {
    const callbackName = `initCafeRadarMap_${Date.now()}` as const;
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      callback: callbackName,
      v: "weekly",
    });

    window[callbackName] = () => {
      delete window[callbackName];
      resolve(window.google!.maps);
    };

    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      delete window[callbackName];
      reject(new Error("Google Maps를 불러오지 못했습니다"));
    };

    document.head.append(script);
  });

  googleMapsLoaders.set(apiKey, loader);
  return loader;
}

export function CafeMap({
  cafes = [],
  selectedCafeId = null,
  onSelectCafe,
}: CafeMapProps) {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const markerRef = useRef<GoogleMarker | null>(null);
  const cafeMarkersRef = useRef<GoogleMarker[]>([]);
  const circleRef = useRef<GoogleCircle | null>(null);
  const [mapError, setMapError] = useState("");
  const selectedPoint = useSearchStore((state) => state.selectedPoint);
  const radiusMeters = useSearchStore((state) => state.radiusMeters);
  const setSelectedPoint = useSearchStore((state) => state.setSelectedPoint);

  useEffect(() => {
    let isMounted = true;

    loadGoogleMaps(googleMapsApiKey)
      .then((maps) => {
        if (!isMounted || !mapNode.current) {
          return;
        }

        const map = new maps.Map(mapNode.current, {
          center: defaultCenter,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: "greedy",
          mapId: "CAFE_RADAR_SEARCH_MAP",
        });

        map.addListener("click", (event) => {
          setSelectedPoint({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });
        });

        mapRef.current = map;
      })
      .catch((error: Error) => {
        if (isMounted) {
          setMapError(error.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setSelectedPoint]);

  useEffect(() => {
    const maps = window.google?.maps;
    const map = mapRef.current;

    if (!maps || !map || !selectedPoint) {
      return;
    }

    if (!markerRef.current) {
      markerRef.current = new maps.Marker({
        icon: searchPointIcon,
        map,
        title: "선택한 검색 위치",
        zIndex: 3,
      });
    }

    markerRef.current.setPosition(selectedPoint);

    if (!circleRef.current) {
      circleRef.current = new maps.Circle({
        map,
        strokeColor: "#2f6f4e",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#2f6f4e",
        fillOpacity: 0.15,
      });
    }

    circleRef.current.setCenter(selectedPoint);
    circleRef.current.setRadius(radiusMeters);
    map.panTo(selectedPoint);
  }, [selectedPoint, radiusMeters]);

  useEffect(() => {
    const maps = window.google?.maps;
    const map = mapRef.current;

    if (!maps || !map) {
      return;
    }

    cafeMarkersRef.current.forEach((marker) => marker.setMap(null));
    cafeMarkersRef.current = cafes.map((cafe) => {
      const isSelected = cafe.id === selectedCafeId;
      const marker = new maps.Marker({
        icon: isSelected ? selectedCafeIcon : cafeIcon,
        map,
        position: { lat: cafe.latitude, lng: cafe.longitude },
        title: cafe.name,
        zIndex: isSelected ? 2 : 1,
      });

      marker.addListener("click", () => onSelectCafe?.(cafe.id));
      return marker;
    });
  }, [cafes, onSelectCafe, selectedCafeId]);

  if (mapError) {
    return (
      <MapFallback
        cafes={cafes}
        error={mapError}
        selectedCafeId={selectedCafeId}
        onSelectCafe={onSelectCafe}
      />
    );
  }

  return <div ref={mapNode} className="h-full w-full" aria-label="카페 지도" />;
}

function MapFallback({
  cafes,
  error,
  selectedCafeId,
  onSelectCafe,
}: Required<Pick<CafeMapProps, "cafes">> &
  Pick<CafeMapProps, "selectedCafeId" | "onSelectCafe"> & { error: string }) {
  const selectedPoint = useSearchStore((state) => state.selectedPoint);
  const setSelectedPoint = useSearchStore((state) => state.setSelectedPoint);

  return (
    <button
      className="relative h-full w-full cursor-crosshair overflow-hidden bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] text-left"
      onClick={() => setSelectedPoint(defaultCenter)}
      type="button"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cafe-ink via-cafe-leaf to-stone-950" />
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-cafe-leaf shadow-lg" />
      {selectedPoint ? (
        <div className="absolute bottom-24 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white bg-emerald-500 shadow-lg" />
      ) : null}
      <div className="absolute right-4 top-24 flex flex-col gap-2">
        {cafes.map((cafe) => (
          <span
            aria-label={`${cafe.name} 선택`}
            className={`block h-8 w-8 rounded-full border-2 shadow-lg ${
              cafe.id === selectedCafeId
                ? "border-white bg-cafe-leaf ring-2 ring-white/70"
                : "border-cafe-ink bg-[#fff7d8]"
            }`}
            key={cafe.id}
            onClick={(event) => {
              event.stopPropagation();
              onSelectCafe?.(cafe.id);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                onSelectCafe?.(cafe.id);
              }
            }}
            role="button"
            tabIndex={0}
            title={cafe.name}
          >
          </span>
        ))}
      </div>
      <div className="absolute bottom-4 left-4 max-w-sm rounded-lg bg-white/95 p-3 text-sm shadow-panel">
        <p className="font-semibold text-cafe-ink">지도 미리보기 모드</p>
        <p className="mt-1 text-slate-700">
          {error}. Google Maps를 불러오려면 VITE_GOOGLE_MAPS_API_KEY를 설정하세요.
          이 영역을 누르면 기본 성수 위치가 선택됩니다.
        </p>
      </div>
    </button>
  );
}
