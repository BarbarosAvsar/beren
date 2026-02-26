import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HIDE_SEEK_SECONDS } from "../../js/core/Config.js";
import { ALL_EVENT_TYPES, UI_EVENTS } from "../../js/core/events.js";
import { EventBus } from "../../js/core/EventBus.js";
import { HudView } from "../../js/ui/HudView.js";

function createElements() {
  return {
    nameButton: document.createElement("button"),
    nameText: document.createElement("span"),
    emotionButton: document.createElement("button"),
    emotionText: document.createElement("span"),
    hideSeekHud: document.createElement("aside"),
    timer: document.createElement("span"),
    score: document.createElement("span"),
    toast: document.createElement("div"),
    live: document.createElement("p"),
  };
}

describe("HudView", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("emits name and emotion cycle events with lifecycle-safe listeners", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const elements = createElements();
    const view = new HudView(bus, elements);
    const onName = vi.fn();
    const onEmotion = vi.fn();

    bus.on(UI_EVENTS.NAME_CYCLE, onName);
    bus.on(UI_EVENTS.EMOTION_CYCLE, onEmotion);

    view.init();
    elements.nameButton.click();
    elements.emotionButton.click();

    expect(onName).toHaveBeenCalledTimes(1);
    expect(onEmotion).toHaveBeenCalledTimes(1);

    view.unmount();
    elements.nameButton.click();
    elements.emotionButton.click();

    expect(onName).toHaveBeenCalledTimes(1);
    expect(onEmotion).toHaveBeenCalledTimes(1);

    view.mount();
    view.mount();
    elements.nameButton.click();
    expect(onName).toHaveBeenCalledTimes(2);
  });

  it("renders hide seek HUD state correctly", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const elements = createElements();
    const view = new HudView(bus, elements);

    view.renderHideSeek(false, 3, 7);
    expect(elements.hideSeekHud.classList.contains("is-hidden")).toBe(true);
    expect(elements.timer.textContent).toBe(String(HIDE_SEEK_SECONDS));
    expect(elements.score.textContent).toBe("7");

    view.renderHideSeek(true, 4, 8);
    expect(elements.hideSeekHud.classList.contains("is-hidden")).toBe(false);
    expect(elements.timer.textContent).toBe("4");
    expect(elements.timer.classList.contains("is-warning")).toBe(true);
    expect(elements.score.textContent).toBe("8");
  });

  it("clears toast timers on destroy", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const elements = createElements();
    const view = new HudView(bus, elements);

    view.showToast("Hello", 200);
    expect(elements.toast.classList.contains("is-visible")).toBe(true);

    view.destroy();
    vi.runAllTimers();

    expect(elements.toast.textContent).toBe("Hello");
  });
});
