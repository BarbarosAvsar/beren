import { describe, expect, it, vi } from "vitest";

import { UI_EVENTS } from "../../js/core/events.js";
import { EventBus } from "../../js/core/EventBus.js";

describe("EventBus", () => {
  it("emits and listens to allowed event types", () => {
    const bus = new EventBus({ allowedTypes: [UI_EVENTS.ACTION] });
    const handler = vi.fn();

    bus.on(UI_EVENTS.ACTION, handler);
    bus.emit(UI_EVENTS.ACTION, { action: "nextTheme" });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail.action).toBe("nextTheme");
  });

  it("throws for unknown event types when allowlist is configured", () => {
    const bus = new EventBus({ allowedTypes: [UI_EVENTS.ACTION] });

    expect(() => bus.emit("ui:unknown")).toThrow(/Unknown event type/);
    expect(() => bus.on("", () => {})).toThrow(/non-empty string/);
  });
});
