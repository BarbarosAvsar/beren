import { CONTROL_DEFINITIONS } from "../core/Config.js";

export class ControlsView {
  #bus;
  #container;
  #buttons = new Map();

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
}
