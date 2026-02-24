(() => {
  // js/core/EventBus.js
  var EventBus = class {
    #target;
    constructor() {
      this.#target = new EventTarget();
    }
    on(type, handler, options) {
      this.#target.addEventListener(type, handler, options);
    }
    off(type, handler, options) {
      this.#target.removeEventListener(type, handler, options);
    }
    emit(type, detail = {}) {
      this.#target.dispatchEvent(new CustomEvent(type, { detail }));
    }
  };

  // js/core/Config.js
  var THEMES = [
    "Factory",
    "Space",
    "Moon",
    "Jungle",
    "Mars",
    "Underwater",
    "Candy",
    "Volcano",
    "Arctic",
    "Sunset",
    "Haunted",
    "Disco"
  ];
  var DANCE_STYLES = [
    { name: "Bounce", cssClass: "dance-bounce" },
    { name: "Twist", cssClass: "dance-twist" },
    { name: "Shimmy", cssClass: "dance-shimmy" },
    { name: "Disco", cssClass: "dance-disco" }
  ];
  var EMOTIONS = [":)", "B)", ":D", "xD", "o_o", ">:)", "^_^", "!!"];
  var SCALE_PRESETS = [0.75, 0.9, 1, 1.15, 1.3, 1.45, 1.6];
  var PALETTES = [
    { name: "Steel", head: "#64748b", body: "#4b5563", arms: "#6b7280", legs: "#475569" },
    { name: "Ocean", head: "#2563eb", body: "#1d4ed8", arms: "#0ea5e9", legs: "#1e40af" },
    { name: "Jungle", head: "#16a34a", body: "#15803d", arms: "#22c55e", legs: "#166534" },
    { name: "Solar", head: "#f59e0b", body: "#f97316", arms: "#fbbf24", legs: "#ea580c" },
    { name: "Candy", head: "#ec4899", body: "#d946ef", arms: "#f472b6", legs: "#be185d" },
    { name: "Neon", head: "#22d3ee", body: "#14b8a6", arms: "#06b6d4", legs: "#0f766e" },
    { name: "Shadow", head: "#334155", body: "#1e293b", arms: "#475569", legs: "#0f172a" },
    { name: "Ember", head: "#ef4444", body: "#dc2626", arms: "#f97316", legs: "#991b1b" }
  ];
  var PART_CATALOG = {
    heads: [
      { key: "classic", variant: 0 },
      { key: "round", variant: 1 },
      { key: "visor", variant: 2 },
      { key: "antenna", variant: 3 },
      { key: "radar", variant: 4 },
      { key: "crown", variant: 5 }
    ],
    bodies: [
      { key: "core", variant: 0, engine: false },
      { key: "tank", variant: 1, engine: false },
      { key: "vault", variant: 2, engine: false },
      { key: "shield", variant: 3, engine: false },
      { key: "turbo", variant: 4, engine: true },
      { key: "jet", variant: 5, engine: true }
    ],
    arms: [
      { key: "clamp", variant: 0 },
      { key: "joint", variant: 1 },
      { key: "hook", variant: 2 },
      { key: "tool", variant: 3 },
      { key: "blade", variant: 4 }
    ],
    legs: [
      { key: "walker", variant: 0 },
      { key: "boots", variant: 1 },
      { key: "wheels", variant: 2 },
      { key: "hover", variant: 3 },
      { key: "treads", variant: 4 }
    ]
  };
  var CONTROL_DEFINITIONS = [
    { id: "scene", action: "nextTheme", label: "Scene", icon: "icon-scene", variant: "scene" },
    { id: "color", action: "nextPalette", label: "Color", icon: "icon-color", variant: "color" },
    { id: "size", action: "nextSize", label: "Size", icon: "icon-size", variant: "size" },
    { id: "mix", action: "randomize", label: "Mix", icon: "icon-mix", variant: "mix" },
    { id: "move", action: "toggleMove", label: "Move", icon: "icon-move", variant: "move" },
    { id: "dance", action: "toggleDance", label: "Dance", icon: "icon-dance", variant: "dance" },
    { id: "hide", action: "toggleHideSeek", label: "Hide", icon: "icon-hide", variant: "hideSeek" }
  ];
  var HIDE_SEEK_SECONDS = 30;

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
      this.#bus.emit("game:theme", { state: this.snapshot });
    }
    toggleMove() {
      this.#isMoving = !this.#isMoving;
      this.#bus.emit("game:move", { state: this.snapshot });
    }
    toggleDance() {
      if (this.#isDancing) {
        this.#isDancing = false;
        this.#bus.emit("game:dance", { state: this.snapshot });
        return;
      }
      this.#danceIndex = (this.#danceIndex + 1) % DANCE_STYLES.length;
      this.#isDancing = true;
      this.#bus.emit("game:dance", { state: this.snapshot });
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
      this.#bus.emit("game:hide-seek:start", { state: this.snapshot });
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
      this.#bus.emit("game:hide-seek:end", { state: this.snapshot, reason: "cancel" });
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
      this.#bus.emit("game:hide-seek:found", { state: this.snapshot });
      this.#bus.emit("game:hide-seek:end", { state: this.snapshot, reason: "found" });
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
      this.#bus.emit("game:hide-seek:tick", { state: this.snapshot });
      if (secondsLeft <= 0) {
        this.#hideSeek = {
          ...this.#hideSeek,
          active: false,
          secondsLeft: HIDE_SEEK_SECONDS
        };
        this.#bus.emit("game:hide-seek:timeout", { state: this.snapshot });
        this.#bus.emit("game:hide-seek:end", { state: this.snapshot, reason: "timeout" });
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
      this.#bus.emit("robot:changed", {
        changed,
        state: this.snapshot
      });
    }
  };

  // js/services/AudioService.js
  var AudioService = class {
    #contextFactory;
    #speech;
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
      const ctx = this.#ensureContext();
      if (!ctx) {
        return;
      }
      const duration = 0.2;
      const sampleCount = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < sampleCount; i += 1) {
        const t = i / sampleCount;
        data[i] = (Math.random() * 2 - 1) * (1 - t) * 0.6;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + duration);
      noise.connect(gain);
      gain.connect(this.#masterGain);
      noise.start(ctx.currentTime);
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
      utterance.rate = 1.05;
      utterance.pitch = 1.12;
      utterance.volume = 0.7;
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
      this.#masterGain.gain.value = 0.32;
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

  // js/services/SceneService.js
  var SceneService = class _SceneService {
    #container;
    static #accentsByTheme = {
      Factory: [
        { x: 8, y: 20, w: 90, h: 90, color: "rgba(148,163,184,0.4)", shape: "square" },
        { x: 76, y: 12, w: 70, h: 70, color: "rgba(250,204,21,0.35)", shape: "line" },
        { x: 42, y: 66, w: 130, h: 16, color: "rgba(148,163,184,0.25)", shape: "line" }
      ],
      Space: [
        { x: 15, y: 25, w: 4, h: 4, color: "rgba(255,255,255,0.8)", shape: "circle" },
        { x: 50, y: 18, w: 5, h: 5, color: "rgba(255,255,255,0.7)", shape: "circle" },
        { x: 80, y: 36, w: 6, h: 6, color: "rgba(255,255,255,0.75)", shape: "circle" },
        { x: 68, y: 18, w: 88, h: 88, color: "rgba(147,51,234,0.35)", shape: "circle" }
      ],
      Moon: [
        { x: 75, y: 14, w: 120, h: 120, color: "rgba(255,255,255,0.32)", shape: "circle" },
        { x: 30, y: 75, w: 240, h: 40, color: "rgba(148,163,184,0.35)", shape: "line" }
      ],
      Jungle: [
        { x: 6, y: 15, w: 40, h: 220, color: "rgba(34,197,94,0.35)", shape: "line" },
        { x: 90, y: 18, w: 36, h: 240, color: "rgba(21,128,61,0.35)", shape: "line" },
        { x: 48, y: 68, w: 150, h: 150, color: "rgba(134,239,172,0.2)", shape: "circle" }
      ],
      Mars: [
        { x: 70, y: 20, w: 90, h: 90, color: "rgba(248,113,113,0.25)", shape: "circle" },
        { x: 35, y: 72, w: 220, h: 30, color: "rgba(180,83,9,0.32)", shape: "line" }
      ],
      Underwater: [
        { x: 20, y: 18, w: 55, h: 55, color: "rgba(255,255,255,0.22)", shape: "circle" },
        { x: 42, y: 50, w: 48, h: 48, color: "rgba(255,255,255,0.18)", shape: "circle" },
        { x: 75, y: 30, w: 60, h: 60, color: "rgba(255,255,255,0.2)", shape: "circle" }
      ],
      Candy: [
        { x: 16, y: 26, w: 56, h: 56, color: "rgba(236,72,153,0.35)", shape: "circle" },
        { x: 78, y: 24, w: 46, h: 46, color: "rgba(217,70,239,0.3)", shape: "square" },
        { x: 48, y: 66, w: 120, h: 18, color: "rgba(249,168,212,0.42)", shape: "line" }
      ],
      Volcano: [
        { x: 45, y: 60, w: 150, h: 150, color: "rgba(248,113,113,0.25)", shape: "circle" },
        { x: 48, y: 80, w: 260, h: 24, color: "rgba(249,115,22,0.42)", shape: "line" }
      ],
      Arctic: [
        { x: 15, y: 20, w: 10, h: 10, color: "rgba(255,255,255,0.72)", shape: "circle" },
        { x: 42, y: 35, w: 8, h: 8, color: "rgba(255,255,255,0.68)", shape: "circle" },
        { x: 75, y: 28, w: 9, h: 9, color: "rgba(255,255,255,0.74)", shape: "circle" }
      ],
      Sunset: [
        { x: 52, y: 18, w: 90, h: 90, color: "rgba(251,191,36,0.4)", shape: "circle" },
        { x: 50, y: 72, w: 260, h: 16, color: "rgba(255,255,255,0.2)", shape: "line" }
      ],
      Haunted: [
        { x: 20, y: 24, w: 70, h: 70, color: "rgba(167,139,250,0.26)", shape: "circle" },
        { x: 80, y: 14, w: 120, h: 120, color: "rgba(148,163,184,0.18)", shape: "circle" }
      ],
      Disco: [
        { x: 50, y: 22, w: 120, h: 120, color: "rgba(244,114,182,0.25)", shape: "circle" },
        { x: 50, y: 72, w: 280, h: 24, color: "rgba(56,189,248,0.2)", shape: "line" }
      ]
    };
    constructor(container) {
      this.#container = container;
    }
    render(themeName) {
      this.#container.className = `scene-layer scene-theme-${themeName.toLowerCase()}`;
      this.#container.innerHTML = "";
      const accents = _SceneService.#accentsByTheme[themeName] ?? [];
      accents.forEach((accent) => {
        const node = document.createElement("div");
        node.className = `scene-accent ${accent.shape}`;
        node.style.left = `${accent.x}%`;
        node.style.top = `${accent.y}%`;
        node.style.width = `${accent.w}px`;
        node.style.height = `${accent.h}px`;
        node.style.background = accent.color;
        node.style.transform = "translate(-50%, -50%)";
        this.#container.appendChild(node);
      });
      if (themeName === "Disco" || themeName === "Factory") {
        const grid = document.createElement("div");
        grid.className = "scene-grid";
        this.#container.appendChild(grid);
      }
    }
  };

  // js/controllers/AppController.js
  var AppController = class {
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
      }, 1e3);
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
  };

  // js/ui/ControlsView.js
  var ControlsView = class {
    #bus;
    #container;
    #buttons = /* @__PURE__ */ new Map();
    constructor(bus, container) {
      this.#bus = bus;
      this.#container = container;
    }
    init() {
      this.#container.innerHTML = "";
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
        button.addEventListener("click", () => {
          this.#bus.emit("ui:action", { action: definition.action });
        });
        this.#buttons.set(definition.action, button);
        this.#container.appendChild(button);
      });
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
    }
    init() {
      this.#nameButton.addEventListener("click", () => {
        this.#bus.emit("ui:name-cycle");
      });
      this.#emotionButton.addEventListener("click", () => {
        this.#bus.emit("ui:emotion-cycle");
      });
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
        this.#timer.textContent = "30";
        return;
      }
      this.#hideSeekHud.classList.remove("is-hidden");
      this.#timer.textContent = String(secondsLeft);
      this.#timer.classList.toggle("is-warning", secondsLeft <= 5);
    }
    showToast(message, duration = 1800) {
      if (this.#toastTimer !== null) {
        clearTimeout(this.#toastTimer);
        this.#toastTimer = null;
      }
      if (this.#toastHideTimer !== null) {
        clearTimeout(this.#toastHideTimer);
        this.#toastHideTimer = null;
      }
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
  };

  // js/ui/StageView.js
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
    #movePosition = { x: 0, y: 0 };
    #hideSeekActive = false;
    #hideSeekListener = null;
    constructor(bus, elements) {
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
    }
    init() {
      [this.#head, this.#body, this.#armLeft, this.#armRight, this.#legs].forEach((node) => {
        node.addEventListener("click", () => {
          if (this.#hideSeekActive) {
            return;
          }
          const part = node.dataset.part;
          this.#bus.emit("ui:part-cycle", { part });
        });
      });
    }
    render(state) {
      this.#renderPiece(this.#head, "head", state.head.variant, state.palette.head);
      this.#renderPiece(this.#body, "body", state.body.variant, state.palette.body, state.bodyHasEngine);
      this.#renderPiece(this.#armLeft, "arm", state.arms.variant, state.palette.arms, false, true);
      this.#renderPiece(this.#armRight, "arm", state.arms.variant, state.palette.arms, false, false);
      this.#renderPiece(this.#legs, "legs", state.legs.variant, state.palette.legs);
      this.setScale(state.scale);
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
    stepMovement() {
      const bounds = this.#computeBounds();
      const nextX = this.#movePosition.x + (Math.random() - 0.5) * 170;
      const nextY = this.#movePosition.y + (Math.random() - 0.5) * 90;
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
    beginHideSeek() {
      if (this.#hideSeekActive) {
        return;
      }
      this.#hideSeekActive = true;
      const spot = this.#randomHideSpot();
      this.#assembly.classList.add("robot-hidden");
      this.#applyMover(spot.x, spot.y);
      this.#hideSeekListener = (event) => {
        event.stopPropagation();
        if (!this.#hideSeekActive) {
          return;
        }
        this.#bus.emit("ui:hide-seek-found");
      };
      this.#assembly.addEventListener("click", this.#hideSeekListener);
    }
    endHideSeek() {
      if (!this.#hideSeekActive) {
        return;
      }
      this.#hideSeekActive = false;
      this.#assembly.classList.remove("robot-hidden");
      if (this.#hideSeekListener) {
        this.#assembly.removeEventListener("click", this.#hideSeekListener);
        this.#hideSeekListener = null;
      }
      this.#applyMover(this.#movePosition.x, this.#movePosition.y);
    }
    destroy() {
      this.endHideSeek();
    }
    #renderPiece(targetButton, kind, variant, color, isEngine = false, mirror = false) {
      const existingExhaust = kind === "body" ? targetButton.querySelector("#exhaust-container") : null;
      targetButton.innerHTML = "";
      if (kind === "body") {
        targetButton.dataset.engine = isEngine ? "true" : "false";
      }
      const piece = document.createElement("div");
      piece.className = "robot-piece";
      piece.style.setProperty("--piece-color", color);
      if (kind === "head") {
        piece.classList.add("robot-head-shape");
        piece.style.borderRadius = this.#headRadiusFor(variant);
      }
      if (kind === "body") {
        piece.classList.add("robot-body-shape");
        piece.style.borderRadius = this.#bodyRadiusFor(variant);
        if (isEngine) {
          piece.classList.add("robot-body-engine");
        }
      }
      if (kind === "arm") {
        piece.classList.add("robot-arm-shape");
        piece.style.borderRadius = this.#armRadiusFor(variant);
        if (mirror) {
          piece.classList.add("robot-arm-mirror");
        }
      }
      if (kind === "legs") {
        piece.classList.add("robot-legs-shape");
        piece.style.borderRadius = this.#legsRadiusFor(variant);
      }
      targetButton.appendChild(piece);
      if (existingExhaust) {
        targetButton.appendChild(existingExhaust);
      }
    }
    #headRadiusFor(variant) {
      const map = ["16px", "42px", "10px", "28px", "20px 20px 8px 8px", "8px 8px 26px 26px"];
      return map[variant % map.length];
    }
    #bodyRadiusFor(variant) {
      const map = ["18px", "50px", "8px", "18px 18px 30px 30px", "12px", "46px 46px 14px 14px"];
      return map[variant % map.length];
    }
    #armRadiusFor(variant) {
      const map = ["999px", "24px", "12px", "20px", "999px 999px 20px 20px"];
      return map[variant % map.length];
    }
    #legsRadiusFor(variant) {
      const map = ["0 0 16px 16px", "12px", "999px", "24px", "10px"];
      return map[variant % map.length];
    }
    #applyMover(x, y) {
      this.#mover.style.transform = `translate(-50%, -50%) translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    }
    #computeBounds() {
      const width = this.#region.clientWidth;
      const height = this.#region.clientHeight;
      return {
        minX: -Math.max(60, width * 0.32),
        maxX: Math.max(60, width * 0.32),
        minY: -Math.max(50, height * 0.32),
        maxY: Math.max(20, height * 0.16)
      };
    }
    #randomHideSpot() {
      const bounds = this.#computeBounds();
      const spots = [
        { x: bounds.minX + 30, y: bounds.minY + 20 },
        { x: bounds.maxX - 30, y: bounds.minY + 15 },
        { x: bounds.minX + 45, y: bounds.maxY - 10 },
        { x: bounds.maxX - 45, y: bounds.maxY - 8 },
        { x: 0, y: bounds.minY + 5 }
      ];
      return spots[Math.floor(Math.random() * spots.length)];
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
    const bus = new EventBus();
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
    const sceneService = new SceneService(queryRequired("scene-layer"));
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
