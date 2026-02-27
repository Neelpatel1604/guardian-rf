"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveDroneList } from "@/components/drones/ActiveDroneList";
import { WhitelistedDroneList } from "@/components/drones/WhitelistedDroneList";

export function DroneConsole() {
  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-sidebar-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-primary">Drone Management</h1>
          <p className="text-sm text-muted-foreground">
            Live airspace overview and active drones.
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Connected
        </span>
      </header>

      <main className="flex flex-1">
        {/* Left side: Active / Whitelisted tabs */}
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

        {/* Map area */}
        <section className="flex-1 bg-black">
          <iframe
            title="Guardian RF Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-77.200%2C38.80%2C-76.90%2C39.00&layer=mapnik"
            className="h-full w-full border-0"
          />
        </section>
      </main>
    </div>
  );
}

