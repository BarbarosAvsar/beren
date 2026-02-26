import { SCENE_THEMES } from "./scene/themes.js";

const FALLBACK_THEME = "Factory";

export class SceneService {
  #background;
  #foreground;

  constructor(backgroundContainer, foregroundContainer) {
    this.#background = backgroundContainer;
    this.#foreground = foregroundContainer;
  }

  render(themeName) {
    const selectedThemeName = SCENE_THEMES[themeName] ? themeName : FALLBACK_THEME;
    const theme = SCENE_THEMES[selectedThemeName];
    const key = selectedThemeName.toLowerCase();

    this.#setThemeClasses(key);
    this.#clearLayers();

    this.#renderAccents(theme.accents);
    const occluderIds = this.#renderOccluders(theme.occluders, key);
    const hideSpots = this.#mapHideSpots(theme.hideSpots, key);

    return {
      hideSpots,
      occluderIds,
    };
  }

  #setThemeClasses(key) {
    this.#background.className = `scene-layer scene-background scene-theme-${key}`;
    this.#foreground.className = `scene-layer scene-foreground scene-theme-${key}`;
  }

  #clearLayers() {
    this.#background.innerHTML = "";
    this.#foreground.innerHTML = "";
  }

  #renderAccents(accents) {
    accents.forEach((accent) => {
      const node = document.createElement("div");
      node.className = `scene-accent ${accent.shape}`;
      node.style.left = `${accent.x}%`;
      node.style.top = `${accent.y}%`;
      node.style.width = `${accent.w}px`;
      node.style.height = `${accent.h}px`;
      node.style.background = accent.color;
      node.style.transform = "translate(-50%, -50%)";
      this.#background.appendChild(node);
    });
  }

  #renderOccluders(occluders, key) {
    const occluderIds = [];

    occluders.forEach((occluder) => {
      const node = document.createElement("div");
      node.className = `scene-occluder scene-occluder-${occluder.type}`;
      node.style.left = `${occluder.x}%`;
      node.style.top = `${occluder.y}%`;
      node.style.width = `${occluder.w}px`;
      node.style.height = `${occluder.h}px`;
      node.style.transform = "translate(-50%, -50%)";

      const occluderNodeId = `scene-occluder-${key}-${occluder.id}`;
      node.id = occluderNodeId;
      occluderIds.push(occluderNodeId);
      this.#foreground.appendChild(node);
    });

    return occluderIds;
  }

  #mapHideSpots(hideSpots, key) {
    return hideSpots.map((spot) => ({
      x: spot.x,
      y: spot.y,
      peek: spot.peek,
      occluderId: `scene-occluder-${key}-${spot.occluderId}`,
    }));
  }
}
