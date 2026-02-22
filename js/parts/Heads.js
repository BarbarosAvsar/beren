/**
 * @class HeadRenderer
 * @description Renders robot head HTML for a given index.
 * Each head is a self-contained HTML string with CSS animations.
 */
export class HeadRenderer {
    static #HEADS = [
        // 0 - Classic Square
        () => `<div class="rh rh-square" style="background:#6B7280;width:88px;height:72px;border-radius:12px">
      <div class="rh-antenna"><div class="rh-antenna-stem"></div><div class="rh-antenna-tip rh-blink-red"></div></div>
      <div class="rh-eyes"><div class="rh-eye rh-blink"></div><div class="rh-eye rh-blink rh-blink-delay"></div></div>
      <div class="rh-mouth rh-mouth-wave"></div>
    </div>`,

        // 1 - Round Dome
        () => `<div class="rh" style="background:#3B82F6;width:90px;height:80px;border-radius:50%">
      <div class="rh-visor rh-visor-blue rh-glow-cyan"></div>
      <div class="rh-chin" style="background:#1D4ED8;width:40px;height:8px;border-radius:4px;position:absolute;bottom:8px"></div>
    </div>`,

        // 2 - Monitor
        () => `<div class="rh" style="background:#1F2937;width:96px;height:72px;border-radius:8px">
      <div class="rh-screen">
        <div class="rh-waveform"></div>
      </div>
      <div style="position:absolute;bottom:5px;width:16px;height:4px;background:#6B7280;border-radius:2px"></div>
    </div>`,

        // 3 - Cyclops
        () => `<div class="rh" style="background:#22C55E;width:80px;height:80px;border-radius:50%">
      <div class="rh-cyclops-eye"><div class="rh-cyclops-pupil rh-pupil-slide"></div></div>
      <div class="rh-antenna-tiny rh-wiggle"></div>
    </div>`,

        // 4 - Cat
        () => `<div class="rh" style="background:#EC4899;width:92px;height:68px;border-radius:16px">
      <div class="rh-cat-ear rh-cat-ear-left"></div>
      <div class="rh-cat-ear rh-cat-ear-right"></div>
      <div class="rh-eyes"><div class="rh-eye rh-eye-cat"></div><div class="rh-eye rh-eye-cat"></div></div>
      <div class="rh-nose-cat"></div>
      <div class="rh-whisker rh-whisker-left rh-whisker-wave"></div>
      <div class="rh-whisker rh-whisker-right rh-whisker-wave-r"></div>
    </div>`,

        // 5 - Skull
        () => `<div class="rh" style="background:#1E1E2E;width:84px;height:76px;border-radius:8px 8px 20px 20px">
      <div class="rh-eyes">
        <div class="rh-eye rh-eye-red rh-glow-red"></div>
        <div class="rh-eye rh-eye-red rh-glow-red rh-blink-delay"></div>
      </div>
      <div class="rh-teeth"></div>
    </div>`,

        // 6 - Astronaut
        () => `<div class="rh" style="background:#F3F4F6;width:88px;height:88px;border-radius:50%;border:4px solid #D1D5DB">
      <div class="rh-visor rh-visor-orange rh-glow-orange"></div>
      <div class="rh-helmet-seal rh-helmet-seal-left"></div>
      <div class="rh-helmet-seal rh-helmet-seal-right"></div>
    </div>`,

        // 7 - Toaster
        () => `<div class="rh" style="background:#D1D5DB;width:88px;height:68px;border-radius:8px">
      <div class="rh-toast-slot">
        <div class="rh-toast rh-toast-pop"></div>
        <div class="rh-toast rh-toast-pop rh-pop-delay"></div>
      </div>
      <div class="rh-glow-orb" style="bottom:12px;width:16px;height:16px;background:#F97316;opacity:0.5"></div>
    </div>`,

        // 8 - Pumpkin
        () => `<div class="rh" style="background:#F97316;width:88px;height:80px;border-radius:50%">
      <div class="rh-pumpkin-stem"></div>
      <div class="rh-pumpkin-eyes">
        <div class="rh-pumpkin-eye"></div>
        <div class="rh-pumpkin-eye"></div>
      </div>
      <div class="rh-pumpkin-mouth rh-glow-yellow"></div>
    </div>`,

        // 9 - Fish
        () => `<div class="rh" style="background:#14B8A6;width:100px;height:64px;border-radius:40px">
      <div class="rh-fin rh-fin-left rh-fin-wave"></div>
      <div class="rh-fin rh-fin-right rh-fin-wave-r"></div>
      <div class="rh-eyes">
        <div class="rh-eye rh-eye-fish rh-fish-blink"></div>
        <div class="rh-eye rh-eye-fish rh-fish-blink rh-blink-delay"></div>
      </div>
      <div class="rh-fish-mouth"></div>
    </div>`,

        // 10 - Crown King
        () => `<div class="rh" style="background:#EAB308;width:96px;height:72px;border-radius:4px 4px 16px 16px">
      <div class="rh-crown-points">
        <div class="rh-crown-point rh-crown-short"></div>
        <div class="rh-crown-point rh-crown-tall rh-crown-sway"></div>
        <div class="rh-crown-point rh-crown-short"></div>
      </div>
      <div class="rh-jewel rh-glow-red rh-jewel-pulse"></div>
      <div class="rh-dots"><div class="rh-dot"></div><div class="rh-dot"></div></div>
    </div>`,

        // 11 - Alien
        () => `<div class="rh" style="background:#86EFAC;width:80px;height:84px;border-radius:50% 50% 40% 40%">
      <div class="rh-antenna-alien rh-alien-left rh-alien-wave-l"></div>
      <div class="rh-antenna-alien rh-alien-right rh-alien-wave-r"></div>
      <div class="rh-eyes">
        <div class="rh-eye rh-eye-alien rh-alien-blink"></div>
        <div class="rh-eye rh-eye-alien rh-alien-blink rh-blink-delay"></div>
      </div>
    </div>`,
    ];

    /** @returns {number} Total number of head designs. */
    static get count() { return HeadRenderer.#HEADS.length; }

    /**
     * Renders the HTML for a given head index.
     * @param {number} index - Head index (0-based).
     * @returns {string} HTML string for the head.
     */
    static render(index) {
        const idx = ((index % HeadRenderer.#HEADS.length) + HeadRenderer.#HEADS.length) % HeadRenderer.#HEADS.length;
        return HeadRenderer.#HEADS[idx]();
    }
}
