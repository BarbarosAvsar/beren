/**
 * @class ExhaustEffect
 * @description Manages exhaust effects (smoke and fire jets) for engine/motor robot bodies.
 * Automatically detects engine bodies and injects animated particles into the
 * exhaust container. Supports two modes: smoke (idle/move) and fire (dancing/jet).
 */
export class ExhaustEffect {
    /** @type {HTMLElement} */
    #container;
    /** @type {number|null} */
    #interval = null;
    /** @type {'smoke'|'fire'|'off'} */
    #mode = 'off';

    static #SMOKE_COLORS = ['#94a3b8', '#64748b', '#9ca3af', '#6b7280', '#d1d5db'];
    static #FIRE_COLORS = ['#ef4444', '#f97316', '#eab308', '#fbbf24', '#fb923c'];

    /**
     * @param {HTMLElement} container - The exhaust container element (#exhaust-container).
     */
    constructor(container) {
        this.#container = container;
    }

    /** @param {'smoke'|'fire'|'off'} mode */
    setMode(mode) {
        if (this.#mode === mode) return;
        this.#mode = mode;
        this.#stop();
        if (mode !== 'off') this.#start();
    }

    #start() {
        const interval = this.#mode === 'fire' ? 80 : 200;
        this.#interval = setInterval(() => this.#emit(), interval);
    }

    #stop() {
        if (this.#interval) {
            clearInterval(this.#interval);
            this.#interval = null;
        }
        // Fade out existing particles
        Array.from(this.#container.children).forEach(el => el.remove());
    }

    #emit() {
        const isFireMode = this.#mode === 'fire';
        const colors = isFireMode ? ExhaustEffect.#FIRE_COLORS : ExhaustEffect.#SMOKE_COLORS;
        const count = isFireMode ? 3 : 1;

        for (let i = 0; i < count; i++) {
            this.#spawnParticle(colors, isFireMode);
        }
    }

    #spawnParticle(colors, isFire) {
        const el = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = isFire ? (6 + Math.random() * 12) : (12 + Math.random() * 16);
        const xOff = (Math.random() - 0.5) * 40;

        el.className = isFire ? 'exhaust-fire-particle' : 'exhaust-smoke-particle';
        el.style.cssText = `
      width:${size}px;
      height:${size}px;
      background:${color};
      left:calc(50% + ${xOff}px);
      box-shadow: 0 0 ${isFire ? size * 2 : 4}px ${color};
      opacity:${isFire ? 0.9 : 0.6};
    `;

        this.#container.appendChild(el);
        // Remove particle after animation completes
        const dur = isFire ? 400 : 800;
        setTimeout(() => el.remove(), dur);
    }

    /** Completely stops and cleans up the exhaust effect. */
    destroy() {
        this.#stop();
    }
}
