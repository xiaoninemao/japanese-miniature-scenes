import "./style.css";
import { config } from "./config.ts";
import { buildScene } from "./model.ts";
import { createScene } from "./viewer.ts";

document.documentElement.style.setProperty("--scene-background", config.background);
const host = document.getElementById("scene");
if (!(host instanceof HTMLElement)) throw new Error("The model canvas container is missing.");

function showError(error: Error) {
  console.error("Unable to render the miniature:", error);
  document.querySelector(".scene-error")?.remove();
  const panel = document.createElement("section");
  panel.className = "scene-error";
  panel.setAttribute("role", "alert");
  const title = document.createElement("h1");
  title.textContent = "三维模型未能载入";
  const hint = document.createElement("p");
  hint.textContent = "请确认浏览器已开启硬件加速，然后重新载入。";
  const detail = document.createElement("p");
  detail.className = "error-detail";
  detail.textContent = error.message;
  const retry = document.createElement("button");
  retry.textContent = "重新载入";
  retry.addEventListener("click", () => window.location.reload());
  panel.append(title, hint, detail, retry);
  document.body.appendChild(panel);
}

let dispose: (() => void) | undefined;
try {
  dispose = createScene(host, config, buildScene, showError);
} catch (error) {
  showError(error instanceof Error ? error : new Error(String(error)));
}

window.addEventListener("pagehide", (event) => {
  if (!event.persisted) dispose?.();
});
if (import.meta.hot) {
  import.meta.hot.dispose(() => dispose?.());
}
