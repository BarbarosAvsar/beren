export class SceneService {
  #container;

  static #accentsByTheme = {
    Factory: [
      { x: 8, y: 20, w: 90, h: 90, color: "rgba(148,163,184,0.4)", shape: "square" },
      { x: 76, y: 12, w: 70, h: 70, color: "rgba(250,204,21,0.35)", shape: "line" },
      { x: 42, y: 66, w: 130, h: 16, color: "rgba(148,163,184,0.25)", shape: "line" },
    ],
    Space: [
      { x: 15, y: 25, w: 4, h: 4, color: "rgba(255,255,255,0.8)", shape: "circle" },
      { x: 50, y: 18, w: 5, h: 5, color: "rgba(255,255,255,0.7)", shape: "circle" },
      { x: 80, y: 36, w: 6, h: 6, color: "rgba(255,255,255,0.75)", shape: "circle" },
      { x: 68, y: 18, w: 88, h: 88, color: "rgba(147,51,234,0.35)", shape: "circle" },
    ],
    Moon: [
      { x: 75, y: 14, w: 120, h: 120, color: "rgba(255,255,255,0.32)", shape: "circle" },
      { x: 30, y: 75, w: 240, h: 40, color: "rgba(148,163,184,0.35)", shape: "line" },
    ],
    Jungle: [
      { x: 6, y: 15, w: 40, h: 220, color: "rgba(34,197,94,0.35)", shape: "line" },
      { x: 90, y: 18, w: 36, h: 240, color: "rgba(21,128,61,0.35)", shape: "line" },
      { x: 48, y: 68, w: 150, h: 150, color: "rgba(134,239,172,0.2)", shape: "circle" },
    ],
    Mars: [
      { x: 70, y: 20, w: 90, h: 90, color: "rgba(248,113,113,0.25)", shape: "circle" },
      { x: 35, y: 72, w: 220, h: 30, color: "rgba(180,83,9,0.32)", shape: "line" },
    ],
    Underwater: [
      { x: 20, y: 18, w: 55, h: 55, color: "rgba(255,255,255,0.22)", shape: "circle" },
      { x: 42, y: 50, w: 48, h: 48, color: "rgba(255,255,255,0.18)", shape: "circle" },
      { x: 75, y: 30, w: 60, h: 60, color: "rgba(255,255,255,0.2)", shape: "circle" },
    ],
    Candy: [
      { x: 16, y: 26, w: 56, h: 56, color: "rgba(236,72,153,0.35)", shape: "circle" },
      { x: 78, y: 24, w: 46, h: 46, color: "rgba(217,70,239,0.3)", shape: "square" },
      { x: 48, y: 66, w: 120, h: 18, color: "rgba(249,168,212,0.42)", shape: "line" },
    ],
    Volcano: [
      { x: 45, y: 60, w: 150, h: 150, color: "rgba(248,113,113,0.25)", shape: "circle" },
      { x: 48, y: 80, w: 260, h: 24, color: "rgba(249,115,22,0.42)", shape: "line" },
    ],
    Arctic: [
      { x: 15, y: 20, w: 10, h: 10, color: "rgba(255,255,255,0.72)", shape: "circle" },
      { x: 42, y: 35, w: 8, h: 8, color: "rgba(255,255,255,0.68)", shape: "circle" },
      { x: 75, y: 28, w: 9, h: 9, color: "rgba(255,255,255,0.74)", shape: "circle" },
    ],
    Sunset: [
      { x: 52, y: 18, w: 90, h: 90, color: "rgba(251,191,36,0.4)", shape: "circle" },
      { x: 50, y: 72, w: 260, h: 16, color: "rgba(255,255,255,0.2)", shape: "line" },
    ],
    Haunted: [
      { x: 20, y: 24, w: 70, h: 70, color: "rgba(167,139,250,0.26)", shape: "circle" },
      { x: 80, y: 14, w: 120, h: 120, color: "rgba(148,163,184,0.18)", shape: "circle" },
    ],
    Disco: [
      { x: 50, y: 22, w: 120, h: 120, color: "rgba(244,114,182,0.25)", shape: "circle" },
      { x: 50, y: 72, w: 280, h: 24, color: "rgba(56,189,248,0.2)", shape: "line" },
    ],
  };

  constructor(container) {
    this.#container = container;
  }

  render(themeName) {
    this.#container.className = `scene-layer scene-theme-${themeName.toLowerCase()}`;
    this.#container.innerHTML = "";

    const accents = SceneService.#accentsByTheme[themeName] ?? [];
    accents.forEach((accent) => {
      const node = document.createElement("div");
      node.className = `scene-accent ${accent.shape}`;
      node.style.left = `${accent.x}%`;
      node.style.top = `${accent.y}%`;
      node.style.width = `${accent.w}px`;
      node.style.height = `${accent.h}px`;
      node.style.background = accent.color;
      node.style.transform = "translate(-50%, -50%)";
      this.#container.appendChild(node);
    });

    if (themeName === "Disco" || themeName === "Factory") {
      const grid = document.createElement("div");
      grid.className = "scene-grid";
      this.#container.appendChild(grid);
    }
  }
}
