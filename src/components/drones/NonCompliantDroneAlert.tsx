"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconAlertCircle, IconSend, IconX } from "@tabler/icons-react";
import type { DroneSession } from "@/data/drones";

function parseCoord(s: string): number {
  return parseFloat(s.replace(/[°\s]/g, "")) || 0;
}

type NonCompliantDroneAlertProps = {
  drone: DroneSession;
  geofenceName: string;
  lastSeenAt: Date;
  onDismiss: () => void;
  onReportIncident: () => void;
  onSendCoordinates: () => void;
  onFocusDrone?: () => void;
};

export function NonCompliantDroneAlert({
  drone,
  geofenceName,
  lastSeenAt,
  onDismiss,
  onReportIncident,
  onSendCoordinates,
}: NonCompliantDroneAlertProps) {
  const formattedDate = lastSeenAt.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="w-full min-w-[320px] max-w-[420px] overflow-hidden rounded-xl border border-red-500/30 bg-zinc-900 shadow-2xl">
      {/* Header - dark red */}
      <div className="flex items-center gap-2 bg-red-950/90 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600">
          <IconAlertCircle className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-semibold text-white">Non-Compliant Drone Detected</h3>
      </div>

      {/* Info section */}
      <div className="space-y-2 bg-zinc-800/90 px-4 py-3">
        <div className="flex justify-between gap-2 text-xs">
          <span className="shrink-0 text-zinc-400">Drone ID:</span>
          <span className="min-w-0 truncate font-mono text-white">{drone.id}</span>
        </div>
        <div className="flex justify-between gap-2 text-xs">
          <span className="shrink-0 text-zinc-400">Drone Type:</span>
          <span className="min-w-0 truncate text-white">{drone.model}</span>
        </div>
        <div className="flex justify-between gap-2 text-xs">
          <span className="text-zinc-400">Coordinates:</span>
          <span className="font-mono text-white">
            {parseCoord(drone.droneLocation.lat).toFixed(6)}, {parseCoord(drone.droneLocation.lon).toFixed(6)}
          </span>
        </div>
        <div className="flex justify-between gap-2 text-xs">
          <span className="text-zinc-400">Last seen in unauthorized zone:</span>
          <span className="text-amber-400">{formattedDate}</span>
        </div>
      </div>

      {/* Warning message */}
      <div className="bg-red-950/50 px-4 py-2.5">
        <p className="text-xs text-red-200/90">
          This drone has entered a restricted geofence area. Please take appropriate action.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 border-t border-zinc-700/50 bg-zinc-900/80 p-3">
        <Button
          variant="secondary"
          size="sm"
          className="min-w-0 flex-1 border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          onClick={onDismiss}
        >
          <IconX className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">Dismiss</span>
        </Button>
        <Button
          size="sm"
          className="min-w-0 flex-1 shrink-0 bg-amber-600 text-white hover:bg-amber-700"
          onClick={onReportIncident}
        >
          <span className="truncate">Report Incident</span>
        </Button>
        <Button
          size="sm"
          className="min-w-0 flex-1 shrink-0 bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={onSendCoordinates}
        >
          <IconSend className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">Send Coordinates</span>
        </Button>
      </div>
    </div>
  );
}
