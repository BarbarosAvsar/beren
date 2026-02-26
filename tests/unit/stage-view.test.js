import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HIDE_HINT_DURATION_MS, HIDE_HINT_INTERVAL_MS } from "../../js/core/Config.js";
import { ALL_EVENT_TYPES, UI_EVENTS } from "../../js/core/events.js";
import { EventBus } from "../../js/core/EventBus.js";
import { StageView } from "../../js/ui/StageView.js";

function createRobotState(overrides = {}) {
  const base = {
    head: { key: "cube" },
    body: { key: "chest" },
    arms: { key: "claw" },
    legs: { key: "walker" },
    palette: {
      head: "#64748b",
      body: "#4b5563",
      arms: "#6b7280",
      legs: "#475569",
    },
    bodyHasEngine: false,
    scale: 1,
    name: "Play Bot",
    emotion: ":)",
  };

  return {
    ...base,
    ...overrides,
    head: { ...base.head, ...(overrides.head ?? {}) },
    body: { ...base.body, ...(overrides.body ?? {}) },
    arms: { ...base.arms, ...(overrides.arms ?? {}) },
    legs: { ...base.legs, ...(overrides.legs ?? {}) },
    palette: { ...base.palette, ...(overrides.palette ?? {}) },
  };
}

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
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
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
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
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
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
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

  it("renders both arms without mirror class", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const fixture = createFixture();
    const stage = new StageView(bus, fixture);

    stage.render(createRobotState());

    const leftArmPiece = fixture.armLeft.querySelector(".robot-piece");
    const rightArmPiece = fixture.armRight.querySelector(".robot-piece");

    expect(leftArmPiece.classList.contains("robot-arm-mirror")).toBe(false);
    expect(rightArmPiece.classList.contains("robot-arm-mirror")).toBe(false);
  });

  it("samples a fresh hide spot each round using injected RNG", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const fixture = createFixture();
    const randomIndex = vi.fn()
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2);
    const stage = new StageView(bus, fixture, { randomIndex });

    const hideSpots = [
      { x: 10, y: 0, peek: "left", occluderId: null },
      { x: 20, y: 0, peek: "up", occluderId: null },
      { x: 30, y: 0, peek: "right", occluderId: null },
    ];

    stage.beginHideSeek({ hideSpots });
    expect(fixture.mover.style.transform).toContain("translate(20px, 0px)");
    stage.endHideSeek();

    stage.beginHideSeek({ hideSpots });
    expect(fixture.mover.style.transform).toContain("translate(20px, 0px)");
    stage.endHideSeek();

    stage.beginHideSeek({ hideSpots });
    expect(fixture.mover.style.transform).toContain("translate(30px, 0px)");
    stage.endHideSeek();

    expect(randomIndex).toHaveBeenCalledTimes(3);
    expect(randomIndex).toHaveBeenNthCalledWith(1, 3);
    expect(randomIndex).toHaveBeenNthCalledWith(2, 3);
    expect(randomIndex).toHaveBeenNthCalledWith(3, 3);
  });

  it("does not recreate robot parts when only name changes", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const fixture = createFixture();
    const stage = new StageView(bus, fixture);

    stage.render(createRobotState());
    const refsBefore = {
      head: fixture.head.querySelector(".robot-piece"),
      body: fixture.body.querySelector(".robot-piece"),
      armLeft: fixture.armLeft.querySelector(".robot-piece"),
      armRight: fixture.armRight.querySelector(".robot-piece"),
      legs: fixture.legs.querySelector(".robot-piece"),
    };

    stage.applyRobotChanges(createRobotState({ name: "New Name" }), ["name"]);

    expect(fixture.head.querySelector(".robot-piece")).toBe(refsBefore.head);
    expect(fixture.body.querySelector(".robot-piece")).toBe(refsBefore.body);
    expect(fixture.armLeft.querySelector(".robot-piece")).toBe(refsBefore.armLeft);
    expect(fixture.armRight.querySelector(".robot-piece")).toBe(refsBefore.armRight);
    expect(fixture.legs.querySelector(".robot-piece")).toBe(refsBefore.legs);
  });

  it("recreates only changed part node for head updates", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const fixture = createFixture();
    const stage = new StageView(bus, fixture);

    stage.render(createRobotState());
    const refsBefore = {
      head: fixture.head.querySelector(".robot-piece"),
      body: fixture.body.querySelector(".robot-piece"),
      armLeft: fixture.armLeft.querySelector(".robot-piece"),
      armRight: fixture.armRight.querySelector(".robot-piece"),
      legs: fixture.legs.querySelector(".robot-piece"),
    };

    stage.applyRobotChanges(createRobotState({ head: { key: "bubble" } }), ["head"]);

    expect(fixture.head.querySelector(".robot-piece")).not.toBe(refsBefore.head);
    expect(fixture.body.querySelector(".robot-piece")).toBe(refsBefore.body);
    expect(fixture.armLeft.querySelector(".robot-piece")).toBe(refsBefore.armLeft);
    expect(fixture.armRight.querySelector(".robot-piece")).toBe(refsBefore.armRight);
    expect(fixture.legs.querySelector(".robot-piece")).toBe(refsBefore.legs);
  });

  it("updates palette colors without recreating part nodes", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const fixture = createFixture();
    const stage = new StageView(bus, fixture);

    stage.render(createRobotState());
    const refsBefore = {
      head: fixture.head.querySelector(".robot-piece"),
      body: fixture.body.querySelector(".robot-piece"),
      armLeft: fixture.armLeft.querySelector(".robot-piece"),
      armRight: fixture.armRight.querySelector(".robot-piece"),
      legs: fixture.legs.querySelector(".robot-piece"),
    };

    stage.applyRobotChanges(
      createRobotState({
        palette: {
          head: "#0ea5e9",
          body: "#f43f5e",
          arms: "#84cc16",
          legs: "#7c3aed",
        },
      }),
      ["palette"],
    );

    const refsAfter = {
      head: fixture.head.querySelector(".robot-piece"),
      body: fixture.body.querySelector(".robot-piece"),
      armLeft: fixture.armLeft.querySelector(".robot-piece"),
      armRight: fixture.armRight.querySelector(".robot-piece"),
      legs: fixture.legs.querySelector(".robot-piece"),
    };

    expect(refsAfter.head).toBe(refsBefore.head);
    expect(refsAfter.body).toBe(refsBefore.body);
    expect(refsAfter.armLeft).toBe(refsBefore.armLeft);
    expect(refsAfter.armRight).toBe(refsBefore.armRight);
    expect(refsAfter.legs).toBe(refsBefore.legs);
    expect(refsAfter.head.style.getPropertyValue("--piece-color")).toBe("#0ea5e9");
    expect(refsAfter.body.style.getPropertyValue("--piece-color")).toBe("#f43f5e");
    expect(refsAfter.armLeft.style.getPropertyValue("--piece-color")).toBe("#84cc16");
    expect(refsAfter.armRight.style.getPropertyValue("--piece-color")).toBe("#84cc16");
    expect(refsAfter.legs.style.getPropertyValue("--piece-color")).toBe("#7c3aed");
  });

  it("mounts and unmounts part listeners without duplication", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const fixture = createFixture();
    const stage = new StageView(bus, fixture);
    const onPartCycle = vi.fn();

    bus.on(UI_EVENTS.PART_CYCLE, onPartCycle);

    stage.init();
    fixture.head.click();
    expect(onPartCycle).toHaveBeenCalledTimes(1);

    stage.unmount();
    fixture.head.click();
    expect(onPartCycle).toHaveBeenCalledTimes(1);

    stage.mount();
    stage.mount();
    fixture.head.click();
    expect(onPartCycle).toHaveBeenCalledTimes(2);
  });
});
