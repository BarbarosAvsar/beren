import { test, expect } from "@playwright/test";

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
  await expect(page.getByTestId("part-head")).toBeVisible();

  await page.getByTestId("part-head").click();
  await page.getByTestId("part-legs").click();

  await page.getByTestId("control-mix").click();
  await page.getByTestId("control-scene").click();
  await page.getByTestId("control-color").click();
  await page.getByTestId("control-size").click();

  for (let i = 0; i < 8; i += 1) {
    const isEngine = await page.getByTestId("part-body").getAttribute("data-engine");
    if (isEngine === "true") {
      break;
    }
    await page.getByTestId("part-body").click();
    await page.waitForTimeout(40);
  }
  await expect(page.getByTestId("part-body")).toHaveAttribute("data-engine", "true");
  await page.getByTestId("control-dance").click();
  await expect
    .poll(async () => page.locator("#exhaust-container").getAttribute("data-mode"), { timeout: 10000 })
    .toBe("fire");
  await page.getByTestId("control-dance").click();

  await page.getByTestId("control-hide").click();
  await expect(page.getByTestId("hide-seek-hud")).toBeVisible();

  await page.dispatchEvent("#robot-assembly", "click");
  await expect(page.getByTestId("hide-seek-hud")).toBeHidden();

  await expect(page.getByTestId("hide-seek-score")).toHaveText("1");

  expect(blockedRequests).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
