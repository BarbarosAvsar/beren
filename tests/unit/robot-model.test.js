import { describe, it, expect, vi } from "vitest";

import { EventBus } from "../../js/core/EventBus.js";
import { PART_CATALOG, SCALE_PRESETS } from "../../js/core/Config.js";
import { RobotModel } from "../../js/domain/RobotModel.js";

class FixedNameService {
  #index = 0;
  next() {
    this.#index += 1;
    return `Name ${this.#index}`;
  }
}

describe("RobotModel", () => {
  it("cycles parts with wraparound", () => {
    const bus = new EventBus();
    const model = new RobotModel(bus, new FixedNameService());

    for (let i = 0; i < PART_CATALOG.heads.length; i += 1) {
      model.cyclePart("head");
    }

    expect(model.snapshot.headIndex).toBe(0);
  });

  it("detects engine body correctly", () => {
    const bus = new EventBus();
    const model = new RobotModel(bus, new FixedNameService());

    let safety = 0;
    while (!model.isEngineBody() && safety < 20) {
      model.cyclePart("body");
      safety += 1;
    }

    expect(model.isEngineBody()).toBe(true);
  });

  it("randomize stays in valid ranges and emits event", () => {
    const bus = new EventBus();
    const model = new RobotModel(bus, new FixedNameService());
    const handler = vi.fn();

    bus.on("robot:changed", handler);
    model.randomize();

    const state = model.snapshot;
    expect(state.headIndex).toBeGreaterThanOrEqual(0);
    expect(state.headIndex).toBeLessThan(PART_CATALOG.heads.length);
    expect(state.bodyIndex).toBeGreaterThanOrEqual(0);
    expect(state.bodyIndex).toBeLessThan(PART_CATALOG.bodies.length);
    expect(state.armsIndex).toBeGreaterThanOrEqual(0);
    expect(state.armsIndex).toBeLessThan(PART_CATALOG.arms.length);
    expect(state.legsIndex).toBeGreaterThanOrEqual(0);
    expect(state.legsIndex).toBeLessThan(PART_CATALOG.legs.length);
    expect(SCALE_PRESETS).toContain(state.scale);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
