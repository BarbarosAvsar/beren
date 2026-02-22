/**
 * @class ArmRenderer
 * @description Renders robot arm HTML for a given index and side (left/right).
 */
export class ArmRenderer {
    /**
     * Each arm factory receives (side: 'left'|'right') and returns HTML string.
     * Side-specific mirroring is done with CSS transform: scaleX(-1).
     */
    static #ARMS = [
        // 0 - Robot Arm (segmented mechanical)
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <div class="ra-seg ra-seg-upper ra-wobble"></div>
      <div class="ra-joint"></div>
      <div class="ra-seg ra-seg-lower"></div>
      <div class="ra-hand ra-hand-flat"></div>
    </div>`,

        // 1 - Claw
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <div class="ra-claw-arm ra-claw-swing"></div>
      <div class="ra-claw-pincer">
        <div class="ra-pincer-l ra-pincer-open"></div>
        <div class="ra-pincer-r ra-pincer-open"></div>
      </div>
    </div>`,

        // 2 - Drill
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <div class="ra-drill-arm ra-drill-sway"></div>
      <div class="ra-drill-bit ra-drill-spin">
        <div class="ra-drill-tip"></div>
      </div>
    </div>`,

        // 3 - Sword
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <div class="ra-sword-hilt ra-sword-parry">
        <div class="ra-guard"></div>
        <div class="ra-blade"></div>
      </div>
    </div>`,

        // 4 - Wing
        (side) => `<div class="ra ra-wing ${side === 'left' ? 'ra-flip' : ''} ra-wing-flap">
      <svg width="45" height="60" viewBox="0 0 45 60">
        <ellipse cx="35" cy="15" rx="12" ry="5" fill="#60A5FA" transform="rotate(-30 35 15)"/>
        <ellipse cx="30" cy="25" rx="14" ry="5" fill="#3B82F6" transform="rotate(-20 30 25)"/>
        <ellipse cx="25" cy="35" rx="16" ry="5" fill="#2563EB" transform="rotate(-10 25 35)"/>
        <ellipse cx="22" cy="45" rx="18" ry="6" fill="#1D4ED8"/>
      </svg>
    </div>`,

        // 5 - Tentacle
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <svg class="ra-tentacle-wave" width="30" height="50" viewBox="0 0 30 50">
        <path d="M15,0 Q25,12 10,20 Q0,28 15,35 Q25,42 12,50" stroke="#8B5CF6" stroke-width="6" fill="none" stroke-linecap="round"/>
      </svg>
    </div>`,

        // 6 - Boxing Glove
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <div class="ra-glove-arm"></div>
      <div class="ra-glove ra-glove-jab"></div>
    </div>`,

        // 7 - Magic Wand
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <div class="ra-wand-grip ra-wand-wave">
        <div class="ra-wand-shaft"></div>
        <div class="ra-wand-star ra-star-twinkle">✨</div>
      </div>
    </div>`,

        // 8 - Hook
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <div class="ra-hook-arm ra-hook-sway">
        <svg width="20" height="24" viewBox="0 0 20 24">
          <path d="M10,0 L10,10 Q10,20 4,20 Q-2,20 2,14" stroke="#D4A017" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>
      </div>
    </div>`,

        // 9 - Cannon
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <div class="ra-cannon-base ra-cannon-aim">
        <div class="ra-cannon-barrel"></div>
        <div class="ra-cannon-charge ra-charge-pulse"></div>
      </div>
    </div>`,

        // 10 - Paintbrush
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <div class="ra-brush ra-brush-stroke">
        <div class="ra-brush-handle"></div>
        <div class="ra-brush-bristles">
          <div class="ra-drip"></div>
        </div>
      </div>
    </div>`,

        // 11 - Shield Arm
        (side) => `<div class="ra ${side === 'left' ? 'ra-flip' : ''}">
      <div class="ra-shield-arm ra-shield-guard">
        <div class="ra-shield-disc">⚔️</div>
      </div>
    </div>`,
    ];

    /** @returns {number} Total number of arm designs. */
    static get count() { return ArmRenderer.#ARMS.length; }

    /**
     * Renders the HTML for a given arm index and side.
     * @param {number} index
     * @param {'left'|'right'} side
     * @returns {string} HTML string for one arm.
     */
    static render(index, side) {
        const idx = ((index % ArmRenderer.#ARMS.length) + ArmRenderer.#ARMS.length) % ArmRenderer.#ARMS.length;
        return ArmRenderer.#ARMS[idx](side);
    }
}
