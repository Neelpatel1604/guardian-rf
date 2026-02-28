"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { MapPageLayout } from "@/components/map/MapPageLayout";
import { MapLayoutProvider, useMapLayout } from "@/context/MapLayoutContext";

function MapLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { geofences, isCreating, focusedGeofenceId, setFocusedGeofenceId, onSelectionComplete, setIsCreating } =
    useMapLayout();

  const isGeofences = pathname === "/geofences";

  const title = isGeofences ? "Geofences" : "Drone Management";
  const subtitle = isGeofences
    ? "Define and manage geographic boundaries for monitored airspace."
    : "Live airspace overview and active drones.";

  return (
    <MapPageLayout
      title={title}
      subtitle={subtitle}
      headerBadge={
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Connected
        </span>
      }
      sidebar={children}
      geofenceProps={
        isGeofences
          ? {
              geofences,
              isCreating,
              onSelectionComplete,
              onCancelCreate: () => setIsCreating(false),
              focusedGeofenceId,
              onFocusGeofence: setFocusedGeofenceId,
            }
          : undefined
      }
    />
  );
}

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <MapLayoutProvider>
      <MapLayoutInner>{children}</MapLayoutInner>
    </MapLayoutProvider>
  );
}
