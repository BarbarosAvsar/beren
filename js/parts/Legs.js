/**
 * @class LegRenderer
 * @description Renders robot leg HTML for a given index.
 */
export class LegRenderer {
    static #LEGS = [
        // 0 - Biped walking
        () => `<div class="rl">
      <div class="rl-biped rl-biped-left rl-walk-l">
        <div class="rl-shin" style="background:#6B7280"></div>
        <div class="rl-foot" style="background:#4B5563"></div>
      </div>
      <div class="rl-biped rl-biped-right rl-walk-r">
        <div class="rl-shin" style="background:#6B7280"></div>
        <div class="rl-foot" style="background:#4B5563"></div>
      </div>
    </div>`,

        // 1 - Thick Boots
        () => `<div class="rl">
      <div class="rl-boot rl-boot-sway-l" style="background:#92400E"></div>
      <div class="rl-boot rl-boot-sway-r" style="background:#92400E"></div>
    </div>`,

        // 2 - Wheels
        () => `<div class="rl rl-wheels-row">
      <div class="rl-wheel rl-wheel-spin"><div class="rl-wheel-spoke"></div></div>
      <div class="rl-axle"></div>
      <div class="rl-wheel rl-wheel-spin"><div class="rl-wheel-spoke"></div></div>
    </div>`,

        // 3 - Tank Treads
        () => `<div class="rl">
      <div class="rl-tread rl-tread-scroll">
        <div class="rl-tread-wheel"></div>
        <div class="rl-tread-wheel"></div>
        <div class="rl-tread-wheel"></div>
        <div class="rl-tread-wheel"></div>
        <div class="rl-tread-wheel"></div>
      </div>
    </div>`,

        // 4 - Hover Pad
        () => `<div class="rl rl-hover">
      <div class="rl-hover-body rl-hover-float"></div>
      <div class="rl-hover-glow rl-hover-pulse"></div>
    </div>`,

        // 5 - Springs
        () => `<div class="rl rl-springs-row">
      <div class="rl-spring rl-spring-bounce-l">
        <svg width="16" height="40" viewBox="0 0 16 40"><path d="M2,0 L14,8 L2,16 L14,24 L2,32 L14,40" stroke="#EAB308" stroke-width="3" fill="none"/></svg>
      </div>
      <div class="rl-spring rl-spring-bounce-r">
        <svg width="16" height="40" viewBox="0 0 16 40"><path d="M2,0 L14,8 L2,16 L14,24 L2,32 L14,40" stroke="#EAB308" stroke-width="3" fill="none"/></svg>
      </div>
    </div>`,

        // 6 - Chicken Legs
        () => `<div class="rl">
      <div class="rl-chicken rl-chicken-l">
        <div class="rl-cleg-upper" style="background:#EAB308"></div>
        <div class="rl-cleg-lower" style="background:#EAB308"></div>
        <div class="rl-cleg-toes"></div>
      </div>
      <div class="rl-chicken rl-chicken-r">
        <div class="rl-cleg-upper" style="background:#EAB308"></div>
        <div class="rl-cleg-lower" style="background:#EAB308"></div>
        <div class="rl-cleg-toes"></div>
      </div>
    </div>`,

        // 7 - Tentacles
        () => `<div class="rl rl-tentacles-row">
      <div class="rl-tentacle" style="height:35px;background:#8B5CF6;animation-delay:0s"></div>
      <div class="rl-tentacle" style="height:40px;background:#7C3AED;animation-delay:0.15s"></div>
      <div class="rl-tentacle" style="height:30px;background:#6D28D9;animation-delay:0.3s"></div>
      <div class="rl-tentacle" style="height:45px;background:#5B21B6;animation-delay:0.1s"></div>
    </div>`,

        // 8 - Unicycle
        () => `<div class="rl rl-unicycle">
      <div class="rl-uni-stem"></div>
      <div class="rl-uni-wheel rl-wheel-spin">
        <div class="rl-wheel-spoke"></div>
        <div class="rl-wheel-spoke" style="transform:rotate(90deg)"></div>
      </div>
    </div>`,

        // 9 - Rocket Boots
        () => `<div class="rl">
      <div class="rl-rboot">
        <div class="rl-rboot-body" style="background:#6B7280"></div>
        <div class="rl-rboot-flame rl-flame-rocket"></div>
      </div>
      <div class="rl-rboot">
        <div class="rl-rboot-body" style="background:#6B7280"></div>
        <div class="rl-rboot-flame rl-flame-rocket rl-flame-delay"></div>
      </div>
    </div>`,

        // 10 - Spider Legs
        () => `<div class="rl rl-spider">
      <div class="rl-spider-body">
        <div class="rl-spider-leg" style="--deg:-55deg;--side:left;--idx:0"></div>
        <div class="rl-spider-leg" style="--deg:-35deg;--side:left;--idx:1"></div>
        <div class="rl-spider-leg" style="--deg:-15deg;--side:left;--idx:2"></div>
        <div class="rl-spider-leg" style="--deg:15deg;--side:right;--idx:3"></div>
        <div class="rl-spider-leg" style="--deg:35deg;--side:right;--idx:4"></div>
        <div class="rl-spider-leg" style="--deg:55deg;--side:right;--idx:5"></div>
      </div>
    </div>`,

        // 11 - Pogo Stick
        () => `<div class="rl rl-pogo-wrap">
      <div class="rl-pogo rl-pogo-bounce">
        <div class="rl-pogo-handle"></div>
        <div class="rl-pogo-shaft"></div>
        <div class="rl-pogo-spring"></div>
        <div class="rl-pogo-base"></div>
      </div>
    </div>`,
    ];

    /** @returns {number} Total number of leg designs. */
    static get count() { return LegRenderer.#LEGS.length; }

    /**
     * Renders the HTML for a given leg index.
     * @param {number} index
     * @returns {string} HTML string for the legs.
     */
    static render(index) {
        const idx = ((index % LegRenderer.#LEGS.length) + LegRenderer.#LEGS.length) % LegRenderer.#LEGS.length;
        return LegRenderer.#LEGS[idx]();
    }
}
