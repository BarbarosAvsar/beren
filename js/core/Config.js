export const THEMES = [
  "Factory",
  "Space",
  "Moon",
  "Jungle",
  "Mars",
  "Underwater",
  "Candy",
  "Volcano",
  "Arctic",
  "Sunset",
  "Haunted",
  "Disco",
];

export const DANCE_STYLES = [
  { name: "Bounce", cssClass: "dance-bounce" },
  { name: "Twist", cssClass: "dance-twist" },
  { name: "Shimmy", cssClass: "dance-shimmy" },
  { name: "Disco", cssClass: "dance-disco" },
];

export const EMOTIONS = [":)", "B)", ":D", "xD", "o_o", ">:)", "^_^", "!!"];

export const SCALE_PRESETS = [0.75, 0.9, 1, 1.15, 1.3, 1.45, 1.6];

export const PALETTES = [
  { name: "Steel", head: "#64748b", body: "#4b5563", arms: "#6b7280", legs: "#475569" },
  { name: "Ocean", head: "#2563eb", body: "#1d4ed8", arms: "#0ea5e9", legs: "#1e40af" },
  { name: "Jungle", head: "#16a34a", body: "#15803d", arms: "#22c55e", legs: "#166534" },
  { name: "Solar", head: "#f59e0b", body: "#f97316", arms: "#fbbf24", legs: "#ea580c" },
  { name: "Candy", head: "#ec4899", body: "#d946ef", arms: "#f472b6", legs: "#be185d" },
  { name: "Neon", head: "#22d3ee", body: "#14b8a6", arms: "#06b6d4", legs: "#0f766e" },
  { name: "Shadow", head: "#334155", body: "#1e293b", arms: "#475569", legs: "#0f172a" },
  { name: "Ember", head: "#ef4444", body: "#dc2626", arms: "#f97316", legs: "#991b1b" },
];

export const PART_CATALOG = {
  heads: [
    { key: "classic", variant: 0 },
    { key: "round", variant: 1 },
    { key: "visor", variant: 2 },
    { key: "antenna", variant: 3 },
    { key: "radar", variant: 4 },
    { key: "crown", variant: 5 },
  ],
  bodies: [
    { key: "core", variant: 0, engine: false },
    { key: "tank", variant: 1, engine: false },
    { key: "vault", variant: 2, engine: false },
    { key: "shield", variant: 3, engine: false },
    { key: "turbo", variant: 4, engine: true },
    { key: "jet", variant: 5, engine: true },
  ],
  arms: [
    { key: "clamp", variant: 0 },
    { key: "joint", variant: 1 },
    { key: "hook", variant: 2 },
    { key: "tool", variant: 3 },
    { key: "blade", variant: 4 },
  ],
  legs: [
    { key: "walker", variant: 0 },
    { key: "boots", variant: 1 },
    { key: "wheels", variant: 2 },
    { key: "hover", variant: 3 },
    { key: "treads", variant: 4 },
  ],
};

export const CONTROL_DEFINITIONS = [
  { id: "scene", action: "nextTheme", label: "Scene", icon: "icon-scene", variant: "scene" },
  { id: "color", action: "nextPalette", label: "Color", icon: "icon-color", variant: "color" },
  { id: "size", action: "nextSize", label: "Size", icon: "icon-size", variant: "size" },
  { id: "mix", action: "randomize", label: "Mix", icon: "icon-mix", variant: "mix" },
  { id: "move", action: "toggleMove", label: "Move", icon: "icon-move", variant: "move" },
  { id: "dance", action: "toggleDance", label: "Dance", icon: "icon-dance", variant: "dance" },
  { id: "hide", action: "toggleHideSeek", label: "Hide", icon: "icon-hide", variant: "hideSeek" },
];

export const HIDE_SEEK_SECONDS = 30;
