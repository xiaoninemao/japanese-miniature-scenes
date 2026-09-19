import * as THREE from "three";
import type { Kit, XYZ } from "./kit.ts";
import type { SceneAnimation } from "./types.ts";

export function buildScene(kit: Kit): SceneAnimation {
  const root = kit.root;
  let seed = 3829;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const green = ["#487c69", "#739781", "#365d56", "#8da987"];
  const petals = ["#ac9dce", "#c9b5da", "#e1b7cb", "#939fce", "#c8cde6"];
  const leafGeometry = new THREE.SphereGeometry(1, 6, 4);
  const petalGeometry = new THREE.OctahedronGeometry(1, 0);
  const glass = new THREE.MeshBasicMaterial({
    color: "#c1e4df",
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const canopy = new THREE.MeshBasicMaterial({
    color: "#c9e4dc",
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const wet = new THREE.MeshBasicMaterial({
    color: "#bbd7d7",
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
  });
  const oval = (position: XYZ, scale: XYZ, color: string, parent: THREE.Object3D = root) => {
    const mesh = kit.mesh(leafGeometry, kit.toon(color), position, parent);
    mesh.scale.set(...scale);
    return mesh;
  };
  const leaf = (position: XYZ, size: number, angle: number, parent = root) => {
    const mesh = oval(
      position,
      [size * 0.35, size * 0.09, size],
      green[Math.floor(random() * 4)],
      parent,
    );
    mesh.rotation.set(-0.3, angle, 0.35);
  };
  const hydrangea = (position: XYZ, radius: number, color: string, parent = root) => {
    const [x, y, z] = position;
    // Every crown is a hemisphere of individual four-petal florets.
    for (let f = 0; f < 22; f++) {
      const a = f * 2.39996;
      const up = 0.06 + (f / 22) * 0.93;
      const ring = Math.sqrt(1 - up * up);
      const center = new THREE.Vector3(Math.cos(a) * ring, up, Math.sin(a) * ring).multiplyScalar(
        radius,
      );
      const flower = new THREE.Group();
      flower.position.set(x + center.x, y + center.y, z + center.z);
      flower.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), center.clone().normalize());
      parent.add(flower);
      for (let p = 0; p < 4; p++) {
        const angle = (p * Math.PI) / 2;
        const mesh = kit.mesh(
          petalGeometry,
          kit.toon(color),
          [Math.cos(angle) * radius * 0.15, 0, Math.sin(angle) * radius * 0.15],
          flower,
        );
        mesh.scale.set(radius * 0.18, radius * 0.065, radius * 0.13);
        mesh.rotation.y = -angle;
      }
      oval([0, 0.035, 0], [0.025, 0.025, 0.025], "#e7e3bc", flower);
    }
  };
  const pot = (x: number, z: number, size: number, type: number, floor = 0.24) => {
    const colors = ["#b99683", "#d2c6b1", "#7b9d95", "#aab5be"];
    kit.cylinder(
      [x, floor + size * 0.42, z],
      size * 0.34,
      size * 0.84,
      colors[type % 4],
      root,
      10,
      size * 0.47,
    );
    kit.cylinder([x, floor + size * 0.86, z], size * 0.48, 0.08, colors[type % 4], root, 12);
    kit.cylinder([x, floor + size * 0.91, z], size * 0.4, 0.035, "#4b5750", root, 12);
    for (let i = 0; i < 5; i++) {
      const a = i * 2.4;
      const px = x + Math.cos(a) * size * 0.29;
      const pz = z + Math.sin(a) * size * 0.29;
      const height = floor + size * (1.4 + random() * 0.5);
      kit.rod([x, floor + size * 0.9, z], [px, height, pz], 0.024, green[0]);
      leaf([px, height - size * 0.3, pz], size * 0.37, a);
      if (type % 3 !== 2)
        hydrangea([px, height, pz], size * 0.34, petals[(type + i) % petals.length]);
      else {
        for (let j = 0; j < 4; j++) {
          leaf([px, height - j * size * 0.15, pz], size * (0.36 - j * 0.04), a + j);
        }
      }
    }
  };
  const fern = (x: number, z: number, size: number) => {
    kit.cylinder([x, 0.46, z], size * 0.32, 0.5, "#82978b", root, 10, size * 0.4);
    for (let i = 0; i < 7; i++) {
      const a = (i * Math.PI * 2) / 7;
      const dx = Math.cos(a);
      const dz = Math.sin(a);
      kit.rod([x, 0.7, z], [x + dx * size * 0.7, 1.15, z + dz * size * 0.7], 0.017, green[0]);
      for (let j = 1; j < 6; j++) {
        const t = j / 6;
        for (const sign of [-1, 1]) {
          const blade = oval(
            [
              x + dx * size * t * 0.7 - dz * sign * size * 0.12,
              0.7 + t * 0.5,
              z + dz * size * t * 0.7 + dx * sign * size * 0.12,
            ],
            [size * 0.23 * (1 - t * 0.6), 0.035, 0.06],
            green[(i + j) % 4],
          );
          blade.rotation.y = -a + sign * 0.65;
        }
      }
    }
  };

  kit.box([0, -0.2, 0], [15, 0.6, 15], "#728c8d");
  kit.box([0, 0.13, -1.7], [14.7, 0.06, 11.2], "#93aaa6");
  kit.box([0, 0.12, 5.42], [15, 0.04, 3.95], "#71878a");
  for (let x = -7; x < 7.3; x += 0.67) {
    for (let z = -6.9; z < 3.4; z += 0.53) {
      if (x > -6 && x < 1 && z < 0.7 && z > -5.9) continue;
      kit.box(
        [x + (Math.round(z / 0.53) % 2) * 0.14, 0.19, z],
        [0.58, 0.045, 0.45],
        ["#a0b2ae", "#91a7a4", "#b0bebb"][Math.floor(random() * 3)],
      );
    }
  }
  for (let x = -7; x <= 7; x += 0.7) {
    kit.box([x, 0.155, 5.3], [0.22, 0.075, 2.1], "#627477");
  }
  for (const z of [4.65, 5.95]) {
    kit.box([0, 0.225, z], [15, 0.11, 0.12], "#4c646b");
    kit.box([0, 0.29, z + 0.025], [15, 0.025, 0.045], "#c3d4d4");
  }
  kit.box([0, 0.29, 3.62], [14.7, 0.16, 0.27], "#c1cbc2");
  for (let x = -6.8; x < 7; x += 0.42) {
    kit.box([x, 0.38, 3.58], [0.23, 0.018, 0.08], "#e3dec6");
  }
  kit.box([1.7, 0.23, 2.7], [1.4, 0.04, 0.52], "#475e62");
  for (let i = 0; i < 10; i++)
    kit.box([1.08 + i * 0.14, 0.26, 2.7], [0.045, 0.025, 0.45], "#90a6a6");
  for (let i = 0; i < 12; i++) {
    const puddle = kit.mesh(new THREE.CircleGeometry(0.3 + random() * 0.4, 24), wet, [
      -6.7 + random() * 13.2,
      0.245,
      3.95 + random() * 2.9,
    ]);
    puddle.rotation.x = -Math.PI / 2;
    puddle.scale.y = 0.4;
    puddle.castShadow = false;
  }

  // The little timber shop has transparent front and side walls.
  kit.box([-2.6, 0.32, -2.55], [6.9, 0.3, 6.2], "#c6c2ae");
  kit.box([-2.6, 2.47, -5.58], [6.65, 4.15, 0.18], "#c4c7af");
  kit.box([-5.86, 2.47, -2.55], [0.18, 4.15, 6], "#bcc5b1");
  kit.box([-2.6, 0.55, -2.55], [6.5, 0.12, 5.95], "#b8ac94");
  for (let z = -5.3; z < 0.4; z += 0.42) kit.box([-2.6, 0.617, z], [6.4, 0.018, 0.026], "#9a9989");
  for (const x of [-5.87, -3.9, -1.6, 0.69]) {
    kit.box([x, 2.55, 0.49], [0.12, 4.08, 0.14], "#658378");
  }
  kit.box([-2.59, 1.95, 0.5], [6.45, 2.72, 0.035], glass);
  kit.box([0.7, 2.43, -2.52], [0.035, 3.63, 5.8], glass);
  kit.box([-2.6, 3.87, 0.51], [6.7, 0.92, 0.22], "#819e90");
  kit.sign("花しずく", [-2.6, 3.91, 0.637], 4.45, 0.65, "#819e90", "#fff1d5", root, 116);
  kit.sign(
    "FLOWERS  &  LITTLE THINGS",
    [-2.6, 3.49, 0.64],
    4.45,
    0.17,
    "#819e90",
    "#e7e6cd",
    root,
    42,
  );
  kit.box([-2.6, 0.75, 0.54], [6.5, 0.3, 0.14], "#6b897d");
  kit.box([-2.75, 1.94, 0.57], [0.045, 2.6, 0.08], "#92a895");
  kit.rod([-2.9, 1.55, 0.67], [-2.9, 1.95, 0.67], 0.035, "#b9b399");
  const roof = kit.box([-2.6, 4.71, -2.55], [7.35, 0.22, 6.75], "#657e83");
  roof.rotation.x = -0.12;
  for (let x = -6.15; x < 1.04; x += 0.39) {
    const rib = kit.box([x, 4.85, -2.55], [0.06, 0.045, 6.7], "#8ca0a0");
    rib.rotation.x = -0.12;
  }
  kit.box([-2.6, 4.31, 0.87], [7.35, 0.14, 0.16], "#69817e");
  const awning = kit.box([-2.6, 3.38, 1.28], [6.7, 0.045, 1.35], canopy);
  awning.rotation.x = 0.11;
  for (const x of [-5.8, -3.65, -1.5, 0.65])
    kit.rod([x, 3.45, 0.6], [x, 3.3, 1.95], 0.035, "#adc4b7");
  kit.rod([-5.8, 3.3, 1.95], [0.65, 3.3, 1.95], 0.042, "#adc4b7");

  // A working wrapping station, not just a luminous empty window.
  kit.box([-1.7, 1.59, -0.45], [2.9, 0.13, 1.3], "#d5bb92");
  for (const x of [-2.9, -0.5])
    for (const z of [-0.95, 0]) kit.box([x, 1.08, z], [0.09, 1.03, 0.09], "#78918a");
  kit.box([-1.6, 1.675, -0.38], [1.3, 0.018, 0.85], "#ddc8a1");
  for (let i = 0; i < 3; i++) {
    const roll = kit.cylinder(
      [-2.68 + i * 0.27, 1.81, -0.72],
      0.11,
      0.95,
      ["#bd9e72", "#ead7af", "#b5c5af"][i],
    );
    roll.rotation.x = Math.PI / 2;
    const hole = kit.cylinder([-2.68 + i * 0.27, 1.81, -0.233], 0.05, 0.01, "#8f8368");
    hole.rotation.x = Math.PI / 2;
  }
  for (let i = 0; i < 3; i++) kit.cylinder([-0.62, 1.76 + i * 0.14, -0.63], 0.16, 0.12, petals[i]);
  kit.rod([-1.52, 1.71, -0.21], [-1.15, 1.71, -0.53], 0.02, "#6f827f");
  kit.rod([-1.35, 1.71, -0.19], [-1.53, 1.71, -0.58], 0.02, "#6f827f");
  for (const x of [-1.52, -1.34]) {
    const handle = kit.torus([x, 1.72, -0.16], 0.07, 0.017, "#b88188");
    handle.rotation.x = Math.PI / 2;
  }
  kit.box([-3.85, 2.25, -5.27], [3.4, 3.2, 0.17], "#7b9181");
  for (const y of [1.03, 2.0, 2.97]) {
    kit.box([-3.85, y, -4.9], [3.55, 0.12, 0.86], "#adad91");
    for (let i = 0; i < 5; i++) {
      const x = -5.23 + i * 0.69;
      kit.cylinder(
        [x, y + 0.3, -4.84],
        0.17,
        0.45,
        ["#dbcdb1", "#a1b4a4", "#b694a4"][i % 3],
        root,
        12,
        0.21,
      );
      if (i % 2 === 0) {
        for (let s = 0; s < 3; s++) leaf([x, y + 0.62 + s * 0.1, -4.84], 0.21, s * 2);
      } else hydrangea([x, y + 0.55, -4.84], 0.2, petals[i]);
    }
  }
  kit.box([-0.32, 1.06, -4.44], [1.4, 0.85, 1.1], "#99a996");
  kit.box([-0.32, 1.52, -4.44], [1.6, 0.08, 1.2], "#d4c2a0");
  pot(-0.45, -4.45, 0.48, 0, 1.56);
  kit.sign("季節の花", [-4.84, 2.89, -5.13], 1.15, 0.34, "#dcdcc4", "#678276");
  kit.box([-4.72, 1.05, -0.65], [1.4, 0.8, 1.1], "#adb5a0");
  for (let i = 0; i < 3; i++) pot(-5.15 + i * 0.44, -0.67, 0.43, i, 1.5);
  for (const x of [-4.4, -1.25]) {
    kit.rod([x, 4.24, -1.28], [x, 3.76, -1.28], 0.025, "#5f766c");
    kit.cylinder([x, 3.7, -1.28], 0.31, 0.22, "#d4d7bd", root, 16, 0.11);
    kit.cylinder([x, 3.57, -1.28], 0.24, 0.02, kit.basic("#ffe1a9"));
    kit.point([x, 3.3, -1], "#ffddb2", 4.2, 5);
  }

  kit.box([-4.56, 0.46, 1.2], [2.36, 0.33, 0.92], "#96a58e");
  for (let i = 0; i < 6; i++) pot(-5.5 + i * 0.37, 1.25, 0.43, i, 0.66);
  const garden: [number, number, number, number][] = [
    [-6.65, -4.6, 0.82, 2],
    [-6.67, -2.8, 0.85, 0],
    [-6.61, -1.2, 0.76, 1],
    [-6.45, 0.5, 0.79, 3],
    [-6.35, 2.3, 0.78, 0],
    [-5.04, 2.63, 0.58, 1],
    [-3.96, 2.6, 0.55, 3],
    [-0.25, 1.43, 0.6, 1],
    [0.74, 2.02, 0.65, 0],
    [1.74, -0.13, 0.86, 3],
    [1.85, -1.55, 0.7, 2],
    [1.74, -3.25, 0.9, 1],
    [1.84, -4.93, 0.78, 0],
    [3.12, -5.55, 0.75, 2],
    [4.5, -5.93, 0.75, 1],
    [5.94, -5.75, 0.78, 3],
  ];
  garden.forEach(([x, z, s, type]) => pot(x, z, s, type));
  fern(2.4, -2.4, 0.9);
  fern(-6.35, 1.35, 0.7);
  fern(3.5, -4.17, 1.0);
  for (let i = 0; i < 3; i++) {
    kit.box([2.8 + i * 1.07, 0.44, -6.7], [0.93, 0.5, 0.67], "#a7b09b");
    for (let s = 0; s < 5; s++) {
      const x = 2.5 + i * 1.07 + s * 0.13;
      const y = 1.45 + random() * 0.85;
      kit.rod([x, 0.7, -6.7], [x + 0.07, y, -6.7], 0.024, green[0]);
      for (let j = 0; j < 3; j++) leaf([x, y - 0.32 - j * 0.2, -6.7], 0.2, j * 2.4);
      hydrangea([x + 0.07, y, -6.7], 0.16, petals[(i + s) % 5]);
    }
  }
  kit.box([-1.75, 0.8, 2.17], [0.73, 1.13, 0.09], "#71897d");
  kit.sign("あじさい", [-1.75, 1.08, 2.226], 0.65, 0.23, "#71897d", "#f0e7cd");
  kit.sign("¥ 380", [-1.75, 0.77, 2.226], 0.65, 0.2, "#71897d", "#f0e7cd");
  kit.rod([-1.75, 1.35, 2.2], [-1.75, 0.25, 1.67], 0.04, "#8a9a86");
  kit.cylinder([-3.03, 0.7, 1.15], 0.28, 0.9, "#d6dfd7", root, 16);
  for (let i = 0; i < 4; i++) {
    const x = -3.2 + i * 0.12;
    kit.rod([x, 0.7, 1.15], [x + 0.09, 1.92, 1.15], 0.025, "#ecede3");
    const umbrella = kit.cylinder(
      [x + 0.06, 1.27, 1.15],
      0.085,
      0.84,
      ["#e9eee7", "#bccac2"][i % 2],
      root,
      7,
      0.015,
    );
    umbrella.rotation.z = -0.07;
    const hook = kit.torus([x + 0.15, 1.94, 1.15], 0.07, 0.024, "#eceee4");
    hook.scale.y = 1.3;
  }
  for (let i = 0; i < 18; i++) {
    const link = kit.torus([0.96, 4.16 - i * 0.2, 0.78], 0.072, 0.017, "#a7b5a5");
    link.rotation.y = ((i % 2) * Math.PI) / 2;
  }
  kit.cylinder([0.96, 0.37, 0.78], 0.31, 0.15, "#849b92", root, 16);

  // A separate open tram shelter leaves the flower garden visible behind it.
  for (const x of [3.65, 6.58]) {
    kit.box([x, 1.94, 1.08], [0.1, 3.42, 0.1], "#728e86");
    kit.box([x, 1.94, 2.93], [0.1, 3.42, 0.1], "#728e86");
  }
  kit.box([5.12, 3.67, 2.02], [3.48, 0.16, 2.35], "#819b90");
  kit.box([5.12, 3.77, 2.02], [3.22, 0.045, 2.1], canopy);
  kit.box([5.1, 1.95, 1.09], [2.8, 2.7, 0.025], glass);
  for (let i = 0; i < 4; i++) kit.box([5.0, 0.99, 1.57 + i * 0.15], [2.18, 0.08, 0.12], "#b5bba3");
  for (let i = 0; i < 3; i++) kit.box([5.0, 1.38 + i * 0.18, 1.42], [2.18, 0.12, 0.085], "#b5bba3");
  for (const x of [4.23, 5.78]) kit.box([x, 0.6, 1.86], [0.09, 0.75, 0.46], "#6a847f");
  kit.sign("花坂  /  HANASAKA", [5.12, 3.43, 3.2], 2.7, 0.34, "#819b90", "#eef0d9", root, 62);
  kit.box([6.7, 1.55, 0.22], [0.07, 2.7, 0.07], "#798d86");
  kit.cylinder([6.7, 2.87, 0.22], 0.39, 0.08, "#d5e2d8", root, 24).rotation.x = Math.PI / 2;
  kit.sign("電停", [6.7, 2.87, 0.27], 0.61, 0.25, "#d5e2d8", "#5b8075");
  kit.box([6.7, 1.95, 0.22], [0.65, 0.94, 0.12], "#d9ded0");
  kit.sign("時刻表", [6.7, 2.25, 0.29], 0.55, 0.17, "#d9ded0", "#648075");
  for (let j = 0; j < 6; j++)
    for (let k = 0; k < 3; k++)
      kit.box([6.49 + k * 0.19, 2.08 - j * 0.08, 0.29], [0.11, 0.014, 0.007], "#83948c");
  kit.box([5.13, 3.55, 2.17], [1.7, 0.045, 0.12], kit.basic("#edf0d1"));
  kit.point([5.13, 2.95, 2.17], "#d8f0df", 2.5, 4);

  const rainCount = 150;
  const rainPositions = new Float32Array(rainCount * 6);
  const drops: { x: number; z: number; phase: number }[] = [];
  for (let i = 0; i < rainCount; i++) {
    let x: number;
    let z: number;
    do {
      x = -7.2 + random() * 14.4;
      z = -7.2 + random() * 14.4;
    } while (
      (x > -6.4 && x < 1.2 && z > -6.2 && z < 2.1) ||
      (x > 3.3 && x < 6.9 && z > 0.8 && z < 3.3)
    );
    drops.push({ x, z, phase: random() * 5.7 });
  }
  const rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
  const rainMaterial = new THREE.LineBasicMaterial({
    color: "#d6e7ea",
    transparent: true,
    opacity: 0.23,
    depthWrite: false,
  });
  const rain = new THREE.LineSegments(rainGeometry, rainMaterial);
  rain.frustumCulled = false;
  root.add(rain);
  const rippleMaterial = new THREE.MeshBasicMaterial({
    color: "#d3e2df",
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const rippleGeometry = new THREE.RingGeometry(0.91, 1, 24);
  const ripples = Array.from({ length: 9 }, (_, i) => {
    const ripple = kit.mesh(rippleGeometry, rippleMaterial, [
      -6.5 + i * 1.5,
      0.31,
      4.03 + (i % 3) * 1.25,
    ]);
    ripple.rotation.x = -Math.PI / 2;
    ripple.userData.dynamic = true;
    ripple.castShadow = false;
    return ripple;
  });
  const chainDrops = Array.from({ length: 4 }, () => {
    const drop = kit.mesh(leafGeometry, rippleMaterial, [0.96, 1, 0.78]);
    drop.scale.set(0.026, 0.065, 0.026);
    drop.userData.dynamic = true;
    drop.castShadow = false;
    return drop;
  });
  return {
    update(_delta, time, reduced) {
      rain.visible = !reduced;
      chainDrops.forEach((drop, i) => {
        drop.visible = !reduced;
        drop.position.y = 0.48 + (1 - ((time * 0.7 + i * 0.25) % 1)) * 3.7;
      });
      ripples.forEach((ripple, i) => {
        const phase = (time * 0.55 + i * 0.217) % 1;
        ripple.visible = !reduced && phase < 0.83;
        ripple.scale.setScalar(0.035 + phase * 0.31);
      });
      if (reduced) return;
      drops.forEach((drop, i) => {
        const y = 0.4 + ((((drop.phase - time * 2.8) % 5.7) + 5.7) % 5.7);
        rainPositions.set([drop.x, y, drop.z, drop.x - 0.025, y + 0.2, drop.z], i * 6);
      });
      rainGeometry.attributes.position.needsUpdate = true;
    },
    dispose() {
      rainGeometry.dispose();
      rainMaterial.dispose();
    },
  };
}
