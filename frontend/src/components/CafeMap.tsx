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

type CafeMapProps = {
  cafes?: Cafe[];
  selectedCafeId?: number | null;
  onSelectCafe?: (cafeId: number) => void;
};

function loadGoogleMaps(apiKey: string | undefined): Promise<GoogleMapsApi> {
  if (!apiKey) {
    return Promise.reject(new Error("Missing VITE_GOOGLE_MAPS_API_KEY"));
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
      reject(new Error("Google Maps failed to load"));
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
        map,
        title: "Selected search point",
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
      const marker = new maps.Marker({
        label: cafe.id === selectedCafeId ? "✓" : "C",
        map,
        position: { lat: cafe.latitude, lng: cafe.longitude },
        title: cafe.name,
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

  return <div ref={mapNode} className="h-full w-full" aria-label="Cafe map" />;
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
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-lg ${
              cafe.id === selectedCafeId
                ? "bg-cafe-leaf text-white"
                : "bg-white text-cafe-ink"
            }`}
            key={cafe.id}
            onClick={(event) => {
              event.stopPropagation();
              onSelectCafe?.(cafe.id);
            }}
          >
            {cafe.priceLevel}
          </span>
        ))}
      </div>
      <div className="absolute bottom-4 left-4 max-w-sm rounded-lg bg-white/95 p-3 text-sm shadow-panel">
        <p className="font-semibold text-cafe-ink">Map preview mode</p>
        <p className="mt-1 text-slate-700">
          {error}. Set VITE_GOOGLE_MAPS_API_KEY to load Google Maps. Click here
          to select the default Seongsu point.
        </p>
      </div>
    </button>
  );
}
