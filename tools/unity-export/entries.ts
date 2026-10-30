import type { EntryConfig } from "./extract";

// The entries on the /models page, in order. `caption` is optional
// text shown under the viewer.

// the earlier AC Mini project, for the bots and props
const AC_MINI = "~/unity/ac-mini";
export const ENTRIES: EntryConfig[] = [
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
  { id: "bicycle", title: "Bicycle", prefab: "Assets/Vehicles/Bicycle/Bicycle.prefab" },
  { id: "crawler", title: "Crawler", project: AC_MINI, prefab: "Assets/Prefabs/Crawler.prefab" },
  { id: "airship", title: "Airship", project: AC_MINI, prefab: "Assets/Prefabs/Airship.prefab" },
  { id: "tram", title: "Tram", project: AC_MINI, prefab: "Assets/Prefabs/Tram.prefab" },
  { id: "subway-car", title: "Subway Car", project: AC_MINI, prefab: "Assets/Prefabs/Subway Car.prefab" },
  { id: "sweeper-bot", title: "Sweeper Bot", project: AC_MINI, prefab: "Assets/Models/Vehicles/SweeperBot.prefab" },
  // hidden from the page for now
  // { id: "ballbot", title: "Ballbot", project: AC_MINI, prefab: "Assets/Prefabs/Bots/Ballbot 2.prefab" },
  { id: "fabricator", title: "Fabricator", project: AC_MINI, prefab: "Assets/Prefabs/Fabricator.prefab" },
  { id: "terminal", title: "Terminal", project: AC_MINI, prefab: "Assets/Prefabs/KeyLocations/Terminal.prefab" },
  {
    id: "wolf",
    title: "Wolf Sculpture",
    project: AC_MINI,
    // placed in the City scene as the model itself, in steel
    model: "Assets/Models/Props/ac-origami-wolf.fbx",
    materials: { Universal: "Assets/Materials/MK Toon/MK Two Sided Steel.mat" },
  },
  { id: "server-rack", title: "Server Rack", project: AC_MINI, prefab: "Assets/Prefabs/Mechanics/ServerRack.prefab" },
  { id: "scout", title: "Scout", project: AC_MINI, prefab: "Assets/Prefabs/Characters/Scout.prefab" },
  { id: "pk9", title: "PK9", project: AC_MINI, prefab: "Assets/Scout/PK9.prefab" },
  { id: "security-bot", title: "Security Bot", project: AC_MINI, prefab: "Assets/Prefabs/Mechanics/SecurityBot.prefab" },
  { id: "eau-bot", title: "EAU Bot", project: AC_MINI, prefab: "Assets/Models/Vehicles/EAU Bot.prefab" },
  { id: "botdroid", title: "BotDroid 3B", project: AC_MINI, prefab: "Assets/Models/Characters/BotDroid/BotDroid 3B.prefab" },
  {
    id: "arm",
    title: "ARM",
    project: AC_MINI,
    // the model in the ARM ads
    model: "Assets/Models/Greebs/ac-arm-dark.fbx",
    // the face upright and square to a level camera
    rotation: { x: 90, y: 55.5 },
    level: true,
  },
];
