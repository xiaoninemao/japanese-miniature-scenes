import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { Kit } from "../src/kit.ts";
import { buildScene } from "../src/model.ts";

class GeometryOnlyKit extends Kit {
  paint() {
    const texture = new THREE.Texture();
    this.textures.add(texture);
    return texture;
  }
}

test("station benches are supported, sit on the platform and clear the shelter columns", () => {
  const kit = new GeometryOnlyKit();
  const animation = buildScene(kit);
  try {
    kit.root.updateMatrixWorld(true);
    const benches = [];
    const columns = [];
    kit.root.traverse((object) => {
      if (object.name === "station-bench") benches.push(object);
      if (object.name === "station-shelter-column") columns.push(object);
    });
    assert.equal(benches.length, 2);
    assert.equal(columns.length, 6);
    const platform = new THREE.Box3().setFromObject(
      kit.root.getObjectByName("station-platform-deck"),
    );
    const bounds = (object) => new THREE.Box3().setFromObject(object);
    for (const bench of benches) {
      const parts = (name) => bench.children.filter((part) => part.name === name);
      const feet = parts("bench-foot");
      const legs = parts("bench-leg");
      const rails = parts("bench-seat-rail");
      const seats = parts("bench-seat-slat");
      const backs = parts("bench-back-slat");
      const backSupports = parts("bench-back-support");
      const arms = parts("bench-armrest");
      const armSupports = parts("bench-arm-support");
      assert.equal(feet.length, 4);
      assert.equal(legs.length, 4);
      assert.equal(seats.length, 4);
      assert.equal(backs.length, 3);
      for (const foot of feet) {
        assert.ok(Math.abs(bounds(foot).min.y - platform.max.y) < 1e-6, "feet must not be buried");
        assert.ok(legs.some((leg) => bounds(leg).intersectsBox(bounds(foot))));
      }
      for (const leg of legs) {
        assert.ok(rails.some((rail) => bounds(rail).intersectsBox(bounds(leg))));
      }
      for (const seat of seats) {
        assert.ok(Math.abs(bounds(seat).max.y - platform.max.y - 0.485) < 1e-6);
        assert.equal(rails.filter((rail) => bounds(rail).intersectsBox(bounds(seat))).length, 2);
      }
      for (const back of backs) {
        assert.equal(
          backSupports.filter((support) => bounds(support).intersectsBox(bounds(back))).length,
          2,
        );
      }
      for (const arm of arms) {
        assert.ok(armSupports.some((support) => bounds(support).intersectsBox(bounds(arm))));
        assert.ok(backSupports.some((support) => bounds(support).intersectsBox(bounds(arm))));
      }
      for (const support of armSupports) {
        assert.ok(seats.some((seat) => bounds(seat).intersectsBox(bounds(support))));
      }
      const benchBounds = bounds(bench);
      for (const column of columns) {
        assert.ok(
          !benchBounds.intersectsBox(bounds(column)),
          "shelter posts must not pierce a bench",
        );
        assert.ok(
          benchBounds.min.z - bounds(column).max.z > 0.45,
          "bench must be in front of the posts",
        );
      }
      assert.ok(
        benchBounds.max.z + 0.7 < 3.175,
        "leave walking space before the tactile edge strip",
      );
    }
    assert.ok(
      bounds(benches[0]).min.x - bounds(benches[1]).max.x > 2.4,
      "retain the ticket-window approach",
    );
    kit.batch();
  } finally {
    animation?.dispose?.();
    kit.dispose();
  }
});
