/**
 * @class SceneManager
 * @description Manages the 12 animated background scenes.
 * Each scene defines its background HTML and a `mount(el)` method
 * that injects animated elements via JavaScript/CSS animations.
 */
export class SceneManager {
    static THEMES = [
        'Factory', 'Space', 'Moon', 'Jungle', 'Mars',
        'Underwater', 'Candy', 'Volcano', 'Arctic', 'Sunset', 'Haunted', 'Disco'
    ];

    /** @type {HTMLElement|null} */
    #container = null;
    /** @type {number[]} */
    #animIntervals = [];

    /**
     * @param {HTMLElement} container - The scene background container element.
     */
    constructor(container) {
        this.#container = container;
    }

    /**
     * Renders and mounts a scene by name.
     * @param {string} name - Scene name from THEMES array.
     */
    render(name) {
        this.#clearAnimations();
        const renderer = SceneManager.#SCENES[name];
        if (!renderer) return;
        this.#container.innerHTML = '';
        this.#container.className = `scene-bg scene-${name.toLowerCase()}`;
        renderer(this.#container, this.#animIntervals);
    }

    /** Clears all running scene animation intervals. */
    #clearAnimations() {
        this.#animIntervals.forEach(id => clearInterval(id));
        this.#animIntervals.length = 0;
    }

    /** Scene definitions keyed by name. Each receives (container, intervals[]). */
    static #SCENES = {
        Factory: (el) => {
            el.innerHTML = `
        <div class="scene-gradient" style="background:linear-gradient(to bottom,#1a1c2c,#29366f,#334155)"></div>
        <div class="scene-gear" style="left:8%;top:15%;width:100px;height:100px;animation:spin 10s linear infinite"></div>
        <div class="scene-gear" style="right:15%;top:25%;width:80px;height:80px;animation:spin 7s linear infinite reverse"></div>
        <div class="scene-gear" style="left:45%;top:55%;width:130px;height:130px;animation:spin 14s linear infinite"></div>
        <div class="scene-gear" style="left:25%;bottom:25%;width:60px;height:60px;animation:spin 5s linear infinite reverse"></div>
        <div class="scene-conveyor">
          <div class="scene-conveyor-belt"></div>
        </div>
        <div style="position:absolute;top:50%;left:25%;width:128px;height:128px;background:rgba(250,204,21,0.04);filter:blur(40px)"></div>
      `;
        },

        Space: (el) => {
            const starsHtml = Array.from({ length: 60 }, () => {
                const x = Math.random() * 100, y = Math.random() * 100;
                const s = Math.random() * 3 + 2;
                const d = (Math.random() * 5 + 2).toFixed(1);
                return `<div class="scene-star" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;animation-duration:${d}s"></div>`;
            }).join('');
            el.innerHTML = `
        <div class="scene-gradient" style="background:radial-gradient(circle at 50%,#1e1b4b 0%,#000 100%)"></div>
        ${starsHtml}
        <div class="scene-planet" style="right:10%;top:15%;animation:floatY 20s ease-in-out infinite"></div>
      `;
        },

        Moon: (el) => {
            el.innerHTML = `
        <div class="scene-gradient" style="background:#111827"></div>
        <div class="scene-moon-orb"></div>
        <div class="scene-moon-ground"></div>
        <div class="scene-ufo scene-float-slow">🛸</div>
        <div class="scene-crater" style="bottom:20%;left:20%;width:30px;height:15px"></div>
        <div class="scene-crater" style="bottom:22%;right:28%;width:20px;height:10px"></div>
      `;
        },

        Jungle: (el) => {
            el.innerHTML = `
        <div class="scene-gradient" style="background:linear-gradient(to bottom,#065f46,#059669,#064e3b)"></div>
        <div style="position:absolute;inset:0;opacity:0.1;background:repeating-linear-gradient(45deg,transparent,transparent 80px,white 80px,white 85px)"></div>
        <div class="scene-monkey scene-monkey-bounce">🐒<span class="scene-leaf">🍃</span></div>
        <div class="scene-parrot scene-parrot-sway">🦜</div>
        <div class="scene-tree scene-tree-breathe">🌳</div>
        <div class="scene-vine scene-vine-left"></div>
        <div class="scene-vine scene-vine-right"></div>
      `;
        },

        Mars: (el) => {
            const dusts = Array.from({ length: 10 }, (_, i) => {
                const left = Math.random() * 100;
                return `<div class="scene-dust" style="left:${left}%;animation-delay:${i * 0.5}s"></div>`;
            }).join('');
            el.innerHTML = `
        <div class="scene-gradient" style="background:#450a0a"></div>
        <div class="scene-mars-ground"></div>
        ${dusts}
        <div class="scene-comet scene-comet-drift">☄️</div>
      `;
        },

