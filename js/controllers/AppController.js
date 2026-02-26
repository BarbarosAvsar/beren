import { MOVE_STEP_MS } from "../core/Config.js";
import { GAME_EVENTS, ROBOT_EVENTS, UI_EVENTS } from "../core/events.js";
import { GameFlowCoordinator } from "./coordinators/GameFlowCoordinator.js";
import { RobotSyncCoordinator } from "./coordinators/RobotSyncCoordinator.js";
import { UiSyncCoordinator } from "./coordinators/UiSyncCoordinator.js";

export class AppController {
  #bus;
  #robotModel;
  #gameModel;
  #audioService;
  #exhaustService;
  #stageView;
  #hudView;
  #uiSync;
  #robotSync;
  #gameFlow;
  #listeners = [];
  #latestRobotState = null;
  #latestGameState = null;
  #moveInterval = null;
  #hideSeekInterval = null;

  constructor(dependencies) {
    this.#bus = dependencies.bus;
    this.#robotModel = dependencies.robotModel;
    this.#gameModel = dependencies.gameModel;
    this.#audioService = dependencies.audioService;
    this.#exhaustService = dependencies.exhaustService;
    this.#stageView = dependencies.stageView;
    this.#hudView = dependencies.hudView;

    this.#uiSync = new UiSyncCoordinator({
      controlsView: dependencies.controlsView,
      hudView: dependencies.hudView,
      stageView: dependencies.stageView,
    });

    this.#robotSync = new RobotSyncCoordinator({
      stageView: dependencies.stageView,
      uiSync: this.#uiSync,
      exhaustService: dependencies.exhaustService,
    });

    this.#gameFlow = new GameFlowCoordinator({
      sceneService: dependencies.sceneService,
      stageView: dependencies.stageView,
      hudView: dependencies.hudView,
      controlsView: dependencies.controlsView,
      audioService: dependencies.audioService,
    });
  }

  init() {
    this.#uiSync.initialize();
    this.#wireEvents();

    const gameState = this.#gameModel.snapshot;
    const robotState = this.#robotModel.snapshot;
    this.#latestGameState = gameState;
    this.#latestRobotState = robotState;

    this.#gameFlow.renderInitialScene(gameState);
    this.#uiSync.renderInitial(robotState, gameState);
    this.#robotSync.syncExhaust(robotState, gameState);
  }

  destroy() {
    this.#stopMovementLoop();
    this.#stopHideSeekLoop();
    this.#offAll();
    this.#uiSync.destroy();
    this.#audioService.destroy();
    this.#exhaustService.destroy();
  }

  #wireEvents() {
    this.#on(UI_EVENTS.PART_CYCLE, (event) => {
      this.#audioService.playBoing();
      this.#robotModel.cyclePart(event.detail.part);
    });

    this.#on(UI_EVENTS.NAME_CYCLE, () => {
      this.#audioService.playClick();
      this.#robotModel.nextName();
    });

    this.#on(UI_EVENTS.EMOTION_CYCLE, () => {
      this.#audioService.playClick();
      this.#robotModel.cycleEmotion();
    });

    this.#on(UI_EVENTS.HIDE_SEEK_FOUND, () => {
      this.#gameModel.markHideSeekFound();
    });

    this.#on(UI_EVENTS.ACTION, (event) => {
      this.#handleAction(event.detail.action);
    });

    this.#on(ROBOT_EVENTS.CHANGED, (event) => {
      const state = event.detail.state;
      const changed = Array.isArray(event.detail.changed) ? event.detail.changed : [];
      this.#latestRobotState = state;

      this.#robotSync.handleRobotChanged(state, changed, this.#latestGameState ?? this.#gameModel.snapshot);
    });

    this.#on(GAME_EVENTS.THEME, (event) => {
      const state = event.detail.state;
      this.#latestGameState = state;
      this.#gameFlow.handleThemeChanged(state);
    });

    this.#on(GAME_EVENTS.MOVE, (event) => {
      const state = event.detail.state;
      this.#latestGameState = state;

      this.#gameFlow.handleMoveChanged(state, {
        startMovementLoop: () => this.#startMovementLoop(),
        stopMovementLoop: () => this.#stopMovementLoop(),
        syncMotionState: (nextState) => this.#uiSync.syncMotionState(nextState),
      });

      this.#robotSync.syncExhaust(this.#latestRobotState ?? this.#robotModel.snapshot, state);
    });

    this.#on(GAME_EVENTS.DANCE, (event) => {
      const state = event.detail.state;
      this.#latestGameState = state;

      this.#gameFlow.handleDanceChanged(state, {
        syncMotionState: (nextState) => this.#uiSync.syncMotionState(nextState),
      });

      this.#robotSync.syncExhaust(this.#latestRobotState ?? this.#robotModel.snapshot, state);
    });

    this.#on(GAME_EVENTS.HIDE_SEEK_START, (event) => {
      const state = event.detail.state;
      this.#latestGameState = state;

      this.#gameFlow.handleHideSeekStart(state, {
        startHideSeekLoop: () => this.#startHideSeekLoop(),
      });
    });

    this.#on(GAME_EVENTS.HIDE_SEEK_TICK, (event) => {
      const state = event.detail.state;
      this.#latestGameState = state;
      this.#gameFlow.handleHideSeekTick(state);
    });

    this.#on(GAME_EVENTS.HIDE_SEEK_FOUND, (event) => {
      const state = event.detail.state;
      this.#latestGameState = state;
      this.#gameFlow.handleHideSeekFound(state);
    });

    this.#on(GAME_EVENTS.HIDE_SEEK_TIMEOUT, (event) => {
      this.#latestGameState = event.detail.state;
      this.#gameFlow.handleHideSeekTimeout();
    });

    this.#on(GAME_EVENTS.HIDE_SEEK_END, (event) => {
      const state = event.detail.state;
      this.#latestGameState = state;

      this.#gameFlow.handleHideSeekEnd(state, event.detail.reason, {
        stopHideSeekLoop: () => this.#stopHideSeekLoop(),
      });
    });
  }

  #handleAction(action) {
    switch (action) {
      case "nextTheme":
        this.#audioService.playSuccess();
        this.#gameModel.nextTheme();
        this.#audioService.speak(this.#latestGameState?.theme ?? this.#gameModel.snapshot.theme);
        break;
      case "nextPalette":
        this.#audioService.playSuccess();
        this.#robotModel.nextPalette();
        this.#hudView.showToast("Color palette changed", 1200);
        break;
      case "nextSize":
        this.#audioService.playBoing();
        this.#robotModel.setScalePreset();
        this.#hudView.showToast("Size changed", 1100);
        break;
      case "randomize":
        this.#audioService.playSuccess();
        this.#robotModel.randomize();
        this.#stageView.resetPosition();
        this.#hudView.showToast("Mixed all parts");
        this.#audioService.speak("Super mix.");
        break;
      case "toggleMove":
        this.#audioService.playClick();
        this.#gameModel.toggleMove();
        break;
      case "toggleDance":
        this.#audioService.playClick();
        this.#gameModel.toggleDance();
        break;
      case "toggleHideSeek":
        if ((this.#latestGameState ?? this.#gameModel.snapshot).hideSeek.active) {
          this.#gameModel.cancelHideSeek();
        } else {
          this.#gameModel.startHideSeek();
        }
        break;
      default:
        break;
    }
  }

  #startMovementLoop() {
    this.#stopMovementLoop();
    this.#stageView.stepMovement();
    this.#moveInterval = setInterval(() => {
      this.#stageView.stepMovement();
    }, MOVE_STEP_MS);
  }

  #stopMovementLoop() {
    if (this.#moveInterval !== null) {
      clearInterval(this.#moveInterval);
      this.#moveInterval = null;
    }
  }

  #startHideSeekLoop() {
    this.#stopHideSeekLoop();
    this.#hideSeekInterval = setInterval(() => {
      this.#gameModel.tickHideSeek();
    }, 1000);
  }

  #stopHideSeekLoop() {
    if (this.#hideSeekInterval !== null) {
      clearInterval(this.#hideSeekInterval);
      this.#hideSeekInterval = null;
    }
  }

  #on(type, handler) {
    this.#bus.on(type, handler);
    this.#listeners.push({ type, handler });
  }

  #offAll() {
    this.#listeners.forEach(({ type, handler }) => {
      this.#bus.off(type, handler);
    });
    this.#listeners = [];
  }
}
