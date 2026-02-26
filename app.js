(() => {
  // js/core/controls.js
  var CONTROL_DEFINITIONS = [
    { id: "scene", action: "nextTheme", label: "Scene", icon: "icon-scene", variant: "scene" },
    { id: "color", action: "nextPalette", label: "Color", icon: "icon-color", variant: "color" },
    { id: "size", action: "nextSize", label: "Size", icon: "icon-size", variant: "size" },
    { id: "mix", action: "randomize", label: "Mix", icon: "icon-mix", variant: "mix" },
    { id: "move", action: "toggleMove", label: "Move", icon: "icon-move", variant: "move" },
    { id: "dance", action: "toggleDance", label: "Dance", icon: "icon-dance", variant: "dance" },
    { id: "hide", action: "toggleHideSeek", label: "Hide", icon: "icon-hide", variant: "hideSeek" }
  ];

  // js/core/defaults.js
  var THEMES = [
    "Factory",
    "Space",
    "Moon",
    "Jungle",
    "Underwater",
    "Candy",
    "Arctic",
    "Sunset"
  ];
  var DANCE_STYLES = [
    { name: "Bounce", cssClass: "dance-bounce" },
    { name: "Twist", cssClass: "dance-twist" },
    { name: "Shimmy", cssClass: "dance-shimmy" },
    { name: "Disco", cssClass: "dance-disco" }
  ];
  var EMOTIONS = [":)", "B)", ":D", "xD", "o_o", "^_^", "!!", "<3"];
  var SCALE_PRESETS = [0.78, 0.9, 1, 1.12, 1.24, 1.36, 1.5];
  var HIDE_SEEK_SECONDS = 15;
  var MOVE_STEP_MS = 900;
  var MOVE_TRANSITION_MS = 650;
  var MOVE_DELTA_X = 120;
  var MOVE_DELTA_Y = 55;
  var HIDE_HINT_INTERVAL_MS = 2600;
  var HIDE_HINT_DURATION_MS = 700;

  // js/core/palettes.js
  var PALETTES = [
    { name: "Steel", head: "#64748b", body: "#4b5563", arms: "#6b7280", legs: "#475569" },
    { name: "Ocean", head: "#2563eb", body: "#1d4ed8", arms: "#38bdf8", legs: "#1e40af" },
    { name: "Jungle", head: "#16a34a", body: "#15803d", arms: "#4ade80", legs: "#166534" },
    { name: "Sun", head: "#f59e0b", body: "#f97316", arms: "#fbbf24", legs: "#ea580c" },
    { name: "Berry", head: "#ec4899", body: "#d946ef", arms: "#f472b6", legs: "#be185d" },
    { name: "Mint", head: "#22d3ee", body: "#14b8a6", arms: "#2dd4bf", legs: "#0f766e" },
    { name: "Cloud", head: "#94a3b8", body: "#64748b", arms: "#cbd5e1", legs: "#475569" },
    { name: "Coral", head: "#fb7185", body: "#f43f5e", arms: "#fdba74", legs: "#be123c" },
    { name: "Neon", head: "#22d3ee", body: "#0ea5e9", arms: "#67e8f9", legs: "#0369a1" },
    { name: "Arcade", head: "#f43f5e", body: "#7c3aed", arms: "#fb7185", legs: "#4c1d95" },
    { name: "Bubblegum", head: "#f9a8d4", body: "#f472b6", arms: "#fde68a", legs: "#ec4899" },
    { name: "Volt", head: "#bef264", body: "#84cc16", arms: "#d9f99d", legs: "#4d7c0f" },
    { name: "Lava", head: "#fb923c", body: "#ea580c", arms: "#f97316", legs: "#9a3412" },
    { name: "Royal", head: "#60a5fa", body: "#1d4ed8", arms: "#a78bfa", legs: "#312e81" },
    { name: "Sand", head: "#fcd34d", body: "#f59e0b", arms: "#fde68a", legs: "#b45309" },
    { name: "Midnight", head: "#334155", body: "#1e293b", arms: "#64748b", legs: "#0f172a" }
  ];

  // js/core/robot-parts.js
  var PART_CATALOG = {
    heads: [
      { key: "cube", variant: 0 },
      { key: "bubble", variant: 1 },
      { key: "visor", variant: 2 },
      { key: "antenna", variant: 3 },
      { key: "cat", variant: 4 },
      { key: "crown", variant: 5 },
      { key: "helmet", variant: 6 },
      { key: "star", variant: 7 },
      { key: "cloud", variant: 8 },
      { key: "rocket", variant: 9 },
      { key: "owl", variant: 10 },
      { key: "donut", variant: 11 },
      { key: "frog", variant: 12 },
      { key: "tv", variant: 13 },
      { key: "dice", variant: 14 },
      { key: "beetle", variant: 15 },
      { key: "kite", variant: 16 },
      { key: "pumpkin", variant: 17 }
    ],
    bodies: [
      { key: "chest", variant: 0, engine: false },
      { key: "tank", variant: 1, engine: false },
      { key: "shield", variant: 2, engine: false },
      { key: "orb", variant: 3, engine: false },
      { key: "speaker", variant: 4, engine: false },
      { key: "safe", variant: 5, engine: false },
      { key: "rocket", variant: 6, engine: false },
      { key: "gift", variant: 7, engine: false },
      { key: "engine", variant: 8, engine: true },
      { key: "jet", variant: 9, engine: true },
      { key: "arcade", variant: 10, engine: false },
      { key: "jelly", variant: 11, engine: false },
      { key: "backpack", variant: 12, engine: false },
      { key: "lantern", variant: 13, engine: false },
      { key: "teapot", variant: 14, engine: false },
      { key: "mailbox", variant: 15, engine: false },
      { key: "reactor", variant: 16, engine: true },
      { key: "sub", variant: 17, engine: true }
    ],
    arms: [
      { key: "claw", variant: 0 },
      { key: "spring", variant: 1 },
      { key: "paddle", variant: 2 },
      { key: "wing", variant: 3 },
      { key: "mitt", variant: 4 },
      { key: "wand", variant: 5 },
      { key: "hook", variant: 6 },
      { key: "drum", variant: 7 },
      { key: "brush", variant: 8 },
      { key: "fan", variant: 9 },
      { key: "balloon", variant: 10 },
      { key: "ribbon", variant: 11 },
      { key: "grabber", variant: 12 },
      { key: "laser", variant: 13 },
      { key: "bubble", variant: 14 },
      { key: "trumpet", variant: 15 },
      { key: "noodle", variant: 16 },
      { key: "pixel", variant: 17 }
    ],
    legs: [
      { key: "walker", variant: 0 },
      { key: "boots", variant: 1 },
      { key: "wheels", variant: 2 },
      { key: "treads", variant: 3 },
      { key: "hover", variant: 4 },
      { key: "springs", variant: 5 },
      { key: "stompers", variant: 6 },
      { key: "pogo", variant: 7 },
      { key: "skates", variant: 8 },
      { key: "paws", variant: 9 },
      { key: "spider", variant: 10 },
      { key: "stilts", variant: 11 },
      { key: "fins", variant: 12 },
      { key: "skis", variant: 13 },
      { key: "moon", variant: 14 },
      { key: "tentacle", variant: 15 },
      { key: "magnet", variant: 16 },
      { key: "rollers", variant: 17 }
    ]
  };

  // js/core/events.js
  var UI_EVENTS = Object.freeze({
    ACTION: "ui:action",
    PART_CYCLE: "ui:part-cycle",
    NAME_CYCLE: "ui:name-cycle",
    EMOTION_CYCLE: "ui:emotion-cycle",
    HIDE_SEEK_FOUND: "ui:hide-seek-found"
  });
  var ROBOT_EVENTS = Object.freeze({
    CHANGED: "robot:changed"
  });
  var GAME_EVENTS = Object.freeze({
    THEME: "game:theme",
    MOVE: "game:move",
    DANCE: "game:dance",
    HIDE_SEEK_START: "game:hide-seek:start",
    HIDE_SEEK_TICK: "game:hide-seek:tick",
    HIDE_SEEK_FOUND: "game:hide-seek:found",
    HIDE_SEEK_TIMEOUT: "game:hide-seek:timeout",
    HIDE_SEEK_END: "game:hide-seek:end"
  });
  var AUDIO_EVENTS = Object.freeze({
    MUSIC_START: "audio:music:start",
    MUSIC_STOP: "audio:music:stop",
    SPEAK: "audio:speak"
  });
  var ALL_EVENT_TYPES = Object.freeze([
    ...Object.values(UI_EVENTS),
    ...Object.values(ROBOT_EVENTS),
    ...Object.values(GAME_EVENTS),
    ...Object.values(AUDIO_EVENTS)
  ]);
  var EVENT_TYPE_SET = new Set(ALL_EVENT_TYPES);

  // js/controllers/coordinators/GameFlowCoordinator.js
  var GameFlowCoordinator = class {
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
  };

  // js/controllers/coordinators/RobotSyncCoordinator.js
  var DEFAULT_VISUAL_KEYS = /* @__PURE__ */ new Set(["head", "body", "arms", "legs", "palette", "scale"]);
  var RobotSyncCoordinator = class {
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
  };

  // js/controllers/coordinators/UiSyncCoordinator.js
  var UiSyncCoordinator = class {
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
        danceClass: gameState.isDancing ? gameState.dance.cssClass : null
      });
    }
    #callLifecycle(method) {
      [this.#controlsView, this.#hudView, this.#stageView].forEach((view) => {
        if (typeof view[method] === "function") {
          view[method]();
        }
      });
    }
  };

  // js/controllers/AppController.js
  var AppController = class {
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
        stageView: dependencies.stageView
      });
      this.#robotSync = new RobotSyncCoordinator({
        stageView: dependencies.stageView,
        uiSync: this.#uiSync,
        exhaustService: dependencies.exhaustService
      });
      this.#gameFlow = new GameFlowCoordinator({
        sceneService: dependencies.sceneService,
        stageView: dependencies.stageView,
        hudView: dependencies.hudView,
        controlsView: dependencies.controlsView,
        audioService: dependencies.audioService
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
          syncMotionState: (nextState) => this.#uiSync.syncMotionState(nextState)
        });
        this.#robotSync.syncExhaust(this.#latestRobotState ?? this.#robotModel.snapshot, state);
      });
      this.#on(GAME_EVENTS.DANCE, (event) => {
        const state = event.detail.state;
        this.#latestGameState = state;
        this.#gameFlow.handleDanceChanged(state, {
          syncMotionState: (nextState) => this.#uiSync.syncMotionState(nextState)
        });
        this.#robotSync.syncExhaust(this.#latestRobotState ?? this.#robotModel.snapshot, state);
      });
      this.#on(GAME_EVENTS.HIDE_SEEK_START, (event) => {
        const state = event.detail.state;
        this.#latestGameState = state;
        this.#gameFlow.handleHideSeekStart(state, {
          startHideSeekLoop: () => this.#startHideSeekLoop()
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
          stopHideSeekLoop: () => this.#stopHideSeekLoop()
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
      }, 1e3);
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
  };

  // js/core/EventBus.js
  var EventBus = class {
    #target;
    #allowedTypes;
    constructor(options = {}) {
      this.#target = new EventTarget();
      this.#allowedTypes = this.#normalizeAllowedTypes(options.allowedTypes);
    }
    on(type, handler, options) {
      this.#assertKnownType(type);
      this.#target.addEventListener(type, handler, options);
    }
    off(type, handler, options) {
      this.#assertKnownType(type);
      this.#target.removeEventListener(type, handler, options);
    }
    emit(type, detail = {}) {
      this.#assertKnownType(type);
      this.#target.dispatchEvent(new CustomEvent(type, { detail }));
    }
    #normalizeAllowedTypes(allowedTypes) {
      if (!allowedTypes) {
        return null;
      }
      const normalized = Array.isArray(allowedTypes) ? allowedTypes : Array.from(allowedTypes);
      return new Set(normalized);
    }
    #assertKnownType(type) {
      if (typeof type !== "string" || type.length === 0) {
        throw new Error("Event type must be a non-empty string.");
      }
      if (!this.#allowedTypes || this.#allowedTypes.has(type)) {
        return;
      }
      throw new Error(`Unknown event type "${type}". Add it to js/core/events.js before use.`);
    }
  };

  // js/domain/GameModel.js
  var GameModel = class {
    #bus;
    #themeIndex = 0;
    #danceIndex = 0;
    #isMoving = false;
    #isDancing = false;
    #hideSeek = {
      active: false,
      secondsLeft: HIDE_SEEK_SECONDS,
      score: 0
    };
    constructor(bus) {
      this.#bus = bus;
    }
    get snapshot() {
      return {
        themeIndex: this.#themeIndex,
        theme: THEMES[this.#themeIndex],
        danceIndex: this.#danceIndex,
        dance: DANCE_STYLES[this.#danceIndex],
        isMoving: this.#isMoving,
        isDancing: this.#isDancing,
        hideSeek: { ...this.#hideSeek }
      };
    }
    nextTheme() {
      this.#themeIndex = (this.#themeIndex + 1) % THEMES.length;
      this.#bus.emit(GAME_EVENTS.THEME, { state: this.snapshot });
    }
    toggleMove() {
      this.#isMoving = !this.#isMoving;
      this.#bus.emit(GAME_EVENTS.MOVE, { state: this.snapshot });
    }
    toggleDance() {
      if (this.#isDancing) {
        this.#isDancing = false;
        this.#bus.emit(GAME_EVENTS.DANCE, { state: this.snapshot });
        return;
      }
      this.#danceIndex = (this.#danceIndex + 1) % DANCE_STYLES.length;
      this.#isDancing = true;
      this.#bus.emit(GAME_EVENTS.DANCE, { state: this.snapshot });
    }
    startHideSeek() {
      if (this.#hideSeek.active) {
        return false;
      }
      this.#hideSeek = {
        ...this.#hideSeek,
        active: true,
        secondsLeft: HIDE_SEEK_SECONDS
      };
      this.#bus.emit(GAME_EVENTS.HIDE_SEEK_START, { state: this.snapshot });
      return true;
    }
    cancelHideSeek() {
      if (!this.#hideSeek.active) {
        return false;
      }
      this.#hideSeek = {
        ...this.#hideSeek,
        active: false,
        secondsLeft: HIDE_SEEK_SECONDS
      };
      this.#bus.emit(GAME_EVENTS.HIDE_SEEK_END, { state: this.snapshot, reason: "cancel" });
      return true;
    }
    markHideSeekFound() {
      if (!this.#hideSeek.active) {
        return false;
      }
      this.#hideSeek = {
        ...this.#hideSeek,
        active: false,
        secondsLeft: HIDE_SEEK_SECONDS,
        score: this.#hideSeek.score + 1
      };
      this.#bus.emit(GAME_EVENTS.HIDE_SEEK_FOUND, { state: this.snapshot });
      this.#bus.emit(GAME_EVENTS.HIDE_SEEK_END, { state: this.snapshot, reason: "found" });
      return true;
    }
    tickHideSeek() {
      if (!this.#hideSeek.active) {
        return;
      }
      const secondsLeft = this.#hideSeek.secondsLeft - 1;
      this.#hideSeek = {
        ...this.#hideSeek,
        secondsLeft
      };
      this.#bus.emit(GAME_EVENTS.HIDE_SEEK_TICK, { state: this.snapshot });
      if (secondsLeft <= 0) {
        this.#hideSeek = {
          ...this.#hideSeek,
          active: false,
          secondsLeft: HIDE_SEEK_SECONDS
        };
        this.#bus.emit(GAME_EVENTS.HIDE_SEEK_TIMEOUT, { state: this.snapshot });
        this.#bus.emit(GAME_EVENTS.HIDE_SEEK_END, { state: this.snapshot, reason: "timeout" });
      }
    }
  };

  // js/domain/RobotModel.js
  var RobotModel = class {
    #bus;
    #nameService;
    #headIndex = 0;
    #bodyIndex = 0;
    #armsIndex = 0;
    #legsIndex = 0;
    #emotionIndex = 0;
    #paletteIndex = 0;
    #scaleIndex = 2;
    #name;
    constructor(bus, nameService) {
      this.#bus = bus;
      this.#nameService = nameService;
      this.#name = this.#nameService.next();
    }
    get snapshot() {
      return {
        headIndex: this.#headIndex,
        bodyIndex: this.#bodyIndex,
        armsIndex: this.#armsIndex,
        legsIndex: this.#legsIndex,
        emotionIndex: this.#emotionIndex,
        paletteIndex: this.#paletteIndex,
        scale: SCALE_PRESETS[this.#scaleIndex],
        name: this.#name,
        emotion: EMOTIONS[this.#emotionIndex],
        palette: PALETTES[this.#paletteIndex],
        bodyHasEngine: this.isEngineBody(),
        body: PART_CATALOG.bodies[this.#bodyIndex],
        head: PART_CATALOG.heads[this.#headIndex],
        arms: PART_CATALOG.arms[this.#armsIndex],
        legs: PART_CATALOG.legs[this.#legsIndex]
      };
    }
    cyclePart(part) {
      switch (part) {
        case "head":
          this.#headIndex = (this.#headIndex + 1) % PART_CATALOG.heads.length;
          this.#emit(["head"]);
          break;
        case "body":
          this.#bodyIndex = (this.#bodyIndex + 1) % PART_CATALOG.bodies.length;
          this.#emit(["body"]);
          break;
        case "arms":
          this.#armsIndex = (this.#armsIndex + 1) % PART_CATALOG.arms.length;
          this.#emit(["arms"]);
          break;
        case "legs":
          this.#legsIndex = (this.#legsIndex + 1) % PART_CATALOG.legs.length;
          this.#emit(["legs"]);
          break;
        default:
          break;
      }
    }
    cycleEmotion() {
      this.#emotionIndex = (this.#emotionIndex + 1) % EMOTIONS.length;
      this.#emit(["emotion"]);
    }
    nextName() {
      this.#name = this.#nameService.next();
      this.#emit(["name"]);
    }
    randomize() {
      this.#headIndex = Math.floor(Math.random() * PART_CATALOG.heads.length);
      this.#bodyIndex = Math.floor(Math.random() * PART_CATALOG.bodies.length);
      this.#armsIndex = Math.floor(Math.random() * PART_CATALOG.arms.length);
      this.#legsIndex = Math.floor(Math.random() * PART_CATALOG.legs.length);
      this.#emotionIndex = Math.floor(Math.random() * EMOTIONS.length);
      this.#paletteIndex = Math.floor(Math.random() * PALETTES.length);
      this.#scaleIndex = Math.floor(Math.random() * SCALE_PRESETS.length);
      this.#name = this.#nameService.next();
      this.#emit(["head", "body", "arms", "legs", "emotion", "palette", "scale", "name"]);
    }
    nextPalette() {
      this.#paletteIndex = (this.#paletteIndex + 1) % PALETTES.length;
      this.#emit(["palette"]);
    }
    setScalePreset() {
      this.#scaleIndex = (this.#scaleIndex + 1) % SCALE_PRESETS.length;
      this.#emit(["scale"]);
    }
    isEngineBody() {
      return Boolean(PART_CATALOG.bodies[this.#bodyIndex].engine);
    }
    #emit(changed) {
      this.#bus.emit(ROBOT_EVENTS.CHANGED, {
        changed,
        state: this.snapshot
      });
    }
  };

  // js/services/AudioService.js
  var AudioService = class {
    #contextFactory;
    #speech;
    #speechLang = "en-US";
    #selectedVoiceName = null;
    #selectedVoiceLang = null;
    #context = null;
    #masterGain = null;
    #musicTimer = null;
    #isMusicPlaying = false;
    #step = 0;
    #nextTime = 0;
    #tempo = 124;
    constructor(options = {}) {
      this.#contextFactory = options.audioContextFactory ?? (() => {
        if (typeof window === "undefined") {
          return null;
        }
        const Ctx = window.AudioContext || window.webkitAudioContext;
        return Ctx ? new Ctx() : null;
      });
      this.#speech = options.speech ?? (typeof window !== "undefined" ? window.speechSynthesis : null);
      if (typeof options.speechLang === "string" && options.speechLang.trim()) {
        this.#speechLang = options.speechLang;
      }
    }
    playClick() {
      this.#playTone({
        type: "square",
        frequency: 640,
        frequencyEnd: 420,
        duration: 0.08,
        gain: 0.07
      });
    }
    playBoing() {
      this.#playTone({
        type: "triangle",
        frequency: 180,
        frequencyEnd: 520,
        duration: 0.2,
        gain: 0.1,
        ramp: "linear"
      });
    }
    playSuccess() {
      const notes = [392, 523, 659, 784];
      notes.forEach((note, index) => {
        this.#schedule(() => {
          this.#playTone({
            type: "sine",
            frequency: note,
            frequencyEnd: note,
            duration: 0.12,
            gain: 0.06
          });
        }, index * 70);
      });
    }
    playScratch() {
      this.#playTone({
        type: "triangle",
        frequency: 300,
        frequencyEnd: 220,
        duration: 0.12,
        gain: 0.04,
        ramp: "linear"
      });
    }
    startMusic() {
      if (this.#isMusicPlaying) {
        return;
      }
      const ctx = this.#ensureContext();
      if (!ctx) {
        return;
      }
      this.#isMusicPlaying = true;
      this.#step = 0;
      this.#nextTime = ctx.currentTime;
      const scheduler = () => {
        if (!this.#isMusicPlaying) {
          return;
        }
        while (this.#nextTime < ctx.currentTime + 0.12) {
          this.#scheduleBeat(this.#nextTime, this.#step);
          this.#step += 1;
          this.#nextTime += 60 / this.#tempo / 4;
        }
      };
      scheduler();
      this.#musicTimer = setInterval(scheduler, 35);
    }
    stopMusic() {
      this.#isMusicPlaying = false;
      if (this.#musicTimer !== null) {
        clearInterval(this.#musicTimer);
        this.#musicTimer = null;
      }
    }
    speak(text) {
      if (!this.#speech || typeof SpeechSynthesisUtterance === "undefined") {
        return;
      }
      this.#speech.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.#speechLang;
      const voice = this.#pickSpeechVoice();
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 0.55;
      this.#speech.speak(utterance);
    }
    destroy() {
      this.stopMusic();
      if (this.#speech) {
        this.#speech.cancel();
      }
      if (this.#context && this.#context.state !== "closed") {
        this.#context.close();
      }
      this.#context = null;
      this.#masterGain = null;
    }
    #ensureContext() {
      if (this.#context) {
        if (this.#context.state === "suspended") {
          this.#context.resume();
        }
        return this.#context;
      }
      const created = this.#contextFactory();
      if (!created) {
        return null;
      }
      this.#context = created;
      this.#masterGain = this.#context.createGain();
      this.#masterGain.gain.value = 0.18;
      this.#masterGain.connect(this.#context.destination);
      if (this.#context.state === "suspended") {
        this.#context.resume();
      }
      return this.#context;
    }
    #playTone({ type, frequency, frequencyEnd, duration, gain, ramp = "exp" }) {
      const ctx = this.#ensureContext();
      if (!ctx) {
        return;
      }
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      if (ramp === "linear") {
        osc.frequency.linearRampToValueAtTime(frequencyEnd, ctx.currentTime + duration);
      } else {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, frequencyEnd), ctx.currentTime + duration);
      }
      env.gain.setValueAtTime(gain, ctx.currentTime);
      env.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + duration);
      osc.connect(env);
      env.connect(this.#masterGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    }
    #scheduleBeat(time, step) {
      const ctx = this.#ensureContext();
      if (!ctx) {
        return;
      }
      const index = step % 16;
      if (index % 4 === 0) {
        this.#kick(time);
      }
      if (index % 8 === 4) {
        this.#snare(time);
      }
      if (index % 2 === 0) {
        this.#hihat(time, index % 4 === 2);
      }
      if (index % 4 === 0) {
        const bass = [55, 62, 65, 49][Math.floor(index / 4) % 4];
        this.#bass(time, bass);
      }
    }
    #kick(time) {
      const ctx = this.#ensureContext();
      if (!ctx) {
        return;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(1e-4, time + 0.25);
      osc.connect(gain);
      gain.connect(this.#masterGain);
      osc.start(time);
      osc.stop(time + 0.25);
    }
    #snare(time) {
      const ctx = this.#ensureContext();
      if (!ctx) {
        return;
      }
      const duration = 0.09;
      const sampleCount = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < sampleCount; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1600;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(1e-4, time + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.#masterGain);
      noise.start(time);
    }
    #hihat(time, open) {
      const ctx = this.#ensureContext();
      if (!ctx) {
        return;
      }
      const duration = open ? 0.16 : 0.05;
      const sampleCount = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < sampleCount; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 7e3;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(1e-4, time + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.#masterGain);
      noise.start(time);
    }
    #bass(time, note) {
      const ctx = this.#ensureContext();
      if (!ctx) {
        return;
      }
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(note, time);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(260, time);
      filter.frequency.linearRampToValueAtTime(620, time + 0.08);
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(1e-4, time + 0.18);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.#masterGain);
      osc.start(time);
      osc.stop(time + 0.2);
    }
    #pickSpeechVoice() {
      if (!this.#speech || typeof this.#speech.getVoices !== "function") {
        return null;
      }
      let voices;
      try {
        voices = this.#speech.getVoices() ?? [];
      } catch {
        return null;
      }
      if (!Array.isArray(voices) || voices.length === 0) {
        this.#selectedVoiceName = null;
        this.#selectedVoiceLang = null;
        return null;
      }
      if (this.#selectedVoiceName) {
        const cached = voices.find((voice) => voice.name === this.#selectedVoiceName && String(voice.lang ?? "").toLowerCase() === this.#selectedVoiceLang);
        if (cached) {
          return cached;
        }
      }
      const englishVoices = voices.filter((voice) => String(voice.lang ?? "").toLowerCase().startsWith("en"));
      if (englishVoices.length === 0) {
        this.#selectedVoiceName = null;
        this.#selectedVoiceLang = null;
        return null;
      }
      const ranked = [...englishVoices].sort((left, right) => {
        const leftRank = this.#voiceRank(left.lang);
        const rightRank = this.#voiceRank(right.lang);
        if (leftRank !== rightRank) {
          return leftRank - rightRank;
        }
        const leftLocal = left.localService ? 0 : 1;
        const rightLocal = right.localService ? 0 : 1;
        if (leftLocal !== rightLocal) {
          return leftLocal - rightLocal;
        }
        return String(left.name ?? "").localeCompare(String(right.name ?? ""));
      });
      const selected = ranked[0];
      this.#selectedVoiceName = selected.name;
      this.#selectedVoiceLang = String(selected.lang ?? "").toLowerCase();
      return selected;
    }
    #voiceRank(lang) {
      const normalized = String(lang ?? "").toLowerCase();
      if (normalized === "en-us") {
        return 0;
      }
      if (normalized.startsWith("en-us-")) {
        return 1;
      }
      if (normalized === "en-gb") {
        return 2;
      }
      return 3;
    }
    #schedule(callback, delayMs) {
      setTimeout(callback, delayMs);
    }
  };

  // js/services/ExhaustService.js
  var ExhaustService = class {
    #container;
    #enabled = false;
    #mode = "off";
    #intervalId = null;
    #clock;
    constructor(container, clock = globalThis) {
      this.#container = container;
      this.#clock = {
        setInterval: clock.setInterval.bind(clock),
        clearInterval: clock.clearInterval.bind(clock),
        setTimeout: clock.setTimeout.bind(clock)
      };
      this.#container.dataset.mode = "off";
      this.#container.dataset.enabled = "false";
    }
    setEnabled(enabled) {
      this.#enabled = Boolean(enabled);
      this.#container.dataset.enabled = this.#enabled ? "true" : "false";
      if (!this.#enabled) {
        this.setMode("off");
        return;
      }
      if (this.#mode === "off") {
        this.setMode("smoke");
      }
    }
    setMode(mode) {
      const normalized = this.#enabled ? mode : "off";
      if (this.#mode === normalized) {
        return;
      }
      this.#mode = normalized;
      this.#container.dataset.mode = this.#mode;
      this.#stopEmitter();
      this.#clearParticles();
      if (this.#mode === "off") {
        return;
      }
      const interval = this.#mode === "fire" ? 90 : 180;
      this.#intervalId = this.#clock.setInterval(() => this.#emit(), interval);
    }
    destroy() {
      this.#enabled = false;
      this.setMode("off");
    }
    #stopEmitter() {
      if (this.#intervalId !== null) {
        this.#clock.clearInterval(this.#intervalId);
        this.#intervalId = null;
      }
    }
    #clearParticles() {
      while (this.#container.firstChild) {
        this.#container.firstChild.remove();
      }
    }
    #emit() {
      if (this.#mode === "off") {
        return;
      }
      const isFire = this.#mode === "fire";
      const count = isFire ? 3 : 1;
      for (let i = 0; i < count; i += 1) {
        this.#spawnParticle(isFire);
      }
    }
    #spawnParticle(isFire) {
      const particle = document.createElement("span");
      const size = isFire ? 8 + Math.random() * 10 : 12 + Math.random() * 12;
      const offset = (Math.random() - 0.5) * 26;
      particle.className = `exhaust-particle ${isFire ? "exhaust-particle-fire" : "exhaust-particle-smoke"}`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `calc(50% + ${offset}px)`;
      this.#container.appendChild(particle);
      const life = isFire ? 420 : 860;
      this.#clock.setTimeout(() => {
        particle.remove();
      }, life);
    }
  };

  // js/services/NameService.js
  var NameService = class _NameService {
    static #adjectives = [
      "Turbo",
      "Mighty",
      "Steady",
      "Nova",
      "Iron",
      "Neon",
      "Quantum",
      "Brisk",
      "Solar",
      "Echo",
      "Arctic",
      "Rapid"
    ];
    static #nouns = [
      "Bot",
      "Walker",
      "Unit",
      "Core",
      "Engine",
      "Spark",
      "Forge",
      "Scout",
      "Pilot",
      "Gear",
      "Ranger",
      "Frame"
    ];
    next() {
      const adjective = _NameService.#adjectives[Math.floor(Math.random() * _NameService.#adjectives.length)];
      const noun = _NameService.#nouns[Math.floor(Math.random() * _NameService.#nouns.length)];
      return `${adjective} ${noun}`;
    }
  };

  // js/services/scene/themes.js
  var SCENE_THEMES = Object.freeze({
    Factory: {
      accents: [
        { x: 15, y: 20, w: 120, h: 120, color: "rgba(148,163,184,0.28)", shape: "square" },
        { x: 82, y: 25, w: 100, h: 100, color: "rgba(250,204,21,0.2)", shape: "circle" },
        { x: 50, y: 78, w: 360, h: 24, color: "rgba(148,163,184,0.22)", shape: "line" }
      ],
      occluders: [
        { id: "crate-left", type: "crate", x: 18, y: 72, w: 130, h: 130 },
        { id: "crate-right", type: "crate", x: 81, y: 70, w: 120, h: 120 },
        { id: "pipe", type: "pipe", x: 52, y: 68, w: 190, h: 170 }
      ],
      hideSpots: [
        { x: -245, y: 90, occluderId: "crate-left", peek: "right" },
        { x: 240, y: 82, occluderId: "crate-right", peek: "left" },
        { x: 0, y: 80, occluderId: "pipe", peek: "up" }
      ]
    },
    Space: {
      accents: [
        { x: 20, y: 22, w: 5, h: 5, color: "rgba(255,255,255,0.88)", shape: "circle" },
        { x: 43, y: 32, w: 4, h: 4, color: "rgba(255,255,255,0.75)", shape: "circle" },
        { x: 77, y: 18, w: 7, h: 7, color: "rgba(255,255,255,0.9)", shape: "circle" },
        { x: 67, y: 23, w: 130, h: 130, color: "rgba(99,102,241,0.2)", shape: "circle" }
      ],
      occluders: [
        { id: "planet-left", type: "planet", x: 15, y: 70, w: 150, h: 150 },
        { id: "planet-right", type: "planet", x: 84, y: 68, w: 170, h: 170 },
        { id: "cloud", type: "nebula", x: 48, y: 75, w: 260, h: 120 }
      ],
      hideSpots: [
        { x: -248, y: 84, occluderId: "planet-left", peek: "right" },
        { x: 245, y: 86, occluderId: "planet-right", peek: "left" },
        { x: -20, y: 92, occluderId: "cloud", peek: "up" }
      ]
    },
    Moon: {
      accents: [
        { x: 80, y: 18, w: 140, h: 140, color: "rgba(255,255,255,0.24)", shape: "circle" },
        { x: 30, y: 80, w: 270, h: 38, color: "rgba(148,163,184,0.28)", shape: "line" }
      ],
      occluders: [
        { id: "rock-left", type: "rock", x: 20, y: 73, w: 150, h: 105 },
        { id: "rock-right", type: "rock", x: 80, y: 71, w: 170, h: 118 },
        { id: "ridge", type: "ridge", x: 50, y: 79, w: 340, h: 120 }
      ],
      hideSpots: [
        { x: -235, y: 88, occluderId: "rock-left", peek: "right" },
        { x: 225, y: 85, occluderId: "rock-right", peek: "left" },
        { x: 6, y: 92, occluderId: "ridge", peek: "up" }
      ]
    },
    Jungle: {
      accents: [
        { x: 11, y: 22, w: 70, h: 220, color: "rgba(34,197,94,0.2)", shape: "line" },
        { x: 88, y: 22, w: 65, h: 220, color: "rgba(21,128,61,0.2)", shape: "line" },
        { x: 47, y: 70, w: 170, h: 170, color: "rgba(187,247,208,0.2)", shape: "circle" }
      ],
      occluders: [
        { id: "tree-left", type: "tree", x: 14, y: 66, w: 165, h: 220 },
        { id: "tree-right", type: "tree", x: 83, y: 67, w: 175, h: 220 },
        { id: "bush", type: "bush", x: 50, y: 79, w: 330, h: 130 }
      ],
      hideSpots: [
        { x: -246, y: 72, occluderId: "tree-left", peek: "right" },
        { x: 240, y: 73, occluderId: "tree-right", peek: "left" },
        { x: 0, y: 95, occluderId: "bush", peek: "up" }
      ]
    },
    Underwater: {
      accents: [
        { x: 20, y: 25, w: 60, h: 60, color: "rgba(255,255,255,0.2)", shape: "circle" },
        { x: 42, y: 48, w: 50, h: 50, color: "rgba(255,255,255,0.18)", shape: "circle" },
        { x: 74, y: 30, w: 68, h: 68, color: "rgba(255,255,255,0.22)", shape: "circle" }
      ],
      occluders: [
        { id: "reef-left", type: "reef", x: 17, y: 72, w: 170, h: 150 },
        { id: "reef-right", type: "reef", x: 80, y: 72, w: 180, h: 150 },
        { id: "seaweed", type: "seaweed", x: 52, y: 74, w: 320, h: 170 }
      ],
      hideSpots: [
        { x: -238, y: 94, occluderId: "reef-left", peek: "right" },
        { x: 236, y: 96, occluderId: "reef-right", peek: "left" },
        { x: -5, y: 88, occluderId: "seaweed", peek: "up" }
      ]
    },
    Candy: {
      accents: [
        { x: 17, y: 23, w: 62, h: 62, color: "rgba(251,113,133,0.27)", shape: "circle" },
        { x: 78, y: 20, w: 58, h: 58, color: "rgba(217,70,239,0.25)", shape: "square" },
        { x: 50, y: 69, w: 180, h: 24, color: "rgba(252,165,165,0.26)", shape: "line" }
      ],
      occluders: [
        { id: "gumdrop-left", type: "gumdrop", x: 20, y: 74, w: 170, h: 125 },
        { id: "gumdrop-right", type: "gumdrop", x: 82, y: 74, w: 185, h: 125 },
        { id: "hill", type: "candies", x: 50, y: 77, w: 340, h: 140 }
      ],
      hideSpots: [
        { x: -236, y: 92, occluderId: "gumdrop-left", peek: "right" },
        { x: 240, y: 91, occluderId: "gumdrop-right", peek: "left" },
        { x: 10, y: 94, occluderId: "hill", peek: "up" }
      ]
    },
    Arctic: {
      accents: [
        { x: 18, y: 20, w: 12, h: 12, color: "rgba(255,255,255,0.78)", shape: "circle" },
        { x: 41, y: 30, w: 10, h: 10, color: "rgba(255,255,255,0.68)", shape: "circle" },
        { x: 78, y: 26, w: 12, h: 12, color: "rgba(255,255,255,0.75)", shape: "circle" }
      ],
      occluders: [
        { id: "ice-left", type: "ice", x: 16, y: 70, w: 175, h: 150 },
        { id: "ice-right", type: "ice", x: 84, y: 70, w: 170, h: 145 },
        { id: "snowbank", type: "snowbank", x: 52, y: 79, w: 350, h: 120 }
      ],
      hideSpots: [
        { x: -239, y: 85, occluderId: "ice-left", peek: "right" },
        { x: 238, y: 87, occluderId: "ice-right", peek: "left" },
        { x: 0, y: 96, occluderId: "snowbank", peek: "up" }
      ]
    },
    Sunset: {
      accents: [
        { x: 51, y: 19, w: 100, h: 100, color: "rgba(251,191,36,0.35)", shape: "circle" },
        { x: 50, y: 73, w: 300, h: 20, color: "rgba(255,255,255,0.24)", shape: "line" }
      ],
      occluders: [
        { id: "hill-left", type: "hill", x: 19, y: 76, w: 220, h: 160 },
        { id: "hill-right", type: "hill", x: 81, y: 76, w: 220, h: 160 },
        { id: "cloud", type: "cloud", x: 50, y: 44, w: 260, h: 100 }
      ],
      hideSpots: [
        { x: -232, y: 95, occluderId: "hill-left", peek: "right" },
        { x: 233, y: 95, occluderId: "hill-right", peek: "left" },
        { x: 0, y: -40, occluderId: "cloud", peek: "down" }
      ]
    }
  });

  // js/services/SceneService.js
  var FALLBACK_THEME = "Factory";
  var SceneService = class {
    #background;
    #foreground;
    constructor(backgroundContainer, foregroundContainer) {
      this.#background = backgroundContainer;
      this.#foreground = foregroundContainer;
    }
    render(themeName) {
      const selectedThemeName = SCENE_THEMES[themeName] ? themeName : FALLBACK_THEME;
      const theme = SCENE_THEMES[selectedThemeName];
      const key = selectedThemeName.toLowerCase();
      this.#setThemeClasses(key);
      this.#clearLayers();
      this.#renderAccents(theme.accents);
      const occluderIds = this.#renderOccluders(theme.occluders, key);
      const hideSpots = this.#mapHideSpots(theme.hideSpots, key);
      return {
        hideSpots,
        occluderIds
      };
    }
    #setThemeClasses(key) {
      this.#background.className = `scene-layer scene-background scene-theme-${key}`;
      this.#foreground.className = `scene-layer scene-foreground scene-theme-${key}`;
    }
    #clearLayers() {
      this.#background.innerHTML = "";
      this.#foreground.innerHTML = "";
    }
    #renderAccents(accents) {
      accents.forEach((accent) => {
        const node = document.createElement("div");
        node.className = `scene-accent ${accent.shape}`;
        node.style.left = `${accent.x}%`;
        node.style.top = `${accent.y}%`;
        node.style.width = `${accent.w}px`;
        node.style.height = `${accent.h}px`;
        node.style.background = accent.color;
        node.style.transform = "translate(-50%, -50%)";
        this.#background.appendChild(node);
      });
    }
    #renderOccluders(occluders, key) {
      const occluderIds = [];
      occluders.forEach((occluder) => {
        const node = document.createElement("div");
        node.className = `scene-occluder scene-occluder-${occluder.type}`;
        node.style.left = `${occluder.x}%`;
        node.style.top = `${occluder.y}%`;
        node.style.width = `${occluder.w}px`;
        node.style.height = `${occluder.h}px`;
        node.style.transform = "translate(-50%, -50%)";
        const occluderNodeId = `scene-occluder-${key}-${occluder.id}`;
        node.id = occluderNodeId;
        occluderIds.push(occluderNodeId);
        this.#foreground.appendChild(node);
      });
      return occluderIds;
    }
    #mapHideSpots(hideSpots, key) {
      return hideSpots.map((spot) => ({
        x: spot.x,
        y: spot.y,
        peek: spot.peek,
        occluderId: `scene-occluder-${key}-${spot.occluderId}`
      }));
    }
  };

  // js/ui/ControlsView.js
  var ControlsView = class {
    #bus;
    #container;
    #buttons = /* @__PURE__ */ new Map();
    #handlers = /* @__PURE__ */ new Map();
    #initialized = false;
    #mounted = false;
    constructor(bus, container) {
      this.#bus = bus;
      this.#container = container;
    }
    init() {
      if (!this.#initialized) {
        this.#buildButtons();
        this.#initialized = true;
      }
      this.mount();
    }
    mount() {
      if (this.#mounted) {
        return;
      }
      this.#handlers.forEach((handler, action) => {
        const button = this.#buttons.get(action);
        if (button) {
          button.addEventListener("click", handler);
        }
      });
      this.#mounted = true;
    }
    unmount() {
      if (!this.#mounted) {
        return;
      }
      this.#handlers.forEach((handler, action) => {
        const button = this.#buttons.get(action);
        if (button) {
          button.removeEventListener("click", handler);
        }
      });
      this.#mounted = false;
    }
    destroy() {
      this.unmount();
      this.#buttons.clear();
      this.#handlers.clear();
      this.#container.innerHTML = "";
      this.#initialized = false;
    }
    setMoveActive(active) {
      this.#setActive("toggleMove", active, active ? "Stop" : "Move");
    }
    setDanceActive(active) {
      this.#setActive("toggleDance", active, active ? "Stop" : "Dance");
    }
    setHideSeekActive(active) {
      this.#setActive("toggleHideSeek", active, active ? "Cancel" : "Hide");
    }
    #buildButtons() {
      this.#container.innerHTML = "";
      this.#buttons.clear();
      this.#handlers.clear();
      CONTROL_DEFINITIONS.forEach((definition) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "control-button";
        button.dataset.variant = definition.variant;
        button.dataset.action = definition.action;
        button.dataset.testid = `control-${definition.id}`;
        button.setAttribute("data-testid", `control-${definition.id}`);
        button.setAttribute("aria-label", definition.label);
        button.innerHTML = `
        <svg class="control-icon" aria-hidden="true" focusable="false">
          <use href="#${definition.icon}"></use>
        </svg>
        <span class="control-label">${definition.label}</span>
      `;
        const handler = () => {
          this.#bus.emit(UI_EVENTS.ACTION, { action: definition.action });
        };
        this.#buttons.set(definition.action, button);
        this.#handlers.set(definition.action, handler);
        this.#container.appendChild(button);
      });
    }
    #setActive(action, active, labelText) {
      const button = this.#buttons.get(action);
      if (!button) {
        return;
      }
      button.classList.toggle("is-active", active);
      const label = button.querySelector(".control-label");
      if (label) {
        label.textContent = labelText;
      }
    }
  };

  // js/ui/HudView.js
  var HudView = class {
    #bus;
    #nameButton;
    #nameText;
    #emotionButton;
    #emotionText;
    #hideSeekHud;
    #timer;
    #score;
    #toast;
    #live;
    #toastTimer = null;
    #toastHideTimer = null;
    #mounted = false;
    #onNameClick;
    #onEmotionClick;
    constructor(bus, elements) {
      this.#bus = bus;
      this.#nameButton = elements.nameButton;
      this.#nameText = elements.nameText;
      this.#emotionButton = elements.emotionButton;
      this.#emotionText = elements.emotionText;
      this.#hideSeekHud = elements.hideSeekHud;
      this.#timer = elements.timer;
      this.#score = elements.score;
      this.#toast = elements.toast;
      this.#live = elements.live;
      this.#onNameClick = () => {
        this.#bus.emit(UI_EVENTS.NAME_CYCLE);
      };
      this.#onEmotionClick = () => {
        this.#bus.emit(UI_EVENTS.EMOTION_CYCLE);
      };
    }
    init() {
      this.mount();
    }
    mount() {
      if (this.#mounted) {
        return;
      }
      this.#nameButton.addEventListener("click", this.#onNameClick);
      this.#emotionButton.addEventListener("click", this.#onEmotionClick);
      this.#mounted = true;
    }
    unmount() {
      if (!this.#mounted) {
        return;
      }
      this.#nameButton.removeEventListener("click", this.#onNameClick);
      this.#emotionButton.removeEventListener("click", this.#onEmotionClick);
      this.#mounted = false;
    }
    destroy() {
      this.unmount();
      this.#clearToastTimers();
    }
    renderName(name) {
      this.#nameText.textContent = name;
    }
    renderEmotion(emotion) {
      this.#emotionText.textContent = emotion;
    }
    renderHideSeek(active, secondsLeft, score) {
      this.#score.textContent = String(score);
      if (!active) {
        this.#hideSeekHud.classList.add("is-hidden");
        this.#timer.classList.remove("is-warning");
        this.#timer.textContent = String(HIDE_SEEK_SECONDS);
        return;
      }
      this.#hideSeekHud.classList.remove("is-hidden");
      this.#timer.textContent = String(secondsLeft);
      this.#timer.classList.toggle("is-warning", secondsLeft <= 5);
    }
    showToast(message, duration = 1800) {
      this.#clearToastTimers();
      this.#toast.textContent = message;
      this.#toast.classList.remove("is-hidden", "is-leaving");
      this.#toast.classList.add("is-visible");
      this.#toastTimer = setTimeout(() => {
        this.#toast.classList.remove("is-visible");
        this.#toast.classList.add("is-leaving");
        this.#toastHideTimer = setTimeout(() => {
          this.#toast.classList.add("is-hidden");
          this.#toast.classList.remove("is-leaving");
        }, 280);
      }, duration);
    }
    announce(text) {
      this.#live.textContent = text;
    }
    #clearToastTimers() {
      if (this.#toastTimer !== null) {
        clearTimeout(this.#toastTimer);
        this.#toastTimer = null;
      }
      if (this.#toastHideTimer !== null) {
        clearTimeout(this.#toastHideTimer);
        this.#toastHideTimer = null;
      }
    }
  };

  // js/ui/StageView.js
  var VISUAL_KEYS = /* @__PURE__ */ new Set(["head", "body", "arms", "legs", "palette", "scale"]);
  var StageView = class {
    #bus;
    #region;
    #mover;
    #dancer;
    #assembly;
    #head;
    #body;
    #armLeft;
    #armRight;
    #legs;
    #partNodes;
    #partClickHandlers = /* @__PURE__ */ new Map();
    #mounted = false;
    #movePosition = { x: 0, y: 0 };
    #hideSeekActive = false;
    #hideSeekListener = null;
    #hideHintInterval = null;
    #hideHintTimeout = null;
    #activeOccluderId = null;
    #randomIndex = null;
    #hasRendered = false;
    #renderedHeadKey = null;
    #renderedBodyKey = null;
    #renderedArmsKey = null;
    #renderedLegsKey = null;
    #renderedBodyHasEngine = null;
    #renderedPalette = {
      head: null,
      body: null,
      arms: null,
      legs: null
    };
    #renderedScale = null;
    constructor(bus, elements, options = {}) {
      this.#bus = bus;
      this.#region = elements.region;
      this.#mover = elements.mover;
      this.#dancer = elements.dancer;
      this.#assembly = elements.assembly;
      this.#head = elements.head;
      this.#body = elements.body;
      this.#armLeft = elements.armLeft;
      this.#armRight = elements.armRight;
      this.#legs = elements.legs;
      this.#partNodes = [this.#head, this.#body, this.#armLeft, this.#armRight, this.#legs];
      if (typeof options.randomIndex === "function") {
        this.#randomIndex = options.randomIndex;
      }
    }
    init() {
      this.#mover.style.setProperty("--move-transition-ms", `${MOVE_TRANSITION_MS}ms`);
      this.setMotionState({ isMoving: false, danceClass: null });
      this.mount();
    }
    mount() {
      if (this.#mounted) {
        return;
      }
      this.#partNodes.forEach((node) => {
        const handler = () => {
          if (this.#hideSeekActive) {
            return;
          }
          const part = node.dataset.part;
          this.#bus.emit(UI_EVENTS.PART_CYCLE, { part });
        };
        this.#partClickHandlers.set(node, handler);
        node.addEventListener("click", handler);
      });
      this.#mounted = true;
    }
    unmount() {
      if (!this.#mounted) {
        return;
      }
      this.#partClickHandlers.forEach((handler, node) => {
        node.removeEventListener("click", handler);
      });
      this.#partClickHandlers.clear();
      if (this.#hideSeekListener) {
        this.#mover.removeEventListener("click", this.#hideSeekListener);
        this.#hideSeekListener = null;
      }
      this.#mounted = false;
    }
    render(state) {
      this.applyRobotChanges(state, [...VISUAL_KEYS]);
    }
    applyRobotChanges(state, changed = []) {
      const changedSet = new Set((Array.isArray(changed) ? changed : []).filter((key) => VISUAL_KEYS.has(key)));
      const firstRender = !this.#hasRendered;
      if (!firstRender && changedSet.size === 0) {
        return;
      }
      const shouldRebuildHead = firstRender || changedSet.has("head");
      const shouldRebuildBody = firstRender || changedSet.has("body") || this.#renderedBodyHasEngine !== state.bodyHasEngine;
      const shouldRebuildArms = firstRender || changedSet.has("arms");
      const shouldRebuildLegs = firstRender || changedSet.has("legs");
      if (shouldRebuildHead && this.#shouldRenderPiece(this.#renderedHeadKey, state.head.key, firstRender, changedSet, "head")) {
        this.#renderPiece(this.#head, {
          kind: "head",
          key: state.head.key,
          color: state.palette.head
        });
      }
      if (shouldRebuildBody && this.#shouldRenderBody(state, firstRender, changedSet)) {
        this.#renderPiece(this.#body, {
          kind: "body",
          key: state.body.key,
          color: state.palette.body,
          isEngine: state.bodyHasEngine
        });
      }
      if (shouldRebuildArms && this.#shouldRenderPiece(this.#renderedArmsKey, state.arms.key, firstRender, changedSet, "arms")) {
        this.#renderPiece(this.#armLeft, {
          kind: "arm",
          key: state.arms.key,
          color: state.palette.arms
        });
        this.#renderPiece(this.#armRight, {
          kind: "arm",
          key: state.arms.key,
          color: state.palette.arms
        });
      }
      if (shouldRebuildLegs && this.#shouldRenderPiece(this.#renderedLegsKey, state.legs.key, firstRender, changedSet, "legs")) {
        this.#renderPiece(this.#legs, {
          kind: "legs",
          key: state.legs.key,
          color: state.palette.legs
        });
      }
      if (changedSet.has("palette") && !firstRender) {
        this.#applyPaletteChanges(state, {
          head: shouldRebuildHead,
          body: shouldRebuildBody,
          arms: shouldRebuildArms,
          legs: shouldRebuildLegs
        });
      }
      if ((firstRender || changedSet.has("scale")) && this.#renderedScale !== state.scale) {
        this.setScale(state.scale);
      }
      this.#cacheRenderedState(state);
    }
    setScale(scale) {
      this.#assembly.style.transform = `scale(${scale})`;
    }
    setDance(danceClass) {
      this.#dancer.classList.remove("dance-bounce", "dance-twist", "dance-shimmy", "dance-disco");
      if (danceClass) {
        this.#dancer.classList.add(danceClass);
      }
    }
    setMotionState({ isMoving, danceClass }) {
      const dancing = Boolean(danceClass);
      this.setDance(danceClass);
      this.#dancer.classList.toggle("is-moving", Boolean(isMoving));
      this.#dancer.classList.toggle("is-dancing", dancing);
      this.#dancer.classList.toggle("is-idle", !isMoving && !dancing);
    }
    stepMovement() {
      const bounds = this.#computeBounds();
      const nextX = this.#movePosition.x + (Math.random() * 2 - 1) * MOVE_DELTA_X;
      const nextY = this.#movePosition.y + (Math.random() * 2 - 1) * MOVE_DELTA_Y;
      this.#movePosition = {
        x: Math.max(bounds.minX, Math.min(bounds.maxX, nextX)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, nextY))
      };
      if (!this.#hideSeekActive) {
        this.#applyMover(this.#movePosition.x, this.#movePosition.y);
      }
    }
    resetPosition() {
      this.#movePosition = { x: 0, y: 0 };
      if (!this.#hideSeekActive) {
        this.#applyMover(0, 0);
      }
    }
    beginHideSeek(hideContext = { hideSpots: [] }) {
      if (this.#hideSeekActive) {
        return;
      }
      this.#hideSeekActive = true;
      const spot = this.#pickHideSpot(hideContext);
      this.#assembly.classList.add("robot-hidden");
      this.#applyPeekClass(spot.peek);
      this.#applyMover(spot.x, spot.y);
      this.#mover.classList.add("hide-target");
      if (spot.occluderId) {
        const occluder = document.getElementById(spot.occluderId);
        if (occluder) {
          occluder.classList.add("is-occluding");
          this.#activeOccluderId = spot.occluderId;
        }
      }
      this.#hideSeekListener = (event) => {
        event.stopPropagation();
        if (!this.#hideSeekActive) {
          return;
        }
        this.#bus.emit(UI_EVENTS.HIDE_SEEK_FOUND);
      };
      this.#mover.addEventListener("click", this.#hideSeekListener);
      this.#startHintLoop();
    }
    endHideSeek() {
      if (!this.#hideSeekActive) {
        return;
      }
      this.#hideSeekActive = false;
      this.#assembly.classList.remove("robot-hidden", "robot-hint", "robot-peek-left", "robot-peek-right", "robot-peek-up", "robot-peek-down");
      this.#mover.classList.remove("hide-target");
      if (this.#activeOccluderId) {
        const occluder = document.getElementById(this.#activeOccluderId);
        if (occluder) {
          occluder.classList.remove("is-occluding");
        }
        this.#activeOccluderId = null;
      }
      if (this.#hideSeekListener) {
        this.#mover.removeEventListener("click", this.#hideSeekListener);
        this.#hideSeekListener = null;
      }
      if (this.#hideHintInterval !== null) {
        clearInterval(this.#hideHintInterval);
        this.#hideHintInterval = null;
      }
      if (this.#hideHintTimeout !== null) {
        clearTimeout(this.#hideHintTimeout);
        this.#hideHintTimeout = null;
      }
      this.#applyMover(this.#movePosition.x, this.#movePosition.y);
    }
    destroy() {
      this.endHideSeek();
      this.unmount();
    }
    #applyPaletteChanges(state, rebuilt) {
      if (!rebuilt.head && this.#renderedPalette.head !== state.palette.head && !this.#setPieceColor(this.#head, state.palette.head)) {
        this.#renderPiece(this.#head, {
          kind: "head",
          key: state.head.key,
          color: state.palette.head
        });
      }
      if (!rebuilt.body && this.#renderedPalette.body !== state.palette.body && !this.#setPieceColor(this.#body, state.palette.body)) {
        this.#renderPiece(this.#body, {
          kind: "body",
          key: state.body.key,
          color: state.palette.body,
          isEngine: state.bodyHasEngine
        });
      }
      if (!rebuilt.arms && this.#renderedPalette.arms !== state.palette.arms) {
        const updatedLeft = this.#setPieceColor(this.#armLeft, state.palette.arms);
        const updatedRight = this.#setPieceColor(this.#armRight, state.palette.arms);
        if (!updatedLeft || !updatedRight) {
          this.#renderPiece(this.#armLeft, {
            kind: "arm",
            key: state.arms.key,
            color: state.palette.arms
          });
          this.#renderPiece(this.#armRight, {
            kind: "arm",
            key: state.arms.key,
            color: state.palette.arms
          });
        }
      }
      if (!rebuilt.legs && this.#renderedPalette.legs !== state.palette.legs && !this.#setPieceColor(this.#legs, state.palette.legs)) {
        this.#renderPiece(this.#legs, {
          kind: "legs",
          key: state.legs.key,
          color: state.palette.legs
        });
      }
    }
    #shouldRenderPiece(renderedKey, nextKey, firstRender, changedSet, keyName) {
      if (firstRender) {
        return true;
      }
      if (renderedKey !== nextKey) {
        return true;
      }
      return changedSet.has(keyName);
    }
    #shouldRenderBody(state, firstRender, changedSet) {
      if (firstRender) {
        return true;
      }
      if (this.#renderedBodyKey !== state.body.key) {
        return true;
      }
      if (this.#renderedBodyHasEngine !== state.bodyHasEngine) {
        return true;
      }
      return changedSet.has("body");
    }
    #renderPiece(targetButton, options) {
      const { kind, key, color, isEngine = false } = options;
      const existingExhaust = kind === "body" ? targetButton.querySelector("#exhaust-container") : null;
      targetButton.innerHTML = "";
      targetButton.dataset.key = key;
      if (kind === "body") {
        targetButton.dataset.engine = isEngine ? "true" : "false";
      }
      const piece = document.createElement("div");
      piece.className = `robot-piece robot-piece-${kind} robot-${kind}-${key}`;
      piece.style.setProperty("--piece-color", color);
      if (kind === "body" && isEngine) {
        piece.classList.add("robot-body-engine");
      }
      this.#appendDetail(piece, kind, key);
      targetButton.appendChild(piece);
      if (existingExhaust) {
        targetButton.appendChild(existingExhaust);
      }
    }
    #appendDetail(piece, kind, key) {
      const detail = document.createElement("span");
      detail.className = `piece-detail piece-detail-${kind} piece-detail-${kind}-${key}`;
      piece.appendChild(detail);
      const detailSecondary = document.createElement("span");
      detailSecondary.className = `piece-detail-secondary piece-detail-secondary-${kind} piece-detail-secondary-${kind}-${key}`;
      piece.appendChild(detailSecondary);
    }
    #setPieceColor(targetButton, color) {
      const piece = targetButton.querySelector(".robot-piece");
      if (!piece) {
        return false;
      }
      piece.style.setProperty("--piece-color", color);
      return true;
    }
    #cacheRenderedState(state) {
      this.#hasRendered = true;
      this.#renderedHeadKey = state.head.key;
      this.#renderedBodyKey = state.body.key;
      this.#renderedArmsKey = state.arms.key;
      this.#renderedLegsKey = state.legs.key;
      this.#renderedBodyHasEngine = state.bodyHasEngine;
      this.#renderedPalette = {
        head: state.palette.head,
        body: state.palette.body,
        arms: state.palette.arms,
        legs: state.palette.legs
      };
      this.#renderedScale = state.scale;
    }
    #startHintLoop() {
      if (this.#hideHintInterval !== null) {
        clearInterval(this.#hideHintInterval);
      }
      const hintPulse = () => {
        if (!this.#hideSeekActive) {
          return;
        }
        this.#assembly.classList.add("robot-hint");
        if (this.#hideHintTimeout !== null) {
          clearTimeout(this.#hideHintTimeout);
        }
        this.#hideHintTimeout = setTimeout(() => {
          this.#assembly.classList.remove("robot-hint");
        }, HIDE_HINT_DURATION_MS);
      };
      this.#hideHintInterval = setInterval(hintPulse, HIDE_HINT_INTERVAL_MS);
    }
    #pickHideSpot(hideContext) {
      const candidates = hideContext.hideSpots ?? [];
      if (candidates.length > 0) {
        return candidates[this.#pickRandomIndex(candidates.length)];
      }
      const bounds = this.#computeBounds();
      const fallbackSpots = [
        { x: bounds.minX + 45, y: bounds.maxY - 12, peek: "right", occluderId: null },
        { x: bounds.maxX - 45, y: bounds.maxY - 10, peek: "left", occluderId: null },
        { x: 0, y: bounds.minY + 15, peek: "up", occluderId: null }
      ];
      return fallbackSpots[this.#pickRandomIndex(fallbackSpots.length)];
    }
    #pickRandomIndex(length) {
      if (length <= 1) {
        return 0;
      }
      if (this.#randomIndex) {
        const supplied = Number(this.#randomIndex(length));
        if (Number.isInteger(supplied) && supplied >= 0) {
          return supplied % length;
        }
      }
      const cryptoApi = globalThis.crypto;
      if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
        const max = Math.floor(4294967296 / length) * length;
        const values = new Uint32Array(1);
        do {
          cryptoApi.getRandomValues(values);
        } while (values[0] >= max);
        return values[0] % length;
      }
      return Math.floor(Math.random() * length);
    }
    #applyPeekClass(peek) {
      this.#assembly.classList.remove("robot-peek-left", "robot-peek-right", "robot-peek-up", "robot-peek-down");
      const direction = ["left", "right", "up", "down"].includes(peek) ? peek : "up";
      this.#assembly.classList.add(`robot-peek-${direction}`);
    }
    #applyMover(x, y) {
      this.#mover.style.transform = `translate(-50%, -50%) translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    }
    #computeBounds() {
      const width = this.#region.clientWidth;
      const height = this.#region.clientHeight;
      return {
        minX: -Math.max(70, width * 0.34),
        maxX: Math.max(70, width * 0.34),
        minY: -Math.max(65, height * 0.3),
        maxY: Math.max(24, height * 0.22)
      };
    }
  };

  // js/main.js
  function queryRequired(id) {
    const node = document.getElementById(id);
    if (!node) {
      throw new Error(`Missing element with id "${id}".`);
    }
    return node;
  }
  async function bootstrap() {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const nameService = new NameService();
    const robotModel = new RobotModel(bus, nameService);
    const gameModel = new GameModel(bus);
    const controlsView = new ControlsView(bus, queryRequired("controls"));
    const hudView = new HudView(bus, {
      nameButton: queryRequired("name-button"),
      nameText: queryRequired("name-text"),
      emotionButton: queryRequired("emotion-button"),
      emotionText: queryRequired("emotion-text"),
      hideSeekHud: queryRequired("hide-seek-hud"),
      timer: queryRequired("hide-seek-timer"),
      score: queryRequired("hide-seek-score"),
      toast: queryRequired("toast"),
      live: queryRequired("status-live")
    });
    const stageView = new StageView(bus, {
      region: queryRequired("stage-region"),
      mover: queryRequired("robot-mover"),
      dancer: queryRequired("robot-dancer"),
      assembly: queryRequired("robot-assembly"),
      head: queryRequired("part-head"),
      body: queryRequired("part-body"),
      armLeft: queryRequired("part-arm-left"),
      armRight: queryRequired("part-arm-right"),
      legs: queryRequired("part-legs")
    });
    const sceneService = new SceneService(queryRequired("scene-background"), queryRequired("scene-foreground"));
    const exhaustService = new ExhaustService(queryRequired("exhaust-container"));
    const audioService = new AudioService();
    const controller = new AppController({
      bus,
      robotModel,
      gameModel,
      sceneService,
      exhaustService,
      audioService,
      controlsView,
      hudView,
      stageView
    });
    controller.init();
    window.addEventListener("beforeunload", () => {
      controller.destroy();
    });
  }
  bootstrap().catch((error) => {
    const root = document.getElementById("app");
    if (root) {
      root.innerHTML = `<p style="padding:16px;color:#fecaca;background:#7f1d1d">Startup failed: ${error.message}</p>`;
    }
    console.error(error);
  });
})();
