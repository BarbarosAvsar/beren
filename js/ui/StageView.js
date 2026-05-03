import {
  HIDE_HINT_DURATION_MS,
  HIDE_HINT_INTERVAL_MS,
  MOVE_DELTA_X,
  MOVE_DELTA_Y,
  MOVE_TRANSITION_MS,
} from "../core/Config.js";
import { UI_EVENTS } from "../core/events.js";

const VISUAL_KEYS = new Set(["characterMode", "head", "body", "arms", "legs", "palette", "scale"]);

export class StageView {
  #bus;
  #region;
  #mover;
  #dancer;
  #assembly;
  #head;
  #body;
  #armLeft;
  #armRight;
  #legLeft;
  #legRight;
  #partNodes;
  #partClickHandlers = new Map();
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
  #renderedCharacterMode = null;
  #renderedBodyHasEngine = null;
  #renderedPalette = {
    head: null,
    body: null,
    arms: null,
    legs: null,
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
    this.#legLeft = elements.legLeft;
    this.#legRight = elements.legRight;
    this.#partNodes = [this.#head, this.#body, this.#armLeft, this.#armRight, this.#legLeft, this.#legRight];

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

    const modeChanged = this.#renderedCharacterMode !== state.characterMode;
    const shouldRebuildHead = firstRender || modeChanged || changedSet.has("head");
    const shouldRebuildBody = firstRender || modeChanged || changedSet.has("body") || this.#renderedBodyHasEngine !== state.bodyHasEngine;
    const shouldRebuildArms = firstRender || modeChanged || changedSet.has("arms");
    const shouldRebuildLegs = firstRender || modeChanged || changedSet.has("legs");

