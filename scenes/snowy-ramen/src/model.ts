import { Kit } from "./kit.ts";
import type { SceneAnimation } from "./types.ts";
import { buildStore } from "./store.ts";
import { buildStreet } from "./street.ts";
import { addWetDetails, createWeather } from "./weather.ts";

export function buildScene(kit: Kit): SceneAnimation {
  buildStreet(kit);
  buildStore(kit);
  addWetDetails(kit);
  return createWeather(kit);
}
