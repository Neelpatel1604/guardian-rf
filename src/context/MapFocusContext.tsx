"use client";

import * as React from "react";
import type { DroneSession } from "@/data/drones";

type MapFocusContextValue = {
  focusDrone: (drone: DroneSession) => void;
  focusOperator: (drone: DroneSession) => void;
};

const MapFocusContext = React.createContext<MapFocusContextValue | null>(null);

export function useMapFocus() {
  const ctx = React.useContext(MapFocusContext);
  return ctx;
}

export function MapFocusProvider({
  children,
  focusDrone,
  focusOperator,
}: {
  children: React.ReactNode;
  focusDrone: (drone: DroneSession) => void;
  focusOperator: (drone: DroneSession) => void;
}) {
  const value = React.useMemo(() => ({ focusDrone, focusOperator }), [focusDrone, focusOperator]);
  return <MapFocusContext.Provider value={value}>{children}</MapFocusContext.Provider>;
}
