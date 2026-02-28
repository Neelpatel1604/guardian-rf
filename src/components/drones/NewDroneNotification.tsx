"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconShield, IconFocus2, IconMapPin, IconX } from "@tabler/icons-react";
import type { DroneSession } from "@/data/drones";

type NewDroneNotificationProps = {
  drone: DroneSession;
  onFocusDrone: () => void;
  onFocusOperator: () => void;
  onDismiss: () => void;
};

export function NewDroneNotification({
  drone,
  onFocusDrone,
  onFocusOperator,
  onDismiss,
}: NewDroneNotificationProps) {
  return (
    <div className="absolute left-4 top-4 z-20 w-80 rounded-xl border border-sky-500/40 bg-zinc-900/95 p-4 shadow-xl backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconShield className="h-5 w-5 text-sky-400" />
          <h3 className="font-semibold text-white">New Drone Detected</h3>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white"
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 rounded-lg bg-zinc-800/80 p-3 text-xs">
        <p className="mb-1 font-mono text-sky-300">{drone.id}</p>
        <p className="mb-1 text-zinc-300">
          Type: <span className="text-zinc-200">{drone.model}</span>
        </p>
        <p className="mb-1 text-zinc-300">
          Location:{" "}
          <span className="text-zinc-200">
            {drone.droneLocation.lat}, {drone.droneLocation.lon}
          </span>
        </p>
        <p className="text-zinc-300">
          Operator:{" "}
          <span className="text-zinc-200">
            {drone.operatorLocation.lat}, {drone.operatorLocation.lon}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          className="w-full bg-sky-600 hover:bg-sky-700"
          onClick={onFocusDrone}
        >
          <IconFocus2 className="mr-2 h-4 w-4" />
          Focus on Drone
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="w-full border-emerald-500/50 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30"
          onClick={onFocusOperator}
        >
          <IconMapPin className="mr-2 h-4 w-4" />
          Find Operator
        </Button>
        <Button size="sm" variant="ghost" className="w-full text-zinc-400" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
