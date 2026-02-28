"use client";

import * as React from "react";
import { MapPageLayout } from "@/components/map/MapPageLayout";
import { MapSelectionOverlay } from "@/components/radar/MapSelectionOverlay";

export function RadarConsole() {
  const [selectionInfo, setSelectionInfo] = React.useState<string>(
    "Click and drag on the map to select an array area."
  );

  return (
    <MapPageLayout
      title="Radar Management"
      subtitle="Select radar arrays and coverage zones on the shared Guardian RF map."
      sidebar={
        <>
          <h2 className="mb-2 text-sm font-semibold text-sidebar-foreground">
            Radar Arrays
          </h2>
          <p className="text-xs text-muted-foreground">{selectionInfo}</p>
        </>
      }
      mapOverlay={
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
      }
    />
  );
}

