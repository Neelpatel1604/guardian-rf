"use client";

type InfoStatProps = {
  label: string;
  value: string;
};

export function InfoStat({ label, value }: InfoStatProps) {
  return (
    <div className="rounded-lg border border-emerald-600/60 bg-zinc-900/80 px-2 py-1.5">
      <div className="text-[10px] font-medium uppercase tracking-wide text-emerald-300/80">
        {label}
      </div>
      <div className="text-[11px] font-semibold text-emerald-100">
        {value}
      </div>
    </div>
  );
}

