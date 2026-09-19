import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { Kit } from "../src/kit.ts";
import { buildBookshopTerrain } from "../src/terrain.ts";

class GeometryOnlyKit extends Kit {
  paint() {
    const texture = new THREE.Texture();
    this.textures.add(texture);
    return texture;
  }
}

test("the hillside street, stair flights and terraces form continuous supported terrain", () => {
  const kit = new GeometryOnlyKit();
  try {
    const [, road] = buildBookshopTerrain(kit, {
      earth: "#715947",
      stone: "#ad9b84",
      mortar: "#796d60",
      iron: "#443e36",
    });
    kit.root.updateMatrixWorld(true);
    const named = (name) => kit.root.children.filter((object) => object.name === name);
    const bounds = (object) => new THREE.Box3().setFromObject(object);
    const ray = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));
    const heightAt = (objects, x, z) => {
      ray.ray.origin.set(x, 20, z);
      return ray.intersectObjects(objects, false)[0]?.point.y;
    };
    const treads = named("bookshop-stair-tread");
    const landing = named("bookshop-stair-landing")[0];
    const shop = named("bookshop-platform")[0];
    const high = named("bookshop-high-landing")[0];
    assert.equal(treads.length, 16);
    assert.ok(landing && shop && high);
    const sequence = [...treads, landing].sort((a, b) => b.position.x - a.position.x);
    const first = bounds(sequence[0]);
    let previousHeight = heightAt([road], first.max.x + 0.0001, (first.min.z + first.max.z) / 2);
    assert.ok(Number.isFinite(previousHeight));
    let previous;
    for (const step of sequence) {
      const box = bounds(step);
      assert.ok(
        Math.abs(box.min.z - 2.25) < 1e-6,
        "every tread must touch the terrace retaining line",
      );
      const rise = box.max.y - previousHeight;
      assert.ok(rise >= -1e-6 && rise <= 0.18, `unexpected stair rise ${rise}`);
      if (previous) assert.ok(Math.abs(box.max.x - previous.min.x) < 1e-6, "no gaps between steps");
      const x = (box.min.x + box.max.x) / 2;
      assert.ok(
        Number.isFinite(heightAt([road], x, box.max.z + 0.04)),
        "road must reach the outside of each tread",
      );
      assert.equal(
        heightAt([road], x, (box.min.z + box.max.z) / 2),
        undefined,
        "road must not intrude into a stair footprint",
      );
      previousHeight = box.max.y;
      previous = box;
    }
    assert.ok(Math.abs(bounds(landing).max.y - bounds(shop).max.y) < 1e-6);
    assert.ok(Math.abs(bounds(sequence.at(-1)).max.y - bounds(high).max.y) < 1e-6);
    assert.ok(Math.abs(bounds(sequence.at(-1)).min.x - bounds(high).max.x) < 1e-6);
    assert.ok(bounds(high).max.z >= bounds(sequence.at(-1)).max.z);
    assert.ok(
      Math.abs(heightAt([shop, landing], 1.5, 2.2) - heightAt([shop, landing], 1.5, 2.3)) < 1e-6,
    );
    assert.ok(heightAt([road], 0.15, 3.86) > 1, "the former ramp/stair slit must be filled");
    assert.ok(
      Math.abs(heightAt([landing], 1.89, 2.45) - 1.41) < 1e-6,
      "the shop approach must not drop into a gap",
    );
    for (const post of named("bookshop-guard-post")) {
      const support = kit.root.getObjectByProperty("uuid", post.userData.support);
      assert.ok(support);
      const foot = bounds(post);
      const surface = bounds(support);
      assert.ok(
        Math.abs(foot.min.y - surface.max.y) < 1e-6,
        "rail posts must meet their actual tread",
      );
      assert.ok(foot.min.x >= surface.min.x && foot.max.x <= surface.max.x);
      assert.ok(foot.min.z >= surface.min.z && foot.max.z <= surface.max.z);
    }
    const whole = bounds(kit.root);
    assert.ok(whole.min.x >= -7.5 && whole.max.x <= 7.5);
    assert.ok(whole.min.z >= -7.5 && whole.max.z <= 7.5);
    kit.batch();
  } finally {
    kit.dispose();
  }
});
