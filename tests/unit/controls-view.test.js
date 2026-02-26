import { describe, expect, it, vi } from "vitest";

import { ALL_EVENT_TYPES, UI_EVENTS } from "../../js/core/events.js";
import { EventBus } from "../../js/core/EventBus.js";
import { ControlsView } from "../../js/ui/ControlsView.js";

describe("ControlsView", () => {
  it("emits ui action events when control buttons are clicked", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const container = document.createElement("div");
    const view = new ControlsView(bus, container);
    const onAction = vi.fn();

    bus.on(UI_EVENTS.ACTION, onAction);
    view.init();

    const moveButton = container.querySelector('[data-testid="control-move"]');
    moveButton.click();

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction.mock.calls[0][0].detail.action).toBe("toggleMove");
  });

  it("supports mount and unmount without duplicate listeners", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const container = document.createElement("div");
    const view = new ControlsView(bus, container);
    const onAction = vi.fn();

    bus.on(UI_EVENTS.ACTION, onAction);
    view.init();

    const hideButton = container.querySelector('[data-testid="control-hide"]');
    hideButton.click();
    expect(onAction).toHaveBeenCalledTimes(1);

    view.unmount();
    hideButton.click();
    expect(onAction).toHaveBeenCalledTimes(1);

    view.mount();
    view.mount();
    hideButton.click();
    expect(onAction).toHaveBeenCalledTimes(2);
  });

  it("cleans up DOM content on destroy", () => {
    const bus = new EventBus({ allowedTypes: ALL_EVENT_TYPES });
    const container = document.createElement("div");
    const view = new ControlsView(bus, container);

    view.init();
    expect(container.children.length).toBeGreaterThan(0);

    view.destroy();
    expect(container.children.length).toBe(0);
  });
});
