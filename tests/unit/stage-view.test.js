import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EventBus } from "../../js/core/EventBus.js";
import { HIDE_HINT_DURATION_MS, HIDE_HINT_INTERVAL_MS } from "../../js/core/Config.js";
import { StageView } from "../../js/ui/StageView.js";

function createFixture() {
  const region = document.createElement("div");
  const mover = document.createElement("div");
  const dancer = document.createElement("div");
  const assembly = document.createElement("div");
  const head = document.createElement("button");
  const body = document.createElement("button");
  const armLeft = document.createElement("button");
  const armRight = document.createElement("button");
  const legs = document.createElement("button");

  head.dataset.part = "head";
  body.dataset.part = "body";
  armLeft.dataset.part = "arms";
  armRight.dataset.part = "arms";
  legs.dataset.part = "legs";

  head.id = "part-head";
  body.id = "part-body";
  armLeft.id = "part-arm-left";
  armRight.id = "part-arm-right";
  legs.id = "part-legs";

  region.appendChild(mover);
  mover.appendChild(dancer);
  dancer.appendChild(assembly);
  assembly.append(head, armLeft, body, armRight, legs);
  document.body.appendChild(region);

  Object.defineProperty(region, "clientWidth", { value: 960, configurable: true });
  Object.defineProperty(region, "clientHeight", { value: 560, configurable: true });

  return {
    region,
    mover,
    dancer,
    assembly,
    head,
    body,
    armLeft,
    armRight,
    legs,
  };
}

describe("StageView", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("steps movement with immediate transform update", () => {
    const bus = new EventBus();
    const fixture = createFixture();
    const stage = new StageView(bus, fixture);

    const random = vi.spyOn(Math, "random");
    random.mockReturnValueOnce(0.9);
    random.mockReturnValueOnce(0.8);

    stage.stepMovement();

    expect(fixture.mover.style.transform).toContain("translate(");
    expect(fixture.mover.style.transform).not.toContain("translate(0px, 0px)");
  });

  it("applies hide context and hint lifecycle", () => {
    const bus = new EventBus();
    const fixture = createFixture();
    const stage = new StageView(bus, fixture);

    const occluder = document.createElement("div");
    occluder.id = "scene-occluder-demo-1";
    document.body.appendChild(occluder);

    stage.beginHideSeek({
      hideSpots: [{ x: 100, y: 40, occluderId: "scene-occluder-demo-1", peek: "left" }],
    });

    expect(fixture.assembly.classList.contains("robot-hidden")).toBe(true);
    expect(fixture.assembly.classList.contains("robot-peek-left")).toBe(true);
    expect(occluder.classList.contains("is-occluding")).toBe(true);

    vi.advanceTimersByTime(HIDE_HINT_INTERVAL_MS + 1);
    expect(fixture.assembly.classList.contains("robot-hint")).toBe(true);

    vi.advanceTimersByTime(HIDE_HINT_DURATION_MS + 5);
    expect(fixture.assembly.classList.contains("robot-hint")).toBe(false);

    stage.endHideSeek();
    expect(fixture.assembly.classList.contains("robot-hidden")).toBe(false);
    expect(occluder.classList.contains("is-occluding")).toBe(false);
  });

  it("switches motion classes for move and dance", () => {
    const bus = new EventBus();
    const fixture = createFixture();
    const stage = new StageView(bus, fixture);

    stage.setMotionState({ isMoving: true, danceClass: null });
    expect(fixture.dancer.classList.contains("is-moving")).toBe(true);
    expect(fixture.dancer.classList.contains("is-dancing")).toBe(false);

    stage.setMotionState({ isMoving: true, danceClass: "dance-bounce" });
    expect(fixture.dancer.classList.contains("is-dancing")).toBe(true);
    expect(fixture.dancer.classList.contains("dance-bounce")).toBe(true);

    stage.setMotionState({ isMoving: false, danceClass: null });
    expect(fixture.dancer.classList.contains("is-idle")).toBe(true);
  });
});
