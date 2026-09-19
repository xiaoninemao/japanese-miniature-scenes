import * as THREE from "three";
import { type Kit, type XYZ } from "./kit.ts";
import type { SceneAnimation } from "./types.ts";

const C = {
  base: "#937e66",
  paving: "#c8b99d",
  wood: "#533d31",
  honey: "#b18c60",
  green: "#355a47",
  celadon: "#99ac90",
  cream: "#eee1c4",
  terra: "#b47450",
  iron: "#3f4840",
  brass: "#bc9855",
  coffee: "#513523",
};

export function buildScene(kit: Kit): SceneAnimation {
  const floor = 0.42;
  const box = (p: XYZ, s: XYZ, color: string, parent?: THREE.Object3D) =>
    kit.box(p, s, color, parent);
  const rod = (a: XYZ, b: XYZ, r = 0.025, color = C.iron, parent?: THREE.Object3D) =>
    kit.rod(a, b, r, color, parent);
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#deefe3",
    transparent: true,
    opacity: 0.14,
    roughness: 0.1,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const ceramic = kit.toon(C.cream);
  const sphereGeometry = new THREE.SphereGeometry(1, 14, 10);
  const sphere = (p: XYZ, s: XYZ, material: THREE.Material, parent?: THREE.Object3D) => {
    const mesh = kit.mesh(sphereGeometry, material, p, parent);
    mesh.scale.set(...s);
    return mesh;
  };
  const lathe = (
    points: [number, number][],
    position: XYZ,
    material: THREE.Material,
    parent?: THREE.Object3D,
  ) =>
    kit.mesh(
      new THREE.LatheGeometry(
        points.map(([x, y]) => new THREE.Vector2(x, y)),
        20,
      ),
      material,
      position,
      parent,
    );
  const cup = (x: number, y: number, z: number, parent?: THREE.Object3D) => {
    lathe(
      [
        [0, 0],
        [0.14, 0],
        [0.19, 0.028],
        [0.2, 0.048],
        [0.15, 0.055],
        [0, 0.04],
      ],
      [x, y, z],
      ceramic,
      parent,
    );
    lathe(
      [
        [0.065, 0.04],
        [0.08, 0.055],
        [0.108, 0.19],
        [0.103, 0.21],
        [0.086, 0.21],
        [0.073, 0.09],
        [0.055, 0.07],
      ],
      [x, y, z],
      ceramic,
      parent,
    );
    kit.cylinder([x, y + 0.182, z], 0.086, 0.008, C.coffee, parent, 18);
    const handle = kit.torus([x + 0.124, y + 0.139, z], 0.064, 0.016, C.cream, parent);
    handle.scale.set(0.72, 1, 1);
    rod([x - 0.11, y + 0.066, z + 0.1], [x - 0.2, y + 0.066, z + 0.16], 0.009, C.brass, parent);
    sphere([x - 0.207, y + 0.066, z + 0.165], [0.025, 0.007, 0.018], kit.toon(C.brass), parent);
  };
  const plate = (x: number, y: number, z: number, radius = 0.24) => {
    lathe(
      [
        [0, 0],
        [radius * 0.6, 0],
        [radius, 0.04],
        [radius, 0.065],
        [radius * 0.7, 0.036],
        [0, 0.03],
      ],
      [x, y, z],
      ceramic,
    );
  };
  const cake = (x: number, y: number, z: number, type: number) => {
    plate(x, y, z);
    if (type % 2 === 0) {
      const shape = new THREE.Shape();
      shape.moveTo(-0.14, -0.16);
      shape.lineTo(0.16, -0.16);
      shape.lineTo(0.09, 0.2);
      shape.closePath();
      for (let layer = 0; layer < 4; layer++) {
        const mesh = kit.mesh(
          new THREE.ExtrudeGeometry(shape, { depth: 0.055, bevelEnabled: false }),
          kit.toon(layer % 2 ? "#f0dfb9" : "#c99555"),
          [x, y + 0.07 + layer * 0.055, z],
        );
        mesh.rotation.x = -Math.PI / 2;
      }
      sphere([x + 0.035, y + 0.32, z - 0.055], [0.055, 0.07, 0.052], kit.toon("#b7523f"));
      sphere([x - 0.06, y + 0.29, z - 0.08], [0.045, 0.045, 0.045], ceramic);
    } else {
      kit.cylinder([x, y + 0.14, z], 0.145, 0.17, "#765039", undefined, 20);
      kit.cylinder([x, y + 0.237, z], 0.15, 0.035, "#493b31", undefined, 20);
      for (let i = 0; i < 5; i++)
        sphere(
          [x + Math.cos(i * 1.26) * 0.09, y + 0.28, z + Math.sin(i * 1.26) * 0.09],
          [0.034, 0.04, 0.034],
          ceramic,
        );
    }
  };
  const chair = (x: number, y: number, z: number, angle: number, outdoor = false) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = angle;
    kit.root.add(group);
    kit.cylinder([0, 0.5, 0], 0.29, 0.11, outdoor ? C.honey : C.green, group, 24);
    for (const xx of [-0.21, 0.21]) {
      for (const zz of [-0.2, 0.2])
        rod([xx * 1.2, 0, zz * 1.2], [xx, 0.46, zz], 0.027, outdoor ? C.iron : C.wood, group);
    }
    kit.tube(
      [
        [-0.27, 0.5, -0.19],
        [-0.3, 0.95, -0.23],
        [0, 1.11, -0.26],
        [0.3, 0.95, -0.23],
        [0.27, 0.5, -0.19],
      ],
      0.035,
      outdoor ? C.iron : C.wood,
      group,
    );
    if (outdoor) {
      for (const xx of [-0.15, 0, 0.15])
        rod([xx, 0.55, -0.22], [xx, 0.98, -0.25], 0.014, C.iron, group);
    } else {
      const back = sphere([0, 0.87, -0.245], [0.265, 0.18, 0.072], kit.toon(C.green), group);
      back.rotation.x = -0.12;
      for (const xx of [-0.1, 0.1])
        sphere([xx, 0.87, -0.167], [0.013, 0.013, 0.01], kit.toon(C.brass), group);
    }
  };
  const table = (x: number, y: number, z: number, r: number, marble = false) => {
    kit.cylinder([x, y + 0.81, z], r, 0.09, marble ? C.cream : C.honey, undefined, 32);
    kit.cylinder([x, y + 0.4, z], 0.065, 0.8, C.iron);
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3;
      rod(
        [x, y + 0.2, z],
        [x + Math.cos(a) * r * 0.72, y + 0.035, z + Math.sin(a) * r * 0.72],
        0.045,
      );
    }
    if (marble) {
      kit.tube(
        [
          [x - r * 0.55, y + 0.859, z - r * 0.4],
          [x - r * 0.1, y + 0.859, z],
          [x + r * 0.52, y + 0.859, z + r * 0.35],
        ],
        0.006,
        "#c4b8a0",
      );
    }
  };
  const pot = (x: number, y: number, z: number, radius: number, color = C.terra) => {
    lathe(
      [
        [0, 0],
        [radius * 0.7, 0],
        [radius, radius * 1.35],
        [radius * 1.04, radius * 1.42],
        [radius * 0.93, radius * 1.45],
        [radius * 0.89, radius * 1.3],
      ],
      [x, y, z],
      kit.toon(color),
    );
    kit.cylinder([x, y + radius * 1.3, z], radius * 0.87, 0.02, "#63533b");
  };
  const plant = (x: number, y: number, z: number, r: number) => {
    pot(x, y, z, r);
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4;
      const height = r * (2 + (i % 3) * 0.5);
      rod([x, y + r, z], [x + Math.cos(a) * r, y + height, z + Math.sin(a) * r], 0.012, C.green);
      const leaf = sphere(
        [x + Math.cos(a) * r, y + height, z + Math.sin(a) * r],
        [r * 0.3, r * 0.64, r * 0.13],
        kit.toon(i % 2 ? "#638158" : "#84966a"),
      );
      leaf.rotation.set(Math.sin(a) * 0.9, a, Math.cos(a) * 0.9);
    }
  };

  box([0, -0.2, 0], [15, 0.6, 15], C.base);
  box([0, 0.12, 0], [14.94, 0.04, 14.94], C.paving);
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 19; col++) {
      const x = -7.04 + col * 0.765;
      const z = -7.04 + row * 0.724;
      box([x, 0.16, z], [0.728, 0.04, 0.681], (row + col * 3) % 7 ? "#c6b79b" : "#b9aa8d");
    }
  }
  box([0, 0.25, -1.73], [7.9, 0.28, 6.43], C.terra);
  box([0, 0.4, -1.73], [7.74, 0.04, 6.28], C.wood);
  for (let i = 0; i < 30; i++)
    box([-3.65 + i * 0.25, floor, -1.75], [0.235, 0.035, 6.13], i % 3 ? "#a48158" : "#b9966d");
  box([0, 1.89, -4.85], [7.8, 3, 0.17], C.cream);
  box([-3.82, 1.9, -1.73], [0.17, 3, 6.3], C.cream);
  box([0, 0.74, 1.37], [7.75, 0.58, 0.15], C.green);
  box([3.82, 0.74, -1.73], [0.15, 0.58, 6.3], C.green);
  for (const x of [-3.8, -1.3, 1.45, 3.8]) {
    box([x, 1.95, 1.37], [0.14, 3.04, 0.17], C.wood);
    box([x, 1.95, -4.83], [0.14, 3.04, 0.17], C.wood);
  }
  for (const y of [1.03, 2.9, 3.35]) {
    box([0, y, 1.37], [7.75, 0.1, 0.17], C.wood);
    box([3.82, y, -1.7], [0.17, 0.1, 6.3], C.wood);
  }
  for (const z of [-4.83, -2.85, -0.7]) box([3.82, 1.94, z], [0.15, 3, 0.13], C.wood);
  kit.box([3.83, 2, -1.7], [0.012, 1.77, 6.06], glass);
  // A shallow bay window projects toward the patio, with a broad timber sill.
  box([-0.1, 1.03, 1.68], [2.78, 0.16, 0.74], C.honey);
  for (const x of [-1.4, 1.2]) {
    box([x, 1.99, 1.81], [0.08, 1.86, 0.1], C.wood);
    kit.box([x, 1.98, 1.61], [0.013, 1.75, 0.42], glass);
  }
  kit.box([-0.1, 1.98, 1.85], [2.54, 1.75, 0.012], glass);
  box([-0.1, 2.9, 1.69], [2.79, 0.12, 0.69], C.wood);
  for (const x of [-0.53, 0.34]) box([x, 2, 1.865], [0.045, 1.75, 0.035], C.wood);
  kit.box([-2.6, 1.98, 1.38], [2.25, 1.75, 0.012], glass);
  box([2.49, 1.55, 1.4], [1.5, 2.26, 0.075], C.wood);
  kit.box([2.49, 1.88, 1.45], [1.22, 1.36, 0.012], glass);
  for (const y of [0.81, 1.07]) box([2.49, y, 1.46], [1.21, 0.17, 0.04], C.green);
  rod([3, 1.3, 1.54], [3, 1.64, 1.54], 0.022, C.brass);
  box([2.5, 0.27, 1.78], [1.8, 0.23, 0.77], C.terra);
  box([2.5, 0.195, 2.21], [2, 0.08, 0.3], "#d3bb90");
  kit.sign("喫茶こもれび", [0, 3.15, 1.48], 4.7, 0.34, C.wood, "#eddbb0", undefined, 74);
  kit.sign("COFFEE  &  HOMEMADE CAKE", [0, 0.74, 1.46], 3.3, 0.15, C.green, C.cream, undefined, 40);

  // A low rear ridge keeps the glazed facade and its interior in view.
  const slope = 0.235;
  for (const side of [-1, 1]) {
    const roof = box([0, 3.89, -1.8 + side * 1.65], [8.38, 0.12, 3.46], C.terra);
    roof.rotation.x = side * slope;
    for (let row = 0; row < 9; row++) {
      const d = 0.2 + row * 0.37;
      for (let col = 0; col < 26; col++) {
        const tile = box(
          [-4.02 + col * 0.32, 4.33 - d * Math.sin(slope), -1.8 + side * d * Math.cos(slope)],
          [0.29, 0.046, 0.4],
          (col + row) % 4 ? "#a96848" : "#bd8158",
        );
        tile.rotation.x = side * slope;
      }
    }
  }
  rod([-4.21, 4.36, -1.8], [4.21, 4.36, -1.8], 0.095, "#b17650");
  for (const z of [-5.18, 1.58]) box([0, 3.46, z], [8.43, 0.13, 0.12], C.wood);
  for (const x of [-4.13, 4.13]) rod([x, 3.4, -5.13], [x, 3.4, 1.54], 0.055, C.wood);
  rod([4.12, 3.4, -4.85], [4.12, 0.2, -4.85], 0.055, C.iron);
  // Canvas awnings have scalloped hems and thin brass supports.
  for (const [x, width] of [
    [-2.56, 2.25],
    [-0.1, 2.77],
    [2.55, 1.88],
  ]) {
    const awning = box([x, 2.94, 1.99], [width, 0.055, 1.09], C.green);
    awning.rotation.x = 0.19;
    for (let i = 0; i < Math.floor(width / 0.2); i++) {
      const hem = kit.cylinder(
        [x - width / 2 + 0.11 + i * 0.2, 2.79, 2.52],
        0.1,
        0.035,
        C.green,
        undefined,
        12,
      );
      hem.rotation.x = Math.PI / 2;
      hem.scale.z = 1.25;
    }
    for (const side of [-1, 1])
      rod(
        [x + side * width * 0.45, 2.35, 1.43],
        [x + side * width * 0.45, 2.82, 2.47],
        0.018,
        C.brass,
      );
  }
  const sideAwning = box([4.16, 2.96, -1.53], [0.84, 0.055, 4.62], C.green);
  sideAwning.rotation.z = -0.2;
  box([4.55, 2.8, -1.53], [0.045, 0.19, 4.62], C.green);

  // Leather banquette, cafe tables, and modeled cups on the visible window side.
  box([-2.99, floor + 0.4, -1.24], [1.05, 0.54, 3.73], C.wood);
  box([-2.98, floor + 0.7, -1.24], [1.06, 0.18, 3.77], C.green);
  box([-3.48, floor + 1.02, -1.24], [0.16, 0.81, 3.77], C.green);
  for (let i = 0; i < 9; i++) {
    box([-2.99, floor + 0.8, -2.99 + i * 0.43], [0.94, 0.012, 0.017], "#617661");
    sphere([-3.383, floor + 1.06, -2.99 + i * 0.43], [0.011, 0.028, 0.028], kit.toon(C.brass));
  }
  for (const z of [-2.1, -0.2]) {
    table(-1.7, floor, z, 0.57, true);
    chair(-0.75, floor, z, -Math.PI / 2);
    cup(-1.9, floor + 0.86, z - 0.08);
    cup(-1.47, floor + 0.86, z + 0.14);
    cake(-1.66, floor + 0.86, z + 0.28, 0);
  }
  table(2.6, floor, -0.45, 0.54, true);
  chair(2.45, floor, -1.25, 0.1);
  chair(1.8, floor, -0.15, -1.25);
  cup(2.58, floor + 0.86, -0.48);
  cake(2.85, floor + 0.86, -0.22, 1);
  // Counter panels, pastry vitrine, brass rails, and siphon coffee apparatus.
  box([0.65, floor + 0.58, -3.38], [4.97, 1.1, 0.92], C.wood);
  for (let i = 0; i < 23; i++)
    box([-1.68 + i * 0.21, floor + 0.55, -2.902], [0.11, 0.92, 0.028], C.honey);
  box([0.65, floor + 1.18, -3.37], [5.18, 0.13, 1.1], "#dac6a2");
  rod([-1.64, floor + 0.21, -2.72], [2.9, floor + 0.21, -2.72], 0.035, C.brass);
  for (const x of [-1.5, 2.7])
    rod([x, floor + 0.21, -2.72], [x, floor + 0.21, -2.91], 0.022, C.brass);
  const counterY = floor + 1.25;
  box([-0.79, counterY + 0.045, -3.37], [1.85, 0.09, 0.86], C.brass);
  kit.box([-0.79, counterY + 0.48, -2.98], [1.83, 0.87, 0.012], glass);
  kit.box([-0.79, counterY + 0.91, -3.37], [1.85, 0.012, 0.86], glass);
  for (const x of [-1.72, 0.14]) {
    kit.box([x, counterY + 0.48, -3.37], [0.012, 0.87, 0.86], glass);
    rod([x, counterY, -2.98], [x, counterY + 0.93, -2.98], 0.017, C.brass);
  }
  box([-0.79, counterY + 0.48, -3.37], [1.78, 0.025, 0.8], "#bbc5ab");
  for (let i = 0; i < 3; i++) {
    cake(-1.39 + i * 0.59, counterY + 0.09, -3.35, i);
    cake(-1.39 + i * 0.59, counterY + 0.5, -3.35, i + 1);
  }
  kit.sign(
    "本日のケーキ",
    [-0.8, counterY + 0.19, -2.955],
    0.93,
    0.14,
    C.cream,
    C.wood,
    undefined,
    71,
  );
  for (let i = 0; i < 3; i++) {
    const x = 0.68 + i * 0.63;
    kit.cylinder([x, counterY + 0.035, -3.32], 0.22, 0.07, C.wood);
    rod([x + 0.18, counterY + 0.05, -3.32], [x + 0.18, counterY + 0.96, -3.32], 0.022, C.brass);
    rod([x + 0.18, counterY + 0.55, -3.32], [x, counterY + 0.55, -3.32], 0.022, C.brass);
    sphere([x, counterY + 0.42, -3.32], [0.18, 0.21, 0.18], glass);
    sphere([x, counterY + 0.34, -3.32], [0.15, 0.095, 0.15], kit.toon(C.coffee));
    kit.cylinder([x, counterY + 0.72, -3.32], 0.022, 0.29, glass);
    lathe(
      [
        [0.035, 0],
        [0.14, 0.08],
        [0.15, 0.3],
        [0.16, 0.32],
        [0.145, 0.32],
        [0.13, 0.09],
        [0.025, 0.02],
      ],
      [x, counterY + 0.73, -3.32],
      glass,
    );
    kit.cylinder([x, counterY + 0.13, -3.32], 0.065, 0.1, C.brass);
    sphere([x, counterY + 0.21, -3.32], [0.027, 0.045, 0.027], kit.toon("#e8bb69", 0.4));
  }
  cup(2.62, counterY, -3.18);
  // Back bar has patterned jars, stacked crockery and hand-lettered menu boards.
  for (const y of [1.38, 2.14, 2.91]) {
    box([0.59, y, -4.57], [5.84, 0.07, 0.44], C.honey);
    for (let i = 0; i < 10; i++) {
      const x = -2.06 + i * 0.54;
      if (i < 5) {
        kit.cylinder([x, y + 0.22, -4.54], 0.12, 0.34, i % 2 ? "#ac8c54" : "#786547");
        kit.cylinder([x, y + 0.408, -4.54], 0.128, 0.038, C.wood);
        box([x, y + 0.22, -4.411], [0.13, 0.12, 0.008], C.cream);
      } else {
        for (let n = 0; n < 3; n++)
          kit.cylinder([x, y + 0.08 + n * 0.047, -4.54], 0.16, 0.034, C.cream);
      }
    }
  }
  box([-2.85, 2.43, -4.68], [1.12, 1.08, 0.07], C.wood);
  kit.sign("珈琲  450\n", [-2.85, 2.66, -4.63], 0.97, 0.22, C.green, C.cream, undefined, 87);
  kit.sign("ケーキ  380", [-2.85, 2.35, -4.63], 0.97, 0.22, C.green, C.cream, undefined, 77);
  for (const x of [-1.6, 1.65]) {
    rod([x, 3.42, -1.55], [x, 2.81, -1.55], 0.012, C.wood);
    kit.cylinder([x, 2.77, -1.55], 0.27, 0.17, C.celadon, undefined, 24, 0.09);
    sphere([x, 2.67, -1.55], [0.09, 0.035, 0.09], kit.toon("#ffe6ac", 0.4));
  }
  kit.point([0, 2.85, -1.5], "#ffe0a4", 4.5, 5);

  // Listening corner: turntable, visible grooves, tonearm, and paper record sleeves.
  box([3.16, floor + 0.41, -2.18], [0.87, 0.8, 0.97], C.wood);
  box([3.16, floor + 0.86, -2.18], [0.85, 0.1, 0.8], C.honey);
  kit.cylinder([3.14, floor + 0.923, -2.18], 0.3, 0.018, "#2d3430", undefined, 32);
  for (const radius of [0.17, 0.22, 0.26]) {
    const ring = kit.torus([3.14, floor + 0.936, -2.18], radius, 0.003, "#6b6b56");
    ring.rotation.x = Math.PI / 2;
  }
  kit.cylinder([3.14, floor + 0.94, -2.18], 0.085, 0.015, "#b28a51");
  rod([3.48, floor + 0.97, -2.43], [3.49, floor + 0.98, -2.18], 0.013, C.brass);
  rod([3.49, floor + 0.98, -2.18], [3.31, floor + 0.96, -2.02], 0.013, C.brass);
  box([3.29, floor + 0.96, -2.01], [0.07, 0.035, 0.035], C.cream);
  for (let i = 0; i < 9; i++)
    box(
      [2.84 + i * 0.068, floor + 0.41, -1.89],
      [0.048, 0.52, 0.38],
      [C.celadon, C.terra, C.cream][i % 3],
    );
  box([3.12, floor + 1.2, -2.7], [0.57, 0.48, 0.29], C.wood);
  const speaker = kit.cylinder([3.12, floor + 1.22, -2.545], 0.17, 0.025, "#34392e");
  speaker.rotation.x = Math.PI / 2;
  for (let i = 0; i < 4; i++) {
    const mag = box(
      [-0.75 + i * 0.42, 1.16, 1.58],
      [0.35, 0.04, 0.46],
      [C.terra, C.celadon, C.cream, C.honey][i],
    );
    mag.rotation.y = i * 0.12 - 0.2;
    box([-0.75 + i * 0.42, 1.185, 1.53], [0.23, 0.01, 0.1], C.wood);
  }

  // Patio tables occupy the open south-east corner instead of a duplicate storefront.
  for (const [x, z] of [
    [0.7, 4.45],
    [4.94, 3.51],
  ]) {
    table(x, 0.19, z, 0.69);
    chair(x - 0.93, 0.19, z - 0.3, -1.25, true);
    chair(x + 0.87, 0.19, z + 0.22, 1.72, true);
    cup(x - 0.24, 1.05, z - 0.12);
    cup(x + 0.23, 1.05, z + 0.13);
    cake(x, 1.05, z + 0.28, 0);
    kit.cylinder([x + 0.1, 1.14, z - 0.31], 0.061, 0.17, C.celadon);
    rod([x + 0.1, 1.19, z - 0.31], [x + 0.1, 1.39, z - 0.31], 0.008, C.green);
    sphere([x + 0.1, 1.4, z - 0.31], [0.06, 0.045, 0.06], kit.toon("#d8bd80"));
  }
  for (let i = 0; i < 12; i++) {
    box([6.61, 0.34, -4.8 + i * 0.48], [0.75, 0.35, 0.46], i % 2 ? "#a76d4e" : "#b77d59");
    if (i % 2 === 0) plant(6.58, 0.52, -4.8 + i * 0.48, 0.17);
  }
  plant(4.57, 0.19, 1.5, 0.36);
  plant(-4.63, 0.19, 1.78, 0.37);
  plant(-5.21, 0.19, 1.42, 0.24);
  plant(3.33, 0.19, 2.26, 0.23);
  plant(-2.49, 0.19, 2.56, 0.25);
  pot(5.21, 0.18, 5.94, 0.49, C.celadon);
  rod([5.21, 0.8, 5.94], [5.28, 3.68, 5.91], 0.08, C.wood);
  for (let branch = 0; branch < 7; branch++) {
    const a = branch * 2.4;
    const end: XYZ = [
      5.23 + Math.cos(a) * 0.88,
      2.75 + (branch % 3) * 0.38,
      5.91 + Math.sin(a) * 0.73,
    ];
    rod([5.23, 2 + branch * 0.15, 5.94], end, 0.024, C.wood);
    for (let j = 0; j < 16; j++) {
      const t = j * 2.4;
      const r = Math.sqrt(j / 16) * 0.49;
      const leaf = sphere(
        [end[0] + Math.cos(t) * r, end[1] + Math.sin(j) * 0.27, end[2] + Math.sin(t) * r],
        [0.12, 0.045, 0.23],
        kit.toon(j % 3 ? "#789064" : "#9aa36c"),
      );
      leaf.rotation.set(j * 0.3, t, j * 0.5);
    }
  }

  // Step-through bicycle with wire spokes, chainwheel, saddle and a wicker basket.
  const bike = new THREE.Group();
  bike.position.set(-5.15, 0.21, 3.47);
  bike.rotation.y = -0.23;
  kit.root.add(bike);
  for (const x of [-0.83, 0.83]) {
    kit.torus([x, 0.5, 0], 0.45, 0.035, "#424139", bike);
    kit.torus([x, 0.5, 0], 0.4, 0.016, "#b2b39c", bike);
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      rod([x, 0.5, 0], [x + Math.cos(a) * 0.4, 0.5 + Math.sin(a) * 0.4, 0], 0.006, "#acae9b", bike);
    }
  }
  for (const [a, b] of [
    [
      [-0.83, 0.5, 0],
      [-0.24, 0.47, 0],
    ],
    [
      [-0.83, 0.5, 0],
      [-0.4, 1.08, 0],
    ],
    [
      [-0.4, 1.08, 0],
      [-0.24, 0.47, 0],
    ],
    [
      [-0.24, 0.47, 0],
      [0.5, 0.96, 0],
    ],
    [
      [-0.4, 0.97, 0],
      [0.04, 0.62, 0],
    ],
    [
      [0.04, 0.62, 0],
      [0.56, 1.12, 0],
    ],
    [
      [0.83, 0.5, 0],
      [0.48, 1.17, 0],
    ],
  ] as [XYZ, XYZ][])
    rod(a, b, 0.028, C.celadon, bike);
  rod([-0.4, 1.08, 0], [-0.43, 1.23, 0], 0.024, C.iron, bike);
  sphere([-0.45, 1.24, 0], [0.18, 0.05, 0.12], kit.toon(C.wood), bike);
  kit.torus([-0.24, 0.47, 0.055], 0.13, 0.018, C.iron, bike);
  rod([-0.24, 0.47, 0.08], [-0.04, 0.39, 0.08], 0.018, C.iron, bike);
  box([-0.04, 0.39, 0.12], [0.13, 0.04, 0.13], C.wood, bike);
  kit.tube(
    [
      [0.48, 1.13, 0],
      [0.49, 1.34, 0],
      [0.42, 1.37, 0.25],
      [0.31, 1.35, 0.28],
    ],
    0.023,
    "#b5b79d",
    bike,
  );
  box([0.91, 1.06, 0], [0.48, 0.05, 0.4], C.honey, bike);
  for (let i = 0; i < 5; i++)
    for (const s of [-1, 1]) {
      box([0.91, 1.1 + i * 0.06, s * 0.2], [0.49, 0.024, 0.025], C.honey, bike);
      box([0.91 + s * 0.23, 1.1 + i * 0.06, 0], [0.024, 0.024, 0.4], C.honey, bike);
    }
  rod([-0.3, 0.51, 0], [-0.45, 0.02, 0.25], 0.018, C.iron, bike);

  box([-1.85, 0.81, 3], [0.81, 1.19, 0.08], C.wood);
  kit.sign("喫茶", [-1.85, 1.04, 3.052], 0.68, 0.29, C.green, C.cream, undefined, 120);
  kit.sign("珈琲とケーキ", [-1.85, 0.69, 3.052], 0.68, 0.2, C.green, C.cream, undefined, 73);
  for (const x of [-2.22, -1.48]) rod([x, 0.19, 3.35], [x, 1.4, 2.94], 0.025, C.wood);
  rod([3.66, 3.35, 1.4], [3.66, 3.35, 2.56], 0.035, C.iron);
  const sign = new THREE.Group();
  sign.userData.dynamic = true;
  sign.position.set(3.66, 3.35, 2.5);
  kit.root.add(sign);
  for (const x of [-0.2, 0.2]) rod([x, 0, 0], [x, -0.23, 0], 0.012, C.brass, sign);
  const disk = kit.cylinder([0, -0.58, 0], 0.43, 0.07, C.cream, sign, 32);
  disk.rotation.x = Math.PI / 2;
  kit.torus([0, -0.58, 0.044], 0.395, 0.018, C.brass, sign);
  kit.sign("珈琲", [0, -0.57, 0.048], 0.58, 0.3, C.cream, C.green, sign, 170);

  const steam = new THREE.Group();
  steam.userData.dynamic = true;
  kit.root.add(steam);
  const steamMaterial = new THREE.MeshBasicMaterial({
    color: "#fff2d7",
    transparent: true,
    opacity: 0.13,
    depthWrite: false,
  });
  const wisps = Array.from({ length: 5 }, (_, i) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.018, 0.13, 0.01),
      new THREE.Vector3(-0.021, 0.27, 0),
      new THREE.Vector3(0.024, 0.38, 0.02),
    ]);
    return kit.mesh(
      new THREE.TubeGeometry(curve, 12, 0.009, 4, false),
      steamMaterial,
      [0.46, 1.25 + i * 0.018, 4.33],
      steam,
    );
  });
  return {
    update(_delta, time, reducedMotion) {
      const t = reducedMotion ? 0 : time;
      sign.rotation.z = Math.sin(t * 0.73) * 0.035;
      wisps.forEach((wisp, i) => {
        const phase = (t * 0.23 + i / 5) % 1;
        wisp.position.set(0.46 + Math.sin(phase * 6 + i) * 0.025, 1.26 + phase * 0.2, 4.33);
        wisp.scale.set(0.6 + phase * 0.65, 0.45 + phase * 0.65, 1);
        wisp.rotation.y = i + t * 0.1;
      });
    },
  };
}
