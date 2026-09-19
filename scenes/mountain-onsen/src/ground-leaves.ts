import * as THREE from "three";
import type { Kit } from "./kit.ts";

interface GroundLeafOptions {
  count: number;
  seed: number;
  surfaces: THREE.Mesh[];
  sample: (random: () => number) => [number, number];
  accept?: (x: number, z: number) => boolean;
}

export function scatterGroundLeaves(
  kit: Kit,
  geometry: THREE.BufferGeometry,
  materials: THREE.Material[],
  options: GroundLeafOptions,
): THREE.Mesh[] {
  if (!materials.length || !options.surfaces.length) {
    throw new Error("Ground leaves require materials and support surfaces.");
  }
  let state = options.seed;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  kit.root.updateMatrixWorld(true);
  const ray = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 30);
  const normal = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3();
  const localZ = new THREE.Vector3(0, 0, 1);
  const point = new THREE.Vector3();
  const pose = new THREE.Object3D();
  const vertices = geometry.getAttribute("position");
  const leaves: THREE.Mesh[] = [];
  const cast = (x: number, z: number) => {
    ray.ray.origin.set(x, 20, z);
    return ray.intersectObjects(options.surfaces, false)[0];
  };

  for (let attempt = 0; attempt < options.count * 100 && leaves.length < options.count; attempt++) {
    const [x, z] = options.sample(random);
    if (options.accept && !options.accept(x, z)) continue;
    const hit = cast(x, z);
    if (!hit?.face) continue;
    normalMatrix.getNormalMatrix(hit.object.matrixWorld);
    normal.copy(hit.face.normal).applyNormalMatrix(normalMatrix);
    if (normal.y < 0.7) continue;

    pose.position.copy(hit.point).addScaledVector(normal, 0.003);
    pose.quaternion.setFromUnitVectors(localZ, normal);
    pose.rotateZ(random() * Math.PI * 2);
    const scale = 0.65 + random() * 0.65;
    pose.scale.set(scale, scale * (0.85 + random() * 0.3), 1);
    pose.updateMatrix();

    // A center hit alone leaves leaf tips hovering across steps and rock edges.
    let supported = true;
    for (let i = 0; i < vertices.count; i++) {
      point.fromBufferAttribute(vertices, i).applyMatrix4(pose.matrix);
      const contact = cast(point.x, point.z);
      const gap = contact ? point.y - contact.point.y : Infinity;
      if (gap < 0.001 || gap > 0.008) {
        supported = false;
        break;
      }
    }
    if (!supported) continue;

    const leaf = kit.mesh(geometry, materials[Math.floor(random() * materials.length)], [0, 0, 0]);
    leaf.applyMatrix4(
      new THREE.Matrix4().copy(kit.root.matrixWorld).invert().multiply(pose.matrix),
    );
    leaf.name = "ground-leaf";
    leaf.userData.groundLeaf = true;
    leaves.push(leaf);
  }
  if (leaves.length !== options.count) {
    throw new Error(`Could only place ${leaves.length}/${options.count} supported ground leaves.`);
  }
  return leaves;
}
