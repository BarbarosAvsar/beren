import { EMOTIONS, PALETTES, PART_CATALOG, SCALE_PRESETS } from "../core/Config.js";

export class RobotModel {
  #bus;
  #nameService;
  #headIndex = 0;
  #bodyIndex = 0;
  #armsIndex = 0;
  #legsIndex = 0;
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
    return {
      headIndex: this.#headIndex,
      bodyIndex: this.#bodyIndex,
      armsIndex: this.#armsIndex,
      legsIndex: this.#legsIndex,
      emotionIndex: this.#emotionIndex,
      paletteIndex: this.#paletteIndex,
      scale: SCALE_PRESETS[this.#scaleIndex],
      name: this.#name,
      emotion: EMOTIONS[this.#emotionIndex],
      palette: PALETTES[this.#paletteIndex],
      bodyHasEngine: this.isEngineBody(),
      body: PART_CATALOG.bodies[this.#bodyIndex],
      head: PART_CATALOG.heads[this.#headIndex],
      arms: PART_CATALOG.arms[this.#armsIndex],
      legs: PART_CATALOG.legs[this.#legsIndex],
    };
  }

  cyclePart(part) {
    switch (part) {
      case "head":
        this.#headIndex = (this.#headIndex + 1) % PART_CATALOG.heads.length;
        this.#emit(["head"]);
        break;
      case "body":
        this.#bodyIndex = (this.#bodyIndex + 1) % PART_CATALOG.bodies.length;
        this.#emit(["body"]);
        break;
      case "arms":
        this.#armsIndex = (this.#armsIndex + 1) % PART_CATALOG.arms.length;
        this.#emit(["arms"]);
        break;
      case "legs":
        this.#legsIndex = (this.#legsIndex + 1) % PART_CATALOG.legs.length;
        this.#emit(["legs"]);
        break;
      default:
        break;
    }
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
    this.#headIndex = Math.floor(Math.random() * PART_CATALOG.heads.length);
    this.#bodyIndex = Math.floor(Math.random() * PART_CATALOG.bodies.length);
    this.#armsIndex = Math.floor(Math.random() * PART_CATALOG.arms.length);
    this.#legsIndex = Math.floor(Math.random() * PART_CATALOG.legs.length);
    this.#emotionIndex = Math.floor(Math.random() * EMOTIONS.length);
    this.#paletteIndex = Math.floor(Math.random() * PALETTES.length);
    this.#scaleIndex = Math.floor(Math.random() * SCALE_PRESETS.length);
    this.#name = this.#nameService.next();
    this.#emit(["head", "body", "arms", "legs", "emotion", "palette", "scale", "name"]);
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
    return Boolean(PART_CATALOG.bodies[this.#bodyIndex].engine);
  }

  #emit(changed) {
    this.#bus.emit("robot:changed", {
      changed,
      state: this.snapshot,
    });
  }
}
