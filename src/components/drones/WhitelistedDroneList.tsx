"use client";

import { whitelistedDrones } from "@/data/drones";

export function WhitelistedDroneList() {
  return (
    <div className="space-y-4">
      {whitelistedDrones.map((drone) => (
        <article
          key={drone.id}
          className="rounded-2xl border border-emerald-500/50 bg-black/60 p-3 text-xs text-emerald-100 shadow-[0_0_0_1px_rgba(56,189,248,0.25),0_10px_30px_rgba(0,0,0,0.8)]"
        >
          <header className="mb-3 flex items-center justify-between gap-2">
            <div className="truncate text-[11px] font-mono text-emerald-200/80">
              {drone.id}
            </div>
            <span className="rounded-full bg-sky-500/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-200">
              Whitelisted
            </span>
          </header>

          <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-500/20 px-2 py-1 text-[11px] text-emerald-100">
            <span className="truncate">{drone.model}</span>
          </div>

          <div className="mt-3 text-[11px] text-emerald-100/80">
            This drone is approved and will not trigger alerts when detected in
            the monitored airspace.
          </div>
        </article>
      ))}
    </div>
  );
}

