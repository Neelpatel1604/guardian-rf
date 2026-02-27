"use client";

import * as React from "react";

function buildMapHtml(mode: "standard" | "satellite"): string {
  if (mode === "standard") {
    return `<!DOCTYPE html>
<html style="margin:0;padding:0;height:100%">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>html,body,#map{margin:0;padding:0;height:100%;width:100%}</style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([38.90, -77.05], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  </script>
</body>
</html>`;
  }

  return `<!DOCTYPE html>
<html style="margin:0;padding:0;height:100%">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/esri-leaflet@3.0.12/dist/esri-leaflet.js"></script>
  <style>html,body,#map{margin:0;padding:0;height:100%;width:100%}</style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([38.90, -77.05], 11);
    L.esri.basemapLayer('Imagery').addTo(map);
    L.esri.basemapLayer('ImageryLabels').addTo(map);
  </script>
</body>
</html>`;
}

type GuardianMapProps = {
  mode: "standard" | "satellite";
  title?: string;
  className?: string;
};

export function GuardianMap({
  mode,
  title = "Guardian RF Map",
  className,
}: GuardianMapProps) {
  const [blobUrl, setBlobUrl] = React.useState<string>("");

  React.useEffect(() => {
    const html = buildMapHtml(mode);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [mode]);

  if (!blobUrl) return null;

  return (
    <iframe
      key={blobUrl}
      title={title}
      src={blobUrl}
      className={className ?? "h-full w-full border-0"}
    />
  );
}

