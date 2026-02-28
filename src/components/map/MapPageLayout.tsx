"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

const GuardianMapReact = dynamic(
  () => import("@/components/map/GuardianMapReact").then((m) => m.GuardianMapReact),
  { ssr: false }
);
import type { Geofence } from "@/data/geofences";
import type { DroneSession } from "@/data/drones";
import type { LatLngTuple } from "leaflet";
import { IconBell, IconAlertCircle } from "@tabler/icons-react";
import { NewDroneNotification } from "@/components/drones/NewDroneNotification";
import { NonCompliantDroneAlert } from "@/components/drones/NonCompliantDroneAlert";

export type DroneMapProps = {
  activeDrones: DroneSession[];
  showNewDroneNotification?: boolean;
  onDismissNewDrone?: () => void;
  onShowNewDrone?: () => void;
  onFocusDrone?: (drone: DroneSession) => void;
  onFocusOperator?: (drone: DroneSession) => void;
  flyTo?: { lat: number; lng: number } | null;
  onFlyComplete?: () => void;
};

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
  /** Optional drone props. When provided, map shows drone and operator markers. */
  droneProps?: DroneMapProps;
  /** Optional geofence props. When provided, map shows geofences and supports drawing. */
  geofenceProps?: GeofenceMapProps;
  /** Optional header badge (e.g. "Connected") */
  headerBadge?: React.ReactNode;
  /** Optional extra header actions (right side, before map mode toggle) */
  headerActions?: React.ReactNode;
  /** Whether to show Standard/Satellite map mode toggle. Default: true */
  showMapModeToggle?: boolean;
  /** Called when user clicks to show non-compliant drone notification */
  onShowNonCompliant?: () => void;
  /** Non-compliant drone alert (drone in geofence, not whitelisted) */
  nonCompliantAlert?: {
    drone: DroneSession;
    geofenceName: string;
    lastSeenAt: Date;
    onDismiss: () => void;
    onReportIncident: () => void;
    onSendCoordinates: () => void;
    onFocusDrone?: () => void;
  };
};

export function MapPageLayout({
  title,
  subtitle,
  sidebar,
  mapOverlay,
  droneProps,
  geofenceProps,
  headerBadge,
  headerActions,
  showMapModeToggle = true,
  onShowNonCompliant,
  nonCompliantAlert,
}: MapPageLayoutProps) {
  const [mapMode, setMapMode] = React.useState<"standard" | "satellite">(
    "standard"
  );
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

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
          {droneProps?.onShowNewDrone && (
            <button
              type="button"
              onClick={() => droneProps.onShowNewDrone?.()}
              className="flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1.5 text-[11px] font-medium text-amber-200 transition-colors hover:bg-amber-500/30"
            >
              <IconBell className="h-4 w-4" />
              New Drone
            </button>
          )}
          {onShowNonCompliant && (
            <button
              type="button"
              onClick={onShowNonCompliant}
              className="flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1.5 text-[11px] font-medium text-red-200 transition-colors hover:bg-red-500/30"
            >
              <IconAlertCircle className="h-4 w-4" />
              Non-Compliant Drone
            </button>
          )}
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

        <section className="relative flex-1 bg-black" id="map-section">
          {showMapModeToggle && (
            <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-zinc-900/70 px-3 py-1 text-[11px] font-medium text-emerald-100">
              {mapMode === "standard" ? "Standard View" : "Satellite View"}
            </div>
          )}
          <GuardianMapReact
              mapMode={mapMode}
              activeDrones={droneProps?.activeDrones}
              flyTo={droneProps?.flyTo}
              onFlyComplete={droneProps?.onFlyComplete}
              geofences={geofenceProps?.geofences}
              isCreating={geofenceProps?.isCreating}
              onSelectionComplete={geofenceProps?.onSelectionComplete}
              onCancelCreate={geofenceProps?.onCancelCreate}
              focusedGeofenceId={geofenceProps?.focusedGeofenceId}
              onFocusGeofence={geofenceProps?.onFocusGeofence}
            />
          {mapOverlay}
          {mounted &&
            droneProps?.activeDrones &&
            droneProps.activeDrones.length > 0 &&
            droneProps.showNewDroneNotification &&
            createPortal(
              <div className="fixed left-[calc(24rem+4rem)] top-24 z-[9999]">
                <NewDroneNotification
                  drone={droneProps.activeDrones[0]}
                  onFocusDrone={() => droneProps?.onFocusDrone?.(droneProps.activeDrones[0])}
                  onFocusOperator={() => droneProps?.onFocusOperator?.(droneProps.activeDrones[0])}
                  onDismiss={() => droneProps?.onDismissNewDrone?.()}
                />
              </div>,
              document.body
            )}
          {mounted &&
            nonCompliantAlert &&
            createPortal(
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
                <div className="shrink-0">
                <NonCompliantDroneAlert
                  drone={nonCompliantAlert.drone}
                  geofenceName={nonCompliantAlert.geofenceName}
                  lastSeenAt={nonCompliantAlert.lastSeenAt}
                  onDismiss={nonCompliantAlert.onDismiss}
                  onReportIncident={nonCompliantAlert.onReportIncident}
                  onSendCoordinates={nonCompliantAlert.onSendCoordinates}
                  onFocusDrone={nonCompliantAlert.onFocusDrone}
                />
                </div>
              </div>,
              document.body
            )}
        </section>
      </main>
    </div>
  );
}
