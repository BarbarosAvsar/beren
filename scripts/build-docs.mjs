import { copyFile, cp, mkdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const docsDir = path.join(rootDir, "docs");
const appPath = path.join(rootDir, "app.js");

try {
  await stat(appPath);
} catch {
  throw new Error("Missing app.js. Run `npm run build:bundle` first.");
}

await rm(docsDir, { recursive: true, force: true });
await mkdir(docsDir, { recursive: true });

await copyFile(path.join(rootDir, "index.html"), path.join(docsDir, "index.html"));
await copyFile(appPath, path.join(docsDir, "app.js"));
await cp(path.join(rootDir, "css"), path.join(docsDir, "css"), { recursive: true });
await writeFile(path.join(docsDir, ".nojekyll"), "", "utf8");
