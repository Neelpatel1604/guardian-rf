"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngTuple } from "leaflet";
import type { Geofence } from "@/data/geofences";
import type { DroneSession } from "@/data/drones";

import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [38.9, -77.05];
const DEFAULT_ZOOM = 11;

/** Parse "38.910267°" to number */
function parseCoord(s: string): number {
  return parseFloat(s.replace(/[°\s]/g, "")) || 0;
}

const droneIcon = L.divIcon({
  html: `<div style="
    width: 36px; height: 36px;
    background: #10b981;
    border: 2px solid #fff;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  "><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="M5.64 5.64l2.12 2.12"/><path d="M16.24 16.24l2.12 2.12"/><path d="M5.64 18.36l2.12-2.12"/><path d="M16.24 7.76l2.12-2.12"/><circle cx="12" cy="12" r="2"/></svg></div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const operatorIcon = L.divIcon({
  html: `<div style="
    width: 28px; height: 28px;
    background: #3b82f6;
    border: 2px solid #fff;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export type GuardianMapReactProps = {
  mapMode: "standard" | "satellite";
  /** Optional active drones to show on map (drone + operator markers) */
  activeDrones?: DroneSession[];
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
  /** When set, map flies to this location */
  flyTo?: { lat: number; lng: number } | null;
  /** Called after flyTo animation completes (use to clear flyTo for next focus) */
  onFlyComplete?: () => void;
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

function MapFlyToHandler({
  target,
  onComplete,
}: {
  target: { lat: number; lng: number } | null;
  onComplete?: () => void;
}) {
  const map = useMap();
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;
  React.useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
    const t = setTimeout(() => onCompleteRef.current?.(), 1300);
    return () => clearTimeout(t);
  }, [target, map]);
  return null;
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
  activeDrones = [],
  geofences = [],
  isCreating = false,
  onSelectionComplete,
  onCancelCreate,
  focusedGeofenceId = null,
  onFocusGeofence,
  flyTo,
  onFlyComplete,
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
        <MapFlyToHandler target={flyTo ?? null} onComplete={onFlyComplete} />
        {hasGeofenceMode && (
          <MapFocusHandler geofences={geofences} focusedGeofenceId={focusedGeofenceId ?? null} />
        )}
        {activeDrones.map((drone) => (
          <React.Fragment key={`drone-${drone.id}`}>
            <Marker
              position={[parseCoord(drone.droneLocation.lat), parseCoord(drone.droneLocation.lon)]}
              icon={droneIcon}
              eventHandlers={{ click: () => {} }}
            >
              <Popup>
                <div className="min-w-[220px] rounded-lg bg-zinc-900 p-3 text-left">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-semibold text-amber-400">{drone.model}</span>
                    <span className="rounded bg-amber-500/30 px-2 py-0.5 text-[10px] font-medium text-amber-200">
                      active
                    </span>
                  </div>
                  <p className="mb-2 font-mono text-[11px] text-zinc-300">{drone.id}</p>
                  <div className="space-y-1 text-[11px] text-zinc-400">
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="text-zinc-200">{drone.droneLocation.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Altitude:</span>
                      <span className="text-zinc-200">{drone.droneLocation.alt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Direction:</span>
                      <span className="text-zinc-200">{drone.droneLocation.heading}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
            <Marker
              position={[parseCoord(drone.operatorLocation.lat), parseCoord(drone.operatorLocation.lon)]}
              icon={operatorIcon}
            >
              <Popup>
                <div className="min-w-[220px] rounded-lg bg-zinc-900 p-3 text-left">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-semibold text-sky-400">Drone Operator</span>
                    <span className="rounded bg-sky-500/30 px-2 py-0.5 text-[10px] font-medium text-sky-200">
                      active
                    </span>
                  </div>
                  <p className="mb-2 font-mono text-[11px] text-zinc-300">{drone.id}</p>
                  <p className="mb-1 text-[11px] text-zinc-400">
                    Drone Type: <span className="text-zinc-200">{drone.model}</span>
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Position:{" "}
                    <span className="text-zinc-200">
                      {drone.operatorLocation.lat}, {drone.operatorLocation.lon}
                    </span>
                  </p>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
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
