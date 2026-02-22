/**
 * @class Dashboard
 * @description Renders and manages the fixed bottom control bar with toy-style buttons.
 * Wires all button clicks to provided callback callbacks.
 */
export class Dashboard {
    /** @type {HTMLElement} */
    #el;
    /** @type {Object.<string, Function>} */
    #callbacks;

    /**
     * @param {HTMLElement} el - The dashboard container element.
     * @param {Object} callbacks - Object of named callback functions.
     */
    constructor(el, callbacks) {
        this.#el = el;
        this.#callbacks = callbacks;
        this.#render();
    }

    #render() {
        this.#el.innerHTML = `
      <button class="toy-btn" id="btn-scene" data-action="nextTheme" style="--btn-color:#4f46e5;--btn-shadow:#312e81" title="Change scene">
        <span class="toy-btn-icon">🚀</span>
        <span class="toy-btn-label">MAP</span>
      </button>
      <button class="toy-btn" id="btn-color" data-action="splashColor" style="--btn-color:#10b981;--btn-shadow:#064e3b" title="Color splash">
        <span class="toy-btn-icon">🎨</span>
        <span class="toy-btn-label">COLOR</span>
      </button>
      <button class="toy-btn" id="btn-size" data-action="changeSize" style="--btn-color:#ec4899;--btn-shadow:#831843" title="Change size">
        <span class="toy-btn-icon">⚖️</span>
        <span class="toy-btn-label">SIZE</span>
      </button>
      <button class="toy-btn toy-btn-big" id="btn-mix" data-action="randomize" style="--btn-color:#f59e0b;--btn-shadow:#92400e" title="Randomize all">
        <span class="toy-btn-icon toy-btn-icon-big">🎲</span>
        <span class="toy-btn-label">MIX!</span>
      </button>
      <button class="toy-btn" id="btn-move" data-action="toggleMove" style="--btn-color:#0ea5e9;--btn-shadow:#0c4a6e" title="Toggle movement">
        <span class="toy-btn-icon" id="btn-move-icon">🏎️</span>
        <span class="toy-btn-label" id="btn-move-label">GO!</span>
      </button>
      <button class="toy-btn" id="btn-dance" data-action="toggleDance" style="--btn-color:#a855f7;--btn-shadow:#581c87" title="Toggle dance">
        <span class="toy-btn-icon">🕺</span>
        <span class="toy-btn-label">DANCE</span>
      </button>
      <button class="toy-btn" id="btn-snap" data-action="takePhoto" style="--btn-color:#2563eb;--btn-shadow:#1e3a8a" title="Take photo">
        <span class="toy-btn-icon">📸</span>
        <span class="toy-btn-label">SNAP</span>
      </button>
      <button class="toy-btn" id="btn-gallery" data-action="openGallery" style="--btn-color:#7c3aed;--btn-shadow:#3b0764" title="Open gallery">
        <span class="toy-btn-icon" id="btn-gallery-icon">📖</span>
        <span class="toy-btn-label">BOOK</span>
      </button>
      <button class="toy-btn" id="btn-hide" data-action="toggleHideSeek" style="--btn-color:#0f766e;--btn-shadow:#042f2e" title="Play hide & seek">
        <span class="toy-btn-icon">🙈</span>
        <span class="toy-btn-label">HIDE</span>
      </button>
    `;

        // Wire all buttons
        this.#el.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                if (this.#callbacks[action]) this.#callbacks[action]();
            });
        });
    }

    /**
     * Updates the Move button appearance.
     * @param {boolean} isMoving
     */
    setMoving(isMoving) {
        const btn = this.#el.querySelector('#btn-move');
        const icon = this.#el.querySelector('#btn-move-icon');
        const label = this.#el.querySelector('#btn-move-label');
        if (!btn) return;
        btn.style.setProperty('--btn-color', isMoving ? '#ef4444' : '#0ea5e9');
        btn.style.setProperty('--btn-shadow', isMoving ? '#7f1d1d' : '#0c4a6e');
        icon.textContent = isMoving ? '🛑' : '🏎️';
        label.textContent = isMoving ? 'STOP' : 'GO!';
    }

    /**
     * Updates the Dance button appearance.
     * @param {boolean} isDancing
     */
    setDancing(isDancing) {
        const btn = this.#el.querySelector('#btn-dance');
        if (!btn) return;
        btn.style.setProperty('--btn-color', isDancing ? '#f43f5e' : '#a855f7');
        btn.style.setProperty('--btn-shadow', isDancing ? '#881337' : '#581c87');
    }

    /**
     * Updates the Gallery button badge count.
     * @param {number} count
     */
    setGalleryCount(count) {
        const icon = this.#el.querySelector('#btn-gallery-icon');
        if (!icon) return;
        icon.innerHTML = count > 0
            ? `📖<span class="gallery-badge">${count}</span>`
            : '📖';
    }

    /**
     * Updates the Hide & Seek button appearance.
     * @param {boolean} isActive
     */
    setHideSeekActive(isActive) {
        const btn = this.#el.querySelector('#btn-hide');
        if (!btn) return;
        btn.style.setProperty('--btn-color', isActive ? '#dc2626' : '#0f766e');
        btn.style.setProperty('--btn-shadow', isActive ? '#7f1d1d' : '#042f2e');
        btn.querySelector('.toy-btn-icon').textContent = isActive ? '👁️' : '🙈';
        btn.querySelector('.toy-btn-label').textContent = isActive ? 'FOUND!' : 'HIDE';
    }
}
