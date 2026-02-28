"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngTuple } from "leaflet";
import type { Geofence } from "@/data/geofences";

import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [38.9, -77.05];
const DEFAULT_ZOOM = 11;

export type GuardianMapReactProps = {
  mapMode: "standard" | "satellite";
  /** Optional geofences to display. When empty/undefined, no polygons shown. */
  geofences?: Geofence[];
  /** When true, enables drag-to-draw geofence on map */
  isCreating?: boolean;
  /** Called when user completes a drag selection (geofence mode only) */
  onSelectionComplete?: (bounds: [LatLngTuple, LatLngTuple]) => void;
  /** Called when user cancels create (geofence mode only) */
  onCancelCreate?: () => void;
  /** Highlighted geofence id (geofence mode only) */
  focusedGeofenceId?: string | null;
  /** Called when user clicks a geofence (geofence mode only) */
  onFocusGeofence?: (id: string | null) => void;
};

function GeofenceDrawingOverlayInner({
  isCreating,
  onSelectionComplete,
}: {
  isCreating: boolean;
  onSelectionComplete: (bounds: [LatLngTuple, LatLngTuple]) => void;
}) {
  const map = useMap();
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number } | null>(null);
  const [selection, setSelection] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isCreating) {
      map.dragging.disable();
    } else {
      map.dragging.enable();
    }
    return () => {
      map.dragging.enable();
    };
  }, [isCreating, map]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCreating || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setSelection(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart || !containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const x = Math.min(dragStart.x, currentX);
    const y = Math.min(dragStart.y, currentY);
    const width = Math.abs(currentX - dragStart.x);
    const height = Math.abs(currentY - dragStart.y);
    setSelection({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (!map || !selection || selection.width < 10 || selection.height < 10) {
      setDragStart(null);
      setSelection(null);
      return;
    }
    const nw = map.containerPointToLatLng([selection.x, selection.y]);
    const se = map.containerPointToLatLng([
      selection.x + selection.width,
      selection.y + selection.height,
    ]);
    onSelectionComplete([
      [Math.min(nw.lat, se.lat), Math.min(nw.lng, se.lng)],
      [Math.max(nw.lat, se.lat), Math.max(nw.lng, se.lng)],
    ]);
    setDragStart(null);
    setSelection(null);
  };

  if (!isCreating) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[1000] cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {selection && selection.width > 4 && selection.height > 4 && (
        <div
          className="pointer-events-none absolute border-2 border-emerald-400 bg-emerald-500/20"
          style={{
            left: selection.x,
            top: selection.y,
            width: selection.width,
            height: selection.height,
          }}
        />
      )}
    </div>
  );
}

function MapFocusHandler({
  geofences,
  focusedGeofenceId,
}: {
  geofences: Geofence[];
  focusedGeofenceId: string | null;
}) {
  const map = useMap();
  React.useEffect(() => {
    if (!focusedGeofenceId) return;
    const gf = geofences.find((g) => g.id === focusedGeofenceId);
    if (!gf || gf.points.length < 2) return;
    const bounds = L.latLngBounds(gf.points as [number, number][]);
    map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [focusedGeofenceId, geofences, map]);
  return null;
}

/** Shared react-leaflet map used by Drones, Geofences, and Radar. Same map component everywhere. */
export function GuardianMapReact({
  mapMode,
  geofences = [],
  isCreating = false,
  onSelectionComplete,
  onCancelCreate,
  focusedGeofenceId = null,
  onFocusGeofence,
}: GuardianMapReactProps) {
  const tileUrl =
    mapMode === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const hasGeofenceMode = geofences.length > 0 || isCreating;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        style={{ background: "#0a0a0a" }}
      >
        <TileLayer
          url={tileUrl}
          attribution={
            mapMode === "satellite"
              ? "Tiles &copy; Esri"
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
        />
        {hasGeofenceMode && (
          <MapFocusHandler geofences={geofences} focusedGeofenceId={focusedGeofenceId ?? null} />
        )}
        {geofences.map((gf) => (
          <Polygon
            key={gf.id}
            positions={gf.points}
            pathOptions={{
              color: focusedGeofenceId === gf.id ? "#10b981" : "#34d399",
              fillColor: "#34d399",
              fillOpacity: 0.2,
              weight: focusedGeofenceId === gf.id ? 3 : 2,
            }}
            eventHandlers={{
              click: () => onFocusGeofence?.(focusedGeofenceId === gf.id ? null : gf.id),
              dblclick: () => {},
            }}
          />
        ))}
        <GeofenceDrawingOverlayInner
          isCreating={isCreating}
          onSelectionComplete={onSelectionComplete ?? (() => {})}
        />
      </MapContainer>
    </div>
  );
}
