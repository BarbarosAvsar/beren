export class EventBus {
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
}
