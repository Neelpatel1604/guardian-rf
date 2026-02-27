"use client";

import * as React from "react";

type Selection = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type MapSelectionOverlayProps = {
  onSelectionChange?: (selection: Selection | null) => void;
};

export function MapSelectionOverlay({
  onSelectionChange,
}: MapSelectionOverlayProps) {
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number } | null>(null);
  const [selection, setSelection] = React.useState<Selection | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;
    setDragStart({ x: startX, y: startY });
    setSelection(null);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStart || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    const x = Math.min(dragStart.x, currentX);
    const y = Math.min(dragStart.y, currentY);
    const width = Math.abs(currentX - dragStart.x);
    const height = Math.abs(currentY - dragStart.y);

    const next: Selection = { x, y, width, height };
    setSelection(next);
    onSelectionChange?.(next);
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {selection && selection.width > 4 && selection.height > 4 && (
        <div
          className="pointer-events-none absolute rounded border border-emerald-400/80 bg-emerald-500/10"
          style={{
            left: selection.x,
            top: selection.y,
            width: selection.width,
            height: selection.height,
          }}
        />
      )}
    </div>
  );
}

