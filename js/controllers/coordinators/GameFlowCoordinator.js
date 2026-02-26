export class GameFlowCoordinator {
  #sceneService;
  #stageView;
  #hudView;
  #controlsView;
  #audioService;
  #hideContext = { hideSpots: [], occluderIds: [] };

  constructor({ sceneService, stageView, hudView, controlsView, audioService }) {
    this.#sceneService = sceneService;
    this.#stageView = stageView;
    this.#hudView = hudView;
    this.#controlsView = controlsView;
    this.#audioService = audioService;
  }

  renderInitialScene(gameState) {
    this.#hideContext = this.#sceneService.render(gameState.theme);
    return this.#hideContext;
  }

  get hideContext() {
    return this.#hideContext;
  }

  handleThemeChanged(gameState) {
    this.#hideContext = this.#sceneService.render(gameState.theme);
    this.#hudView.announce(`Theme changed to ${gameState.theme}.`);
  }

  handleMoveChanged(gameState, hooks) {
    this.#controlsView.setMoveActive(gameState.isMoving);
    if (gameState.isMoving) {
      hooks.startMovementLoop();
    } else {
      hooks.stopMovementLoop();
    }

    hooks.syncMotionState(gameState);
  }

  handleDanceChanged(gameState, hooks) {
    this.#controlsView.setDanceActive(gameState.isDancing);

    if (gameState.isDancing) {
      this.#audioService.startMusic();
      this.#audioService.speak(`${gameState.dance.name} dance.`);
    } else {
      this.#audioService.stopMusic();
    }

    hooks.syncMotionState(gameState);
  }

  handleHideSeekStart(gameState, hooks) {
    this.#controlsView.setHideSeekActive(true);
    this.#hudView.renderHideSeek(true, gameState.hideSeek.secondsLeft, gameState.hideSeek.score);
    this.#hudView.announce("Hide and seek started. Find the robot.");
    this.#hudView.showToast("Find the robot");
    this.#audioService.playClick();
    this.#audioService.speak("Can you find me?");
    this.#stageView.beginHideSeek(this.#hideContext);
    hooks.startHideSeekLoop();
  }

  handleHideSeekTick(gameState) {
    this.#hudView.renderHideSeek(true, gameState.hideSeek.secondsLeft, gameState.hideSeek.score);
  }

  handleHideSeekFound(gameState) {
    this.#hudView.showToast(`Found. Score ${gameState.hideSeek.score}`);
    this.#audioService.playSuccess();
    this.#audioService.speak("You found me.");
  }

  handleHideSeekTimeout() {
    this.#hudView.showToast("Time is up");
    this.#audioService.playClick();
    this.#audioService.speak("Time is up.");
  }

  handleHideSeekEnd(gameState, reason, hooks) {
    this.#controlsView.setHideSeekActive(false);
    this.#hudView.renderHideSeek(false, gameState.hideSeek.secondsLeft, gameState.hideSeek.score);
    this.#stageView.endHideSeek();
    hooks.stopHideSeekLoop();

    if (reason === "cancel") {
      this.#hudView.showToast("Hide and seek canceled", 1200);
      this.#audioService.playClick();
    }
  }
}
