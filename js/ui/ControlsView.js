import { CONTROL_DEFINITIONS } from "../core/Config.js";
import { UI_EVENTS } from "../core/events.js";

export class ControlsView {
  #bus;
  #container;
  #buttons = new Map();
  #handlers = new Map();
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
}
