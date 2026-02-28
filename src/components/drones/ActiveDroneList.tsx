"use client";

import { activeDrones, type DroneSession } from "@/data/drones";
import { InfoStat } from "@/components/drones/InfoStat";
import { useDrones } from "@/context/DronesContext";
import { useMapFocus } from "@/context/MapFocusContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconShieldCheck } from "@tabler/icons-react";

export function ActiveDroneList() {
  const mapFocus = useMapFocus();
  const { isWhitelisted, whitelistDrone } = useDrones();
  const dronesToShow = activeDrones.filter((d) => !isWhitelisted(d.id));

  return (
    <div className="space-y-4">
      {dronesToShow.map((drone) => (
        <article
          key={drone.id}
          className="rounded-2xl border border-primary/70 bg-black/60 p-3 text-xs text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_10px_30px_rgba(0,0,0,0.8)]"
        >
          <header className="mb-3 flex items-center justify-between gap-2">
            <div className="truncate text-[11px] font-mono text-emerald-200/90">
              {drone.id}
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Active
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 rounded-full text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200"
                  >
                    <IconDotsVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700">
                  <DropdownMenuItem
                    onClick={() => whitelistDrone(drone.id)}
                    className="text-emerald-200 focus:bg-emerald-500/20 focus:text-emerald-100"
                  >
                    <IconShieldCheck className="mr-2 h-4 w-4" />
                    Whitelist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-500/20 px-2 py-1 text-[11px] text-emerald-100">
            <span className="truncate">{drone.model}</span>
          </div>

          {/* Drone location */}
          <section className="mb-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-100">
              <span>DRONE LOCATION</span>
              <button
                type="button"
                className="rounded-full border border-emerald-500/60 px-2 py-0.5 text-[10px] font-medium text-emerald-100 hover:bg-emerald-500/20"
                onClick={() => mapFocus?.focusDrone(drone)}
              >
                Focus
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InfoStat label="LAT" value={drone.droneLocation.lat} />
              <InfoStat label="LON" value={drone.droneLocation.lon} />
              <InfoStat label="ALT" value={drone.droneLocation.alt} />
              <InfoStat label="HDG" value={drone.droneLocation.heading} />
              <InfoStat label="SPD" value={drone.droneLocation.speed} />
              <InfoStat label="V-SPD" value={drone.droneLocation.vSpeed} />
            </div>
          </section>

          {/* Operator location */}
          <section className="mb-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-100">
              <span>OPERATOR LOCATION</span>
              <button
                type="button"
                className="rounded-full border border-emerald-500/60 px-2 py-0.5 text-[10px] font-medium text-emerald-100 hover:bg-emerald-500/20"
                onClick={() => mapFocus?.focusOperator(drone)}
              >
                Focus
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InfoStat label="LAT" value={drone.operatorLocation.lat} />
              <InfoStat label="LON" value={drone.operatorLocation.lon} />
            </div>
          </section>

          {/* Distance from nearest sensor */}
          <section className="mb-3 space-y-1">
            <div className="text-[11px] font-semibold text-emerald-100">
              DISTANCE FROM NEAREST SENSOR
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InfoStat
                label="DRONE"
                value={drone.nearestSensor.droneDistanceKm}
              />
              <InfoStat
                label="OPERATOR"
                value={drone.nearestSensor.operatorDistanceKm}
              />
            </div>
          </section>

          {/* Distance operator to drone */}
          <section className="space-y-1">
            <div className="text-[11px] font-semibold text-emerald-100">
              DISTANCE FROM OPERATOR TO DRONE
            </div>
            <InfoStat
              label="DISTANCE"
              value={drone.operatorToDrone.distanceKm}
            />
          </section>
        </article>
      ))}
    </div>
  );
}

