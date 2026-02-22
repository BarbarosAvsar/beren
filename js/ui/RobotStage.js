import { HeadRenderer } from '../parts/Heads.js';
import { BodyRenderer } from '../parts/Bodies.js';
import { LegRenderer } from '../parts/Legs.js';
import { ArmRenderer } from '../parts/Arms.js';

/**
 * @class RobotStage
 * @description Renders and updates the robot assembly (head, body, arms, legs)
 * including color palette, scale, movement, dance animations, and hide-and-seek behavior.
 */
export class RobotStage {
    /** @type {Object} DOM element references */
    #els = {};
    /** @type {number|null} - Movement interval ID */
    #moveInterval = null;
    /** @type {{x:number, y:number}} */
    #currentPos = { x: 0, y: 0 };

    /**
     * @param {Object} elements - Named DOM element references.
     */
    constructor(elements) {
        this.#els = elements;
        this.#setupPartClickZones();
    }

    #setupPartClickZones() {
        // Head, body, legs clicks are handled by App via data-part attribute
        ['robot-head', 'robot-body', 'robot-legs'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.dataset.part = id.replace('robot-', '');
        });
        const armL = document.getElementById('robot-arm-left');
        const armR = document.getElementById('robot-arm-right');
        if (armL) armL.dataset.part = 'arms';
        if (armR) armR.dataset.part = 'arms';
    }

    // ── Part Rendering ─────────────────────────────────────────────────────────
    /**
     * Renders all robot parts from the provided state.
     * @param {import('../state/RobotState.js').RobotState} robotState
     */
    renderAll(robotState) {
        this.renderHead(robotState.headIndex, robotState.palette);
        this.renderBody(robotState.bodyIndex, robotState.palette);
        this.renderLegs(robotState.legsIndex, robotState.palette);
        this.renderArms(robotState.armsIndex, robotState.palette);
        this.renderEmotion(robotState.emotion);
        this.renderScale(robotState.scale);
    }

    renderHead(index, palette) {
        const el = document.getElementById('robot-head');
        if (!el) return;
        el.innerHTML = HeadRenderer.render(index);
        el.style.filter = `hue-rotate(${palette.h}deg) saturate(1.6) brightness(1.1) drop-shadow(0 0 10px rgba(0,0,0,0.3))`;
        this.#animatePart(el);
    }

    renderBody(index, palette) {
        const el = document.getElementById('robot-body');
        if (!el) return;
        el.innerHTML = BodyRenderer.render(index);
        el.style.filter = `hue-rotate(${palette.b}deg) saturate(1.6) brightness(1.1) drop-shadow(0 0 10px rgba(0,0,0,0.3))`;

        // Show/hide exhaust based on body type
        const exhaustContainer = document.getElementById('exhaust-container');
        if (exhaustContainer) {
            exhaustContainer.style.display = BodyRenderer.isEngineBody(index) ? 'block' : 'none';
        }

        this.#animatePart(el);
    }

    renderLegs(index, palette) {
        const el = document.getElementById('robot-legs');
        if (!el) return;
        el.innerHTML = LegRenderer.render(index);
        el.style.filter = `hue-rotate(${palette.l}deg) saturate(1.6) brightness(1.1) drop-shadow(0 0 10px rgba(0,0,0,0.3))`;
        this.#animatePart(el);
    }

    renderArms(index, palette) {
        const armFilter = `hue-rotate(${palette.a}deg) saturate(1.6) brightness(1.1)`;
        const leftEl = document.getElementById('robot-arm-left');
        const rightEl = document.getElementById('robot-arm-right');

        if (leftEl) {
            leftEl.innerHTML = ArmRenderer.render(index, 'left');
            leftEl.style.filter = armFilter;
            this.#animatePart(leftEl);
        }
        if (rightEl) {
            rightEl.innerHTML = ArmRenderer.render(index, 'right');
            rightEl.style.filter = armFilter;
            this.#animatePart(rightEl);
        }
    }

    renderEmotion(emotion) {
        const el = document.getElementById('emotion-icon');
        if (el) el.textContent = emotion;
    }

    renderScale(scale) {
        const assembly = document.getElementById('robot-assembly');
        if (assembly) {
            // Base scale 1.5 for visibility × user scale
            assembly.style.transform = `scale(${scale * 1.5})`;
        }
    }

    /** Pop animation on part change */
    #animatePart(el) {
        el.classList.remove('part-pop');
        void el.offsetWidth; // Force reflow
        el.classList.add('part-pop');
    }

    // ── Movement ───────────────────────────────────────────────────────────────
    /**
     * Starts continuous wandering movement. Position persists across toggles.
     * @param {Function} onPositionChange - Callback when position changes.
     */
    startMoving(onPositionChange) {
        this.stopMoving();
        this.#moveInterval = setInterval(() => {
            const nextX = this.#currentPos.x + (Math.random() - 0.5) * 150;
            const nextY = this.#currentPos.y + (Math.random() - 0.5) * 60;
            this.#currentPos = {
                x: Math.max(-250, Math.min(250, nextX)),
                y: Math.max(-100, Math.min(50, nextY))
            };
            this.#applyMoverTransform(this.#currentPos);
            if (onPositionChange) onPositionChange(this.#currentPos);
        }, 2500);
    }

    stopMoving() {
        if (this.#moveInterval) {
            clearInterval(this.#moveInterval);
            this.#moveInterval = null;
        }
        // Do NOT reset position – that's the bug fix
    }

    resetPosition() {
        this.#currentPos = { x: 0, y: 0 };
        this.#applyMoverTransform(this.#currentPos);
    }

    #applyMoverTransform(pos) {
        const mover = document.getElementById('robot-mover');
        if (mover) {
            mover.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        }
    }

    // ── Dance ──────────────────────────────────────────────────────────────────
    /**
     * @param {string|null} danceClass - CSS class for the dance animation, or null to stop.
     */
    setDance(danceClass) {
        const dancer = document.getElementById('robot-dancer');
        if (!dancer) return;
        // Remove all dance classes
        dancer.classList.remove('dance-bounce', 'dance-twist', 'dance-shimmy', 'dance-disco');
        if (danceClass) dancer.classList.add(danceClass);
    }

    // ── Magic Burst ────────────────────────────────────────────────────────────
    triggerMagicBurst() {
        const burst = document.getElementById('magic-burst');
        if (!burst) return;
        burst.classList.remove('magic-burst-active');
        void burst.offsetWidth;
        burst.classList.add('magic-burst-active');
        setTimeout(() => burst.classList.remove('magic-burst-active'), 800);
    }

    // ── Hide & Seek ────────────────────────────────────────────────────────────
    /**
     * Hides the robot by moving it to a random hiding spot.
     * @param {Function} onFoundCallback - Called when player taps hidden robot.
     */
    hideRobot(onFoundCallback) {
        const mover = document.getElementById('robot-mover');
        const assembly = document.getElementById('robot-assembly');
        if (!mover || !assembly) return;

        // Pick a random hiding spot (offset from center)
        const spots = [
            { x: -280, y: -160 }, { x: 280, y: -140 },
            { x: -200, y: 100 }, { x: 200, y: 80 },
            { x: 0, y: -200 }, { x: -300, y: 0 },
        ];
        const spot = spots[Math.floor(Math.random() * spots.length)];

        mover.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        mover.style.transform = `translate(${spot.x}px, ${spot.y}px)`;

        assembly.classList.add('robot-hidden');
        assembly.style.cursor = 'pointer';

        const findHandler = (e) => {
            e.stopPropagation();
            assembly.removeEventListener('click', findHandler);
            this.revealRobot();
            if (onFoundCallback) onFoundCallback();
        };
        assembly.addEventListener('click', findHandler);
    }

    revealRobot() {
        const assembly = document.getElementById('robot-assembly');
        const mover = document.getElementById('robot-mover');
        if (assembly) {
            assembly.classList.remove('robot-hidden');
            assembly.style.cursor = '';
        }
        if (mover) {
            mover.style.transition = 'transform 1s ease-out';
            mover.style.transform = `translate(${this.#currentPos.x}px, ${this.#currentPos.y}px)`;
        }
    }
}
