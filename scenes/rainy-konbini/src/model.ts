import { Kit } from "./kit.ts";
import type { SceneAnimation } from "./types.ts";
import { buildStore } from "./store.ts";
import { buildStreet } from "./street.ts";
import { addWetDetails, createWeather } from "./weather.ts";
import { createReflection } from "./reflection.ts";

export function buildScene(kit: Kit): SceneAnimation {
  buildStreet(kit);
  buildStore(kit);
  addWetDetails(kit);
  const weather = createWeather(kit);
  const reflection = createReflection(768);
  reflection.mesh.userData.dynamic = true;
  kit.root.add(reflection.mesh);
  return {
    update: weather.update,
    dispose: reflection.dispose,
  };
}
