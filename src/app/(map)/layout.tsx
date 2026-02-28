"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { MapPageLayout } from "@/components/map/MapPageLayout";
import { MapLayoutProvider, useMapLayout } from "@/context/MapLayoutContext";
import { DronesProvider, useDrones } from "@/context/DronesContext";
import { MapFocusProvider } from "@/context/MapFocusContext";
import { activeDrones } from "@/data/drones";
import { isPointInPolygon } from "@/lib/geofence";
import { NonCompliantDroneAlert } from "@/components/drones/NonCompliantDroneAlert";

function parseCoord(s: string): number {
  return parseFloat(s.replace(/[°\s]/g, "")) || 0;
}

function MapLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { geofences, isCreating, focusedGeofenceId, setFocusedGeofenceId, onSelectionComplete, setIsCreating } =
    useMapLayout();
  const { isWhitelisted } = useDrones();

  const [showNewDroneNotification, setShowNewDroneNotification] = React.useState(false);
  const [showNonCompliantAlert, setShowNonCompliantAlert] = React.useState(false);
  const [flyTo, setFlyTo] = React.useState<{ lat: number; lng: number } | null>(null);
  const [dismissedNonCompliantId, setDismissedNonCompliantId] = React.useState<string | null>(null);
  const dismissTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasNonCompliantDrones = React.useMemo(() => {
    if (geofences.length === 0) return false;
    for (const gf of geofences) {
      for (const drone of activeDrones) {
        if (isWhitelisted(drone.id)) continue;
        const lat = parseCoord(drone.droneLocation.lat);
        const lng = parseCoord(drone.droneLocation.lon);
        if (isPointInPolygon([lat, lng], gf.points)) return true;
      }
    }
    return false;
  }, [geofences, isWhitelisted]);

  const nonCompliant = React.useMemo(() => {
    if (geofences.length === 0) return null;
    for (const gf of geofences) {
      for (const drone of activeDrones) {
        if (isWhitelisted(drone.id) || drone.id === dismissedNonCompliantId) continue;
        const lat = parseCoord(drone.droneLocation.lat);
        const lng = parseCoord(drone.droneLocation.lon);
        if (isPointInPolygon([lat, lng], gf.points)) {
          return { drone, geofence: gf };
        }
      }
    }
    return null;
  }, [geofences, isWhitelisted, dismissedNonCompliantId]);

  const handleShowNewDrone = React.useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setShowNewDroneNotification(true);
    dismissTimerRef.current = setTimeout(() => {
      setShowNewDroneNotification(false);
      dismissTimerRef.current = null;
    }, 5000);
  }, []);

  React.useEffect(() => {
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  const isGeofences = pathname === "/geofences";
  const isDrones = pathname === "/drones";

  const handleFocusDrone = React.useCallback((drone: (typeof activeDrones)[0]) => {
    setFlyTo({
      lat: parseCoord(drone.droneLocation.lat),
      lng: parseCoord(drone.droneLocation.lon),
    });
  }, []);

  const handleFocusOperator = React.useCallback((drone: (typeof activeDrones)[0]) => {
    setFlyTo({
      lat: parseCoord(drone.operatorLocation.lat),
      lng: parseCoord(drone.operatorLocation.lon),
    });
  }, []);

  const title = isGeofences ? "Geofences" : "Drone Management";
  const subtitle = isGeofences
    ? "Define and manage geographic boundaries for monitored airspace."
    : "Live airspace overview and active drones.";

  return (
    <MapFocusProvider focusDrone={handleFocusDrone} focusOperator={handleFocusOperator}>
    <MapPageLayout
      title={title}
      subtitle={subtitle}
      headerBadge={
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Connected
        </span>
      }
      sidebar={children}
      droneProps={{
        activeDrones,
        showNewDroneNotification: isDrones ? showNewDroneNotification : false,
        onDismissNewDrone: isDrones
          ? () => {
              if (dismissTimerRef.current) {
                clearTimeout(dismissTimerRef.current);
                dismissTimerRef.current = null;
              }
              setShowNewDroneNotification(false);
            }
          : undefined,
        onShowNewDrone: isDrones ? handleShowNewDrone : undefined,
        onFocusDrone: handleFocusDrone,
        onFocusOperator: handleFocusOperator,
        flyTo,
        onFlyComplete: () => setFlyTo(null),
      }}
      geofenceProps={{
        geofences,
        isCreating: isGeofences ? isCreating : false,
        onSelectionComplete: isGeofences ? onSelectionComplete : () => {},
        onCancelCreate: () => setIsCreating(false),
        focusedGeofenceId: isGeofences ? focusedGeofenceId : null,
        onFocusGeofence: isGeofences ? setFocusedGeofenceId : () => {},
      }}
      onShowNonCompliant={
        hasNonCompliantDrones
          ? () => {
              setDismissedNonCompliantId(null);
              setShowNonCompliantAlert(true);
            }
          : undefined
      }
      nonCompliantAlert={
        showNonCompliantAlert && nonCompliant
          ? {
              drone: nonCompliant.drone,
              geofenceName: nonCompliant.geofence.name,
              lastSeenAt: new Date(),
              onDismiss: () => {
                setShowNonCompliantAlert(false);
                setDismissedNonCompliantId(nonCompliant.drone.id);
              },
              onReportIncident: () => {},
              onSendCoordinates: () => {},
              onFocusDrone: () =>
                setFlyTo({
                  lat: parseCoord(nonCompliant.drone.droneLocation.lat),
                  lng: parseCoord(nonCompliant.drone.droneLocation.lon),
                }),
            }
          : undefined
      }
    />
    </MapFocusProvider>
  );
}

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <DronesProvider>
      <MapLayoutProvider>
        <MapLayoutInner>{children}</MapLayoutInner>
      </MapLayoutProvider>
    </DronesProvider>
  );
}
