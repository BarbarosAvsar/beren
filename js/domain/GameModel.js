import { DANCE_STYLES, HIDE_SEEK_SECONDS, THEMES } from "../core/Config.js";
import { GAME_EVENTS } from "../core/events.js";

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
      secondsLeft: HIDE_SEEK_SECONDS,
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
      secondsLeft: HIDE_SEEK_SECONDS,
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
      score: this.#hideSeek.score + 1,
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
      secondsLeft,
    };

    this.#bus.emit(GAME_EVENTS.HIDE_SEEK_TICK, { state: this.snapshot });

    if (secondsLeft <= 0) {
      this.#hideSeek = {
        ...this.#hideSeek,
        active: false,
        secondsLeft: HIDE_SEEK_SECONDS,
      };
      this.#bus.emit(GAME_EVENTS.HIDE_SEEK_TIMEOUT, { state: this.snapshot });
      this.#bus.emit(GAME_EVENTS.HIDE_SEEK_END, { state: this.snapshot, reason: "timeout" });
    }
  }
}
