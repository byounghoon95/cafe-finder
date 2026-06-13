import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_CENTER,
  useSearchStore,
} from "../store/searchStore.js";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const googleMapsLoaders = new Map();

function loadGoogleMaps(apiKey) {
  if (!apiKey) {
    return Promise.reject(new Error("Missing VITE_GOOGLE_MAPS_API_KEY"));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsLoaders.has(apiKey)) {
    return googleMapsLoaders.get(apiKey);
  }

  const loader = new Promise((resolve, reject) => {
    const callbackName = `initCafeRadarMap_${Date.now()}`;
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      callback: callbackName,
      v: "weekly",
    });

    window[callbackName] = () => {
      delete window[callbackName];
      resolve(window.google.maps);
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

export function CafeMap() {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const [mapError, setMapError] = useState("");
  const selectedPoint = useSearchStore((state) => state.selectedPoint);
  const radiusMeters = useSearchStore((state) => state.radiusMeters);
  const setSelectedPoint = useSearchStore((state) => state.setSelectedPoint);

  useEffect(() => {
    let isMounted = true;

    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then((maps) => {
        if (!isMounted || !mapNode.current) {
          return;
        }

        const map = new maps.Map(mapNode.current, {
          center: DEFAULT_CENTER,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: "greedy",
          mapId: "CAFEE_RADAR_SEARCH_MAP",
        });

        map.addListener("click", (event) => {
          setSelectedPoint({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });
        });

        mapRef.current = map;
      })
      .catch((error) => {
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
        strokeColor: "#8b5e34",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#8b5e34",
        fillOpacity: 0.15,
      });
    }

    circleRef.current.setCenter(selectedPoint);
    circleRef.current.setRadius(radiusMeters);
    map.panTo(selectedPoint);
  }, [selectedPoint, radiusMeters]);

  if (mapError) {
    return <MapFallback error={mapError} />;
  }

  return <div ref={mapNode} className="h-full w-full" aria-label="Cafe map" />;
}

function MapFallback({ error }) {
  const selectedPoint = useSearchStore((state) => state.selectedPoint);
  const setSelectedPoint = useSearchStore((state) => state.setSelectedPoint);

  return (
    <button
      className="relative h-full w-full cursor-crosshair overflow-hidden bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] text-left"
      onClick={() => setSelectedPoint(DEFAULT_CENTER)}
      type="button"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-coffee-900 to-stone-950" />
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-coffee-500 shadow-lg" />
      {selectedPoint ? (
        <div className="absolute bottom-24 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white bg-emerald-500 shadow-lg" />
      ) : null}
      <div className="absolute bottom-4 left-4 max-w-sm rounded-lg bg-white/95 p-3 text-sm shadow">
        <p className="font-semibold text-stone-900">Map preview mode</p>
        <p className="mt-1 text-stone-700">
          {error}. Set VITE_GOOGLE_MAPS_API_KEY to load Google Maps. Click here
          to select the default Seongsu point.
        </p>
      </div>
    </button>
  );
}
