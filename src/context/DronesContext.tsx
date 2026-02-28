"use client";

import * as React from "react";
import { whitelistedDrones } from "@/data/drones";

type DronesContextValue = {
  whitelistedIds: Set<string>;
  whitelistDrone: (id: string) => void;
  isWhitelisted: (id: string) => boolean;
};

const DronesContext = React.createContext<DronesContextValue | null>(null);

const INITIAL_WHITELISTED = new Set(whitelistedDrones.map((d) => d.id));

export function useDrones() {
  const ctx = React.useContext(DronesContext);
  if (!ctx) throw new Error("useDrones must be used within DronesProvider");
  return ctx;
}

export function DronesProvider({ children }: { children: React.ReactNode }) {
  const [whitelistedIds, setWhitelistedIds] = React.useState<Set<string>>(INITIAL_WHITELISTED);

  const whitelistDrone = React.useCallback((id: string) => {
    setWhitelistedIds((prev) => new Set([...prev, id]));
  }, []);

  const isWhitelisted = React.useCallback(
    (id: string) => whitelistedIds.has(id),
    [whitelistedIds]
  );

  const value = React.useMemo(
    () => ({ whitelistedIds, whitelistDrone, isWhitelisted }),
    [whitelistedIds, whitelistDrone, isWhitelisted]
  );

  return <DronesContext.Provider value={value}>{children}</DronesContext.Provider>;
}
