export type Geofence = {
  id: string;
  name: string;
  /** Polygon points [lat, lng][] - for rectangle: 4 corners */
  points: [number, number][];
  /** Area in sq km */
  areaSqKm: number;
};

/** Calculate approximate area of a polygon using Shoelace formula (for lat/lng, approximate) */
export function polygonAreaSqKm(points: [number, number][]): number {
  if (points.length < 3) return 0;
  const lat = points.reduce((s, p) => s + p[0], 0) / points.length;
  const kmPerDegLat = 111;
  const kmPerDegLng = 111 * Math.cos((lat * Math.PI) / 180);
  let areaDeg2 = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    areaDeg2 += points[i][0] * points[j][1] - points[j][0] * points[i][1];
  }
  return Math.abs(areaDeg2 * 0.5 * kmPerDegLat * kmPerDegLng);
}
