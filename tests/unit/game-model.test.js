import { describe, it, expect, vi } from "vitest";

import { HIDE_SEEK_SECONDS } from "../../js/core/Config.js";
import { EventBus } from "../../js/core/EventBus.js";
import { GameModel } from "../../js/domain/GameModel.js";

describe("GameModel", () => {
  it("toggles move and dance states", () => {
    const bus = new EventBus();
    const model = new GameModel(bus);

    model.toggleMove();
    expect(model.snapshot.isMoving).toBe(true);

    model.toggleDance();
    expect(model.snapshot.isDancing).toBe(true);

    model.toggleDance();
    expect(model.snapshot.isDancing).toBe(false);
  });

  it("runs hide and seek lifecycle", () => {
    const bus = new EventBus();
    const model = new GameModel(bus);
    const onFound = vi.fn();
    const onEnd = vi.fn();

    bus.on("game:hide-seek:found", onFound);
    bus.on("game:hide-seek:end", onEnd);

    expect(model.startHideSeek()).toBe(true);
    expect(model.snapshot.hideSeek.active).toBe(true);

    expect(model.markHideSeekFound()).toBe(true);
    expect(model.snapshot.hideSeek.active).toBe(false);
    expect(model.snapshot.hideSeek.score).toBe(1);
    expect(onFound).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("emits timeout when countdown reaches zero", () => {
    const bus = new EventBus();
    const model = new GameModel(bus);
    const onTimeout = vi.fn();

    bus.on("game:hide-seek:timeout", onTimeout);

    model.startHideSeek();
    for (let i = 0; i < HIDE_SEEK_SECONDS; i += 1) {
      model.tickHideSeek();
    }

    expect(onTimeout).toHaveBeenCalledTimes(1);
    expect(model.snapshot.hideSeek.active).toBe(false);
    expect(model.snapshot.hideSeek.secondsLeft).toBe(HIDE_SEEK_SECONDS);
  });
});
