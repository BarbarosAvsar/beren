import { CHARACTER_MODES, EMOTIONS, PALETTES, PART_CATALOGS_BY_MODE, SCALE_PRESETS } from "../core/Config.js";
import { ROBOT_EVENTS } from "../core/events.js";

const PART_KEYS = Object.freeze(["head", "body", "arms", "legs"]);
const PART_COLLECTION_BY_KEY = Object.freeze({
  head: "heads",
  body: "bodies",
  arms: "arms",
  legs: "legs",
});

function createPartIndexes() {
  return {
    head: 0,
    body: 0,
    arms: 0,
    legs: 0,
  };
}

function createModeIndexes() {
  const indexes = {};
  CHARACTER_MODES.forEach((mode) => {
    indexes[mode] = createPartIndexes();
  });
  return indexes;
}

export class RobotModel {
  #bus;
  #nameService;
  #modeIndex = 0;
  #modePartIndexes = createModeIndexes();
  #emotionIndex = 0;
  #paletteIndex = 0;
  #scaleIndex = 2;
  #name;

  constructor(bus, nameService) {
    this.#bus = bus;
    this.#nameService = nameService;
    this.#name = this.#nameService.next();
  }

  get snapshot() {
    const characterMode = this.#activeMode;
    const catalog = this.#activeCatalog;
    const indexes = this.#activeModePartIndexes;

    return {
      characterMode,
      headIndex: indexes.head,
      bodyIndex: indexes.body,
      armsIndex: indexes.arms,
      legsIndex: indexes.legs,
      emotionIndex: this.#emotionIndex,
      paletteIndex: this.#paletteIndex,
      scale: SCALE_PRESETS[this.#scaleIndex],
      name: this.#name,
      emotion: EMOTIONS[this.#emotionIndex],
      palette: PALETTES[this.#paletteIndex],
      bodyHasEngine: this.isEngineBody(),
      body: catalog.bodies[indexes.body],
      head: catalog.heads[indexes.head],
      arms: catalog.arms[indexes.arms],
      legs: catalog.legs[indexes.legs],
    };
  }

  cyclePart(part) {
    if (!PART_KEYS.includes(part)) {
      return;
    }

    const partIndexes = this.#activeModePartIndexes;
    const catalog = this.#activeCatalog;
    partIndexes[part] = (partIndexes[part] + 1) % catalog[PART_COLLECTION_BY_KEY[part]].length;
    this.#emit([part]);
  }

  cycleEmotion() {
    this.#emotionIndex = (this.#emotionIndex + 1) % EMOTIONS.length;
    this.#emit(["emotion"]);
  }

  nextName() {
    this.#name = this.#nameService.next();
    this.#emit(["name"]);
  }

  randomize() {
    const partIndexes = this.#activeModePartIndexes;
    const catalog = this.#activeCatalog;

    partIndexes.head = Math.floor(Math.random() * catalog.heads.length);
    partIndexes.body = Math.floor(Math.random() * catalog.bodies.length);
    partIndexes.arms = Math.floor(Math.random() * catalog.arms.length);
    partIndexes.legs = Math.floor(Math.random() * catalog.legs.length);
    this.#emotionIndex = Math.floor(Math.random() * EMOTIONS.length);
    this.#paletteIndex = Math.floor(Math.random() * PALETTES.length);
    this.#scaleIndex = Math.floor(Math.random() * SCALE_PRESETS.length);
    this.#name = this.#nameService.next();
    this.#emit(["head", "body", "arms", "legs", "emotion", "palette", "scale", "name"]);
  }

  nextCharacterMode() {
    this.#modeIndex = (this.#modeIndex + 1) % CHARACTER_MODES.length;
    this.#emit(["characterMode", "head", "body", "arms", "legs"]);
  }

  nextPalette() {
    this.#paletteIndex = (this.#paletteIndex + 1) % PALETTES.length;
    this.#emit(["palette"]);
  }

  setScalePreset() {
    this.#scaleIndex = (this.#scaleIndex + 1) % SCALE_PRESETS.length;
    this.#emit(["scale"]);
  }

  isEngineBody() {
    const catalog = this.#activeCatalog;
    return Boolean(catalog.bodies[this.#activeModePartIndexes.body].engine);
  }

  #emit(changed) {
    this.#bus.emit(ROBOT_EVENTS.CHANGED, {
      changed,
      state: this.snapshot,
    });
  }

  get #activeMode() {
    return CHARACTER_MODES[this.#modeIndex];
  }

  get #activeCatalog() {
    return PART_CATALOGS_BY_MODE[this.#activeMode];
  }

  get #activeModePartIndexes() {
    return this.#modePartIndexes[this.#activeMode];
  }
}
