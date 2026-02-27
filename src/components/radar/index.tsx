"use client";

import * as React from "react";
import { GuardianMap } from "@/components/map/GuardianMap";
import { MapSelectionOverlay } from "@/components/radar/MapSelectionOverlay";

export function RadarConsole() {
  const [selectionInfo, setSelectionInfo] = React.useState<string>(
    "Click and drag on the map to select an array area."
  );

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-sidebar-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-primary">Radar Management</h1>
          <p className="text-sm text-muted-foreground">
            Select radar arrays and coverage zones on the shared Guardian RF map.
          </p>
        </div>
      </header>

      <main className="flex flex-1">
        {/* Left side: reserved panel, same width as drones sidebar (we'll fill later) */}
        <section className="hidden w-96 border-r border-sidebar-border bg-sidebar/80 p-4 text-xs text-muted-foreground lg:flex lg:flex-col">
          <h2 className="mb-2 text-sm font-semibold text-sidebar-foreground">
            Radar Arrays
          </h2>
          <p>{selectionInfo}</p>
        </section>

        {/* Map area — same shared map component as drones (standard view) */}
        <section className="relative flex-1 bg-black">
          <GuardianMap
            mode="standard"
            title="Guardian RF Radar Map"
            className="h-full w-full border-0"
          />
          <MapSelectionOverlay
            onSelectionChange={(sel) => {
              if (!sel) {
                setSelectionInfo(
                  "Click and drag on the map to select an array area."
                );
              } else {
                setSelectionInfo(
                  `Selection: ${Math.round(sel.width)} x ${Math.round(
                    sel.height
                  )} px`
                );
              }
            }}
          />
        </section>
      </main>
    </div>
  );
}

