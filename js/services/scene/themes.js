export const SCENE_THEMES = Object.freeze({
  Factory: {
    accents: [
      { x: 15, y: 20, w: 120, h: 120, color: "rgba(148,163,184,0.28)", shape: "square" },
      { x: 82, y: 25, w: 100, h: 100, color: "rgba(250,204,21,0.2)", shape: "circle" },
      { x: 50, y: 78, w: 360, h: 24, color: "rgba(148,163,184,0.22)", shape: "line" },
    ],
    occluders: [
      { id: "crate-left", type: "crate", x: 18, y: 72, w: 130, h: 130 },
      { id: "crate-right", type: "crate", x: 81, y: 70, w: 120, h: 120 },
      { id: "pipe", type: "pipe", x: 52, y: 68, w: 190, h: 170 },
    ],
    hideSpots: [
      { x: -245, y: 90, occluderId: "crate-left", peek: "right" },
      { x: 240, y: 82, occluderId: "crate-right", peek: "left" },
      { x: 0, y: 80, occluderId: "pipe", peek: "up" },
    ],
  },
  Space: {
    accents: [
      { x: 20, y: 22, w: 5, h: 5, color: "rgba(255,255,255,0.88)", shape: "circle" },
      { x: 43, y: 32, w: 4, h: 4, color: "rgba(255,255,255,0.75)", shape: "circle" },
      { x: 77, y: 18, w: 7, h: 7, color: "rgba(255,255,255,0.9)", shape: "circle" },
      { x: 67, y: 23, w: 130, h: 130, color: "rgba(99,102,241,0.2)", shape: "circle" },
    ],
    occluders: [
      { id: "planet-left", type: "planet", x: 15, y: 70, w: 150, h: 150 },
      { id: "planet-right", type: "planet", x: 84, y: 68, w: 170, h: 170 },
      { id: "cloud", type: "nebula", x: 48, y: 75, w: 260, h: 120 },
    ],
    hideSpots: [
      { x: -248, y: 84, occluderId: "planet-left", peek: "right" },
      { x: 245, y: 86, occluderId: "planet-right", peek: "left" },
      { x: -20, y: 92, occluderId: "cloud", peek: "up" },
    ],
  },
  Moon: {
    accents: [
      { x: 80, y: 18, w: 140, h: 140, color: "rgba(255,255,255,0.24)", shape: "circle" },
      { x: 30, y: 80, w: 270, h: 38, color: "rgba(148,163,184,0.28)", shape: "line" },
    ],
    occluders: [
      { id: "rock-left", type: "rock", x: 20, y: 73, w: 150, h: 105 },
      { id: "rock-right", type: "rock", x: 80, y: 71, w: 170, h: 118 },
      { id: "ridge", type: "ridge", x: 50, y: 79, w: 340, h: 120 },
    ],
    hideSpots: [
      { x: -235, y: 88, occluderId: "rock-left", peek: "right" },
      { x: 225, y: 85, occluderId: "rock-right", peek: "left" },
      { x: 6, y: 92, occluderId: "ridge", peek: "up" },
    ],
  },
  Jungle: {
    accents: [
      { x: 11, y: 22, w: 70, h: 220, color: "rgba(34,197,94,0.2)", shape: "line" },
      { x: 88, y: 22, w: 65, h: 220, color: "rgba(21,128,61,0.2)", shape: "line" },
      { x: 47, y: 70, w: 170, h: 170, color: "rgba(187,247,208,0.2)", shape: "circle" },
    ],
    occluders: [
      { id: "tree-left", type: "tree", x: 14, y: 66, w: 165, h: 220 },
      { id: "tree-right", type: "tree", x: 83, y: 67, w: 175, h: 220 },
      { id: "bush", type: "bush", x: 50, y: 79, w: 330, h: 130 },
    ],
    hideSpots: [
      { x: -246, y: 72, occluderId: "tree-left", peek: "right" },
      { x: 240, y: 73, occluderId: "tree-right", peek: "left" },
      { x: 0, y: 95, occluderId: "bush", peek: "up" },
    ],
  },
  Underwater: {
    accents: [
      { x: 20, y: 25, w: 60, h: 60, color: "rgba(255,255,255,0.2)", shape: "circle" },
      { x: 42, y: 48, w: 50, h: 50, color: "rgba(255,255,255,0.18)", shape: "circle" },
      { x: 74, y: 30, w: 68, h: 68, color: "rgba(255,255,255,0.22)", shape: "circle" },
    ],
    occluders: [
      { id: "reef-left", type: "reef", x: 17, y: 72, w: 170, h: 150 },
      { id: "reef-right", type: "reef", x: 80, y: 72, w: 180, h: 150 },
      { id: "seaweed", type: "seaweed", x: 52, y: 74, w: 320, h: 170 },
    ],
    hideSpots: [
      { x: -238, y: 94, occluderId: "reef-left", peek: "right" },
      { x: 236, y: 96, occluderId: "reef-right", peek: "left" },
      { x: -5, y: 88, occluderId: "seaweed", peek: "up" },
    ],
  },
  Candy: {
    accents: [
      { x: 17, y: 23, w: 62, h: 62, color: "rgba(251,113,133,0.27)", shape: "circle" },
      { x: 78, y: 20, w: 58, h: 58, color: "rgba(217,70,239,0.25)", shape: "square" },
      { x: 50, y: 69, w: 180, h: 24, color: "rgba(252,165,165,0.26)", shape: "line" },
    ],
    occluders: [
      { id: "gumdrop-left", type: "gumdrop", x: 20, y: 74, w: 170, h: 125 },
      { id: "gumdrop-right", type: "gumdrop", x: 82, y: 74, w: 185, h: 125 },
      { id: "hill", type: "candies", x: 50, y: 77, w: 340, h: 140 },
    ],
    hideSpots: [
      { x: -236, y: 92, occluderId: "gumdrop-left", peek: "right" },
      { x: 240, y: 91, occluderId: "gumdrop-right", peek: "left" },
      { x: 10, y: 94, occluderId: "hill", peek: "up" },
    ],
  },
  Arctic: {
    accents: [
      { x: 18, y: 20, w: 12, h: 12, color: "rgba(255,255,255,0.78)", shape: "circle" },
      { x: 41, y: 30, w: 10, h: 10, color: "rgba(255,255,255,0.68)", shape: "circle" },
      { x: 78, y: 26, w: 12, h: 12, color: "rgba(255,255,255,0.75)", shape: "circle" },
    ],
    occluders: [
      { id: "ice-left", type: "ice", x: 16, y: 70, w: 175, h: 150 },
      { id: "ice-right", type: "ice", x: 84, y: 70, w: 170, h: 145 },
      { id: "snowbank", type: "snowbank", x: 52, y: 79, w: 350, h: 120 },
    ],
    hideSpots: [
      { x: -239, y: 85, occluderId: "ice-left", peek: "right" },
      { x: 238, y: 87, occluderId: "ice-right", peek: "left" },
      { x: 0, y: 96, occluderId: "snowbank", peek: "up" },
    ],
  },
  Sunset: {
    accents: [
      { x: 51, y: 19, w: 100, h: 100, color: "rgba(251,191,36,0.35)", shape: "circle" },
      { x: 50, y: 73, w: 300, h: 20, color: "rgba(255,255,255,0.24)", shape: "line" },
    ],
    occluders: [
      { id: "hill-left", type: "hill", x: 19, y: 76, w: 220, h: 160 },
      { id: "hill-right", type: "hill", x: 81, y: 76, w: 220, h: 160 },
      { id: "cloud", type: "cloud", x: 50, y: 44, w: 260, h: 100 },
    ],
    hideSpots: [
      { x: -232, y: 95, occluderId: "hill-left", peek: "right" },
      { x: 233, y: 95, occluderId: "hill-right", peek: "left" },
      { x: 0, y: -40, occluderId: "cloud", peek: "down" },
    ],
  },
});