    if (shouldRebuildHead && this.#shouldRenderPiece(this.#renderedHeadKey, state.head.key, firstRender, changedSet, "head")) {
      this.#renderPiece(this.#head, {
        mode: state.characterMode,
        kind: "head",
        key: state.head.key,
        variant: state.head.variant,
        color: state.palette.head,
      });
    }

    if (shouldRebuildBody && this.#shouldRenderBody(state, firstRender, changedSet)) {
      this.#renderPiece(this.#body, {
        mode: state.characterMode,
        kind: "body",
        key: state.body.key,
        variant: state.body.variant,
        color: state.palette.body,
        isEngine: state.bodyHasEngine,
      });
    }

    if (shouldRebuildArms && this.#shouldRenderPiece(this.#renderedArmsKey, state.arms.key, firstRender, changedSet, "arms")) {
      this.#renderPiece(this.#armLeft, {
        mode: state.characterMode,
        kind: "arm",
        key: state.arms.key,
        variant: state.arms.variant,
        color: state.palette.arms,
        side: "left",
      });
      this.#renderPiece(this.#armRight, {
        mode: state.characterMode,
        kind: "arm",
        key: state.arms.key,
        variant: state.arms.variant,
        color: state.palette.arms,
        side: "right",
      });
    }

    if (shouldRebuildLegs && this.#shouldRenderPiece(this.#renderedLegsKey, state.legs.key, firstRender, changedSet, "legs")) {
      this.#renderPiece(this.#legLeft, {
        mode: state.characterMode,
        kind: "legs",
        key: state.legs.key,
        variant: state.legs.variant,
        color: state.palette.legs,
        side: "left",
      });
      this.#renderPiece(this.#legRight, {
        mode: state.characterMode,
        kind: "legs",
        key: state.legs.key,
        variant: state.legs.variant,
        color: state.palette.legs,
        side: "right",
      });
    }

    if (changedSet.has("palette") && !firstRender) {
      this.#applyPaletteChanges(state, {
        head: shouldRebuildHead,
        body: shouldRebuildBody,
        arms: shouldRebuildArms,
        legs: shouldRebuildLegs,
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
      y: Math.max(bounds.minY, Math.min(bounds.maxY, nextY)),
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
        mode: state.characterMode,
        kind: "head",
        key: state.head.key,
        variant: state.head.variant,
        color: state.palette.head,
      });
    }

    if (!rebuilt.body && this.#renderedPalette.body !== state.palette.body && !this.#setPieceColor(this.#body, state.palette.body)) {
      this.#renderPiece(this.#body, {
        mode: state.characterMode,
        kind: "body",
        key: state.body.key,
        variant: state.body.variant,
        color: state.palette.body,
        isEngine: state.bodyHasEngine,
      });
    }

    if (!rebuilt.arms && this.#renderedPalette.arms !== state.palette.arms) {
      const updatedLeft = this.#setPieceColor(this.#armLeft, state.palette.arms);
      const updatedRight = this.#setPieceColor(this.#armRight, state.palette.arms);
      if (!updatedLeft || !updatedRight) {
        this.#renderPiece(this.#armLeft, {
          mode: state.characterMode,
          kind: "arm",
          key: state.arms.key,
          variant: state.arms.variant,
          color: state.palette.arms,
          side: "left",
        });
        this.#renderPiece(this.#armRight, {
          mode: state.characterMode,
          kind: "arm",
          key: state.arms.key,
          variant: state.arms.variant,
          color: state.palette.arms,
          side: "right",
        });
      }
    }

    if (!rebuilt.legs && this.#renderedPalette.legs !== state.palette.legs) {
      const updatedLeft = this.#setPieceColor(this.#legLeft, state.palette.legs);
      const updatedRight = this.#setPieceColor(this.#legRight, state.palette.legs);
      if (!updatedLeft || !updatedRight) {
        this.#renderPiece(this.#legLeft, {
          mode: state.characterMode,
          kind: "legs",
          key: state.legs.key,
          variant: state.legs.variant,
          color: state.palette.legs,
          side: "left",
        });
        this.#renderPiece(this.#legRight, {
          mode: state.characterMode,
          kind: "legs",
          key: state.legs.key,
          variant: state.legs.variant,
          color: state.palette.legs,
          side: "right",
        });
      }
    }
  }

  #shouldRenderPiece(renderedKey, nextKey, firstRender, changedSet, keyName) {
    if (firstRender) {
      return true;
    }

    if (renderedKey !== nextKey) {
      return true;
    }

    return changedSet.has(keyName) || changedSet.has("characterMode");
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

    return changedSet.has("body") || changedSet.has("characterMode");
  }

  #renderPiece(targetButton, options) {
    const {
      mode,
      kind,
      key,
      variant = 0,
      color,
      side = null,
      isEngine = false,
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
      side ? `robot-piece-side-${side}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    piece.style.setProperty("--piece-color", color);

    if (kind === "body" && isEngine) {
      piece.classList.add("robot-body-engine");
    }

    this.#appendDetail(piece, kind, variant);

    targetButton.appendChild(piece);
    if (existingExhaust) {
      targetButton.appendChild(existingExhaust);
    }
  }

  #appendDetail(piece, kind, variant) {
    const detail = document.createElement("span");
    detail.className = `piece-detail piece-detail-${kind} piece-detail-${kind}-variant-${variant}`;
    piece.appendChild(detail);

    const detailSecondary = document.createElement("span");
    detailSecondary.className = `piece-detail-secondary piece-detail-secondary-${kind} piece-detail-secondary-${kind}-variant-${variant}`;
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
    this.#renderedCharacterMode = state.characterMode;
    this.#renderedHeadKey = state.head.key;
    this.#renderedBodyKey = state.body.key;
    this.#renderedArmsKey = state.arms.key;
    this.#renderedLegsKey = state.legs.key;
    this.#renderedBodyHasEngine = state.bodyHasEngine;
    this.#renderedPalette = {
      head: state.palette.head,
      body: state.palette.body,
      arms: state.palette.arms,
      legs: state.palette.legs,
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
      { x: 0, y: bounds.minY + 15, peek: "up", occluderId: null },
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
      const max = Math.floor(0x100000000 / length) * length;
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
      maxY: Math.max(24, height * 0.22),
    };
  }
}
