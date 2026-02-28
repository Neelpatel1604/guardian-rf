"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const GuardianMapReact = dynamic(
  () => import("@/components/map/GuardianMapReact").then((m) => m.GuardianMapReact),
  { ssr: false }
);
import type { Geofence } from "@/data/geofences";
import type { LatLngTuple } from "leaflet";

export type GeofenceMapProps = {
  geofences: Geofence[];
  isCreating: boolean;
  onSelectionComplete: (bounds: [LatLngTuple, LatLngTuple]) => void;
  onCancelCreate: () => void;
  focusedGeofenceId: string | null;
  onFocusGeofence: (id: string | null) => void;
};

export type MapPageLayoutProps = {
  /** Page title shown in header */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Left sidebar content (e.g. tabs, lists, forms). Omit for map-only layout. */
  sidebar?: React.ReactNode;
  /** Optional overlay rendered on top of the map (e.g. MapSelectionOverlay for radar) */
  mapOverlay?: React.ReactNode;
  /** Optional geofence props. When provided, map shows geofences and supports drawing. */
  geofenceProps?: GeofenceMapProps;
  /** Optional header badge (e.g. "Connected") */
  headerBadge?: React.ReactNode;
  /** Optional extra header actions (right side, before map mode toggle) */
  headerActions?: React.ReactNode;
  /** Whether to show Standard/Satellite map mode toggle. Default: true */
  showMapModeToggle?: boolean;
};

export function MapPageLayout({
  title,
  subtitle,
  sidebar,
  mapOverlay,
  geofenceProps,
  headerBadge,
  headerActions,
  showMapModeToggle = true,
}: MapPageLayoutProps) {
  const [mapMode, setMapMode] = React.useState<"standard" | "satellite">(
    "standard"
  );

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-sidebar-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-primary">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {headerActions}
          {showMapModeToggle && (
            <div className="flex items-center gap-1 rounded-full bg-background/10 p-1 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setMapMode("standard")}
                className={`rounded-full px-3 py-1 transition-colors ${
                  mapMode === "standard"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-background/40"
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setMapMode("satellite")}
                className={`rounded-full px-3 py-1 transition-colors ${
                  mapMode === "satellite"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-background/40"
                }`}
              >
                Satellite
              </button>
            </div>
          )}
          {headerBadge}
        </div>
      </header>

      <main className="flex flex-1">
        {sidebar != null && (
          <section className="hidden w-96 min-w-96 max-w-96 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar/80 p-4 lg:flex lg:flex-col">
            {sidebar}
          </section>
        )}

        <section className="relative flex-1 bg-black">
          {showMapModeToggle && (
            <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-zinc-900/70 px-3 py-1 text-[11px] font-medium text-emerald-100">
              {mapMode === "standard" ? "Standard View" : "Satellite View"}
            </div>
          )}
          <>
            <GuardianMapReact
              mapMode={mapMode}
              geofences={geofenceProps?.geofences}
              isCreating={geofenceProps?.isCreating}
              onSelectionComplete={geofenceProps?.onSelectionComplete}
              onCancelCreate={geofenceProps?.onCancelCreate}
              focusedGeofenceId={geofenceProps?.focusedGeofenceId}
              onFocusGeofence={geofenceProps?.onFocusGeofence}
            />
            {mapOverlay}
          </>
        </section>
      </main>
    </div>
  );
}
