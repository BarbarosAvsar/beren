import { HIDE_SEEK_SECONDS } from "../core/Config.js";
import { UI_EVENTS } from "../core/events.js";

export class HudView {
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
}
