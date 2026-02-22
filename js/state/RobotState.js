import { RobotNames } from '../utils/RobotNames.js';

/**
 * @typedef {Object} Palette
 * @property {string} name - Palette name.
 * @property {number} h   - Head hue-rotate degrees.
 * @property {number} b   - Body hue-rotate degrees.
 * @property {number} l   - Legs hue-rotate degrees.
 * @property {number} a   - Arms hue-rotate degrees.
 */

/**
 * @class RobotState
 * @description Manages the state of the robot's parts, color, scale, and name.
 * Emits a 'change' CustomEvent on the window when state updates, enabling
 * a reactive UI without tight coupling (Observer pattern).
 */
export class RobotState extends EventTarget {
    /** @type {string[]} */
    static EMOTIONS = ['😊', '😎', '🤩', '🤪', '🤠', '🤖', '👑', '🔥'];

    /** @type {Palette[]} */
    static PALETTES = [
        { name: 'Fire Hero', h: 350, b: 350, l: 40, a: 350 },
        { name: 'Ocean Hero', h: 200, b: 200, l: 200, a: 200 },
        { name: 'Jungle Hero', h: 120, b: 120, l: 120, a: 120 },
        { name: 'Golden Hero', h: 45, b: 45, l: 45, a: 45 },
        { name: 'Space Hero', h: 270, b: 270, l: 270, a: 270 },
        { name: 'Shadow Hero', h: 0, b: 0, l: 0, a: 0 },
        { name: 'Laser Hero', h: 170, b: 170, l: 170, a: 170 },
        { name: 'Candy Hero', h: 310, b: 310, l: 310, a: 310 },
    ];

    #headIndex = 0;
    #bodyIndex = 0;
    #legsIndex = 0;
    #armsIndex = 0;
    #emotionIndex = 0;
    #paletteIndex = 3; // Golden Hero default
    #scale = 1;
    #name = '';
    #headCount = 12;
    #bodyCount = 14; // includes 2 motor bodies
    #legsCount = 12;
    #armsCount = 12;

    constructor(headCount, bodyCount, legsCount, armsCount) {
        super();
        this.#headCount = headCount;
        this.#bodyCount = bodyCount;
        this.#legsCount = legsCount;
        this.#armsCount = armsCount;
        this.#name = RobotNames.generate();
    }

    /** Notifies listeners of state change. */
    #emit(detail = {}) {
        this.dispatchEvent(new CustomEvent('change', { detail }));
    }

    // ── Accessors ─────────────────────────────────────────────────────────────
    get headIndex() { return this.#headIndex; }
    get bodyIndex() { return this.#bodyIndex; }
    get legsIndex() { return this.#legsIndex; }
    get armsIndex() { return this.#armsIndex; }
    get emotionIndex() { return this.#emotionIndex; }
    get palette() { return RobotState.PALETTES[this.#paletteIndex]; }
    get scale() { return this.#scale; }
    get name() { return this.#name; }
    get emotion() { return RobotState.EMOTIONS[this.#emotionIndex]; }

    /** @returns {boolean} True when current body is a motor/engine type. */
    get bodyHasEngine() { return this.#bodyIndex >= 12; }

    // ── Mutators ──────────────────────────────────────────────────────────────
    nextHead() {
        this.#headIndex = (this.#headIndex + 1) % this.#headCount;
        this.#emit({ changed: 'head' });
    }

    nextBody() {
        this.#bodyIndex = (this.#bodyIndex + 1) % this.#bodyCount;
        this.#emit({ changed: 'body' });
    }

    nextLegs() {
        this.#legsIndex = (this.#legsIndex + 1) % this.#legsCount;
        this.#emit({ changed: 'legs' });
    }

    nextArms() {
        this.#armsIndex = (this.#armsIndex + 1) % this.#armsCount;
        this.#emit({ changed: 'arms' });
    }

    nextEmotion() {
        this.#emotionIndex = (this.#emotionIndex + 1) % RobotState.EMOTIONS.length;
        this.#emit({ changed: 'emotion' });
    }

    nextName() {
        this.#name = RobotNames.generate();
        this.#emit({ changed: 'name' });
    }

    splashColor() {
        const prev = this.#paletteIndex;
        do {
            this.#paletteIndex = Math.floor(Math.random() * RobotState.PALETTES.length);
        } while (this.#paletteIndex === prev && RobotState.PALETTES.length > 1);
        this.#emit({ changed: 'palette' });
    }

    /**
     * Randomly changes robot scale.
     * @returns {number} The new scale value.
     */
    changeSize() {
        const options = [0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 2.2];
        let newScale;
        do { newScale = options[Math.floor(Math.random() * options.length)]; }
        while (newScale === this.#scale);
        this.#scale = newScale;
        this.#emit({ changed: 'scale' });
        return newScale;
    }

    randomize() {
        this.#headIndex = Math.floor(Math.random() * this.#headCount);
        this.#bodyIndex = Math.floor(Math.random() * this.#bodyCount);
        this.#legsIndex = Math.floor(Math.random() * this.#legsCount);
        this.#armsIndex = Math.floor(Math.random() * this.#armsCount);
        this.#emotionIndex = Math.floor(Math.random() * RobotState.EMOTIONS.length);
        this.#paletteIndex = Math.floor(Math.random() * RobotState.PALETTES.length);
        this.#name = RobotNames.generate();
        this.#emit({ changed: 'all' });
    }
}
