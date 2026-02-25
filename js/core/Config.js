export const THEMES = [
  "Factory",
  "Space",
  "Moon",
  "Jungle",
  "Underwater",
  "Candy",
  "Arctic",
  "Sunset",
];

export const DANCE_STYLES = [
  { name: "Bounce", cssClass: "dance-bounce" },
  { name: "Twist", cssClass: "dance-twist" },
  { name: "Shimmy", cssClass: "dance-shimmy" },
  { name: "Disco", cssClass: "dance-disco" },
];

export const EMOTIONS = [":)", "B)", ":D", "xD", "o_o", "^_^", "!!", "<3"];

export const SCALE_PRESETS = [0.78, 0.9, 1, 1.12, 1.24, 1.36, 1.5];

export const PALETTES = [
  { name: "Steel", head: "#64748b", body: "#4b5563", arms: "#6b7280", legs: "#475569" },
  { name: "Ocean", head: "#2563eb", body: "#1d4ed8", arms: "#38bdf8", legs: "#1e40af" },
  { name: "Jungle", head: "#16a34a", body: "#15803d", arms: "#4ade80", legs: "#166534" },
  { name: "Sun", head: "#f59e0b", body: "#f97316", arms: "#fbbf24", legs: "#ea580c" },
  { name: "Berry", head: "#ec4899", body: "#d946ef", arms: "#f472b6", legs: "#be185d" },
  { name: "Mint", head: "#22d3ee", body: "#14b8a6", arms: "#2dd4bf", legs: "#0f766e" },
  { name: "Cloud", head: "#94a3b8", body: "#64748b", arms: "#cbd5e1", legs: "#475569" },
  { name: "Coral", head: "#fb7185", body: "#f43f5e", arms: "#fdba74", legs: "#be123c" },
];

export const PART_CATALOG = {
  heads: [
    { key: "cube", variant: 0 },
    { key: "bubble", variant: 1 },
    { key: "visor", variant: 2 },
    { key: "antenna", variant: 3 },
    { key: "cat", variant: 4 },
    { key: "crown", variant: 5 },
    { key: "helmet", variant: 6 },
    { key: "star", variant: 7 },
    { key: "cloud", variant: 8 },
    { key: "rocket", variant: 9 },
  ],
  bodies: [
    { key: "chest", variant: 0, engine: false },
    { key: "tank", variant: 1, engine: false },
    { key: "shield", variant: 2, engine: false },
    { key: "orb", variant: 3, engine: false },
    { key: "speaker", variant: 4, engine: false },
    { key: "safe", variant: 5, engine: false },
    { key: "rocket", variant: 6, engine: false },
    { key: "gift", variant: 7, engine: false },
    { key: "engine", variant: 8, engine: true },
    { key: "jet", variant: 9, engine: true },
  ],
  arms: [
    { key: "claw", variant: 0 },
    { key: "spring", variant: 1 },
    { key: "paddle", variant: 2 },
    { key: "wing", variant: 3 },
    { key: "mitt", variant: 4 },
    { key: "wand", variant: 5 },
    { key: "hook", variant: 6 },
    { key: "drum", variant: 7 },
    { key: "brush", variant: 8 },
    { key: "fan", variant: 9 },
  ],
  legs: [
    { key: "walker", variant: 0 },
    { key: "boots", variant: 1 },
    { key: "wheels", variant: 2 },
    { key: "treads", variant: 3 },
    { key: "hover", variant: 4 },
    { key: "springs", variant: 5 },
    { key: "stompers", variant: 6 },
    { key: "pogo", variant: 7 },
    { key: "skates", variant: 8 },
    { key: "paws", variant: 9 },
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

export const HIDE_SEEK_SECONDS = 15;
export const MOVE_STEP_MS = 900;
export const MOVE_TRANSITION_MS = 650;
export const MOVE_DELTA_X = 120;
export const MOVE_DELTA_Y = 55;
export const HIDE_HINT_INTERVAL_MS = 2600;
export const HIDE_HINT_DURATION_MS = 700;
