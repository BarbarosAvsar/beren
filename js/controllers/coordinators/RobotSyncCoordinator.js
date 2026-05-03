const DEFAULT_VISUAL_KEYS = new Set(["characterMode", "head", "body", "arms", "legs", "palette", "scale"]);

export class RobotSyncCoordinator {
  #stageView;
  #uiSync;
  #exhaustService;
  #visualKeys;

  constructor({ stageView, uiSync, exhaustService, visualKeys = DEFAULT_VISUAL_KEYS }) {
    this.#stageView = stageView;
    this.#uiSync = uiSync;
    this.#exhaustService = exhaustService;
    this.#visualKeys = visualKeys;
  }

  handleRobotChanged(robotState, changed, gameState) {
    if (this.hasVisualChange(changed)) {
      this.#stageView.applyRobotChanges(robotState, changed);
    }

    this.#uiSync.renderRobotIdentity(robotState, changed);
    this.syncExhaust(robotState, gameState);
  }

  hasVisualChange(changed) {
    return changed.some((key) => this.#visualKeys.has(key));
  }

  syncExhaust(robotState, gameState) {
    this.#exhaustService.setEnabled(robotState.bodyHasEngine);

    if (!robotState.bodyHasEngine) {
      this.#exhaustService.setMode("off");
      return;
    }

    this.#exhaustService.setMode(gameState.isDancing ? "fire" : "smoke");
  }
}
