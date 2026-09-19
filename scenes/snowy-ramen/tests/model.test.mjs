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

test("the standalone model builds, animates, batches and fits its square base", () => {
  const kit = new GeometryOnlyKit();
  const animation = buildScene(kit);
  try {
    animation?.update?.(0.016, 2, true, 65);
    kit.root.updateMatrixWorld(true);
    const bounds = new THREE.Box3();
    let meshCount = 0;
    kit.root.traverse((object) => {
      if (object.isMesh) meshCount++;
      if (!object.geometry?.attributes.position) return;
      const positions = object.geometry.attributes.position.array;
      assert.ok(positions.every(Number.isFinite), "geometry must contain only finite coordinates");
      object.geometry.computeBoundingBox();
      bounds.union(object.geometry.boundingBox.clone().applyMatrix4(object.matrixWorld));
    });
    assert.ok(meshCount > 100);
    assert.ok(bounds.min.x >= -7.51 && bounds.max.x <= 7.51);
    assert.ok(bounds.min.z >= -7.51 && bounds.max.z <= 7.51);
    kit.batch();
    animation?.update?.(0.016, 3, false, 65);
    animation?.update?.(0.016, 4, true, 65);
  } finally {
    animation?.dispose?.();
    kit.dispose();
  }
});
