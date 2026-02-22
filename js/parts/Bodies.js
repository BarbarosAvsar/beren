/**
 * @class BodyRenderer
 * @description Renders robot body HTML for a given index.
 * Indices 12 and 13 are special motor/engine bodies that support the ExhaustEffect.
 */
export class BodyRenderer {
    static #BODIES = [
        // 0 - Box Bot
        () => `<div class="rb" style="background:#6B7280;width:110px;height:100px;border-radius:12px">
      <div class="rb-panel-line rb-panel-top"></div>
      <div class="rb-panel-line rb-panel-bottom"></div>
      <div class="rb-core rb-core-cyan rh-glow-cyan rb-core-pulse"></div>
      <div class="rb-led rb-led-green"></div>
    </div>`,

        // 1 - Barrel
        () => `<div class="rb" style="background:#92400E;width:100px;height:105px;border-radius:50px">
      <div class="rb-ring" style="top:16px"></div>
      <div class="rb-ring" style="bottom:16px"></div>
      <div class="rb-core rb-core-amber rb-core-spin"></div>
      <div class="rb-rivet" style="top:8px;right:24px"></div>
    </div>`,

        // 2 - Furnace
        () => `<div class="rb" style="background:#7F1D1D;width:108px;height:96px;border-radius:16px">
      <div class="rb-fire-window">
        <div class="rb-flame rb-flame-anim"></div>
      </div>
      <div class="rb-bolts"></div>
    </div>`,

        // 3 - Shield
        () => `<div class="rb" style="background:#2563EB;width:100px;height:110px;border-radius:8px 8px 50% 50%">
      <div class="rb-star rb-star-spin">⭐</div>
      <div class="rb-stripe rb-stripe-top"></div>
      <div class="rb-stripe rb-stripe-bottom"></div>
    </div>`,

        // 4 - Sphere
        () => `<div class="rb" style="background:#7C3AED;width:105px;height:105px;border-radius:50%">
      <div class="rb-core rb-core-purple rb-core-pulse"></div>
      <div class="rb-orbit rb-orbit-spin"></div>
    </div>`,

        // 5 - Music Box
        () => `<div class="rb" style="background:#EA580C;width:112px;height:96px;border-radius:12px">
      <div class="rb-speaker-wrap">
        <div class="rb-speaker rb-speaker-pulse"></div>
        <div class="rb-eq">
          <div class="rb-eq-bar" style="animation-delay:0s"></div>
          <div class="rb-eq-bar" style="animation-delay:0.1s"></div>
          <div class="rb-eq-bar" style="animation-delay:0.2s"></div>
          <div class="rb-eq-bar" style="animation-delay:0.15s"></div>
          <div class="rb-eq-bar" style="animation-delay:0.05s"></div>
        </div>
      </div>
    </div>`,

        // 6 - Safe
        () => `<div class="rb" style="background:#374151;width:106px;height:100px;border-radius:12px;border:4px solid #4B5563">
      <div class="rb-vault"><div class="rb-vault-spin"></div></div>
      <div class="rb-rivets-left"></div>
    </div>`,

        // 7 - Rocket Body
        () => `<div class="rb" style="background:#F1F5F9;width:90px;height:110px;border-radius:50% 50% 20% 20%">
      <div class="rb-window rb-window-sky"></div>
      <div class="rb-nose" style="position:absolute;bottom:0;width:100%;height:24px;background:#EF4444;border-radius:0 0 12px 12px"></div>
      <div class="rb-exhaust rb-exhaust-anim" style="bottom:-12px"></div>
    </div>`,

        // 8 - Heart Cage
        () => `<div class="rb" style="background:rgba(75,85,99,0.3);width:100px;height:96px;border-radius:12px;border:4px dashed #6B7280">
      <div class="rb-heart rb-heart-beat">💜</div>
    </div>`,

        // 9 - Gift Box
        () => `<div class="rb" style="background:#F472B6;width:104px;height:96px;border-radius:12px">
      <div class="rb-ribbon rb-ribbon-h"></div>
      <div class="rb-ribbon rb-ribbon-v"></div>
      <div class="rb-bow rb-bow-wobble">🎀</div>
    </div>`,

        // 10 - Engine Block
        () => `<div class="rb" style="background:#1E293B;width:112px;height:96px;border-radius:8px">
      <div class="rb-pipe rb-pipe-left"></div>
      <div class="rb-pipe rb-pipe-right"></div>
      <div class="rb-warning rb-warning-blink"></div>
      <div class="rb-rivets-row"></div>
      <div class="rb-panel-line" style="bottom:8px;width:64px"></div>
    </div>`,

        // 11 - Cauldron
        () => `<div class="rb" style="background:#581C87;width:100px;height:100px;border-radius:20% 20% 50% 50%">
      <div class="rb-brew-top"></div>
      <div class="rb-bubble rb-bubble-1"></div>
      <div class="rb-bubble rb-bubble-2"></div>
      <div class="rb-bubble rb-bubble-3"></div>
      <div class="rb-flask rb-flask-rock">🧪</div>
    </div>`,

        // 12 - Turbo Motor ⚡ (engine body — exhaust enabled)
        () => `<div class="rb rb-engine" style="background:#1a1a2e;width:112px;height:106px;border-radius:10px;border:3px solid #e94560" data-has-engine="true">
      <div class="rb-turbo-grill"></div>
      <div class="rb-core rb-core-red rh-glow-red rb-core-pulse"></div>
      <div class="rb-exhaust-port rb-exhaust-port-left"></div>
      <div class="rb-exhaust-port rb-exhaust-port-right"></div>
      <div class="rb-turbo-label">TURBO</div>
    </div>`,

        // 13 - Jet Engine 🔥 (engine body — exhaust enabled)
        () => `<div class="rb rb-engine" style="background:#0f0f1a;width:114px;height:110px;border-radius:50% 50% 10% 10%;border:3px solid #f59e0b" data-has-engine="true">
      <div class="rb-jet-intake"></div>
      <div class="rb-core rb-core-fire rb-core-pulse"></div>
      <div class="rb-jet-nozzle rb-jet-nozzle-bottom"></div>
      <div class="rb-jet-label">JET</div>
    </div>`,
    ];

    /** @returns {number} Total number of body designs. */
    static get count() { return BodyRenderer.#BODIES.length; }

    /**
     * Checks whether a body index is an engine/motor type.
     * @param {number} index
     * @returns {boolean}
     */
    static isEngineBody(index) { return index >= 12; }

    /**
     * Renders the HTML for a given body index.
     * @param {number} index - Body index (0-based).
     * @returns {string} HTML string for the body.
     */
    static render(index) {
        const idx = ((index % BodyRenderer.#BODIES.length) + BodyRenderer.#BODIES.length) % BodyRenderer.#BODIES.length;
        return BodyRenderer.#BODIES[idx]();
    }
}
