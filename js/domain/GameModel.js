import { DANCE_STYLES, HIDE_SEEK_SECONDS, THEMES } from "../core/Config.js";

export class GameModel {
  #bus;
  #themeIndex = 0;
  #danceIndex = 0;
  #isMoving = false;
  #isDancing = false;
  #hideSeek = {
    active: false,
    secondsLeft: HIDE_SEEK_SECONDS,
    score: 0,
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
      hideSeek: { ...this.#hideSeek },
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
      secondsLeft: HIDE_SEEK_SECONDS,
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
      secondsLeft: HIDE_SEEK_SECONDS,
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
      score: this.#hideSeek.score + 1,
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
      secondsLeft,
    };

    this.#bus.emit("game:hide-seek:tick", { state: this.snapshot });

    if (secondsLeft <= 0) {
      this.#hideSeek = {
        ...this.#hideSeek,
        active: false,
        secondsLeft: HIDE_SEEK_SECONDS,
      };
      this.#bus.emit("game:hide-seek:timeout", { state: this.snapshot });
      this.#bus.emit("game:hide-seek:end", { state: this.snapshot, reason: "timeout" });
    }
  }
}
