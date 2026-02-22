/**
 * @class SparkleTrail
 * @description Creates sparkle particles that follow mouse or touch movements.
 * Uses pure DOM manipulation with CSS animations for compatibility with html2canvas.
 */
export class SparkleTrail {
    /** @type {HTMLElement} */
    #layer;
    /** @type {number} - Throttle last event time */
    #lastTime = 0;
    /** @type {Function} */
    #boundHandleMove;

    static #COLORS = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#7CFC00', '#BA55D3', '#FF4500'];
    static #SHAPES = ['circle', 'star', 'heart'];

    /**
     * @param {HTMLElement} layerEl - The sparkle container element.
     */
    constructor(layerEl) {
        this.#layer = layerEl;
        this.#boundHandleMove = this.#handleMove.bind(this);
        this.#mount();
    }

    #mount() {
        window.addEventListener('mousemove', this.#boundHandleMove, { passive: true });
        window.addEventListener('touchmove', this.#boundHandleMove, { passive: true });
    }

    /** Unmounts listeners – call when destroying the component. */
    destroy() {
        window.removeEventListener('mousemove', this.#boundHandleMove);
        window.removeEventListener('touchmove', this.#boundHandleMove);
    }

    #handleMove(e) {
        const now = Date.now();
        if (now - this.#lastTime < 40) return; // Throttle to ~25 sparkles/sec
        this.#lastTime = now;

        const x = e.clientX ?? e.touches?.[0]?.clientX;
        const y = e.clientY ?? e.touches?.[0]?.clientY;
        if (x === undefined || y === undefined) return;
        this.#spawnSparkle(x, y);
    }

    #spawnSparkle(x, y) {
        const color = SparkleTrail.#COLORS[Math.floor(Math.random() * SparkleTrail.#COLORS.length)];
        const shape = SparkleTrail.#SHAPES[Math.floor(Math.random() * SparkleTrail.#SHAPES.length)];
        const size = 8 + Math.random() * 16;
        const rot = Math.random() * 360;

        const el = document.createElement('div');
        el.className = 'sparkle-particle';
        el.style.cssText = `
      left:${x - size / 2}px;
      top:${y - size / 2}px;
      width:${size}px;
      height:${size}px;
      --sparkle-color:${color};
      --sparkle-rot:${rot}deg;
    `;

        if (shape === 'circle') {
            el.style.borderRadius = '50%';
            el.style.background = color;
            el.style.boxShadow = `0 0 ${size}px ${color}`;
        } else {
            el.style.fontSize = `${size}px`;
            el.style.lineHeight = '1';
            el.style.color = color;
            el.style.textShadow = `0 0 ${size / 2}px ${color}`;
            el.textContent = shape === 'star' ? '★' : '♥';
        }

        this.#layer.appendChild(el);

        // Remove after animation completes
        setTimeout(() => el.remove(), 600);
    }
}
