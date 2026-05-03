import { describe, it, expect, vi } from "vitest";

import { CHARACTER_MODES, PALETTES, PART_CATALOGS_BY_MODE, SCALE_PRESETS } from "../../js/core/Config.js";
import { ALL_EVENT_TYPES, ROBOT_EVENTS } from "../../js/core/events.js";
import { EventBus } from "../../js/core/EventBus.js";
import { RobotModel } from "../../js/domain/RobotModel.js";

class FixedNameService {
  #index = 0;

  next() {
    this.#index += 1;
    return `Name ${this.#index}`;
  }
}

describe("RobotModel", () => {
  it("uses large part catalogs for every character mode", () => {
    CHARACTER_MODES.forEach((mode) => {
      const catalog = PART_CATALOGS_BY_MODE[mode];
      expect(catalog.heads.length).toBeGreaterThanOrEqual(18);
      expect(catalog.bodies.length).toBeGreaterThanOrEqual(18);
      expect(catalog.arms.length).toBeGreaterThanOrEqual(18);
      expect(catalog.legs.length).toBeGreaterThanOrEqual(18);
    });
    expect(PALETTES.length).toBeGreaterThanOrEqual(16);
  });

  it("cycles parts with wraparound", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const model = new RobotModel(bus, new FixedNameService());
    const activeCatalog = PART_CATALOGS_BY_MODE[model.snapshot.characterMode];

    for (let i = 0; i < activeCatalog.heads.length; i += 1) {
      model.cyclePart("head");
    }

    expect(model.snapshot.headIndex).toBe(0);
  });

  it("detects engine body correctly", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const model = new RobotModel(bus, new FixedNameService());
    const activeCatalog = PART_CATALOGS_BY_MODE[model.snapshot.characterMode];

    let safety = 0;
    while (!model.isEngineBody() && safety < activeCatalog.bodies.length + 2) {
      model.cyclePart("body");
      safety += 1;
    }

    expect(model.isEngineBody()).toBe(true);
  });

  it("remembers each mode part indexes when switching mode", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const model = new RobotModel(bus, new FixedNameService());

    model.cyclePart("head");
    expect(model.snapshot.characterMode).toBe("robot");
    expect(model.snapshot.headIndex).toBe(1);

    model.nextCharacterMode();
    expect(model.snapshot.characterMode).toBe("astronaut");
    expect(model.snapshot.headIndex).toBe(0);

    model.cyclePart("head");
    model.cyclePart("head");
    expect(model.snapshot.headIndex).toBe(2);

    model.nextCharacterMode();
    expect(model.snapshot.characterMode).toBe("dragon");
    expect(model.snapshot.headIndex).toBe(0);

    model.nextCharacterMode();
    expect(model.snapshot.characterMode).toBe("robot");
    expect(model.snapshot.headIndex).toBe(1);

    model.nextCharacterMode();
    expect(model.snapshot.characterMode).toBe("astronaut");
    expect(model.snapshot.headIndex).toBe(2);
  });

  it("randomize stays in valid ranges and emits event", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const model = new RobotModel(bus, new FixedNameService());
    const handler = vi.fn();
    const robotHeadBefore = model.snapshot.headIndex;

    bus.on(ROBOT_EVENTS.CHANGED, handler);
    model.nextCharacterMode();
    model.randomize();

    const state = model.snapshot;
    const activeCatalog = PART_CATALOGS_BY_MODE[state.characterMode];
    expect(state.headIndex).toBeGreaterThanOrEqual(0);
    expect(state.headIndex).toBeLessThan(activeCatalog.heads.length);
    expect(state.bodyIndex).toBeGreaterThanOrEqual(0);
    expect(state.bodyIndex).toBeLessThan(activeCatalog.bodies.length);
    expect(state.armsIndex).toBeGreaterThanOrEqual(0);
    expect(state.armsIndex).toBeLessThan(activeCatalog.arms.length);
    expect(state.legsIndex).toBeGreaterThanOrEqual(0);
    expect(state.legsIndex).toBeLessThan(activeCatalog.legs.length);
    expect(SCALE_PRESETS).toContain(state.scale);
    expect(handler).toHaveBeenCalledTimes(2);

    model.nextCharacterMode();
    model.nextCharacterMode();
    expect(model.snapshot.characterMode).toBe("robot");
    expect(model.snapshot.headIndex).toBe(robotHeadBefore);
  });
});
