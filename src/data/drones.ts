export type DroneStatus = "active" | "whitelisted";

export type DroneSession = {
  id: string;
  status: DroneStatus;
  model: string;
  droneLocation: {
    lat: string;
    lon: string;
    alt: string;
    heading: string;
    speed: string;
    vSpeed: string;
  };
  operatorLocation: {
    lat: string;
    lon: string;
  };
  nearestSensor: {
    droneDistanceKm: string;
    operatorDistanceKm: string;
  };
  operatorToDrone: {
    distanceKm: string;
  };
};

export const activeDrones: DroneSession[] = [
  {
    id: "1668BE10JA0012345678",
    status: "active",
    model: "Skydio X2E SDR21V1/SDR21V2",
    droneLocation: {
      lat: "38.910267°",
      lon: "-77.040704°",
      alt: "70.6 m",
      heading: "188°",
      speed: "8.6 m/s",
      vSpeed: "1.4 m/s",
    },
    operatorLocation: {
      lat: "38.909900°",
      lon: "-77.042074°",
    },
    nearestSensor: {
      droneDistanceKm: "2.36 km",
      operatorDistanceKm: "2.34 km",
    },
    operatorToDrone: {
      distanceKm: "0.12 km",
    },
  },
  {
    id: "E04F9C21XA0098765432",
    status: "active",
    model: "DJI Matrice 300 RTK",
    droneLocation: {
      lat: "38.902100°",
      lon: "-77.046500°",
      alt: "120.0 m",
      heading: "034°",
      speed: "5.2 m/s",
      vSpeed: "0.3 m/s",
    },
    operatorLocation: {
      lat: "38.900800°",
      lon: "-77.049300°",
    },
    nearestSensor: {
      droneDistanceKm: "3.02 km",
      operatorDistanceKm: "2.97 km",
    },
    operatorToDrone: {
      distanceKm: "0.45 km",
    },
  },
];

export const whitelistedDrones: DroneSession[] = [
  {
    id: "WLST-01-SKYDIO-X2E",
    status: "whitelisted",
    model: "Skydio X2E Training Drone",
    droneLocation: {
      lat: "38.905000°",
      lon: "-77.050000°",
      alt: "Ground",
      heading: "—",
      speed: "—",
      vSpeed: "—",
    },
    operatorLocation: {
      lat: "38.905000°",
      lon: "-77.050000°",
    },
    nearestSensor: {
      droneDistanceKm: "—",
      operatorDistanceKm: "—",
    },
    operatorToDrone: {
      distanceKm: "—",
    },
  },
];