        Underwater: (el) => {
            const bubbles = Array.from({ length: 15 }, () => {
                const size = 20 + Math.random() * 20;
                const left = Math.random() * 100;
                const dur = (5 + Math.random() * 5).toFixed(1);
                const delay = (Math.random() * 5).toFixed(1);
                return `<div class="scene-bubble" style="width:${size}px;height:${size}px;left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s"></div>`;
            }).join('');
            el.innerHTML = `
        <div class="scene-gradient" style="background:linear-gradient(to bottom,#0ea5e9,#1e3a8a)"></div>
        <div style="position:absolute;inset:0;opacity:0.3;background-image:radial-gradient(circle at 20% 30%,white 1%,transparent 1%);background-size:100px 100px"></div>
        <div class="scene-fish scene-fish-swim">🐟</div>
        <div class="scene-fish scene-fish-swim-rev" style="top:50%;animation-duration:16s">🐠</div>
        <div class="scene-fish scene-fish-swim" style="top:70%;animation-duration:20s">🐡</div>
        <div class="scene-turtle scene-turtle-drift">🐢</div>
        ${bubbles}
      `;
        },

        Candy: (el) => {
            el.innerHTML = `
        <div class="scene-gradient" style="background:#fdf2f8"></div>
        <div class="scene-candy scene-candy-1">🍭</div>
        <div class="scene-candy scene-candy-2">🍬</div>
        <div class="scene-candy scene-candy-3">🍩</div>
        <div class="scene-candy scene-candy-4">🍪</div>
        <div class="scene-candy-ground"></div>
      `;
        },

        Volcano: (el) => {
            const lavas = Array.from({ length: 20 }, () => {
                const xOff = (Math.random() - 0.5) * 300;
                const delay = (Math.random() * 2).toFixed(1);
                return `<div class="scene-lava" style="--lava-x:${xOff}px;animation-delay:${delay}s"></div>`;
            }).join('');
            el.innerHTML = `
        <div class="scene-gradient" style="background:#450a0a"></div>
        <div class="scene-volcano-cone"></div>
        ${lavas}
        <div class="scene-lava-glow"></div>
      `;
        },

        Arctic: (el) => {
            const flakes = Array.from({ length: 30 }, () => {
                const left = Math.random() * 100;
                const dur = (5 + Math.random() * 5).toFixed(1);
                const delay = (Math.random() * 5).toFixed(1);
                const xDrift = ((Math.random() - 0.5) * 50).toFixed(0);
                return `<div class="scene-snowflake" style="left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s;--drift:${xDrift}px"></div>`;
            }).join('');
            el.innerHTML = `
        <div class="scene-gradient" style="background:#f1f5f9"></div>
        ${flakes}
        <div class="scene-penguin scene-penguin-waddle">🐧</div>
        <div class="scene-iceberg"></div>
      `;
        },

        Sunset: (el) => {
            el.innerHTML = `
        <div class="scene-gradient" style="background:linear-gradient(to bottom,#f97316,#e11d48,#4c1d95)"></div>
        <div class="scene-sun scene-sun-pulse"></div>
        <div class="scene-horizon-bar"></div>
        <div class="scene-bird scene-bird-1">🦅</div>
        <div class="scene-bird scene-bird-2">🦅</div>
      `;
        },

        Haunted: (el) => {
            el.innerHTML = `
        <div class="scene-gradient" style="background:#000"></div>
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(88,28,135,0.2),#000)"></div>
        <div class="scene-ghost scene-ghost-float">👻</div>
        <div class="scene-bat scene-bat-flutter">🦇</div>
        <div class="scene-moon-small"></div>
        <div class="scene-cobweb scene-cobweb-tl">🕸️</div>
        <div class="scene-cobweb scene-cobweb-tr">🕸️</div>
        <div class="scene-haunted-bar"></div>
      `;
        },

        Disco: (el) => {
            const tileCount = 24;
            const tileColors = ['#ec4899', '#3b82f6', '#eab308', '#8b5cf6', '#22c55e', '#ef4444', '#06b6d4', '#f97316'];
            const tilesHtml = Array.from({ length: tileCount }, (_, i) => {
                const color = tileColors[i % tileColors.length];
                const delay = (Math.random() * 2).toFixed(1);
                return `<div class="scene-disco-tile" style="background:#1e293b;animation-delay:${delay}s;--tile-color:${color}"></div>`;
            }).join('');
            el.innerHTML = `
        <div style="position:absolute;inset:0;background:#000"></div>
        <div class="scene-disco-ball"></div>
        <div class="scene-disco-floor">${tilesHtml}</div>
        <div class="scene-disco-ring"></div>
        <div class="scene-disco-spotlights">
          <div class="scene-spotlight scene-spotlight-l"></div>
          <div class="scene-spotlight scene-spotlight-r"></div>
        </div>
      `;
        },
    };
}
