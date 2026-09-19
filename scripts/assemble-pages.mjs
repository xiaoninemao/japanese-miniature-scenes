import { access, cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const scenes = path.join(root, "scenes");
const output = path.join(root, "site");
const projects = (await readdir(scenes, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (!projects.length) throw new Error("No scene projects were found.");
for (const project of projects) {
  await access(path.join(scenes, project, "dist/index.html"));
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const project of projects) {
  await cp(path.join(scenes, project, "dist"), path.join(output, project), { recursive: true });
  console.log(`Ready: ${project}/index.html`);
}
await writeFile(path.join(output, ".nojekyll"), "");
console.log("Static output: site/. Each scene has its own URL; no root landing page is generated.");
