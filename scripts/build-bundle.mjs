import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");

await build({
  entryPoints: [path.join(rootDir, "js", "main.js")],
  outfile: path.join(rootDir, "app.js"),
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2018"],
  logLevel: "info",
  legalComments: "none",
});
