"use client";

import * as React from "react";
import { MapPageLayout } from "@/components/map/MapPageLayout";
import { Button } from "@/components/ui/button";
import type { Geofence } from "@/data/geofences";
import { polygonAreaSqKm } from "@/data/geofences";
import { IconPlus, IconMapPin, IconFocus2, IconPencil, IconTrash } from "@tabler/icons-react";
import type { LatLngTuple } from "leaflet";

function boundsToPolygon(bounds: [LatLngTuple, LatLngTuple]): [number, number][] {
  const [[swLat, swLng], [neLat, neLng]] = bounds;
  return [
    [swLat, swLng],
    [swLat, neLng],
    [neLat, neLng],
    [neLat, swLng],
  ];
}

export function GeofencesConsole() {
  const [geofences, setGeofences] = React.useState<Geofence[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [focusedGeofenceId, setFocusedGeofenceId] = React.useState<string | null>(null);

  const handleSelectionComplete = React.useCallback(
    (bounds: [LatLngTuple, LatLngTuple]) => {
      const points = boundsToPolygon(bounds);
      const areaSqKm = polygonAreaSqKm(points);
      const newGeofence: Geofence = {
        id: `gf-${Date.now()}`,
        name: `Geofence #${geofences.length + 1}`,
        points,
        areaSqKm,
      };
      setGeofences((prev) => [...prev, newGeofence]);
      setIsCreating(false);
    },
    [geofences.length]
  );

  const handleDelete = React.useCallback((id: string) => {
    setGeofences((prev) => prev.filter((g) => g.id !== id));
    if (focusedGeofenceId === id) setFocusedGeofenceId(null);
  }, [focusedGeofenceId]);

  const handleFocus = React.useCallback((id: string) => {
    setFocusedGeofenceId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <MapPageLayout
      title="Geofences"
      subtitle="Define and manage geographic boundaries for monitored airspace."
      headerBadge={
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Connected
        </span>
      }
      sidebar={
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-sidebar-foreground">
              Manage Geofences
            </h2>
            <Button
              variant="outline"
              className="w-full border-emerald-500/60 bg-black/60 text-emerald-100 hover:bg-emerald-500/20"
              onClick={() => setIsCreating(true)}
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Create New Geofence
            </Button>
          </div>

          {isCreating && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 text-xs text-amber-100">
              <p className="mb-2 font-medium">Drag on the map to select an area.</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-semibold text-emerald-200">
              Existing Geofences
            </h3>
            <p className="mb-3 text-[11px] text-muted-foreground">
              Double-click on a geofence in the map to edit it.
            </p>
            <div className="space-y-3">
              {geofences.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No geofences yet. Create one to get started.
                </p>
              ) : (
                geofences.map((gf) => (
                  <article
                    key={gf.id}
                    className="rounded-xl border border-emerald-500/40 bg-black/60 p-3"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <IconMapPin className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-100">
                        {gf.name}
                      </span>
                    </div>
                    <p className="mb-3 text-[11px] text-muted-foreground">
                      {gf.points.length} points • {gf.areaSqKm.toFixed(3)} sq km
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 border-sky-500/50 px-2 text-[10px] text-sky-200"
                        onClick={() => handleFocus(gf.id)}
                      >
                        <IconFocus2 className="mr-1 h-3 w-3" />
                        Focus
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 border-amber-500/50 px-2 text-[10px] text-amber-200"
                        onClick={() => {}}
                      >
                        <IconPencil className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 px-2 text-[10px]"
                        onClick={() => handleDelete(gf.id)}
                      >
                        <IconTrash className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      }
      geofenceProps={{
        geofences,
        isCreating,
        onSelectionComplete: handleSelectionComplete,
        onCancelCreate: () => setIsCreating(false),
        focusedGeofenceId,
        onFocusGeofence: setFocusedGeofenceId,
      }}
    />
  );
}
