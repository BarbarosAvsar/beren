import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { test, expect } from "@playwright/test";

import {
  readArmBodyDepth,
  readIdentityMarkers,
  readLayerOrder,
  setIdentityMarkers,
} from "./helpers/ui-helpers.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(currentDir, "..", "..", "index.html");
const indexFileUrl = pathToFileURL(indexPath).href;

test("file protocol startup smoke flow", async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto(indexFileUrl, { waitUntil: "load" });

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
  await page.getByTestId("control-mix").click();
  const robotHeadRemembered = await page.getByTestId("part-head").getAttribute("data-key");
  await page.getByTestId("control-type").click();
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-mode", "astronaut");
  await page.getByTestId("part-head").click();
  const astronautHeadRemembered = await page.getByTestId("part-head").getAttribute("data-key");
  await page.getByTestId("control-type").click();
  await page.getByTestId("control-type").click();
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-mode", "robot");
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-key", robotHeadRemembered);
  await page.getByTestId("control-type").click();
  await expect(page.getByTestId("part-head")).toHaveAttribute("data-key", astronautHeadRemembered);
  await page.getByTestId("control-type").click();

  const beforeMove = await page.locator("#robot-mover").evaluate((el) => el.style.transform);
  await page.getByTestId("control-move").click();
  await expect
    .poll(async () => page.locator("#robot-mover").evaluate((el) => el.style.transform), { timeout: 3000 })
    .not.toBe(beforeMove);
  await page.getByTestId("control-move").click();

  await page.getByTestId("control-hide").click();
  await expect(page.getByTestId("hide-seek-hud")).toBeVisible();
  await expect(page.locator("#robot-assembly")).toHaveClass(/robot-hidden/);
  await expect(page.locator(".scene-occluder.is-occluding")).toHaveCount(1);

  const hideLayerOrder = await readLayerOrder(page);
  expect(hideLayerOrder.hideTarget).toBe(true);
  expect(hideLayerOrder.moverZ).toBeLessThan(hideLayerOrder.foregroundZ);

  await page.dispatchEvent("#robot-mover", "click");
  await expect(page.getByTestId("hide-seek-hud")).toBeHidden();

  const restoredLayerOrder = await readLayerOrder(page);
  expect(restoredLayerOrder.hideTarget).toBe(false);
  expect(restoredLayerOrder.moverZ).toBeGreaterThan(restoredLayerOrder.foregroundZ);

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
