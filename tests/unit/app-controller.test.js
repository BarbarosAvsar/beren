import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppController } from "../../js/controllers/AppController.js";
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
    const bus = new EventBus();
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
      render: vi.fn(),
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
      setMoveActive: vi.fn(),
      setDanceActive: vi.fn(),
      setHideSeekActive: vi.fn(),
    };

    const hudView = {
      init: vi.fn(),
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
      stageView,
      controlsView,
      hideContext,
    };
  }

  it("triggers immediate movement when move is toggled", () => {
    const { bus, controller, stageView, controlsView } = createController();

    const beforeCount = stageView.stepMovement.mock.calls.length;
    bus.emit("ui:action", { action: "toggleMove" });

    expect(stageView.stepMovement.mock.calls.length).toBeGreaterThan(beforeCount);
    expect(controlsView.setMoveActive).toHaveBeenCalledWith(true);

    controller.destroy();
  });

  it("passes scene hide context into stage hide-seek", () => {
    const { bus, controller, stageView, hideContext } = createController();

    bus.emit("ui:action", { action: "toggleHideSeek" });

    expect(stageView.beginHideSeek).toHaveBeenCalledWith(hideContext);

    controller.destroy();
  });
});
