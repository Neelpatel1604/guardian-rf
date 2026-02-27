"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveDroneList } from "@/components/drones/ActiveDroneList";
import { WhitelistedDroneList } from "@/components/drones/WhitelistedDroneList";
import { GuardianMap } from "@/components/map/GuardianMap";

export function DroneConsole() {
  const [mapMode, setMapMode] = React.useState<"standard" | "satellite">(
    "standard"
  );

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-sidebar-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-primary">Drone Management</h1>
          <p className="text-sm text-muted-foreground">
            Live airspace overview and active drones.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Connected
          </span>
        </div>
      </header>

      <main className="flex flex-1">
        <section className="hidden w-96 border-r border-sidebar-border bg-sidebar/80 p-4 lg:flex lg:flex-col">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-3 inline-flex h-9 w-full items-center justify-start rounded-lg bg-background/10 p-1 text-xs font-medium">
              <TabsTrigger
                value="active"
                className="flex-1 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Active Drones
              </TabsTrigger>
              <TabsTrigger
                value="whitelist"
                className="flex-1 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Whitelisted Drones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <ActiveDroneList />
            </TabsContent>

            <TabsContent value="whitelist" className="space-y-4">
              <WhitelistedDroneList />
            </TabsContent>
          </Tabs>
        </section>

        <section className="relative flex-1 bg-black">
          <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-zinc-900/70 px-3 py-1 text-[11px] font-medium text-emerald-100">
            {mapMode === "standard" ? "Standard View" : "Satellite View"}
          </div>
          <GuardianMap mode={mapMode} />
        </section>
      </main>
    </div>
  );
}