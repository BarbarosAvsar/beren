import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppController } from "../../js/controllers/AppController.js";
import { ALL_EVENT_TYPES, ROBOT_EVENTS, UI_EVENTS } from "../../js/core/events.js";
import { EventBus } from "../../js/core/EventBus.js";
import { GameModel } from "../../js/domain/GameModel.js";
import { RobotModel } from "../../js/domain/RobotModel.js";

class FixedNameService {
  next() {
    return "Play Bot";
  }
}

describe("AppController", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function createController() {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const robotModel = new RobotModel(bus, new FixedNameService());
    const gameModel = new GameModel(bus);

    const hideContext = {
      hideSpots: [{ x: 90, y: 55, occluderId: "scene-occluder-test", peek: "right" }],
      occluderIds: ["scene-occluder-test"],
    };

    const sceneService = {
      render: vi.fn(() => hideContext),
    };

    const stageView = {
      init: vi.fn(),
      mount: vi.fn(),
      unmount: vi.fn(),
      render: vi.fn(),
      applyRobotChanges: vi.fn(),
      setMotionState: vi.fn(),
      setDance: vi.fn(),
      stepMovement: vi.fn(),
      beginHideSeek: vi.fn(),
      endHideSeek: vi.fn(),
      resetPosition: vi.fn(),
      destroy: vi.fn(),
    };

    const controlsView = {
      init: vi.fn(),
      mount: vi.fn(),
      unmount: vi.fn(),
      destroy: vi.fn(),
      setMoveActive: vi.fn(),
      setDanceActive: vi.fn(),
      setHideSeekActive: vi.fn(),
    };

    const hudView = {
      init: vi.fn(),
      mount: vi.fn(),
      unmount: vi.fn(),
      destroy: vi.fn(),
      renderName: vi.fn(),
      renderEmotion: vi.fn(),
      renderHideSeek: vi.fn(),
      announce: vi.fn(),
      showToast: vi.fn(),
    };

    const exhaustService = {
      setEnabled: vi.fn(),
      setMode: vi.fn(),
      destroy: vi.fn(),
    };

    const audioService = {
      playBoing: vi.fn(),
      playClick: vi.fn(),
      playSuccess: vi.fn(),
      playScratch: vi.fn(),
      startMusic: vi.fn(),
      stopMusic: vi.fn(),
      speak: vi.fn(),
      destroy: vi.fn(),
    };

    const controller = new AppController({
      bus,
      robotModel,
      gameModel,
      sceneService,
      exhaustService,
      audioService,
      controlsView,
      hudView,
      stageView,
    });

    controller.init();

    return {
      bus,
      controller,
      robotModel,
      gameModel,
      stageView,
      controlsView,
      hudView,
      hideContext,
    };
  }

  it("triggers immediate movement when move is toggled", () => {
    const { bus, controller, stageView, controlsView } = createController();

    const beforeCount = stageView.stepMovement.mock.calls.length;
    bus.emit(UI_EVENTS.ACTION, { action: "toggleMove" });

    expect(stageView.stepMovement.mock.calls.length).toBeGreaterThan(beforeCount);
    expect(controlsView.setMoveActive).toHaveBeenCalledWith(true);

    controller.destroy();
  });

  it("cycles character mode through the new type control action", () => {
    const { bus, controller, hudView, robotModel } = createController();

    expect(robotModel.snapshot.characterMode).toBe("robot");
    bus.emit(UI_EVENTS.ACTION, { action: "nextCharacterMode" });

    expect(robotModel.snapshot.characterMode).toBe("astronaut");
    expect(hudView.showToast).toHaveBeenCalledWith("Type: Astronaut");

    controller.destroy();
  });

  it("passes scene hide context into stage hide-seek", () => {
    const { bus, controller, stageView, hideContext } = createController();

    bus.emit(UI_EVENTS.ACTION, { action: "toggleHideSeek" });

    expect(stageView.beginHideSeek).toHaveBeenCalledWith(hideContext);

    controller.destroy();
  });

  it("does not trigger visual stage update for robot name-only change", () => {
    const { bus, controller, stageView, hudView, robotModel } = createController();

    stageView.applyRobotChanges.mockClear();
    hudView.renderName.mockClear();

    const state = { ...robotModel.snapshot, name: "New Name" };
    bus.emit(ROBOT_EVENTS.CHANGED, { state, changed: ["name"] });

    expect(stageView.applyRobotChanges).not.toHaveBeenCalled();
    expect(hudView.renderName).toHaveBeenCalledWith("New Name");

    controller.destroy();
  });

  it("uses incremental stage update for visual robot changes", () => {
    const { bus, controller, stageView, robotModel } = createController();

    stageView.applyRobotChanges.mockClear();
    const state = robotModel.snapshot;
    bus.emit(ROBOT_EVENTS.CHANGED, { state, changed: ["body"] });

    expect(stageView.applyRobotChanges).toHaveBeenCalledTimes(1);
    expect(stageView.applyRobotChanges).toHaveBeenCalledWith(state, ["body"]);

    controller.destroy();
  });

  it("syncs using event state without re-reading model snapshots on robot events", () => {
    const { bus, controller, robotModel, gameModel } = createController();

    const robotSnapshotGetter = vi.spyOn(robotModel, "snapshot", "get");
    const gameSnapshotGetter = vi.spyOn(gameModel, "snapshot", "get");
    robotSnapshotGetter.mockClear();
    gameSnapshotGetter.mockClear();

    const state = { ...robotModel.snapshot, name: "Snapshot Safe" };
    robotSnapshotGetter.mockClear();
    gameSnapshotGetter.mockClear();

    bus.emit(ROBOT_EVENTS.CHANGED, { state, changed: ["name"] });

    expect(robotSnapshotGetter).not.toHaveBeenCalled();
    expect(gameSnapshotGetter).not.toHaveBeenCalled();

    controller.destroy();
  });
});
