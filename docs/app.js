(() => {
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // js/core/controls.js
  var CONTROL_DEFINITIONS = [
    { id: "type", action: "nextCharacterMode", label: "Type", icon: "icon-type", variant: "type" },
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
  var CHARACTER_MODES = Object.freeze(["robot", "astronaut", "dragon"]);
  function createPartList(keys) {
    return keys.map((key, variant) => ({ key, variant }));
  }
  function createBodyList(keys, engineKeys = []) {
    const engineSet = new Set(engineKeys);
    return keys.map((key, variant) => ({ key, variant, engine: engineSet.has(key) }));
  }
  var ROBOT_PART_CATALOG = Object.freeze({
    heads: createPartList([
      "cube",
      "bubble",
      "visor",
      "antenna",
      "cat",
      "crown",
      "helmet",
      "star",
      "cloud",
      "rocket",
      "owl",
      "donut",
      "frog",
      "tv",
      "dice",
      "beetle",
      "kite",
      "pumpkin"
    ]),
    bodies: createBodyList(
      [
        "chest",
        "tank",
        "shield",
        "orb",
        "speaker",
        "safe",
        "rocket",
        "gift",
        "engine",
        "jet",
        "arcade",
        "jelly",
        "backpack",
        "lantern",
        "teapot",
        "mailbox",
        "reactor",
        "sub"
      ],
      ["engine", "jet", "reactor", "sub"]
    ),
    arms: createPartList([
      "claw",
      "spring",
      "paddle",
      "wing",
      "mitt",
      "wand",
      "hook",
      "drum",
      "brush",
      "fan",
      "balloon",
      "ribbon",
      "grabber",
      "laser",
      "bubble",
      "trumpet",
      "noodle",
      "pixel"
    ]),
    legs: createPartList([
      "walker",
      "boots",
      "wheels",
      "treads",
      "hover",
      "springs",
      "stompers",
      "pogo",
      "skates",
      "paws",
      "spider",
      "stilts",
      "fins",
      "skis",
      "moon",
      "tentacle",
      "magnet",
      "rollers"
    ])
  });
  var ASTRONAUT_PART_CATALOG = Object.freeze({
    heads: createPartList([
      "eva",
      "ranger",
      "orbital",
      "starlens",
      "comms",
      "halo",
      "beacon",
      "cosmo",
      "visorx",
      "nebula",
      "cadet",
      "atlas",
      "quartz",
      "pilot",
      "satellite",
      "lumen",
      "eclipse",
      "zenith"
    ]),
    bodies: createBodyList(
      [
        "suit",
        "capsule",
        "shuttle",
        "cargo",
        "thruster",
        "orbiter",
        "lander",
        "booster",
        "reactor",
        "comet",
        "stasis",
        "astroforge",
        "plasma",
        "airstack",
        "gravity",
        "ion",
        "cosmopod",
        "warp"
      ],
      ["thruster", "orbiter", "booster", "warp"]
    ),
    arms: createPartList([
      "gauntlet",
      "scanner",
      "magclaw",
      "jetfin",
      "patch",
      "tractor",
      "hookline",
      "drone",
      "beaconarm",
      "flare",
      "holo",
      "relay",
      "grip",
      "laserhand",
      "bubbletool",
      "antennaarm",
      "coil",
      "pixelarm"
    ]),
    legs: createPartList([
      "moonboot",
      "thrusterboots",
      "gyro",
      "crawler",
      "hoverpad",
      "springstep",
      "crater",
      "probe",
      "skater",
      "pawguard",
      "spiderpod",
      "stiltpod",
      "finfoot",
      "skid",
      "lunar",
      "tentagrip",
      "maglock",
      "rollerpod"
    ])
  });
  var DRAGON_PART_CATALOG = Object.freeze({
    heads: createPartList([
      "wyrm",
      "spike",
      "ember",
      "scale",
      "jade",
      "crownhorn",
      "obsidian",
      "storm",
      "mist",
      "meteor",
      "elder",
      "fang",
      "toad",
      "rune",
      "gem",
      "beetlesnout",
      "kitewing",
      "gourd"
    ]),
    bodies: createBodyList(
      [
        "plate",
        "ridge",
        "carapace",
        "core",
        "drumfire",
        "vault",
        "comet",
        "hoard",
        "furnace",
        "jetflame",
        "totem",
        "slime",
        "saddle",
        "lanternbelly",
        "kettle",
        "mail",
        "volcano",
        "subscale"
      ],
      ["furnace", "jetflame", "volcano", "comet"]
    ),
    arms: createPartList([
      "talon",
      "coil",
      "paddleclaw",
      "wingclaw",
      "paw",
      "wandflame",
      "hooktalon",
      "drumbeater",
      "brushtail",
      "fanwing",
      "bubbleclaw",
      "ribbonscale",
      "grabtalon",
      "laserfang",
      "mistclaw",
      "trumphorn",
      "noodleclaw",
      "pixeltalon"
    ]),
    legs: createPartList([
      "stalker",
      "hoof",
      "wheelclaw",
      "track",
      "glide",
      "springclaw",
      "stomper",
      "pogohoof",
      "skateclaw",
      "pawpad",
      "spiderclaw",
      "stiltclaw",
      "finclaw",
      "skiclaw",
      "moonclaw",
      "tentaclaw",
      "magnethoof",
      "rollerclaw"
    ])
  });
  var PART_CATALOGS_BY_MODE = Object.freeze({
    robot: ROBOT_PART_CATALOG,
    astronaut: ASTRONAUT_PART_CATALOG,
    dragon: DRAGON_PART_CATALOG
  });
  var PART_CATALOG = PART_CATALOGS_BY_MODE.robot;

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
  var _sceneService, _stageView, _hudView, _controlsView, _audioService, _hideContext;
  var GameFlowCoordinator = class {
    constructor({ sceneService, stageView, hudView, controlsView, audioService }) {
      __privateAdd(this, _sceneService);
      __privateAdd(this, _stageView);
      __privateAdd(this, _hudView);
      __privateAdd(this, _controlsView);
      __privateAdd(this, _audioService);
      __privateAdd(this, _hideContext, { hideSpots: [], occluderIds: [] });
      __privateSet(this, _sceneService, sceneService);
      __privateSet(this, _stageView, stageView);
      __privateSet(this, _hudView, hudView);
      __privateSet(this, _controlsView, controlsView);
      __privateSet(this, _audioService, audioService);
    }
    renderInitialScene(gameState) {
      __privateSet(this, _hideContext, __privateGet(this, _sceneService).render(gameState.theme));
      return __privateGet(this, _hideContext);
    }
    get hideContext() {
      return __privateGet(this, _hideContext);
    }
    handleThemeChanged(gameState) {
      __privateSet(this, _hideContext, __privateGet(this, _sceneService).render(gameState.theme));
      __privateGet(this, _hudView).announce(`Theme changed to ${gameState.theme}.`);
    }
    handleMoveChanged(gameState, hooks) {
      __privateGet(this, _controlsView).setMoveActive(gameState.isMoving);
      if (gameState.isMoving) {
        hooks.startMovementLoop();
      } else {
        hooks.stopMovementLoop();
      }
      hooks.syncMotionState(gameState);
    }
    handleDanceChanged(gameState, hooks) {
      __privateGet(this, _controlsView).setDanceActive(gameState.isDancing);
      if (gameState.isDancing) {
        __privateGet(this, _audioService).startMusic();
        __privateGet(this, _audioService).speak(`${gameState.dance.name} dance.`);
      } else {
        __privateGet(this, _audioService).stopMusic();
      }
      hooks.syncMotionState(gameState);
    }
    handleHideSeekStart(gameState, hooks) {
      __privateGet(this, _controlsView).setHideSeekActive(true);
      __privateGet(this, _hudView).renderHideSeek(true, gameState.hideSeek.secondsLeft, gameState.hideSeek.score);
      __privateGet(this, _hudView).announce("Hide and seek started. Find the robot.");
      __privateGet(this, _hudView).showToast("Find the robot");
      __privateGet(this, _audioService).playClick();
      __privateGet(this, _audioService).speak("Can you find me?");
      __privateGet(this, _stageView).beginHideSeek(__privateGet(this, _hideContext));
      hooks.startHideSeekLoop();
    }
    handleHideSeekTick(gameState) {
      __privateGet(this, _hudView).renderHideSeek(true, gameState.hideSeek.secondsLeft, gameState.hideSeek.score);
    }
    handleHideSeekFound(gameState) {
      __privateGet(this, _hudView).showToast(`Found. Score ${gameState.hideSeek.score}`);
      __privateGet(this, _audioService).playSuccess();
      __privateGet(this, _audioService).speak("You found me.");
    }
    handleHideSeekTimeout() {
      __privateGet(this, _hudView).showToast("Time is up");
      __privateGet(this, _audioService).playClick();
      __privateGet(this, _audioService).speak("Time is up.");
    }
    handleHideSeekEnd(gameState, reason, hooks) {
      __privateGet(this, _controlsView).setHideSeekActive(false);
      __privateGet(this, _hudView).renderHideSeek(false, gameState.hideSeek.secondsLeft, gameState.hideSeek.score);
      __privateGet(this, _stageView).endHideSeek();
      hooks.stopHideSeekLoop();
      if (reason === "cancel") {
        __privateGet(this, _hudView).showToast("Hide and seek canceled", 1200);
        __privateGet(this, _audioService).playClick();
      }
    }
  };
  _sceneService = new WeakMap();
  _stageView = new WeakMap();
  _hudView = new WeakMap();
  _controlsView = new WeakMap();
  _audioService = new WeakMap();
  _hideContext = new WeakMap();

  // js/controllers/coordinators/RobotSyncCoordinator.js
  var DEFAULT_VISUAL_KEYS = /* @__PURE__ */ new Set(["characterMode", "head", "body", "arms", "legs", "palette", "scale"]);
  var _stageView2, _uiSync, _exhaustService, _visualKeys;
  var RobotSyncCoordinator = class {
    constructor({ stageView, uiSync, exhaustService, visualKeys = DEFAULT_VISUAL_KEYS }) {
      __privateAdd(this, _stageView2);
      __privateAdd(this, _uiSync);
      __privateAdd(this, _exhaustService);
      __privateAdd(this, _visualKeys);
      __privateSet(this, _stageView2, stageView);
      __privateSet(this, _uiSync, uiSync);
      __privateSet(this, _exhaustService, exhaustService);
      __privateSet(this, _visualKeys, visualKeys);
    }
    handleRobotChanged(robotState, changed, gameState) {
      if (this.hasVisualChange(changed)) {
        __privateGet(this, _stageView2).applyRobotChanges(robotState, changed);
      }
      __privateGet(this, _uiSync).renderRobotIdentity(robotState, changed);
      this.syncExhaust(robotState, gameState);
    }
    hasVisualChange(changed) {
      return changed.some((key) => __privateGet(this, _visualKeys).has(key));
    }
    syncExhaust(robotState, gameState) {
      __privateGet(this, _exhaustService).setEnabled(robotState.bodyHasEngine);
      if (!robotState.bodyHasEngine) {
        __privateGet(this, _exhaustService).setMode("off");
        return;
      }
      __privateGet(this, _exhaustService).setMode(gameState.isDancing ? "fire" : "smoke");
    }
  };
  _stageView2 = new WeakMap();
  _uiSync = new WeakMap();
  _exhaustService = new WeakMap();
  _visualKeys = new WeakMap();

  // js/controllers/coordinators/UiSyncCoordinator.js
  var _controlsView2, _hudView2, _stageView3, _UiSyncCoordinator_instances, callLifecycle_fn;
  var UiSyncCoordinator = class {
    constructor({ controlsView, hudView, stageView }) {
      __privateAdd(this, _UiSyncCoordinator_instances);
      __privateAdd(this, _controlsView2);
      __privateAdd(this, _hudView2);
      __privateAdd(this, _stageView3);
      __privateSet(this, _controlsView2, controlsView);
      __privateSet(this, _hudView2, hudView);
      __privateSet(this, _stageView3, stageView);
    }
    initialize() {
      __privateMethod(this, _UiSyncCoordinator_instances, callLifecycle_fn).call(this, "init");
      __privateMethod(this, _UiSyncCoordinator_instances, callLifecycle_fn).call(this, "mount");
    }
    destroy() {
      __privateMethod(this, _UiSyncCoordinator_instances, callLifecycle_fn).call(this, "unmount");
      __privateMethod(this, _UiSyncCoordinator_instances, callLifecycle_fn).call(this, "destroy");
    }
    renderInitial(robotState, gameState) {
      __privateGet(this, _stageView3).render(robotState);
      __privateGet(this, _hudView2).renderName(robotState.name);
      __privateGet(this, _hudView2).renderEmotion(robotState.emotion);
      __privateGet(this, _hudView2).renderHideSeek(gameState.hideSeek.active, gameState.hideSeek.secondsLeft, gameState.hideSeek.score);
      this.syncControls(gameState);
      this.syncMotionState(gameState);
    }
    renderRobotIdentity(robotState, changed) {
      if (changed.includes("name")) {
        __privateGet(this, _hudView2).renderName(robotState.name);
      }
      if (changed.includes("emotion")) {
        __privateGet(this, _hudView2).renderEmotion(robotState.emotion);
      }
    }
    syncControls(gameState) {
      __privateGet(this, _controlsView2).setMoveActive(gameState.isMoving);
      __privateGet(this, _controlsView2).setDanceActive(gameState.isDancing);
      __privateGet(this, _controlsView2).setHideSeekActive(gameState.hideSeek.active);
    }
    syncMotionState(gameState) {
      __privateGet(this, _stageView3).setMotionState({
        isMoving: gameState.isMoving,
        danceClass: gameState.isDancing ? gameState.dance.cssClass : null
      });
    }
  };
  _controlsView2 = new WeakMap();
  _hudView2 = new WeakMap();
  _stageView3 = new WeakMap();
  _UiSyncCoordinator_instances = new WeakSet();
  callLifecycle_fn = function(method) {
    [__privateGet(this, _controlsView2), __privateGet(this, _hudView2), __privateGet(this, _stageView3)].forEach((view) => {
      if (typeof view[method] === "function") {
        view[method]();
      }
    });
  };

  // js/controllers/AppController.js
  var _bus, _robotModel, _gameModel, _audioService2, _exhaustService2, _stageView4, _hudView3, _uiSync2, _robotSync, _gameFlow, _listeners, _latestRobotState, _latestGameState, _moveInterval, _hideSeekInterval, _AppController_instances, wireEvents_fn, handleAction_fn, startMovementLoop_fn, stopMovementLoop_fn, startHideSeekLoop_fn, stopHideSeekLoop_fn, on_fn, offAll_fn;
  var AppController = class {
    constructor(dependencies) {
      __privateAdd(this, _AppController_instances);
      __privateAdd(this, _bus);
      __privateAdd(this, _robotModel);
      __privateAdd(this, _gameModel);
      __privateAdd(this, _audioService2);
      __privateAdd(this, _exhaustService2);
      __privateAdd(this, _stageView4);
      __privateAdd(this, _hudView3);
      __privateAdd(this, _uiSync2);
      __privateAdd(this, _robotSync);
      __privateAdd(this, _gameFlow);
      __privateAdd(this, _listeners, []);
      __privateAdd(this, _latestRobotState, null);
      __privateAdd(this, _latestGameState, null);
      __privateAdd(this, _moveInterval, null);
      __privateAdd(this, _hideSeekInterval, null);
      __privateSet(this, _bus, dependencies.bus);
      __privateSet(this, _robotModel, dependencies.robotModel);
      __privateSet(this, _gameModel, dependencies.gameModel);
      __privateSet(this, _audioService2, dependencies.audioService);
      __privateSet(this, _exhaustService2, dependencies.exhaustService);
      __privateSet(this, _stageView4, dependencies.stageView);
      __privateSet(this, _hudView3, dependencies.hudView);
      __privateSet(this, _uiSync2, new UiSyncCoordinator({
        controlsView: dependencies.controlsView,
        hudView: dependencies.hudView,
        stageView: dependencies.stageView
      }));
      __privateSet(this, _robotSync, new RobotSyncCoordinator({
        stageView: dependencies.stageView,
        uiSync: __privateGet(this, _uiSync2),
        exhaustService: dependencies.exhaustService
      }));
      __privateSet(this, _gameFlow, new GameFlowCoordinator({
        sceneService: dependencies.sceneService,
        stageView: dependencies.stageView,
        hudView: dependencies.hudView,
        controlsView: dependencies.controlsView,
        audioService: dependencies.audioService
      }));
    }
    init() {
      __privateGet(this, _uiSync2).initialize();
      __privateMethod(this, _AppController_instances, wireEvents_fn).call(this);
      const gameState = __privateGet(this, _gameModel).snapshot;
      const robotState = __privateGet(this, _robotModel).snapshot;
      __privateSet(this, _latestGameState, gameState);
      __privateSet(this, _latestRobotState, robotState);
      __privateGet(this, _gameFlow).renderInitialScene(gameState);
      __privateGet(this, _uiSync2).renderInitial(robotState, gameState);
      __privateGet(this, _robotSync).syncExhaust(robotState, gameState);
    }
    destroy() {
      __privateMethod(this, _AppController_instances, stopMovementLoop_fn).call(this);
      __privateMethod(this, _AppController_instances, stopHideSeekLoop_fn).call(this);
      __privateMethod(this, _AppController_instances, offAll_fn).call(this);
      __privateGet(this, _uiSync2).destroy();
      __privateGet(this, _audioService2).destroy();
      __privateGet(this, _exhaustService2).destroy();
    }
  };
  _bus = new WeakMap();
  _robotModel = new WeakMap();
  _gameModel = new WeakMap();
  _audioService2 = new WeakMap();
  _exhaustService2 = new WeakMap();
  _stageView4 = new WeakMap();
  _hudView3 = new WeakMap();
  _uiSync2 = new WeakMap();
  _robotSync = new WeakMap();
  _gameFlow = new WeakMap();
  _listeners = new WeakMap();
  _latestRobotState = new WeakMap();
  _latestGameState = new WeakMap();
  _moveInterval = new WeakMap();
  _hideSeekInterval = new WeakMap();
  _AppController_instances = new WeakSet();
  wireEvents_fn = function() {
    __privateMethod(this, _AppController_instances, on_fn).call(this, UI_EVENTS.PART_CYCLE, (event) => {
      __privateGet(this, _audioService2).playBoing();
      __privateGet(this, _robotModel).cyclePart(event.detail.part);
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, UI_EVENTS.NAME_CYCLE, () => {
      __privateGet(this, _audioService2).playClick();
      __privateGet(this, _robotModel).nextName();
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, UI_EVENTS.EMOTION_CYCLE, () => {
      __privateGet(this, _audioService2).playClick();
      __privateGet(this, _robotModel).cycleEmotion();
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, UI_EVENTS.HIDE_SEEK_FOUND, () => {
      __privateGet(this, _gameModel).markHideSeekFound();
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, UI_EVENTS.ACTION, (event) => {
      __privateMethod(this, _AppController_instances, handleAction_fn).call(this, event.detail.action);
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, ROBOT_EVENTS.CHANGED, (event) => {
      var _a;
      const state = event.detail.state;
      const changed = Array.isArray(event.detail.changed) ? event.detail.changed : [];
      __privateSet(this, _latestRobotState, state);
      __privateGet(this, _robotSync).handleRobotChanged(state, changed, (_a = __privateGet(this, _latestGameState)) != null ? _a : __privateGet(this, _gameModel).snapshot);
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, GAME_EVENTS.THEME, (event) => {
      const state = event.detail.state;
      __privateSet(this, _latestGameState, state);
      __privateGet(this, _gameFlow).handleThemeChanged(state);
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, GAME_EVENTS.MOVE, (event) => {
      var _a;
      const state = event.detail.state;
      __privateSet(this, _latestGameState, state);
      __privateGet(this, _gameFlow).handleMoveChanged(state, {
        startMovementLoop: () => __privateMethod(this, _AppController_instances, startMovementLoop_fn).call(this),
        stopMovementLoop: () => __privateMethod(this, _AppController_instances, stopMovementLoop_fn).call(this),
        syncMotionState: (nextState) => __privateGet(this, _uiSync2).syncMotionState(nextState)
      });
      __privateGet(this, _robotSync).syncExhaust((_a = __privateGet(this, _latestRobotState)) != null ? _a : __privateGet(this, _robotModel).snapshot, state);
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, GAME_EVENTS.DANCE, (event) => {
      var _a;
      const state = event.detail.state;
      __privateSet(this, _latestGameState, state);
      __privateGet(this, _gameFlow).handleDanceChanged(state, {
        syncMotionState: (nextState) => __privateGet(this, _uiSync2).syncMotionState(nextState)
      });
      __privateGet(this, _robotSync).syncExhaust((_a = __privateGet(this, _latestRobotState)) != null ? _a : __privateGet(this, _robotModel).snapshot, state);
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, GAME_EVENTS.HIDE_SEEK_START, (event) => {
      const state = event.detail.state;
      __privateSet(this, _latestGameState, state);
      __privateGet(this, _gameFlow).handleHideSeekStart(state, {
        startHideSeekLoop: () => __privateMethod(this, _AppController_instances, startHideSeekLoop_fn).call(this)
      });
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, GAME_EVENTS.HIDE_SEEK_TICK, (event) => {
      const state = event.detail.state;
      __privateSet(this, _latestGameState, state);
      __privateGet(this, _gameFlow).handleHideSeekTick(state);
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, GAME_EVENTS.HIDE_SEEK_FOUND, (event) => {
      const state = event.detail.state;
      __privateSet(this, _latestGameState, state);
      __privateGet(this, _gameFlow).handleHideSeekFound(state);
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, GAME_EVENTS.HIDE_SEEK_TIMEOUT, (event) => {
      __privateSet(this, _latestGameState, event.detail.state);
      __privateGet(this, _gameFlow).handleHideSeekTimeout();
    });
    __privateMethod(this, _AppController_instances, on_fn).call(this, GAME_EVENTS.HIDE_SEEK_END, (event) => {
      const state = event.detail.state;
      __privateSet(this, _latestGameState, state);
      __privateGet(this, _gameFlow).handleHideSeekEnd(state, event.detail.reason, {
        stopHideSeekLoop: () => __privateMethod(this, _AppController_instances, stopHideSeekLoop_fn).call(this)
      });
    });
  };
  handleAction_fn = function(action) {
    var _a, _b, _c, _d;
    switch (action) {
      case "nextCharacterMode":
        __privateGet(this, _audioService2).playSuccess();
        __privateGet(this, _robotModel).nextCharacterMode();
        {
          const mode = ((_a = __privateGet(this, _latestRobotState)) != null ? _a : __privateGet(this, _robotModel).snapshot).characterMode;
          const modeLabel = mode.charAt(0).toUpperCase() + mode.slice(1);
          __privateGet(this, _hudView3).showToast(`Type: ${modeLabel}`);
          __privateGet(this, _audioService2).speak(modeLabel);
        }
        break;
      case "nextTheme":
        __privateGet(this, _audioService2).playSuccess();
        __privateGet(this, _gameModel).nextTheme();
        __privateGet(this, _audioService2).speak((_c = (_b = __privateGet(this, _latestGameState)) == null ? void 0 : _b.theme) != null ? _c : __privateGet(this, _gameModel).snapshot.theme);
        break;
      case "nextPalette":
        __privateGet(this, _audioService2).playSuccess();
        __privateGet(this, _robotModel).nextPalette();
        __privateGet(this, _hudView3).showToast("Color palette changed", 1200);
        break;
      case "nextSize":
        __privateGet(this, _audioService2).playBoing();
        __privateGet(this, _robotModel).setScalePreset();
        __privateGet(this, _hudView3).showToast("Size changed", 1100);
        break;
      case "randomize":
        __privateGet(this, _audioService2).playSuccess();
        __privateGet(this, _robotModel).randomize();
        __privateGet(this, _stageView4).resetPosition();
        __privateGet(this, _hudView3).showToast("Mixed all parts");
        __privateGet(this, _audioService2).speak("Super mix.");
        break;
      case "toggleMove":
        __privateGet(this, _audioService2).playClick();
        __privateGet(this, _gameModel).toggleMove();
        break;
      case "toggleDance":
        __privateGet(this, _audioService2).playClick();
        __privateGet(this, _gameModel).toggleDance();
        break;
      case "toggleHideSeek":
        if (((_d = __privateGet(this, _latestGameState)) != null ? _d : __privateGet(this, _gameModel).snapshot).hideSeek.active) {
          __privateGet(this, _gameModel).cancelHideSeek();
        } else {
          __privateGet(this, _gameModel).startHideSeek();
        }
        break;
      default:
        break;
    }
  };
  startMovementLoop_fn = function() {
    __privateMethod(this, _AppController_instances, stopMovementLoop_fn).call(this);
    __privateGet(this, _stageView4).stepMovement();
    __privateSet(this, _moveInterval, setInterval(() => {
      __privateGet(this, _stageView4).stepMovement();
    }, MOVE_STEP_MS));
  };
  stopMovementLoop_fn = function() {
    if (__privateGet(this, _moveInterval) !== null) {
      clearInterval(__privateGet(this, _moveInterval));
      __privateSet(this, _moveInterval, null);
    }
  };
  startHideSeekLoop_fn = function() {
    __privateMethod(this, _AppController_instances, stopHideSeekLoop_fn).call(this);
    __privateSet(this, _hideSeekInterval, setInterval(() => {
      __privateGet(this, _gameModel).tickHideSeek();
    }, 1e3));
  };
  stopHideSeekLoop_fn = function() {
    if (__privateGet(this, _hideSeekInterval) !== null) {
      clearInterval(__privateGet(this, _hideSeekInterval));
      __privateSet(this, _hideSeekInterval, null);
    }
  };
  on_fn = function(type, handler) {
    __privateGet(this, _bus).on(type, handler);
    __privateGet(this, _listeners).push({ type, handler });
  };
  offAll_fn = function() {
    __privateGet(this, _listeners).forEach(({ type, handler }) => {
      __privateGet(this, _bus).off(type, handler);
    });
    __privateSet(this, _listeners, []);
  };

  // js/core/EventBus.js
  var _target, _allowedTypes, _EventBus_instances, normalizeAllowedTypes_fn, assertKnownType_fn;
  var EventBus = class {
    constructor(options = {}) {
      __privateAdd(this, _EventBus_instances);
      __privateAdd(this, _target);
      __privateAdd(this, _allowedTypes);
      __privateSet(this, _target, new EventTarget());
      __privateSet(this, _allowedTypes, __privateMethod(this, _EventBus_instances, normalizeAllowedTypes_fn).call(this, options.allowedTypes));
    }
    on(type, handler, options) {
      __privateMethod(this, _EventBus_instances, assertKnownType_fn).call(this, type);
      __privateGet(this, _target).addEventListener(type, handler, options);
    }
    off(type, handler, options) {
      __privateMethod(this, _EventBus_instances, assertKnownType_fn).call(this, type);
      __privateGet(this, _target).removeEventListener(type, handler, options);
    }
    emit(type, detail = {}) {
      __privateMethod(this, _EventBus_instances, assertKnownType_fn).call(this, type);
      __privateGet(this, _target).dispatchEvent(new CustomEvent(type, { detail }));
    }
  };
  _target = new WeakMap();
  _allowedTypes = new WeakMap();
  _EventBus_instances = new WeakSet();
  normalizeAllowedTypes_fn = function(allowedTypes) {
    if (!allowedTypes) {
      return null;
    }
    const normalized = Array.isArray(allowedTypes) ? allowedTypes : Array.from(allowedTypes);
    return new Set(normalized);
  };
  assertKnownType_fn = function(type) {
    if (typeof type !== "string" || type.length === 0) {
      throw new Error("Event type must be a non-empty string.");
    }
    if (!__privateGet(this, _allowedTypes) || __privateGet(this, _allowedTypes).has(type)) {
      return;
    }
    throw new Error(`Unknown event type "${type}". Add it to js/core/events.js before use.`);
  };

  // js/domain/GameModel.js
  var _bus2, _themeIndex, _danceIndex, _isMoving, _isDancing, _hideSeek;
  var GameModel = class {
    constructor(bus) {
      __privateAdd(this, _bus2);
      __privateAdd(this, _themeIndex, 0);
      __privateAdd(this, _danceIndex, 0);
      __privateAdd(this, _isMoving, false);
      __privateAdd(this, _isDancing, false);
      __privateAdd(this, _hideSeek, {
        active: false,
        secondsLeft: HIDE_SEEK_SECONDS,
        score: 0
      });
      __privateSet(this, _bus2, bus);
    }
    get snapshot() {
      return {
        themeIndex: __privateGet(this, _themeIndex),
        theme: THEMES[__privateGet(this, _themeIndex)],
        danceIndex: __privateGet(this, _danceIndex),
        dance: DANCE_STYLES[__privateGet(this, _danceIndex)],
        isMoving: __privateGet(this, _isMoving),
        isDancing: __privateGet(this, _isDancing),
        hideSeek: { ...__privateGet(this, _hideSeek) }
      };
    }
    nextTheme() {
      __privateSet(this, _themeIndex, (__privateGet(this, _themeIndex) + 1) % THEMES.length);
      __privateGet(this, _bus2).emit(GAME_EVENTS.THEME, { state: this.snapshot });
    }
    toggleMove() {
      __privateSet(this, _isMoving, !__privateGet(this, _isMoving));
      __privateGet(this, _bus2).emit(GAME_EVENTS.MOVE, { state: this.snapshot });
    }
    toggleDance() {
      if (__privateGet(this, _isDancing)) {
        __privateSet(this, _isDancing, false);
        __privateGet(this, _bus2).emit(GAME_EVENTS.DANCE, { state: this.snapshot });
        return;
      }
      __privateSet(this, _danceIndex, (__privateGet(this, _danceIndex) + 1) % DANCE_STYLES.length);
      __privateSet(this, _isDancing, true);
      __privateGet(this, _bus2).emit(GAME_EVENTS.DANCE, { state: this.snapshot });
    }
    startHideSeek() {
      if (__privateGet(this, _hideSeek).active) {
        return false;
      }
      __privateSet(this, _hideSeek, {
        ...__privateGet(this, _hideSeek),
        active: true,
        secondsLeft: HIDE_SEEK_SECONDS
      });
      __privateGet(this, _bus2).emit(GAME_EVENTS.HIDE_SEEK_START, { state: this.snapshot });
      return true;
    }
    cancelHideSeek() {
      if (!__privateGet(this, _hideSeek).active) {
        return false;
      }
      __privateSet(this, _hideSeek, {
        ...__privateGet(this, _hideSeek),
        active: false,
        secondsLeft: HIDE_SEEK_SECONDS
      });
      __privateGet(this, _bus2).emit(GAME_EVENTS.HIDE_SEEK_END, { state: this.snapshot, reason: "cancel" });
      return true;
    }
    markHideSeekFound() {
      if (!__privateGet(this, _hideSeek).active) {
        return false;
      }
      __privateSet(this, _hideSeek, {
        ...__privateGet(this, _hideSeek),
        active: false,
        secondsLeft: HIDE_SEEK_SECONDS,
        score: __privateGet(this, _hideSeek).score + 1
      });
      __privateGet(this, _bus2).emit(GAME_EVENTS.HIDE_SEEK_FOUND, { state: this.snapshot });
      __privateGet(this, _bus2).emit(GAME_EVENTS.HIDE_SEEK_END, { state: this.snapshot, reason: "found" });
      return true;
    }
    tickHideSeek() {
      if (!__privateGet(this, _hideSeek).active) {
        return;
      }
      const secondsLeft = __privateGet(this, _hideSeek).secondsLeft - 1;
      __privateSet(this, _hideSeek, {
        ...__privateGet(this, _hideSeek),
        secondsLeft
      });
      __privateGet(this, _bus2).emit(GAME_EVENTS.HIDE_SEEK_TICK, { state: this.snapshot });
      if (secondsLeft <= 0) {
        __privateSet(this, _hideSeek, {
          ...__privateGet(this, _hideSeek),
          active: false,
          secondsLeft: HIDE_SEEK_SECONDS
        });
        __privateGet(this, _bus2).emit(GAME_EVENTS.HIDE_SEEK_TIMEOUT, { state: this.snapshot });
        __privateGet(this, _bus2).emit(GAME_EVENTS.HIDE_SEEK_END, { state: this.snapshot, reason: "timeout" });
      }
    }
  };
  _bus2 = new WeakMap();
  _themeIndex = new WeakMap();
  _danceIndex = new WeakMap();
  _isMoving = new WeakMap();
  _isDancing = new WeakMap();
  _hideSeek = new WeakMap();

  // js/domain/RobotModel.js
  var PART_KEYS = Object.freeze(["head", "body", "arms", "legs"]);
  var PART_COLLECTION_BY_KEY = Object.freeze({
    head: "heads",
    body: "bodies",
    arms: "arms",
    legs: "legs"
  });
  function createPartIndexes() {
    return {
      head: 0,
      body: 0,
      arms: 0,
      legs: 0
    };
  }
  function createModeIndexes() {
    const indexes = {};
    CHARACTER_MODES.forEach((mode) => {
      indexes[mode] = createPartIndexes();
    });
    return indexes;
  }
  var _bus3, _nameService, _modeIndex, _modePartIndexes, _emotionIndex, _paletteIndex, _scaleIndex, _name, _RobotModel_instances, emit_fn, activeMode_get, activeCatalog_get, activeModePartIndexes_get;
  var RobotModel = class {
    constructor(bus, nameService) {
      __privateAdd(this, _RobotModel_instances);
      __privateAdd(this, _bus3);
      __privateAdd(this, _nameService);
      __privateAdd(this, _modeIndex, 0);
      __privateAdd(this, _modePartIndexes, createModeIndexes());
      __privateAdd(this, _emotionIndex, 0);
      __privateAdd(this, _paletteIndex, 0);
      __privateAdd(this, _scaleIndex, 2);
      __privateAdd(this, _name);
      __privateSet(this, _bus3, bus);
      __privateSet(this, _nameService, nameService);
      __privateSet(this, _name, __privateGet(this, _nameService).next());
    }
    get snapshot() {
      const characterMode = __privateGet(this, _RobotModel_instances, activeMode_get);
      const catalog = __privateGet(this, _RobotModel_instances, activeCatalog_get);
      const indexes = __privateGet(this, _RobotModel_instances, activeModePartIndexes_get);
      return {
        characterMode,
        headIndex: indexes.head,
        bodyIndex: indexes.body,
        armsIndex: indexes.arms,
        legsIndex: indexes.legs,
        emotionIndex: __privateGet(this, _emotionIndex),
        paletteIndex: __privateGet(this, _paletteIndex),
        scale: SCALE_PRESETS[__privateGet(this, _scaleIndex)],
        name: __privateGet(this, _name),
        emotion: EMOTIONS[__privateGet(this, _emotionIndex)],
        palette: PALETTES[__privateGet(this, _paletteIndex)],
        bodyHasEngine: this.isEngineBody(),
        body: catalog.bodies[indexes.body],
        head: catalog.heads[indexes.head],
        arms: catalog.arms[indexes.arms],
        legs: catalog.legs[indexes.legs]
      };
    }
    cyclePart(part) {
      if (!PART_KEYS.includes(part)) {
        return;
      }
      const partIndexes = __privateGet(this, _RobotModel_instances, activeModePartIndexes_get);
      const catalog = __privateGet(this, _RobotModel_instances, activeCatalog_get);
      partIndexes[part] = (partIndexes[part] + 1) % catalog[PART_COLLECTION_BY_KEY[part]].length;
      __privateMethod(this, _RobotModel_instances, emit_fn).call(this, [part]);
    }
    cycleEmotion() {
      __privateSet(this, _emotionIndex, (__privateGet(this, _emotionIndex) + 1) % EMOTIONS.length);
      __privateMethod(this, _RobotModel_instances, emit_fn).call(this, ["emotion"]);
    }
    nextName() {
      __privateSet(this, _name, __privateGet(this, _nameService).next());
      __privateMethod(this, _RobotModel_instances, emit_fn).call(this, ["name"]);
    }
    randomize() {
      const partIndexes = __privateGet(this, _RobotModel_instances, activeModePartIndexes_get);
      const catalog = __privateGet(this, _RobotModel_instances, activeCatalog_get);
      partIndexes.head = Math.floor(Math.random() * catalog.heads.length);
      partIndexes.body = Math.floor(Math.random() * catalog.bodies.length);
      partIndexes.arms = Math.floor(Math.random() * catalog.arms.length);
      partIndexes.legs = Math.floor(Math.random() * catalog.legs.length);
      __privateSet(this, _emotionIndex, Math.floor(Math.random() * EMOTIONS.length));
      __privateSet(this, _paletteIndex, Math.floor(Math.random() * PALETTES.length));
      __privateSet(this, _scaleIndex, Math.floor(Math.random() * SCALE_PRESETS.length));
      __privateSet(this, _name, __privateGet(this, _nameService).next());
      __privateMethod(this, _RobotModel_instances, emit_fn).call(this, ["head", "body", "arms", "legs", "emotion", "palette", "scale", "name"]);
    }
    nextCharacterMode() {
      __privateSet(this, _modeIndex, (__privateGet(this, _modeIndex) + 1) % CHARACTER_MODES.length);
      __privateMethod(this, _RobotModel_instances, emit_fn).call(this, ["characterMode", "head", "body", "arms", "legs"]);
    }
    nextPalette() {
      __privateSet(this, _paletteIndex, (__privateGet(this, _paletteIndex) + 1) % PALETTES.length);
      __privateMethod(this, _RobotModel_instances, emit_fn).call(this, ["palette"]);
    }
    setScalePreset() {
      __privateSet(this, _scaleIndex, (__privateGet(this, _scaleIndex) + 1) % SCALE_PRESETS.length);
      __privateMethod(this, _RobotModel_instances, emit_fn).call(this, ["scale"]);
    }
    isEngineBody() {
      const catalog = __privateGet(this, _RobotModel_instances, activeCatalog_get);
      return Boolean(catalog.bodies[__privateGet(this, _RobotModel_instances, activeModePartIndexes_get).body].engine);
    }
  };
  _bus3 = new WeakMap();
  _nameService = new WeakMap();
  _modeIndex = new WeakMap();
  _modePartIndexes = new WeakMap();
  _emotionIndex = new WeakMap();
  _paletteIndex = new WeakMap();
  _scaleIndex = new WeakMap();
  _name = new WeakMap();
  _RobotModel_instances = new WeakSet();
  emit_fn = function(changed) {
    __privateGet(this, _bus3).emit(ROBOT_EVENTS.CHANGED, {
      changed,
      state: this.snapshot
    });
  };
  activeMode_get = function() {
    return CHARACTER_MODES[__privateGet(this, _modeIndex)];
  };
  activeCatalog_get = function() {
    return PART_CATALOGS_BY_MODE[__privateGet(this, _RobotModel_instances, activeMode_get)];
  };
  activeModePartIndexes_get = function() {
    return __privateGet(this, _modePartIndexes)[__privateGet(this, _RobotModel_instances, activeMode_get)];
  };

  // js/services/AudioService.js
  var _contextFactory, _speech, _speechLang, _selectedVoiceName, _selectedVoiceLang, _context, _masterGain, _musicTimer, _isMusicPlaying, _step, _nextTime, _tempo, _AudioService_instances, ensureContext_fn, playTone_fn, scheduleBeat_fn, kick_fn, snare_fn, hihat_fn, bass_fn, pickSpeechVoice_fn, voiceRank_fn, schedule_fn;
  var AudioService = class {
    constructor(options = {}) {
      __privateAdd(this, _AudioService_instances);
      __privateAdd(this, _contextFactory);
      __privateAdd(this, _speech);
      __privateAdd(this, _speechLang, "en-US");
      __privateAdd(this, _selectedVoiceName, null);
      __privateAdd(this, _selectedVoiceLang, null);
      __privateAdd(this, _context, null);
      __privateAdd(this, _masterGain, null);
      __privateAdd(this, _musicTimer, null);
      __privateAdd(this, _isMusicPlaying, false);
      __privateAdd(this, _step, 0);
      __privateAdd(this, _nextTime, 0);
      __privateAdd(this, _tempo, 124);
      var _a, _b;
      __privateSet(this, _contextFactory, (_a = options.audioContextFactory) != null ? _a : (() => {
        if (typeof window === "undefined") {
          return null;
        }
        const Ctx = window.AudioContext || window.webkitAudioContext;
        return Ctx ? new Ctx() : null;
      }));
      __privateSet(this, _speech, (_b = options.speech) != null ? _b : typeof window !== "undefined" ? window.speechSynthesis : null);
      if (typeof options.speechLang === "string" && options.speechLang.trim()) {
        __privateSet(this, _speechLang, options.speechLang);
      }
    }
    playClick() {
      __privateMethod(this, _AudioService_instances, playTone_fn).call(this, {
        type: "square",
        frequency: 640,
        frequencyEnd: 420,
        duration: 0.08,
        gain: 0.07
      });
    }
    playBoing() {
      __privateMethod(this, _AudioService_instances, playTone_fn).call(this, {
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
        __privateMethod(this, _AudioService_instances, schedule_fn).call(this, () => {
          __privateMethod(this, _AudioService_instances, playTone_fn).call(this, {
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
      __privateMethod(this, _AudioService_instances, playTone_fn).call(this, {
        type: "triangle",
        frequency: 300,
        frequencyEnd: 220,
        duration: 0.12,
        gain: 0.04,
        ramp: "linear"
      });
    }
    startMusic() {
      if (__privateGet(this, _isMusicPlaying)) {
        return;
      }
      const ctx = __privateMethod(this, _AudioService_instances, ensureContext_fn).call(this);
      if (!ctx) {
        return;
      }
      __privateSet(this, _isMusicPlaying, true);
      __privateSet(this, _step, 0);
      __privateSet(this, _nextTime, ctx.currentTime);
      const scheduler = () => {
        if (!__privateGet(this, _isMusicPlaying)) {
          return;
        }
        while (__privateGet(this, _nextTime) < ctx.currentTime + 0.12) {
          __privateMethod(this, _AudioService_instances, scheduleBeat_fn).call(this, __privateGet(this, _nextTime), __privateGet(this, _step));
          __privateSet(this, _step, __privateGet(this, _step) + 1);
          __privateSet(this, _nextTime, __privateGet(this, _nextTime) + 60 / __privateGet(this, _tempo) / 4);
        }
      };
      scheduler();
      __privateSet(this, _musicTimer, setInterval(scheduler, 35));
    }
    stopMusic() {
      __privateSet(this, _isMusicPlaying, false);
      if (__privateGet(this, _musicTimer) !== null) {
        clearInterval(__privateGet(this, _musicTimer));
        __privateSet(this, _musicTimer, null);
      }
    }
    speak(text) {
      if (!__privateGet(this, _speech) || typeof SpeechSynthesisUtterance === "undefined") {
        return;
      }
      __privateGet(this, _speech).cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = __privateGet(this, _speechLang);
      const voice = __privateMethod(this, _AudioService_instances, pickSpeechVoice_fn).call(this);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 0.55;
      __privateGet(this, _speech).speak(utterance);
    }
    destroy() {
      this.stopMusic();
      if (__privateGet(this, _speech)) {
        __privateGet(this, _speech).cancel();
      }
      if (__privateGet(this, _context) && __privateGet(this, _context).state !== "closed") {
        __privateGet(this, _context).close();
      }
      __privateSet(this, _context, null);
      __privateSet(this, _masterGain, null);
    }
  };
  _contextFactory = new WeakMap();
  _speech = new WeakMap();
  _speechLang = new WeakMap();
  _selectedVoiceName = new WeakMap();
  _selectedVoiceLang = new WeakMap();
  _context = new WeakMap();
  _masterGain = new WeakMap();
  _musicTimer = new WeakMap();
  _isMusicPlaying = new WeakMap();
  _step = new WeakMap();
  _nextTime = new WeakMap();
  _tempo = new WeakMap();
  _AudioService_instances = new WeakSet();
  ensureContext_fn = function() {
    if (__privateGet(this, _context)) {
      if (__privateGet(this, _context).state === "suspended") {
        __privateGet(this, _context).resume();
      }
      return __privateGet(this, _context);
    }
    const created = __privateGet(this, _contextFactory).call(this);
    if (!created) {
      return null;
    }
    __privateSet(this, _context, created);
    __privateSet(this, _masterGain, __privateGet(this, _context).createGain());
    __privateGet(this, _masterGain).gain.value = 0.18;
    __privateGet(this, _masterGain).connect(__privateGet(this, _context).destination);
    if (__privateGet(this, _context).state === "suspended") {
      __privateGet(this, _context).resume();
    }
    return __privateGet(this, _context);
  };
  playTone_fn = function({ type, frequency, frequencyEnd, duration, gain, ramp = "exp" }) {
    const ctx = __privateMethod(this, _AudioService_instances, ensureContext_fn).call(this);
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
    env.connect(__privateGet(this, _masterGain));
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  };
  scheduleBeat_fn = function(time, step) {
    const ctx = __privateMethod(this, _AudioService_instances, ensureContext_fn).call(this);
    if (!ctx) {
      return;
    }
    const index = step % 16;
    if (index % 4 === 0) {
      __privateMethod(this, _AudioService_instances, kick_fn).call(this, time);
    }
    if (index % 8 === 4) {
      __privateMethod(this, _AudioService_instances, snare_fn).call(this, time);
    }
    if (index % 2 === 0) {
      __privateMethod(this, _AudioService_instances, hihat_fn).call(this, time, index % 4 === 2);
    }
    if (index % 4 === 0) {
      const bass = [55, 62, 65, 49][Math.floor(index / 4) % 4];
      __privateMethod(this, _AudioService_instances, bass_fn).call(this, time, bass);
    }
  };
  kick_fn = function(time) {
    const ctx = __privateMethod(this, _AudioService_instances, ensureContext_fn).call(this);
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
    gain.connect(__privateGet(this, _masterGain));
    osc.start(time);
    osc.stop(time + 0.25);
  };
  snare_fn = function(time) {
    const ctx = __privateMethod(this, _AudioService_instances, ensureContext_fn).call(this);
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
    gain.connect(__privateGet(this, _masterGain));
    noise.start(time);
  };
  hihat_fn = function(time, open) {
    const ctx = __privateMethod(this, _AudioService_instances, ensureContext_fn).call(this);
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
    gain.connect(__privateGet(this, _masterGain));
    noise.start(time);
  };
  bass_fn = function(time, note) {
    const ctx = __privateMethod(this, _AudioService_instances, ensureContext_fn).call(this);
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
    gain.connect(__privateGet(this, _masterGain));
    osc.start(time);
    osc.stop(time + 0.2);
  };
  pickSpeechVoice_fn = function() {
    var _a, _b;
    if (!__privateGet(this, _speech) || typeof __privateGet(this, _speech).getVoices !== "function") {
      return null;
    }
    let voices;
    try {
      voices = (_a = __privateGet(this, _speech).getVoices()) != null ? _a : [];
    } catch (e) {
      return null;
    }
    if (!Array.isArray(voices) || voices.length === 0) {
      __privateSet(this, _selectedVoiceName, null);
      __privateSet(this, _selectedVoiceLang, null);
      return null;
    }
    if (__privateGet(this, _selectedVoiceName)) {
      const cached = voices.find((voice) => {
        var _a2;
        return voice.name === __privateGet(this, _selectedVoiceName) && String((_a2 = voice.lang) != null ? _a2 : "").toLowerCase() === __privateGet(this, _selectedVoiceLang);
      });
      if (cached) {
        return cached;
      }
    }
    const englishVoices = voices.filter((voice) => {
      var _a2;
      return String((_a2 = voice.lang) != null ? _a2 : "").toLowerCase().startsWith("en");
    });
    if (englishVoices.length === 0) {
      __privateSet(this, _selectedVoiceName, null);
      __privateSet(this, _selectedVoiceLang, null);
      return null;
    }
    const ranked = [...englishVoices].sort((left, right) => {
      var _a2, _b2;
      const leftRank = __privateMethod(this, _AudioService_instances, voiceRank_fn).call(this, left.lang);
      const rightRank = __privateMethod(this, _AudioService_instances, voiceRank_fn).call(this, right.lang);
      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }
      const leftLocal = left.localService ? 0 : 1;
      const rightLocal = right.localService ? 0 : 1;
      if (leftLocal !== rightLocal) {
        return leftLocal - rightLocal;
      }
      return String((_a2 = left.name) != null ? _a2 : "").localeCompare(String((_b2 = right.name) != null ? _b2 : ""));
    });
    const selected = ranked[0];
    __privateSet(this, _selectedVoiceName, selected.name);
    __privateSet(this, _selectedVoiceLang, String((_b = selected.lang) != null ? _b : "").toLowerCase());
    return selected;
  };
  voiceRank_fn = function(lang) {
    const normalized = String(lang != null ? lang : "").toLowerCase();
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
  };
  schedule_fn = function(callback, delayMs) {
    setTimeout(callback, delayMs);
  };

  // js/services/ExhaustService.js
  var _container, _enabled, _mode, _intervalId, _clock, _ExhaustService_instances, stopEmitter_fn, clearParticles_fn, emit_fn2, spawnParticle_fn;
  var ExhaustService = class {
    constructor(container, clock = globalThis) {
      __privateAdd(this, _ExhaustService_instances);
      __privateAdd(this, _container);
      __privateAdd(this, _enabled, false);
      __privateAdd(this, _mode, "off");
      __privateAdd(this, _intervalId, null);
      __privateAdd(this, _clock);
      __privateSet(this, _container, container);
      __privateSet(this, _clock, {
        setInterval: clock.setInterval.bind(clock),
        clearInterval: clock.clearInterval.bind(clock),
        setTimeout: clock.setTimeout.bind(clock)
      });
      __privateGet(this, _container).dataset.mode = "off";
      __privateGet(this, _container).dataset.enabled = "false";
    }
    setEnabled(enabled) {
      __privateSet(this, _enabled, Boolean(enabled));
      __privateGet(this, _container).dataset.enabled = __privateGet(this, _enabled) ? "true" : "false";
      if (!__privateGet(this, _enabled)) {
        this.setMode("off");
        return;
      }
      if (__privateGet(this, _mode) === "off") {
        this.setMode("smoke");
      }
    }
    setMode(mode) {
      const normalized = __privateGet(this, _enabled) ? mode : "off";
      if (__privateGet(this, _mode) === normalized) {
        return;
      }
      __privateSet(this, _mode, normalized);
      __privateGet(this, _container).dataset.mode = __privateGet(this, _mode);
      __privateMethod(this, _ExhaustService_instances, stopEmitter_fn).call(this);
      __privateMethod(this, _ExhaustService_instances, clearParticles_fn).call(this);
      if (__privateGet(this, _mode) === "off") {
        return;
      }
      const interval = __privateGet(this, _mode) === "fire" ? 90 : 180;
      __privateSet(this, _intervalId, __privateGet(this, _clock).setInterval(() => __privateMethod(this, _ExhaustService_instances, emit_fn2).call(this), interval));
    }
    destroy() {
      __privateSet(this, _enabled, false);
      this.setMode("off");
    }
  };
  _container = new WeakMap();
  _enabled = new WeakMap();
  _mode = new WeakMap();
  _intervalId = new WeakMap();
  _clock = new WeakMap();
  _ExhaustService_instances = new WeakSet();
  stopEmitter_fn = function() {
    if (__privateGet(this, _intervalId) !== null) {
      __privateGet(this, _clock).clearInterval(__privateGet(this, _intervalId));
      __privateSet(this, _intervalId, null);
    }
  };
  clearParticles_fn = function() {
    while (__privateGet(this, _container).firstChild) {
      __privateGet(this, _container).firstChild.remove();
    }
  };
  emit_fn2 = function() {
    if (__privateGet(this, _mode) === "off") {
      return;
    }
    const isFire = __privateGet(this, _mode) === "fire";
    const count = isFire ? 3 : 1;
    for (let i = 0; i < count; i += 1) {
      __privateMethod(this, _ExhaustService_instances, spawnParticle_fn).call(this, isFire);
    }
  };
  spawnParticle_fn = function(isFire) {
    const particle = document.createElement("span");
    const size = isFire ? 8 + Math.random() * 10 : 12 + Math.random() * 12;
    const offset = (Math.random() - 0.5) * 26;
    particle.className = `exhaust-particle ${isFire ? "exhaust-particle-fire" : "exhaust-particle-smoke"}`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `calc(50% + ${offset}px)`;
    __privateGet(this, _container).appendChild(particle);
    const life = isFire ? 420 : 860;
    __privateGet(this, _clock).setTimeout(() => {
      particle.remove();
    }, life);
  };

  // js/services/NameService.js
  var _adjectives, _nouns;
  var _NameService = class _NameService {
    next() {
      const adjective = __privateGet(_NameService, _adjectives)[Math.floor(Math.random() * __privateGet(_NameService, _adjectives).length)];
      const noun = __privateGet(_NameService, _nouns)[Math.floor(Math.random() * __privateGet(_NameService, _nouns).length)];
      return `${adjective} ${noun}`;
    }
  };
  _adjectives = new WeakMap();
  _nouns = new WeakMap();
  __privateAdd(_NameService, _adjectives, [
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
  ]);
  __privateAdd(_NameService, _nouns, [
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
  ]);
  var NameService = _NameService;

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
  var _background, _foreground, _SceneService_instances, setThemeClasses_fn, clearLayers_fn, renderAccents_fn, renderOccluders_fn, mapHideSpots_fn;
  var SceneService = class {
    constructor(backgroundContainer, foregroundContainer) {
      __privateAdd(this, _SceneService_instances);
      __privateAdd(this, _background);
      __privateAdd(this, _foreground);
      __privateSet(this, _background, backgroundContainer);
      __privateSet(this, _foreground, foregroundContainer);
    }
    render(themeName) {
      const selectedThemeName = SCENE_THEMES[themeName] ? themeName : FALLBACK_THEME;
      const theme = SCENE_THEMES[selectedThemeName];
      const key = selectedThemeName.toLowerCase();
      __privateMethod(this, _SceneService_instances, setThemeClasses_fn).call(this, key);
      __privateMethod(this, _SceneService_instances, clearLayers_fn).call(this);
      __privateMethod(this, _SceneService_instances, renderAccents_fn).call(this, theme.accents);
      const occluderIds = __privateMethod(this, _SceneService_instances, renderOccluders_fn).call(this, theme.occluders, key);
      const hideSpots = __privateMethod(this, _SceneService_instances, mapHideSpots_fn).call(this, theme.hideSpots, key);
      return {
        hideSpots,
        occluderIds
      };
    }
  };
  _background = new WeakMap();
  _foreground = new WeakMap();
  _SceneService_instances = new WeakSet();
  setThemeClasses_fn = function(key) {
    __privateGet(this, _background).className = `scene-layer scene-background scene-theme-${key}`;
    __privateGet(this, _foreground).className = `scene-layer scene-foreground scene-theme-${key}`;
  };
  clearLayers_fn = function() {
    __privateGet(this, _background).innerHTML = "";
    __privateGet(this, _foreground).innerHTML = "";
  };
  renderAccents_fn = function(accents) {
    accents.forEach((accent) => {
      const node = document.createElement("div");
      node.className = `scene-accent ${accent.shape}`;
      node.style.left = `${accent.x}%`;
      node.style.top = `${accent.y}%`;
      node.style.width = `${accent.w}px`;
      node.style.height = `${accent.h}px`;
      node.style.background = accent.color;
      node.style.transform = "translate(-50%, -50%)";
      __privateGet(this, _background).appendChild(node);
    });
  };
  renderOccluders_fn = function(occluders, key) {
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
      __privateGet(this, _foreground).appendChild(node);
    });
    return occluderIds;
  };
  mapHideSpots_fn = function(hideSpots, key) {
    return hideSpots.map((spot) => ({
      x: spot.x,
      y: spot.y,
      peek: spot.peek,
      occluderId: `scene-occluder-${key}-${spot.occluderId}`
    }));
  };

  // js/ui/ControlsView.js
  var _bus4, _container2, _buttons, _handlers, _initialized, _mounted, _ControlsView_instances, buildButtons_fn, setActive_fn;
  var ControlsView = class {
    constructor(bus, container) {
      __privateAdd(this, _ControlsView_instances);
      __privateAdd(this, _bus4);
      __privateAdd(this, _container2);
      __privateAdd(this, _buttons, /* @__PURE__ */ new Map());
      __privateAdd(this, _handlers, /* @__PURE__ */ new Map());
      __privateAdd(this, _initialized, false);
      __privateAdd(this, _mounted, false);
      __privateSet(this, _bus4, bus);
      __privateSet(this, _container2, container);
    }
    init() {
      if (!__privateGet(this, _initialized)) {
        __privateMethod(this, _ControlsView_instances, buildButtons_fn).call(this);
        __privateSet(this, _initialized, true);
      }
      this.mount();
    }
    mount() {
      if (__privateGet(this, _mounted)) {
        return;
      }
      __privateGet(this, _handlers).forEach((handler, action) => {
        const button = __privateGet(this, _buttons).get(action);
        if (button) {
          button.addEventListener("click", handler);
        }
      });
      __privateSet(this, _mounted, true);
    }
    unmount() {
      if (!__privateGet(this, _mounted)) {
        return;
      }
      __privateGet(this, _handlers).forEach((handler, action) => {
        const button = __privateGet(this, _buttons).get(action);
        if (button) {
          button.removeEventListener("click", handler);
        }
      });
      __privateSet(this, _mounted, false);
    }
    destroy() {
      this.unmount();
      __privateGet(this, _buttons).clear();
      __privateGet(this, _handlers).clear();
      __privateGet(this, _container2).innerHTML = "";
      __privateSet(this, _initialized, false);
    }
    setMoveActive(active) {
      __privateMethod(this, _ControlsView_instances, setActive_fn).call(this, "toggleMove", active, active ? "Stop" : "Move");
    }
    setDanceActive(active) {
      __privateMethod(this, _ControlsView_instances, setActive_fn).call(this, "toggleDance", active, active ? "Stop" : "Dance");
    }
    setHideSeekActive(active) {
      __privateMethod(this, _ControlsView_instances, setActive_fn).call(this, "toggleHideSeek", active, active ? "Cancel" : "Hide");
    }
  };
  _bus4 = new WeakMap();
  _container2 = new WeakMap();
  _buttons = new WeakMap();
  _handlers = new WeakMap();
  _initialized = new WeakMap();
  _mounted = new WeakMap();
  _ControlsView_instances = new WeakSet();
  buildButtons_fn = function() {
    __privateGet(this, _container2).innerHTML = "";
    __privateGet(this, _buttons).clear();
    __privateGet(this, _handlers).clear();
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
        __privateGet(this, _bus4).emit(UI_EVENTS.ACTION, { action: definition.action });
      };
      __privateGet(this, _buttons).set(definition.action, button);
      __privateGet(this, _handlers).set(definition.action, handler);
      __privateGet(this, _container2).appendChild(button);
    });
  };
  setActive_fn = function(action, active, labelText) {
    const button = __privateGet(this, _buttons).get(action);
    if (!button) {
      return;
    }
    button.classList.toggle("is-active", active);
    const label = button.querySelector(".control-label");
    if (label) {
      label.textContent = labelText;
    }
  };

  // js/ui/HudView.js
  var _bus5, _nameButton, _nameText, _emotionButton, _emotionText, _hideSeekHud, _timer, _score, _toast, _live, _toastTimer, _toastHideTimer, _mounted2, _onNameClick, _onEmotionClick, _HudView_instances, clearToastTimers_fn;
  var HudView = class {
    constructor(bus, elements) {
      __privateAdd(this, _HudView_instances);
      __privateAdd(this, _bus5);
      __privateAdd(this, _nameButton);
      __privateAdd(this, _nameText);
      __privateAdd(this, _emotionButton);
      __privateAdd(this, _emotionText);
      __privateAdd(this, _hideSeekHud);
      __privateAdd(this, _timer);
      __privateAdd(this, _score);
      __privateAdd(this, _toast);
      __privateAdd(this, _live);
      __privateAdd(this, _toastTimer, null);
      __privateAdd(this, _toastHideTimer, null);
      __privateAdd(this, _mounted2, false);
      __privateAdd(this, _onNameClick);
      __privateAdd(this, _onEmotionClick);
      __privateSet(this, _bus5, bus);
      __privateSet(this, _nameButton, elements.nameButton);
      __privateSet(this, _nameText, elements.nameText);
      __privateSet(this, _emotionButton, elements.emotionButton);
      __privateSet(this, _emotionText, elements.emotionText);
      __privateSet(this, _hideSeekHud, elements.hideSeekHud);
      __privateSet(this, _timer, elements.timer);
      __privateSet(this, _score, elements.score);
      __privateSet(this, _toast, elements.toast);
      __privateSet(this, _live, elements.live);
      __privateSet(this, _onNameClick, () => {
        __privateGet(this, _bus5).emit(UI_EVENTS.NAME_CYCLE);
      });
      __privateSet(this, _onEmotionClick, () => {
        __privateGet(this, _bus5).emit(UI_EVENTS.EMOTION_CYCLE);
      });
    }
    init() {
      this.mount();
    }
    mount() {
      if (__privateGet(this, _mounted2)) {
        return;
      }
      __privateGet(this, _nameButton).addEventListener("click", __privateGet(this, _onNameClick));
      __privateGet(this, _emotionButton).addEventListener("click", __privateGet(this, _onEmotionClick));
      __privateSet(this, _mounted2, true);
    }
    unmount() {
      if (!__privateGet(this, _mounted2)) {
        return;
      }
      __privateGet(this, _nameButton).removeEventListener("click", __privateGet(this, _onNameClick));
      __privateGet(this, _emotionButton).removeEventListener("click", __privateGet(this, _onEmotionClick));
      __privateSet(this, _mounted2, false);
    }
    destroy() {
      this.unmount();
      __privateMethod(this, _HudView_instances, clearToastTimers_fn).call(this);
    }
    renderName(name) {
      __privateGet(this, _nameText).textContent = name;
    }
    renderEmotion(emotion) {
      __privateGet(this, _emotionText).textContent = emotion;
    }
    renderHideSeek(active, secondsLeft, score) {
      __privateGet(this, _score).textContent = String(score);
      if (!active) {
        __privateGet(this, _hideSeekHud).classList.add("is-hidden");
        __privateGet(this, _timer).classList.remove("is-warning");
        __privateGet(this, _timer).textContent = String(HIDE_SEEK_SECONDS);
        return;
      }
      __privateGet(this, _hideSeekHud).classList.remove("is-hidden");
      __privateGet(this, _timer).textContent = String(secondsLeft);
      __privateGet(this, _timer).classList.toggle("is-warning", secondsLeft <= 5);
    }
    showToast(message, duration = 1800) {
      __privateMethod(this, _HudView_instances, clearToastTimers_fn).call(this);
      __privateGet(this, _toast).textContent = message;
      __privateGet(this, _toast).classList.remove("is-hidden", "is-leaving");
      __privateGet(this, _toast).classList.add("is-visible");
      __privateSet(this, _toastTimer, setTimeout(() => {
        __privateGet(this, _toast).classList.remove("is-visible");
        __privateGet(this, _toast).classList.add("is-leaving");
        __privateSet(this, _toastHideTimer, setTimeout(() => {
          __privateGet(this, _toast).classList.add("is-hidden");
          __privateGet(this, _toast).classList.remove("is-leaving");
        }, 280));
      }, duration));
    }
    announce(text) {
      __privateGet(this, _live).textContent = text;
    }
  };
  _bus5 = new WeakMap();
  _nameButton = new WeakMap();
  _nameText = new WeakMap();
  _emotionButton = new WeakMap();
  _emotionText = new WeakMap();
  _hideSeekHud = new WeakMap();
  _timer = new WeakMap();
  _score = new WeakMap();
  _toast = new WeakMap();
  _live = new WeakMap();
  _toastTimer = new WeakMap();
  _toastHideTimer = new WeakMap();
  _mounted2 = new WeakMap();
  _onNameClick = new WeakMap();
  _onEmotionClick = new WeakMap();
  _HudView_instances = new WeakSet();
  clearToastTimers_fn = function() {
    if (__privateGet(this, _toastTimer) !== null) {
      clearTimeout(__privateGet(this, _toastTimer));
      __privateSet(this, _toastTimer, null);
    }
    if (__privateGet(this, _toastHideTimer) !== null) {
      clearTimeout(__privateGet(this, _toastHideTimer));
      __privateSet(this, _toastHideTimer, null);
    }
  };

  // js/ui/StageView.js
  var VISUAL_KEYS = /* @__PURE__ */ new Set(["characterMode", "head", "body", "arms", "legs", "palette", "scale"]);
  var _bus6, _region, _mover, _dancer, _assembly, _head, _body, _armLeft, _armRight, _legLeft, _legRight, _partNodes, _partClickHandlers, _mounted3, _movePosition, _hideSeekActive, _hideSeekListener, _hideHintInterval, _hideHintTimeout, _activeOccluderId, _randomIndex, _hasRendered, _renderedHeadKey, _renderedBodyKey, _renderedArmsKey, _renderedLegsKey, _renderedCharacterMode, _renderedBodyHasEngine, _renderedPalette, _renderedScale, _StageView_instances, applyPaletteChanges_fn, shouldRenderPiece_fn, shouldRenderBody_fn, renderPiece_fn, appendDetail_fn, setPieceColor_fn, cacheRenderedState_fn, startHintLoop_fn, pickHideSpot_fn, pickRandomIndex_fn, applyPeekClass_fn, applyMover_fn, computeBounds_fn;
  var StageView = class {
    constructor(bus, elements, options = {}) {
      __privateAdd(this, _StageView_instances);
      __privateAdd(this, _bus6);
      __privateAdd(this, _region);
      __privateAdd(this, _mover);
      __privateAdd(this, _dancer);
      __privateAdd(this, _assembly);
      __privateAdd(this, _head);
      __privateAdd(this, _body);
      __privateAdd(this, _armLeft);
      __privateAdd(this, _armRight);
      __privateAdd(this, _legLeft);
      __privateAdd(this, _legRight);
      __privateAdd(this, _partNodes);
      __privateAdd(this, _partClickHandlers, /* @__PURE__ */ new Map());
      __privateAdd(this, _mounted3, false);
      __privateAdd(this, _movePosition, { x: 0, y: 0 });
      __privateAdd(this, _hideSeekActive, false);
      __privateAdd(this, _hideSeekListener, null);
      __privateAdd(this, _hideHintInterval, null);
      __privateAdd(this, _hideHintTimeout, null);
      __privateAdd(this, _activeOccluderId, null);
      __privateAdd(this, _randomIndex, null);
      __privateAdd(this, _hasRendered, false);
      __privateAdd(this, _renderedHeadKey, null);
      __privateAdd(this, _renderedBodyKey, null);
      __privateAdd(this, _renderedArmsKey, null);
      __privateAdd(this, _renderedLegsKey, null);
      __privateAdd(this, _renderedCharacterMode, null);
      __privateAdd(this, _renderedBodyHasEngine, null);
      __privateAdd(this, _renderedPalette, {
        head: null,
        body: null,
        arms: null,
        legs: null
      });
      __privateAdd(this, _renderedScale, null);
      __privateSet(this, _bus6, bus);
      __privateSet(this, _region, elements.region);
      __privateSet(this, _mover, elements.mover);
      __privateSet(this, _dancer, elements.dancer);
      __privateSet(this, _assembly, elements.assembly);
      __privateSet(this, _head, elements.head);
      __privateSet(this, _body, elements.body);
      __privateSet(this, _armLeft, elements.armLeft);
      __privateSet(this, _armRight, elements.armRight);
      __privateSet(this, _legLeft, elements.legLeft);
      __privateSet(this, _legRight, elements.legRight);
      __privateSet(this, _partNodes, [__privateGet(this, _head), __privateGet(this, _body), __privateGet(this, _armLeft), __privateGet(this, _armRight), __privateGet(this, _legLeft), __privateGet(this, _legRight)]);
      if (typeof options.randomIndex === "function") {
        __privateSet(this, _randomIndex, options.randomIndex);
      }
    }
    init() {
      __privateGet(this, _mover).style.setProperty("--move-transition-ms", `${MOVE_TRANSITION_MS}ms`);
      this.setMotionState({ isMoving: false, danceClass: null });
      this.mount();
    }
    mount() {
      if (__privateGet(this, _mounted3)) {
        return;
      }
      __privateGet(this, _partNodes).forEach((node) => {
        const handler = () => {
          if (__privateGet(this, _hideSeekActive)) {
            return;
          }
          const part = node.dataset.part;
          __privateGet(this, _bus6).emit(UI_EVENTS.PART_CYCLE, { part });
        };
        __privateGet(this, _partClickHandlers).set(node, handler);
        node.addEventListener("click", handler);
      });
      __privateSet(this, _mounted3, true);
    }
    unmount() {
      if (!__privateGet(this, _mounted3)) {
        return;
      }
      __privateGet(this, _partClickHandlers).forEach((handler, node) => {
        node.removeEventListener("click", handler);
      });
      __privateGet(this, _partClickHandlers).clear();
      if (__privateGet(this, _hideSeekListener)) {
        __privateGet(this, _mover).removeEventListener("click", __privateGet(this, _hideSeekListener));
        __privateSet(this, _hideSeekListener, null);
      }
      __privateSet(this, _mounted3, false);
    }
    render(state) {
      this.applyRobotChanges(state, [...VISUAL_KEYS]);
    }
    applyRobotChanges(state, changed = []) {
      const changedSet = new Set((Array.isArray(changed) ? changed : []).filter((key) => VISUAL_KEYS.has(key)));
      const firstRender = !__privateGet(this, _hasRendered);
      if (!firstRender && changedSet.size === 0) {
        return;
      }
      const modeChanged = __privateGet(this, _renderedCharacterMode) !== state.characterMode;
      const shouldRebuildHead = firstRender || modeChanged || changedSet.has("head");
      const shouldRebuildBody = firstRender || modeChanged || changedSet.has("body") || __privateGet(this, _renderedBodyHasEngine) !== state.bodyHasEngine;
      const shouldRebuildArms = firstRender || modeChanged || changedSet.has("arms");
      const shouldRebuildLegs = firstRender || modeChanged || changedSet.has("legs");
      if (shouldRebuildHead && __privateMethod(this, _StageView_instances, shouldRenderPiece_fn).call(this, __privateGet(this, _renderedHeadKey), state.head.key, firstRender, changedSet, "head")) {
        __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _head), {
          mode: state.characterMode,
          kind: "head",
          key: state.head.key,
          variant: state.head.variant,
          color: state.palette.head
        });
      }
      if (shouldRebuildBody && __privateMethod(this, _StageView_instances, shouldRenderBody_fn).call(this, state, firstRender, changedSet)) {
        __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _body), {
          mode: state.characterMode,
          kind: "body",
          key: state.body.key,
          variant: state.body.variant,
          color: state.palette.body,
          isEngine: state.bodyHasEngine
        });
      }
      if (shouldRebuildArms && __privateMethod(this, _StageView_instances, shouldRenderPiece_fn).call(this, __privateGet(this, _renderedArmsKey), state.arms.key, firstRender, changedSet, "arms")) {
        __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _armLeft), {
          mode: state.characterMode,
          kind: "arm",
          key: state.arms.key,
          variant: state.arms.variant,
          color: state.palette.arms,
          side: "left"
        });
        __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _armRight), {
          mode: state.characterMode,
          kind: "arm",
          key: state.arms.key,
          variant: state.arms.variant,
          color: state.palette.arms,
          side: "right"
        });
      }
      if (shouldRebuildLegs && __privateMethod(this, _StageView_instances, shouldRenderPiece_fn).call(this, __privateGet(this, _renderedLegsKey), state.legs.key, firstRender, changedSet, "legs")) {
        __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _legLeft), {
          mode: state.characterMode,
          kind: "legs",
          key: state.legs.key,
          variant: state.legs.variant,
          color: state.palette.legs,
          side: "left"
        });
        __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _legRight), {
          mode: state.characterMode,
          kind: "legs",
          key: state.legs.key,
          variant: state.legs.variant,
          color: state.palette.legs,
          side: "right"
        });
      }
      if (changedSet.has("palette") && !firstRender) {
        __privateMethod(this, _StageView_instances, applyPaletteChanges_fn).call(this, state, {
          head: shouldRebuildHead,
          body: shouldRebuildBody,
          arms: shouldRebuildArms,
          legs: shouldRebuildLegs
        });
      }
      if ((firstRender || changedSet.has("scale")) && __privateGet(this, _renderedScale) !== state.scale) {
        this.setScale(state.scale);
      }
      __privateMethod(this, _StageView_instances, cacheRenderedState_fn).call(this, state);
    }
    setScale(scale) {
      __privateGet(this, _assembly).style.transform = `scale(${scale})`;
    }
    setDance(danceClass) {
      __privateGet(this, _dancer).classList.remove("dance-bounce", "dance-twist", "dance-shimmy", "dance-disco");
      if (danceClass) {
        __privateGet(this, _dancer).classList.add(danceClass);
      }
    }
    setMotionState({ isMoving, danceClass }) {
      const dancing = Boolean(danceClass);
      this.setDance(danceClass);
      __privateGet(this, _dancer).classList.toggle("is-moving", Boolean(isMoving));
      __privateGet(this, _dancer).classList.toggle("is-dancing", dancing);
      __privateGet(this, _dancer).classList.toggle("is-idle", !isMoving && !dancing);
    }
    stepMovement() {
      const bounds = __privateMethod(this, _StageView_instances, computeBounds_fn).call(this);
      const nextX = __privateGet(this, _movePosition).x + (Math.random() * 2 - 1) * MOVE_DELTA_X;
      const nextY = __privateGet(this, _movePosition).y + (Math.random() * 2 - 1) * MOVE_DELTA_Y;
      __privateSet(this, _movePosition, {
        x: Math.max(bounds.minX, Math.min(bounds.maxX, nextX)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, nextY))
      });
      if (!__privateGet(this, _hideSeekActive)) {
        __privateMethod(this, _StageView_instances, applyMover_fn).call(this, __privateGet(this, _movePosition).x, __privateGet(this, _movePosition).y);
      }
    }
    resetPosition() {
      __privateSet(this, _movePosition, { x: 0, y: 0 });
      if (!__privateGet(this, _hideSeekActive)) {
        __privateMethod(this, _StageView_instances, applyMover_fn).call(this, 0, 0);
      }
    }
    beginHideSeek(hideContext = { hideSpots: [] }) {
      if (__privateGet(this, _hideSeekActive)) {
        return;
      }
      __privateSet(this, _hideSeekActive, true);
      const spot = __privateMethod(this, _StageView_instances, pickHideSpot_fn).call(this, hideContext);
      __privateGet(this, _assembly).classList.add("robot-hidden");
      __privateMethod(this, _StageView_instances, applyPeekClass_fn).call(this, spot.peek);
      __privateMethod(this, _StageView_instances, applyMover_fn).call(this, spot.x, spot.y);
      __privateGet(this, _mover).classList.add("hide-target");
      if (spot.occluderId) {
        const occluder = document.getElementById(spot.occluderId);
        if (occluder) {
          occluder.classList.add("is-occluding");
          __privateSet(this, _activeOccluderId, spot.occluderId);
        }
      }
      __privateSet(this, _hideSeekListener, (event) => {
        event.stopPropagation();
        if (!__privateGet(this, _hideSeekActive)) {
          return;
        }
        __privateGet(this, _bus6).emit(UI_EVENTS.HIDE_SEEK_FOUND);
      });
      __privateGet(this, _mover).addEventListener("click", __privateGet(this, _hideSeekListener));
      __privateMethod(this, _StageView_instances, startHintLoop_fn).call(this);
    }
    endHideSeek() {
      if (!__privateGet(this, _hideSeekActive)) {
        return;
      }
      __privateSet(this, _hideSeekActive, false);
      __privateGet(this, _assembly).classList.remove("robot-hidden", "robot-hint", "robot-peek-left", "robot-peek-right", "robot-peek-up", "robot-peek-down");
      __privateGet(this, _mover).classList.remove("hide-target");
      if (__privateGet(this, _activeOccluderId)) {
        const occluder = document.getElementById(__privateGet(this, _activeOccluderId));
        if (occluder) {
          occluder.classList.remove("is-occluding");
        }
        __privateSet(this, _activeOccluderId, null);
      }
      if (__privateGet(this, _hideSeekListener)) {
        __privateGet(this, _mover).removeEventListener("click", __privateGet(this, _hideSeekListener));
        __privateSet(this, _hideSeekListener, null);
      }
      if (__privateGet(this, _hideHintInterval) !== null) {
        clearInterval(__privateGet(this, _hideHintInterval));
        __privateSet(this, _hideHintInterval, null);
      }
      if (__privateGet(this, _hideHintTimeout) !== null) {
        clearTimeout(__privateGet(this, _hideHintTimeout));
        __privateSet(this, _hideHintTimeout, null);
      }
      __privateMethod(this, _StageView_instances, applyMover_fn).call(this, __privateGet(this, _movePosition).x, __privateGet(this, _movePosition).y);
    }
    destroy() {
      this.endHideSeek();
      this.unmount();
    }
  };
  _bus6 = new WeakMap();
  _region = new WeakMap();
  _mover = new WeakMap();
  _dancer = new WeakMap();
  _assembly = new WeakMap();
  _head = new WeakMap();
  _body = new WeakMap();
  _armLeft = new WeakMap();
  _armRight = new WeakMap();
  _legLeft = new WeakMap();
  _legRight = new WeakMap();
  _partNodes = new WeakMap();
  _partClickHandlers = new WeakMap();
  _mounted3 = new WeakMap();
  _movePosition = new WeakMap();
  _hideSeekActive = new WeakMap();
  _hideSeekListener = new WeakMap();
  _hideHintInterval = new WeakMap();
  _hideHintTimeout = new WeakMap();
  _activeOccluderId = new WeakMap();
  _randomIndex = new WeakMap();
  _hasRendered = new WeakMap();
  _renderedHeadKey = new WeakMap();
  _renderedBodyKey = new WeakMap();
  _renderedArmsKey = new WeakMap();
  _renderedLegsKey = new WeakMap();
  _renderedCharacterMode = new WeakMap();
  _renderedBodyHasEngine = new WeakMap();
  _renderedPalette = new WeakMap();
  _renderedScale = new WeakMap();
  _StageView_instances = new WeakSet();
  applyPaletteChanges_fn = function(state, rebuilt) {
    if (!rebuilt.head && __privateGet(this, _renderedPalette).head !== state.palette.head && !__privateMethod(this, _StageView_instances, setPieceColor_fn).call(this, __privateGet(this, _head), state.palette.head)) {
      __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _head), {
        mode: state.characterMode,
        kind: "head",
        key: state.head.key,
        variant: state.head.variant,
        color: state.palette.head
      });
    }
    if (!rebuilt.body && __privateGet(this, _renderedPalette).body !== state.palette.body && !__privateMethod(this, _StageView_instances, setPieceColor_fn).call(this, __privateGet(this, _body), state.palette.body)) {
      __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _body), {
        mode: state.characterMode,
        kind: "body",
        key: state.body.key,
        variant: state.body.variant,
        color: state.palette.body,
        isEngine: state.bodyHasEngine
      });
    }
    if (!rebuilt.arms && __privateGet(this, _renderedPalette).arms !== state.palette.arms) {
      const updatedLeft = __privateMethod(this, _StageView_instances, setPieceColor_fn).call(this, __privateGet(this, _armLeft), state.palette.arms);
      const updatedRight = __privateMethod(this, _StageView_instances, setPieceColor_fn).call(this, __privateGet(this, _armRight), state.palette.arms);
      if (!updatedLeft || !updatedRight) {
        __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _armLeft), {
          mode: state.characterMode,
          kind: "arm",
          key: state.arms.key,
          variant: state.arms.variant,
          color: state.palette.arms,
          side: "left"
        });
        __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _armRight), {
          mode: state.characterMode,
          kind: "arm",
          key: state.arms.key,
          variant: state.arms.variant,
          color: state.palette.arms,
          side: "right"
        });
      }
    }
    if (!rebuilt.legs && __privateGet(this, _renderedPalette).legs !== state.palette.legs) {
      const updatedLeft = __privateMethod(this, _StageView_instances, setPieceColor_fn).call(this, __privateGet(this, _legLeft), state.palette.legs);
      const updatedRight = __privateMethod(this, _StageView_instances, setPieceColor_fn).call(this, __privateGet(this, _legRight), state.palette.legs);
      if (!updatedLeft || !updatedRight) {
        __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _legLeft), {
          mode: state.characterMode,
          kind: "legs",
          key: state.legs.key,
          variant: state.legs.variant,
          color: state.palette.legs,
          side: "left"
        });
        __privateMethod(this, _StageView_instances, renderPiece_fn).call(this, __privateGet(this, _legRight), {
          mode: state.characterMode,
          kind: "legs",
          key: state.legs.key,
          variant: state.legs.variant,
          color: state.palette.legs,
          side: "right"
        });
      }
    }
  };
  shouldRenderPiece_fn = function(renderedKey, nextKey, firstRender, changedSet, keyName) {
    if (firstRender) {
      return true;
    }
    if (renderedKey !== nextKey) {
      return true;
    }
    return changedSet.has(keyName) || changedSet.has("characterMode");
  };
  shouldRenderBody_fn = function(state, firstRender, changedSet) {
    if (firstRender) {
      return true;
    }
    if (__privateGet(this, _renderedBodyKey) !== state.body.key) {
      return true;
    }
    if (__privateGet(this, _renderedBodyHasEngine) !== state.bodyHasEngine) {
      return true;
    }
    return changedSet.has("body") || changedSet.has("characterMode");
  };
  renderPiece_fn = function(targetButton, options) {
    const {
      mode,
      kind,
      key,
      variant = 0,
      color,
      side = null,
      isEngine = false
    } = options;
    const existingExhaust = kind === "body" ? targetButton.querySelector("#exhaust-container") : null;
    targetButton.innerHTML = "";
    targetButton.dataset.key = key;
    targetButton.dataset.mode = mode;
    targetButton.dataset.variant = String(variant);
    if (side) {
      targetButton.dataset.side = side;
    } else {
      delete targetButton.dataset.side;
    }
    if (kind === "body") {
      targetButton.dataset.engine = isEngine ? "true" : "false";
    }
    const piece = document.createElement("div");
    piece.className = [
      "robot-piece",
      `robot-piece-${kind}`,
      `robot-piece-mode-${mode}`,
      `robot-piece-variant-${variant}`,
      `robot-piece-key-${key}`,
      side ? `robot-piece-side-${side}` : ""
    ].filter(Boolean).join(" ");
    piece.style.setProperty("--piece-color", color);
    if (kind === "body" && isEngine) {
      piece.classList.add("robot-body-engine");
    }
    __privateMethod(this, _StageView_instances, appendDetail_fn).call(this, piece, kind, variant);
    targetButton.appendChild(piece);
    if (existingExhaust) {
      targetButton.appendChild(existingExhaust);
    }
  };
  appendDetail_fn = function(piece, kind, variant) {
    const detail = document.createElement("span");
    detail.className = `piece-detail piece-detail-${kind} piece-detail-${kind}-variant-${variant}`;
    piece.appendChild(detail);
    const detailSecondary = document.createElement("span");
    detailSecondary.className = `piece-detail-secondary piece-detail-secondary-${kind} piece-detail-secondary-${kind}-variant-${variant}`;
    piece.appendChild(detailSecondary);
  };
  setPieceColor_fn = function(targetButton, color) {
    const piece = targetButton.querySelector(".robot-piece");
    if (!piece) {
      return false;
    }
    piece.style.setProperty("--piece-color", color);
    return true;
  };
  cacheRenderedState_fn = function(state) {
    __privateSet(this, _hasRendered, true);
    __privateSet(this, _renderedCharacterMode, state.characterMode);
    __privateSet(this, _renderedHeadKey, state.head.key);
    __privateSet(this, _renderedBodyKey, state.body.key);
    __privateSet(this, _renderedArmsKey, state.arms.key);
    __privateSet(this, _renderedLegsKey, state.legs.key);
    __privateSet(this, _renderedBodyHasEngine, state.bodyHasEngine);
    __privateSet(this, _renderedPalette, {
      head: state.palette.head,
      body: state.palette.body,
      arms: state.palette.arms,
      legs: state.palette.legs
    });
    __privateSet(this, _renderedScale, state.scale);
  };
  startHintLoop_fn = function() {
    if (__privateGet(this, _hideHintInterval) !== null) {
      clearInterval(__privateGet(this, _hideHintInterval));
    }
    const hintPulse = () => {
      if (!__privateGet(this, _hideSeekActive)) {
        return;
      }
      __privateGet(this, _assembly).classList.add("robot-hint");
      if (__privateGet(this, _hideHintTimeout) !== null) {
        clearTimeout(__privateGet(this, _hideHintTimeout));
      }
      __privateSet(this, _hideHintTimeout, setTimeout(() => {
        __privateGet(this, _assembly).classList.remove("robot-hint");
      }, HIDE_HINT_DURATION_MS));
    };
    __privateSet(this, _hideHintInterval, setInterval(hintPulse, HIDE_HINT_INTERVAL_MS));
  };
  pickHideSpot_fn = function(hideContext) {
    var _a;
    const candidates = (_a = hideContext.hideSpots) != null ? _a : [];
    if (candidates.length > 0) {
      return candidates[__privateMethod(this, _StageView_instances, pickRandomIndex_fn).call(this, candidates.length)];
    }
    const bounds = __privateMethod(this, _StageView_instances, computeBounds_fn).call(this);
    const fallbackSpots = [
      { x: bounds.minX + 45, y: bounds.maxY - 12, peek: "right", occluderId: null },
      { x: bounds.maxX - 45, y: bounds.maxY - 10, peek: "left", occluderId: null },
      { x: 0, y: bounds.minY + 15, peek: "up", occluderId: null }
    ];
    return fallbackSpots[__privateMethod(this, _StageView_instances, pickRandomIndex_fn).call(this, fallbackSpots.length)];
  };
  pickRandomIndex_fn = function(length) {
    if (length <= 1) {
      return 0;
    }
    if (__privateGet(this, _randomIndex)) {
      const supplied = Number(__privateGet(this, _randomIndex).call(this, length));
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
  };
  applyPeekClass_fn = function(peek) {
    __privateGet(this, _assembly).classList.remove("robot-peek-left", "robot-peek-right", "robot-peek-up", "robot-peek-down");
    const direction = ["left", "right", "up", "down"].includes(peek) ? peek : "up";
    __privateGet(this, _assembly).classList.add(`robot-peek-${direction}`);
  };
  applyMover_fn = function(x, y) {
    __privateGet(this, _mover).style.transform = `translate(-50%, -50%) translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  };
  computeBounds_fn = function() {
    const width = __privateGet(this, _region).clientWidth;
    const height = __privateGet(this, _region).clientHeight;
    return {
      minX: -Math.max(70, width * 0.34),
      maxX: Math.max(70, width * 0.34),
      minY: -Math.max(65, height * 0.3),
      maxY: Math.max(24, height * 0.22)
    };
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
      legLeft: queryRequired("part-leg-left"),
      legRight: queryRequired("part-leg-right")
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
