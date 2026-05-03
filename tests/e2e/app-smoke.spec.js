import { test, expect } from "@playwright/test";

import {
  readArmBodyDepth,
  readIdentityMarkers,
  readLayerOrder,
  setIdentityMarkers,
} from "./helpers/ui-helpers.js";

test("vanilla app smoke flow", async ({ page }) => {
  const consoleErrors = [];
  const blockedRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("request", (request) => {
    const url = request.url();
    if (url.includes("fonts.googleapis.com") || url.includes("fonts.gstatic.com") || url.includes("html2canvas") || url.includes("cdnjs")) {
      blockedRequests.push(url);
    }
  });

  await page.goto("/");

  await expect(page.getByTestId("controls")).toBeVisible();
  await expect(page.locator(".control-button")).toHaveCount(8);
  await expect(page.getByTestId("part-head")).toBeVisible();
  await expect(page.getByTestId("part-body")).toBeVisible();
  await expect(page.getByTestId("part-leg-left")).toBeVisible();
  await expect(page.getByTestId("part-leg-right")).toBeVisible();

  const normalLayerOrder = await readLayerOrder(page);
  expect(normalLayerOrder.hideTarget).toBe(false);
  expect(normalLayerOrder.moverZ).toBeGreaterThan(normalLayerOrder.foregroundZ);

  const depthOrder = await readArmBodyDepth(page);
  expect(depthOrder.armLeftZ).toBeGreaterThan(depthOrder.bodyZ);
  expect(depthOrder.armRightZ).toBeGreaterThan(depthOrder.bodyZ);

  const marked = await setIdentityMarkers(page);
  expect(marked).toBe(true);

  await page.getByTestId("name-button").click();
  await page.getByTestId("emotion-button").click();
  const markersAfterNameEmotion = await readIdentityMarkers(page);
  expect(markersAfterNameEmotion.head).toBe("keep");
  expect(markersAfterNameEmotion.body).toBe("keep");

  await page.getByTestId("part-head").click();
  const markersAfterHeadChange = await readIdentityMarkers(page);
  expect(markersAfterHeadChange.head).toBe(null);
  expect(markersAfterHeadChange.body).toBe("keep");

  await page.getByTestId("part-head").click();
  await page.getByTestId("part-leg-left").click();
  await page.getByTestId("control-mix").click();

  const robotHeadRemembered = await page.getByTestId("part-head").getAttribute("data-key");
  await page.getByTestId("control-type").click();
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-mode", "astronaut");
  await page.getByTestId("part-head").click();
  const astronautHeadRemembered = await page.getByTestId("part-head").getAttribute("data-key");

  await page.getByTestId("control-type").click();
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-mode", "dragon");
  await page.getByTestId("control-type").click();
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-mode", "robot");
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-key", robotHeadRemembered);

  await page.getByTestId("control-type").click();
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-mode", "astronaut");
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-key", astronautHeadRemembered);
  await page.getByTestId("control-type").click();
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-mode", "dragon");
  await page.getByTestId("control-type").click();
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-mode", "robot");

  const initialTransform = await page.locator("#robot-mover").evaluate((el) => el.style.transform);
  await page.getByTestId("control-move").click();
  await expect
    .poll(async () => page.locator("#robot-mover").evaluate((el) => el.style.transform), { timeout: 3000 })
    .not.toBe(initialTransform);
  await expect(page.locator("#robot-dancer")).toHaveClass(/is-moving/);
  await page.getByTestId("control-move").click();

  await page.getByTestId("control-scene").click();
  await page.getByTestId("control-color").click();
  await page.getByTestId("control-size").click();

  for (let i = 0; i < 24; i += 1) {
    const isEngine = await page.getByTestId("part-body").getAttribute("data-engine");
    if (isEngine === "true") {
      break;
    }
    await page.getByTestId("part-body").click();
    await page.waitForTimeout(40);
  }

  await expect(page.getByTestId("part-body")).toHaveAttribute("data-engine", "true");

  await page.getByTestId("control-dance").click();
  await expect(page.locator("#robot-dancer")).toHaveClass(/is-dancing/);
  await expect
    .poll(async () => page.locator("#exhaust-container").getAttribute("data-mode"), { timeout: 10000 })
    .toBe("fire");
  await page.getByTestId("control-dance").click();

  await page.getByTestId("control-hide").click();
  await expect(page.getByTestId("hide-seek-hud")).toBeVisible();
  await expect(page.locator("#robot-assembly")).toHaveClass(/robot-hidden/);
  await expect(page.locator(".scene-occluder.is-occluding")).toHaveCount(1);

  const hideLayerOrder = await readLayerOrder(page);
  expect(hideLayerOrder.hideTarget).toBe(true);
  expect(hideLayerOrder.moverZ).toBeLessThan(hideLayerOrder.foregroundZ);

  await page.dispatchEvent("#robot-mover", "click");
  await expect(page.getByTestId("hide-seek-hud")).toBeHidden();
  await expect(page.getByTestId("hide-seek-score")).toHaveText("1");

  const restoredLayerOrder = await readLayerOrder(page);
  expect(restoredLayerOrder.hideTarget).toBe(false);
  expect(restoredLayerOrder.moverZ).toBeGreaterThan(restoredLayerOrder.foregroundZ);

  expect(blockedRequests).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
