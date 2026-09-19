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

test("harbor rear and side walls meet the sloped roof without a daylight gap", () => {
  const kit = new GeometryOnlyKit();
  const animation = buildScene(kit);
  try {
    kit.root.updateMatrixWorld(true);
    const roof = kit.root.getObjectByName("fish-market-roof");
    const rear = kit.root.getObjectByName("fish-market-rear-wall");
    const side = kit.root.getObjectByName("fish-market-side-wall");
    assert.ok(roof && rear && side);
    const ray = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0));
    const roofHeight = (x, z) => {
      ray.ray.origin.set(x, 1, z);
      const hit = ray.intersectObject(roof, false)[0];
      assert.ok(hit, "wall or column must be underneath the roof");
      return hit.point.y;
    };
    const rearBounds = new THREE.Box3().setFromObject(rear);
    for (const x of [-6.55, -4.8, -3.32, -1.8, 0]) {
      for (const z of [-5.38, -5.3, -5.22]) {
        const overlap = rearBounds.max.y - roofHeight(x, z);
        assert.ok(overlap >= 0 && overlap <= 0.04, `rear wall/roof overlap ${overlap}`);
      }
    }
    const sideTops = new Map();
    const positions = side.geometry.attributes.position;
    const point = new THREE.Vector3();
    for (let i = 0; i < positions.count; i++) {
      point.fromBufferAttribute(positions, i).applyMatrix4(side.matrixWorld);
      const z = Number(point.z.toFixed(3));
      sideTops.set(z, Math.max(sideTops.get(z) ?? -Infinity, point.y));
    }
    assert.equal(sideTops.size, 2);
    for (const [z, y] of sideTops) {
      const overlap = y - roofHeight(-6.63, z);
      assert.ok(overlap >= 0.005 && overlap <= 0.025, `sloped side-wall overlap ${overlap}`);
    }
    assert.ok(sideTops.get(-5.365) - sideTops.get(0.565) > 0.6);

    const posts = [];
    kit.root.traverse((object) => {
      if (object.name === "fish-market-roof-post") posts.push(object);
    });
    assert.equal(posts.length, 6);
    for (const post of posts) {
      const bounds = new THREE.Box3().setFromObject(post);
      assert.ok(Math.abs(bounds.min.y - 0.95) < 1e-6);
      for (const z of [bounds.min.z, bounds.max.z]) {
        const overlap = bounds.max.y - roofHeight(post.position.x, z);
        assert.ok(overlap >= 0 && overlap <= 0.03, `column/roof overlap ${overlap}`);
      }
    }

    ray.ray.origin.set(-4.2, 2.65, 1);
    ray.ray.direction.set(0, 0, -1);
    const frontHit = ray
      .intersectObjects(kit.root.children, true)
      .find((hit) => hit.object instanceof THREE.Mesh);
    assert.ok(frontHit && frontHit.point.z < 0, "the front counter must remain open");
    kit.batch();
  } finally {
    animation?.dispose?.();
    kit.dispose();
  }
});
