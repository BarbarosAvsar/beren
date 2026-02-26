export class EventBus {
  #target;
  #allowedTypes;

  constructor(options = {}) {
    this.#target = new EventTarget();
    this.#allowedTypes = this.#normalizeAllowedTypes(options.allowedTypes);
  }

  on(type, handler, options) {
    this.#assertKnownType(type);
    this.#target.addEventListener(type, handler, options);
  }

  off(type, handler, options) {
    this.#assertKnownType(type);
    this.#target.removeEventListener(type, handler, options);
  }

  emit(type, detail = {}) {
    this.#assertKnownType(type);
    this.#target.dispatchEvent(new CustomEvent(type, { detail }));
  }

  #normalizeAllowedTypes(allowedTypes) {
    if (!allowedTypes) {
      return null;
    }

    const normalized = Array.isArray(allowedTypes) ? allowedTypes : Array.from(allowedTypes);
    return new Set(normalized);
  }

  #assertKnownType(type) {
    if (typeof type !== "string" || type.length === 0) {
      throw new Error("Event type must be a non-empty string.");
    }

    if (!this.#allowedTypes || this.#allowedTypes.has(type)) {
      return;
    }

    throw new Error(`Unknown event type "${type}". Add it to js/core/events.js before use.`);
  }
}
