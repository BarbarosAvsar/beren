import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { ExhaustService } from "../../js/services/ExhaustService.js";

describe("ExhaustService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("spawns smoke particles when enabled", () => {
    const container = document.createElement("div");
    const exhaust = new ExhaustService(container, globalThis);

    exhaust.setEnabled(true);
    exhaust.setMode("smoke");

    vi.advanceTimersByTime(200);
    expect(container.children.length).toBeGreaterThan(0);

    exhaust.destroy();
    vi.advanceTimersByTime(1000);
    expect(container.children.length).toBe(0);
  });

  it("switches to fire mode without leaking", () => {
    const container = document.createElement("div");
    const exhaust = new ExhaustService(container, globalThis);

    exhaust.setEnabled(true);
    exhaust.setMode("smoke");
    vi.advanceTimersByTime(200);
    const smokeCount = container.children.length;

    exhaust.setMode("fire");
    vi.advanceTimersByTime(100);

    expect(container.children.length).toBeGreaterThan(smokeCount);

    exhaust.setEnabled(false);
    vi.advanceTimersByTime(500);
    expect(container.children.length).toBe(0);
  });
});
