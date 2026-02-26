import { describe, expect, it } from "vitest";

import { SceneService } from "../../js/services/SceneService.js";

describe("SceneService", () => {
  it("renders accents, occluders, and hide spots for a valid theme", () => {
    const background = document.createElement("div");
    const foreground = document.createElement("div");
    const service = new SceneService(background, foreground);

    const context = service.render("Factory");

    expect(background.className).toContain("scene-theme-factory");
    expect(foreground.className).toContain("scene-theme-factory");
    expect(background.querySelectorAll(".scene-accent")).toHaveLength(3);
    expect(foreground.querySelectorAll(".scene-occluder")).toHaveLength(3);
    expect(context.hideSpots).toHaveLength(3);
    expect(context.occluderIds).toHaveLength(3);
    expect(context.hideSpots[0].occluderId).toMatch(/^scene-occluder-factory-/);
  });

  it("falls back to Factory when theme is unknown", () => {
    const background = document.createElement("div");
    const foreground = document.createElement("div");
    const service = new SceneService(background, foreground);

    const context = service.render("Unknown Theme");

    expect(background.className).toContain("scene-theme-factory");
    expect(foreground.className).toContain("scene-theme-factory");
    expect(context.hideSpots).toHaveLength(3);
  });

  it("clears previous nodes before rendering a new theme", () => {
    const background = document.createElement("div");
    const foreground = document.createElement("div");
    const service = new SceneService(background, foreground);

    service.render("Factory");
    service.render("Space");

    expect(background.querySelectorAll(".scene-accent")).toHaveLength(4);
    expect(foreground.querySelectorAll(".scene-occluder")).toHaveLength(3);
    expect(background.className).toContain("scene-theme-space");
  });
});
