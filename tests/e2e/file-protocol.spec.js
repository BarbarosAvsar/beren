import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { test, expect } from "@playwright/test";

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
  await expect(page.locator(".control-button")).toHaveCount(7);

  await page.getByTestId("part-head").click();
  await page.getByTestId("control-mix").click();
  await page.getByTestId("control-hide").click();
  await expect(page.getByTestId("hide-seek-hud")).toBeVisible();

  await page.dispatchEvent("#robot-assembly", "click");
  await expect(page.getByTestId("hide-seek-hud")).toBeHidden();

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
