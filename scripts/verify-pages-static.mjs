import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");

const requiredPaths = [
  path.join(rootDir, "docs", ".nojekyll"),
  path.join(rootDir, "docs", "index.html"),
  path.join(rootDir, "docs", "app.js"),
  path.join(rootDir, "docs", "css", "base.css"),
  path.join(rootDir, "docs", "css", "layout.css"),
  path.join(rootDir, "docs", "css", "components.css"),
  path.join(rootDir, "docs", "css", "animations.css"),
];

const missing = [];
for (const target of requiredPaths) {
  try {
    await access(target);
  } catch {
    missing.push(path.relative(rootDir, target));
  }
}

if (missing.length > 0) {
  console.error("Pages static artifact verification failed. Missing:");
  missing.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log("Pages static artifact verification passed.");
