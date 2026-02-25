import {
  HIDE_HINT_DURATION_MS,
  HIDE_HINT_INTERVAL_MS,
  MOVE_DELTA_X,
  MOVE_DELTA_Y,
  MOVE_TRANSITION_MS,
} from "../core/Config.js";

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
  #legs;
  #movePosition = { x: 0, y: 0 };
  #hideSeekActive = false;
  #hideSeekListener = null;
  #hideHintInterval = null;
  #hideHintTimeout = null;
  #activeOccluderId = null;

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
    this.#mover.style.setProperty("--move-transition-ms", `${MOVE_TRANSITION_MS}ms`);
    this.setMotionState({ isMoving: false, danceClass: null });

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
    this.#renderPiece(this.#head, {
      kind: "head",
      key: state.head.key,
      color: state.palette.head,
    });

    this.#renderPiece(this.#body, {
      kind: "body",
      key: state.body.key,
      color: state.palette.body,
      isEngine: state.bodyHasEngine,
    });

    this.#renderPiece(this.#armLeft, {
      kind: "arm",
      key: state.arms.key,
      color: state.palette.arms,
      mirror: true,
    });

    this.#renderPiece(this.#armRight, {
      kind: "arm",
      key: state.arms.key,
      color: state.palette.arms,
      mirror: false,
    });

    this.#renderPiece(this.#legs, {
      kind: "legs",
      key: state.legs.key,
      color: state.palette.legs,
    });

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
      this.#bus.emit("ui:hide-seek-found");
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
  }

  #renderPiece(targetButton, options) {
    const { kind, key, color, isEngine = false, mirror = false } = options;
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

    if (kind === "arm" && mirror) {
      piece.classList.add("robot-arm-mirror");
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
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    const bounds = this.#computeBounds();
    const fallbackSpots = [
      { x: bounds.minX + 45, y: bounds.maxY - 12, peek: "right", occluderId: null },
      { x: bounds.maxX - 45, y: bounds.maxY - 10, peek: "left", occluderId: null },
      { x: 0, y: bounds.minY + 15, peek: "up", occluderId: null },
    ];

    return fallbackSpots[Math.floor(Math.random() * fallbackSpots.length)];
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
