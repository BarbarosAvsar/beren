export class ExhaustService {
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
      setTimeout: clock.setTimeout.bind(clock),
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
}
