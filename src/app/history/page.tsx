"use client";

import { IconAlertCircle, IconShieldCheck, IconDrone } from "@tabler/icons-react";

const historyItems = [
  {
    id: "1",
    type: "non-compliant" as const,
    title: "Non-compliant drone detected",
    description: "Drone 1668BE10JA0012345678 entered Geofence #1",
    timestamp: "Feb 27, 2026, 11:56 PM",
  },
  {
    id: "2",
    type: "detection" as const,
    title: "Drone detected",
    description: "Skydio X2E detected in monitored airspace",
    timestamp: "Feb 27, 2026, 11:45 PM",
  },
  {
    id: "3",
    type: "whitelist" as const,
    title: "Drone whitelisted",
    description: "WLST-01-SKYDIO-X2E added to whitelist",
    timestamp: "Feb 27, 2026, 10:30 PM",
  },
  {
    id: "4",
    type: "non-compliant" as const,
    title: "Non-compliant drone detected",
    description: "DJI Matrice 300 RTK entered restricted zone",
    timestamp: "Feb 27, 2026, 9:15 PM",
  },
  {
    id: "5",
    type: "detection" as const,
    title: "Drone detected",
    description: "DJI Matrice 300 RTK detected in monitored airspace",
    timestamp: "Feb 27, 2026, 9:12 PM",
  },
];

export default function HistoryPage() {
  return (
    <div className="flex min-h-[calc(100vh-2rem)] flex-col p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">History</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Activity log of drone detections, alerts, and whitelist changes.
        </p>
      </div>

      <div className="space-y-3">
        {historyItems.map((item) => (
          <article
            key={item.id}
            className="flex items-start gap-3 rounded-lg border-2 border-zinc-600/90 bg-sidebar/50 px-3 py-3 transition-colors hover:border-zinc-500/80 hover:bg-sidebar-accent/30"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                item.type === "non-compliant"
                  ? "bg-red-500/20 text-red-400"
                  : item.type === "whitelist"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-primary/20 text-primary"
              }`}
            >
              {item.type === "non-compliant" ? (
                <IconAlertCircle className="h-4 w-4" />
              ) : item.type === "whitelist" ? (
                <IconShieldCheck className="h-4 w-4" />
              ) : (
                <IconDrone className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h3
                className={`font-semibold text-sm ${
                  item.type === "non-compliant"
                    ? "text-red-400"
                    : item.type === "whitelist"
                      ? "text-emerald-400"
                      : "text-primary"
                }`}
              >
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
              <p className="text-[11px] text-muted-foreground/80">{item.timestamp}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
