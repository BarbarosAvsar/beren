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
      maxY: Math.max(20, height * 0.16),
    };
  }

  #randomHideSpot() {
    const bounds = this.#computeBounds();
    const spots = [
      { x: bounds.minX + 30, y: bounds.minY + 20 },
      { x: bounds.maxX - 30, y: bounds.minY + 15 },
      { x: bounds.minX + 45, y: bounds.maxY - 10 },
      { x: bounds.maxX - 45, y: bounds.maxY - 8 },
      { x: 0, y: bounds.minY + 5 },
    ];

    return spots[Math.floor(Math.random() * spots.length)];
  }
}
