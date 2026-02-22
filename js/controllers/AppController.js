export class AppController {
  #bus;
  #robotModel;
  #gameModel;
  #sceneService;
  #exhaustService;
  #audioService;
  #controlsView;
  #hudView;
  #stageView;
  #moveInterval = null;
  #hideSeekInterval = null;

  constructor(dependencies) {
    this.#bus = dependencies.bus;
    this.#robotModel = dependencies.robotModel;
    this.#gameModel = dependencies.gameModel;
    this.#sceneService = dependencies.sceneService;
    this.#exhaustService = dependencies.exhaustService;
    this.#audioService = dependencies.audioService;
    this.#controlsView = dependencies.controlsView;
    this.#hudView = dependencies.hudView;
    this.#stageView = dependencies.stageView;
  }

  init() {
    this.#controlsView.init();
    this.#hudView.init();
    this.#stageView.init();
    this.#wireEvents();

    this.#sceneService.render(this.#gameModel.snapshot.theme);
    this.#stageView.render(this.#robotModel.snapshot);
    this.#hudView.renderName(this.#robotModel.snapshot.name);
    this.#hudView.renderEmotion(this.#robotModel.snapshot.emotion);
    this.#hudView.renderHideSeek(false, 30, this.#gameModel.snapshot.hideSeek.score);
    this.#syncControls();
    this.#syncExhaust();
  }

  destroy() {
    this.#stopMovementLoop();
    this.#stopHideSeekLoop();
    this.#stageView.destroy();
    this.#audioService.destroy();
    this.#exhaustService.destroy();
  }

  #wireEvents() {
    this.#bus.on("ui:part-cycle", (event) => {
      this.#audioService.playBoing();
      this.#robotModel.cyclePart(event.detail.part);
    });

    this.#bus.on("ui:name-cycle", () => {
      this.#audioService.playClick();
      this.#robotModel.nextName();
    });

    this.#bus.on("ui:emotion-cycle", () => {
      this.#audioService.playClick();
      this.#robotModel.cycleEmotion();
    });

    this.#bus.on("ui:hide-seek-found", () => {
      this.#gameModel.markHideSeekFound();
    });

    this.#bus.on("ui:action", (event) => {
      this.#handleAction(event.detail.action);
    });

    this.#bus.on("robot:changed", (event) => {
      const state = event.detail.state;
      const changed = event.detail.changed;

      this.#stageView.render(state);
      if (changed.includes("name")) {
        this.#hudView.renderName(state.name);
      }
      if (changed.includes("emotion")) {
        this.#hudView.renderEmotion(state.emotion);
      }

      this.#syncExhaust();
    });

    this.#bus.on("game:theme", (event) => {
      const state = event.detail.state;
      this.#sceneService.render(state.theme);
      this.#hudView.announce(`Theme changed to ${state.theme}.`);
    });

    this.#bus.on("game:move", (event) => {
      const state = event.detail.state;
      this.#controlsView.setMoveActive(state.isMoving);
      if (state.isMoving) {
        this.#startMovementLoop();
      } else {
        this.#stopMovementLoop();
      }
      this.#syncExhaust();
    });

    this.#bus.on("game:dance", (event) => {
      const state = event.detail.state;
      this.#controlsView.setDanceActive(state.isDancing);

      if (state.isDancing) {
        this.#stageView.setDance(state.dance.cssClass);
        this.#audioService.startMusic();
        this.#audioService.speak(`${state.dance.name} mode.`);
      } else {
        this.#stageView.setDance(null);
        this.#audioService.stopMusic();
      }

      this.#syncExhaust();
    });

    this.#bus.on("game:hide-seek:start", (event) => {
      const state = event.detail.state;
      this.#controlsView.setHideSeekActive(true);
      this.#hudView.renderHideSeek(true, state.hideSeek.secondsLeft, state.hideSeek.score);
      this.#hudView.announce("Hide and seek started. Find the robot.");
      this.#hudView.showToast("Find the robot");
      this.#audioService.playClick();
      this.#audioService.speak("Find me if you can.");
      this.#stageView.beginHideSeek();
      this.#startHideSeekLoop();
    });

    this.#bus.on("game:hide-seek:tick", (event) => {
      const state = event.detail.state;
      this.#hudView.renderHideSeek(true, state.hideSeek.secondsLeft, state.hideSeek.score);
    });

    this.#bus.on("game:hide-seek:found", (event) => {
      const state = event.detail.state;
      this.#hudView.showToast(`Found. Score ${state.hideSeek.score}`);
      this.#audioService.playSuccess();
      this.#audioService.speak("You found me.");
    });

    this.#bus.on("game:hide-seek:timeout", () => {
      this.#hudView.showToast("Time is up");
      this.#audioService.playScratch();
      this.#audioService.speak("Time is up.");
    });

    this.#bus.on("game:hide-seek:end", (event) => {
      const state = event.detail.state;
      this.#controlsView.setHideSeekActive(false);
      this.#hudView.renderHideSeek(false, state.hideSeek.secondsLeft, state.hideSeek.score);
      this.#stageView.endHideSeek();
      this.#stopHideSeekLoop();

      if (event.detail.reason === "cancel") {
        this.#hudView.showToast("Hide and seek canceled", 1200);
      }
    });
  }

  #handleAction(action) {
    switch (action) {
      case "nextTheme":
        this.#audioService.playSuccess();
        this.#gameModel.nextTheme();
        this.#audioService.speak(this.#gameModel.snapshot.theme);
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
      case "toggleDance": {
        if (this.#gameModel.snapshot.isDancing) {
          this.#audioService.playScratch();
        } else {
          this.#audioService.playClick();
        }
        this.#gameModel.toggleDance();
        break;
      }
      case "toggleHideSeek":
        if (this.#gameModel.snapshot.hideSeek.active) {
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
    this.#moveInterval = setInterval(() => {
      this.#stageView.stepMovement();
    }, 2500);
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

  #syncControls() {
    const state = this.#gameModel.snapshot;
    this.#controlsView.setMoveActive(state.isMoving);
    this.#controlsView.setDanceActive(state.isDancing);
    this.#controlsView.setHideSeekActive(state.hideSeek.active);
  }

  #syncExhaust() {
    const robot = this.#robotModel.snapshot;
    const game = this.#gameModel.snapshot;

    this.#exhaustService.setEnabled(robot.bodyHasEngine);

    if (!robot.bodyHasEngine) {
      this.#exhaustService.setMode("off");
      return;
    }

    this.#exhaustService.setMode(game.isDancing ? "fire" : "smoke");
  }
}
