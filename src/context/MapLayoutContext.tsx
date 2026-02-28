"use client";

import * as React from "react";
import type { Geofence } from "@/data/geofences";
import { polygonAreaSqKm } from "@/data/geofences";
import type { LatLngTuple } from "leaflet";

type MapLayoutContextValue = {
  geofences: Geofence[];
  setGeofences: React.Dispatch<React.SetStateAction<Geofence[]>>;
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  focusedGeofenceId: string | null;
  setFocusedGeofenceId: React.Dispatch<React.SetStateAction<string | null>>;
  onSelectionComplete: (bounds: [LatLngTuple, LatLngTuple]) => void;
};

const MapLayoutContext = React.createContext<MapLayoutContextValue | null>(null);

export function useMapLayout() {
  const ctx = React.useContext(MapLayoutContext);
  if (!ctx) throw new Error("useMapLayout must be used within MapLayoutProvider");
  return ctx;
}

export function MapLayoutProvider({ children }: { children: React.ReactNode }) {
  const [geofences, setGeofences] = React.useState<Geofence[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [focusedGeofenceId, setFocusedGeofenceId] = React.useState<string | null>(null);

  const onSelectionComplete = React.useCallback(
    (bounds: [LatLngTuple, LatLngTuple]) => {
      const [[swLat, swLng], [neLat, neLng]] = bounds;
      const points: [number, number][] = [
        [swLat, swLng],
        [swLat, neLng],
        [neLat, neLng],
        [neLat, swLng],
      ];
      const areaSqKm = polygonAreaSqKm(points);
      const newGeofence: Geofence = {
        id: `gf-${Date.now()}`,
        name: `Geofence #${geofences.length + 1}`,
        points,
        areaSqKm,
      };
      setGeofences((prev) => [...prev, newGeofence]);
      setIsCreating(false);
    },
    [geofences.length]
  );

  const value = React.useMemo(
    () => ({
      geofences,
      setGeofences,
      isCreating,
      setIsCreating,
      focusedGeofenceId,
      setFocusedGeofenceId,
      onSelectionComplete,
    }),
    [geofences, isCreating, focusedGeofenceId, onSelectionComplete]
  );

  return (
    <MapLayoutContext.Provider value={value}>{children}</MapLayoutContext.Provider>
  );
}
