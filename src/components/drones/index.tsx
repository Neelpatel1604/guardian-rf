"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveDroneList } from "@/components/drones/ActiveDroneList";
import { WhitelistedDroneList } from "@/components/drones/WhitelistedDroneList";
import { MapPageLayout } from "@/components/map/MapPageLayout";

export function DroneConsole() {
  return (
    <MapPageLayout
      title="Drone Management"
      subtitle="Live airspace overview and active drones."
      headerBadge={
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Connected
        </span>
      }
      sidebar={
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
      }
    />
  );
}