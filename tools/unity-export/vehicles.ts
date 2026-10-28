import type { VehicleConfig } from "./extract";

// The vehicles on the /vehicles page, in order. `caption` is optional
// text shown under the viewer.
export const VEHICLES: VehicleConfig[] = [
  {
    id: "razor",
    title: "Razor",
    prefab: "Assets/Vehicles/Razor/Razor.prefab",
  },
  {
    id: "hoverbike",
    title: "Hoverbike",
    prefab: "Assets/Vehicles/Hoverbike/Hoverbike.prefab",
  },
  {
    id: "hoverboard",
    title: "Hoverboard",
    prefab: "Assets/Vehicles/Hoverboard/Hoverboard.prefab",
  },
  {
    id: "javelin",
    title: "Javelin",
    prefab: "Assets/Vehicles/Javelin/Javelin.prefab",
    // switched off in the prefab (fileID -5993774555431446439)
    hide: { "Assets/Vehicles/Javelin/ac-javelin-jet-p5.fbx": ["nose tail lights.001"] },
  },
  {
    id: "hoverpack",
    title: "Hoverpack",
    prefab: "Assets/Vehicles/Hoverpack/Hoverpack.prefab",
  },
];
