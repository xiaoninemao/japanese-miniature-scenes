import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { Kit } from "../src/kit.ts";
import { scatterGroundLeaves } from "../src/ground-leaves.ts";

function verifyContact(leaves, surfaces) {
  const ray = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));
  const vertex = new THREE.Vector3();
  for (const leaf of leaves) {
    leaf.updateWorldMatrix(true, false);
    const positions = leaf.geometry.getAttribute("position");
    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i).applyMatrix4(leaf.matrixWorld);
      ray.ray.origin.set(vertex.x, 20, vertex.z);
      const hit = ray.intersectObjects(surfaces, false)[0];
      assert.ok(hit, "every leaf vertex needs a supporting surface");
      const gap = vertex.y - hit.point.y;
      assert.ok(gap >= 0.001 && gap <= 0.008, `leaf surface gap ${gap} is outside tolerance`);
    }
  }
}

function sample(random) {
  return random() < 0.75
    ? [-1.8 + (random() + random() - 1) * 1.2, (random() + random() - 1) * 2.8]
    : [1.2 + random() * 2, -2.8 + random() * 5.6];
}

test("leaves rest just above the real flat surface, with deterministic irregular placement", () => {
  const kit = new Kit();
  const ground = kit.box([0, 0.105, 0], [10, 0.12, 10], "#74856f");
  const geometry = new THREE.PlaneGeometry(0.3, 0.3);
  const materials = [kit.toon("#b25030"), kit.toon("#bb913f")];
  const options = { count: 48, seed: 240917, surfaces: [ground], sample };
  try {
    const leaves = scatterGroundLeaves(kit, geometry, materials, options);
    verifyContact(leaves, [ground]);
    assert.equal(leaves.length, 48);
    assert.ok(leaves.every((leaf) => Math.abs(leaf.position.y - 0.168) < 1e-6));
    assert.ok(new Set(leaves.map((leaf) => leaf.position.x.toFixed(3))).size > 43);
    assert.ok(new Set(leaves.map((leaf) => leaf.position.z.toFixed(3))).size > 43);
    assert.ok(new Set(leaves.map((leaf) => leaf.scale.x.toFixed(3))).size > 30);
    assert.ok(new Set(leaves.map((leaf) => leaf.quaternion.z.toFixed(3))).size > 35);
    assert.ok(leaves.filter((leaf) => leaf.position.x < 0).length > 28);
    const signature = (list) =>
      list.map((leaf) => [...leaf.position, ...leaf.quaternion, ...leaf.scale]);
    assert.deepEqual(
      signature(scatterGroundLeaves(kit, geometry, materials, options)),
      signature(leaves),
    );
  } finally {
    kit.dispose();
  }
});

test("all leaf tips follow a slope rather than floating on a horizontal plane", () => {
  const kit = new Kit();
  const ramp = kit.box([0, 1.2, 0], [10, 0.12, 10], "#ad9b84");
  ramp.rotation.z = -Math.atan(2.16 / 14.9);
  try {
    const leaves = scatterGroundLeaves(
      kit,
      new THREE.PlaneGeometry(0.3, 0.3),
      [kit.toon("#b25030")],
      { count: 38, seed: 715, surfaces: [ramp], sample },
    );
    verifyContact(leaves, [ramp]);
    const expected = new THREE.Vector3(0, 1, 0).applyQuaternion(ramp.quaternion);
    for (const leaf of leaves) {
      const actual = new THREE.Vector3(0, 0, 1).applyQuaternion(leaf.quaternion);
      assert.ok(actual.dot(expected) > 0.999999);
    }
    kit.batch();
  } finally {
    kit.dispose();
  }
});

test("a leaf spanning a step edge is rejected instead of intersecting or hovering", () => {
  const kit = new Kit();
  const ground = kit.box([0, 0, 0], [10, 0.2, 10], "#74856f");
  const step = kit.box([2, 0.4, 0], [4, 0.6, 4], "#8b9390");
  const geometry = new THREE.PlaneGeometry(0.3, 0.3);
  try {
    assert.throws(
      () =>
        scatterGroundLeaves(kit, geometry, [kit.toon("#b25030")], {
          count: 1,
          seed: 29,
          surfaces: [ground, step],
          sample: () => [-0.02, 0],
        }),
      /Could only place 0\/1 supported ground leaves/,
    );
  } finally {
    geometry.dispose();
    kit.dispose();
  }
});
