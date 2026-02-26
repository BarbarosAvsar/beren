export class UiSyncCoordinator {
  #controlsView;
  #hudView;
  #stageView;

  constructor({ controlsView, hudView, stageView }) {
    this.#controlsView = controlsView;
    this.#hudView = hudView;
    this.#stageView = stageView;
  }

  initialize() {
    this.#callLifecycle("init");
    this.#callLifecycle("mount");
  }

  destroy() {
    this.#callLifecycle("unmount");
    this.#callLifecycle("destroy");
  }

  renderInitial(robotState, gameState) {
    this.#stageView.render(robotState);
    this.#hudView.renderName(robotState.name);
    this.#hudView.renderEmotion(robotState.emotion);
    this.#hudView.renderHideSeek(gameState.hideSeek.active, gameState.hideSeek.secondsLeft, gameState.hideSeek.score);
    this.syncControls(gameState);
    this.syncMotionState(gameState);
  }

  renderRobotIdentity(robotState, changed) {
    if (changed.includes("name")) {
      this.#hudView.renderName(robotState.name);
    }
    if (changed.includes("emotion")) {
      this.#hudView.renderEmotion(robotState.emotion);
    }
  }

  syncControls(gameState) {
    this.#controlsView.setMoveActive(gameState.isMoving);
    this.#controlsView.setDanceActive(gameState.isDancing);
    this.#controlsView.setHideSeekActive(gameState.hideSeek.active);
  }

  syncMotionState(gameState) {
    this.#stageView.setMotionState({
      isMoving: gameState.isMoving,
      danceClass: gameState.isDancing ? gameState.dance.cssClass : null,
    });
  }

  #callLifecycle(method) {
    [this.#controlsView, this.#hudView, this.#stageView].forEach((view) => {
      if (typeof view[method] === "function") {
        view[method]();
      }
    });
  }
}
