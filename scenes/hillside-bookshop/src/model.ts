import * as THREE from "three";
import { type Kit, type XYZ } from "./kit.ts";
import type { SceneAnimation } from "./types.ts";
import { scatterGroundLeaves } from "./ground-leaves.ts";

const C = {
  earth: "#715947",
  stone: "#ad9b84",
  mortar: "#796d60",
  wood: "#51372d",
  honey: "#ac764a",
  plaster: "#e6cfab",
  roof: "#a24d36",
  brass: "#b99150",
  paper: "#e8d6af",
  iron: "#443e36",
};
const BOOKS = ["#993f35", "#49666a", "#b49a52", "#697148", "#ceb084", "#614f65"];

export function buildScene(kit: Kit): SceneAnimation {
  const floor = 1.45;
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#c8e4df",
    transparent: true,
    opacity: 0.11,
    roughness: 0.16,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const box = (p: XYZ, s: XYZ, color: string, parent?: THREE.Object3D) =>
    kit.box(p, s, color, parent);
  const beam = (a: XYZ, b: XYZ, r = 0.035, color = C.iron) => kit.rod(a, b, r, color);
  const ball = (p: XYZ, r: number, color: string, scale?: XYZ) => {
    const mesh = kit.mesh(new THREE.IcosahedronGeometry(r, 1), kit.toon(color), p);
    if (scale) mesh.scale.set(...scale);
    return mesh;
  };
  const wedge = (
    x: number,
    z: number,
    width: number,
    depth: number,
    left: number,
    right: number,
  ) => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0.1);
    shape.lineTo(width / 2, 0.1);
    shape.lineTo(width / 2, right);
    shape.lineTo(-width / 2, left);
    shape.closePath();
    return kit.mesh(
      new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }),
      kit.toon(C.stone),
      [x, 0, z - depth / 2],
    );
  };
  const book = (
    x: number,
    y: number,
    z: number,
    height: number,
    width: number,
    index: number,
    parent?: THREE.Object3D,
  ) => {
    const color = BOOKS[index % BOOKS.length];
    box([x, y + height / 2, z], [width, height, 0.32], color, parent);
    box([x, y + height * 0.77, z + 0.164], [width * 0.78, 0.025, 0.008], C.paper, parent);
    box([x, y + height * 0.17, z + 0.164], [width * 0.78, 0.018, 0.008], C.brass, parent);
  };
  const shelf = (
    x: number,
    y: number,
    z: number,
    width: number,
    rows: number,
    parent?: THREE.Object3D,
  ) => {
    const height = rows * 0.56;
    box([x, y + height / 2, z - 0.2], [width, height, 0.09], C.wood, parent);
    for (const side of [-1, 1]) {
      box([x + (side * width) / 2, y + height / 2, z], [0.075, height + 0.1, 0.5], C.honey, parent);
    }
    for (let row = 0; row <= rows; row++) {
      box([x, y + row * 0.56, z], [width, 0.065, 0.5], C.honey, parent);
      if (row === rows) continue;
      const count = Math.floor(width / 0.14);
      for (let i = 0; i < count; i++) {
        const height = 0.31 + ((i * 7 + row * 3) % 9) * 0.016;
        book(
          x - width / 2 + 0.11 + i * 0.135,
          y + row * 0.56 + 0.04,
          z + 0.04,
          height,
          0.105,
          i + row * 2,
          parent,
        );
      }
    }
  };
  const stack = (x: number, y: number, z: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const g = new THREE.Group();
      g.position.set(x, y + i * 0.105, z);
      g.rotation.y = Math.sin(i * 7) * 0.12;
      kit.root.add(g);
      box([0, 0.04, 0], [0.43, 0.065, 0.31], C.paper, g);
      for (const yy of [0, 0.08]) box([0, yy, 0], [0.46, 0.018, 0.34], BOOKS[i % 6], g);
    }
  };
  const pot = (x: number, y: number, z: number, r = 0.23) => {
    kit.cylinder([x, y + r * 0.6, z], r * 0.7, r * 1.2, C.roof, undefined, 12, r);
    kit.cylinder([x, y + r * 1.2, z], r * 0.9, 0.045, C.earth);
    const ring = kit.torus([x, y + r * 1.15, z], r, 0.035, C.roof);
    ring.rotation.x = Math.PI / 2;
    for (let i = 0; i < 7; i++) {
      const a = i * 2.4;
      beam(
        [x, y + r, z],
        [x + Math.cos(a) * r, y + r * 2.8, z + Math.sin(a) * r],
        0.012,
        "#666c3c",
      );
      ball(
        [x + Math.cos(a) * r, y + r * 2.5, z + Math.sin(a) * r],
        r * 0.52,
        i % 2 ? "#667248" : "#8e8a4d",
        [0.7, 1.6, 0.8],
      );
    }
  };
  const chair = (x: number, y: number, z: number, angle: number) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = angle;
    kit.root.add(g);
    box([0, 0.5, 0], [0.64, 0.12, 0.65], "#7b704c", g);
    for (const xx of [-0.25, 0.25]) {
      for (const zz of [-0.24, 0.24])
        kit.rod([xx, 0, zz], [xx * 0.85, 0.48, zz * 0.85], 0.035, C.wood, g);
      kit.rod([xx, 0.43, -0.25], [xx, 1.1, -0.34], 0.035, C.wood, g);
    }
    for (let i = 0; i < 3; i++) box([0, 0.76 + i * 0.12, -0.3], [0.57, 0.08, 0.045], C.honey, g);
  };

  // The whole diorama sits on a square slab; the street climbs across its face.
  box([0, -0.2, 0], [15, 0.6, 15], C.earth);
  box([0, 0.7, -2.4], [13.8, 1.2, 9.3], C.mortar);
  box([0, 1.33, -2.4], [13.8, 0.09, 9.3], C.stone);
  const street = wedge(0, 5.68, 14.9, 3.55, 2.3, 0.14);
  const leafSurfaces = [street];
  for (let i = 0; i < 30; i++) {
    const x = -7.13 + i * 0.49;
    const y = 2.3 - ((x + 7.45) / 14.9) * 2.16;
    const cobble = box([x, y + 0.035, 5.68], [0.035, 0.018, 3.48], "#8e8171");
    cobble.rotation.z = -0.144;
    leafSurfaces.push(cobble);
  }
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 21; col++) {
      const x = -6.7 + col * 0.65 + (row % 2) * 0.16;
      box([x, 0.24 + row * 0.29, 2.28], [0.59, 0.245, 0.18], row % 2 ? "#9a8871" : C.stone);
    }
  }
  // Broad stair switches diagonally from the low eastern street to the high west lane.
  for (let i = 0; i < 17; i++) {
    const x = 5.95 - i * 0.58;
    const z = 3.88 - i * 0.085;
    const top = 0.4 + i * 0.155;
    box([x, (top + 0.1) / 2, z], [0.6, top - 0.1, 1.56], C.stone);
    box([x, top + 0.018, z + 0.72], [0.6, 0.035, 0.12], "#d6c3a2");
    if (i % 3 === 0) beam([x, top, z + 0.8], [x, top + 0.7, z + 0.8], 0.03);
  }
  beam([5.95, 1.1, 4.68], [-3.33, 3.58, 3.32], 0.038);
  box([-5.2, 1.43, 1.35], [3.1, 2.66, 2.75], C.mortar);
  box([-5.2, 2.81, 1.35], [3.15, 0.12, 2.8], C.stone);
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 4; col++) {
      box(
        [-6.3 + col * 0.74 + (row % 2) * 0.08, 0.35 + row * 0.36, 2.77],
        [0.67, 0.3, 0.1],
        row % 2 ? C.stone : "#93816c",
      );
    }
  }
  for (let i = 0; i < 4; i++) {
    const top = 1.42 + i * 0.345;
    box([-3.75 - i * 0.37, (top + 1.36) / 2, -0.5], [0.39, top - 1.36 + 0.06, 1.5], C.stone);
  }
  for (let x = -3; x < 6.5; x += 0.66) {
    for (let z = 1.3; z < 2.1; z += 0.42) box([x, 1.39, z], [0.62, 0.035, 0.38], "#c5b394");
  }

  // Timber frame, open storefront and a glazed upper reading gallery.
  box([0, 1.41, -1.55], [6.1, 0.16, 5.25], C.wood);
  for (let i = 0; i < 23; i++)
    box([-2.88 + i * 0.255, floor, -1.55], [0.24, 0.035, 5.02], i % 3 ? "#b0875e" : "#a47a54");
  box([0, 3.74, -4.07], [6.1, 4.65, 0.18], C.plaster);
  box([-3.02, 3.74, -1.55], [0.18, 4.65, 5.05], C.plaster);
  for (let row = 0; row < 5; row++) {
    for (let i = 0; i < 16; i++) {
      box(
        [-2.85 + i * 0.37, 1.6 + row * 0.16, 1.045],
        [0.33, 0.13, 0.12],
        row % 2 ? "#9b5940" : "#b47655",
      );
    }
  }
  for (const x of [-3, -1.05, 1.1, 3]) {
    box([x, 3.85, 1], [0.15, 4.8, 0.17], C.wood);
    box([x, 3.85, -4], [0.15, 4.8, 0.17], C.wood);
  }
  for (const y of [1.52, 3.88, 4.26, 6.13]) {
    box([0, y, 1], [6.13, 0.15, 0.2], C.wood);
    box([3, y, -1.5], [0.15, 0.15, 5.15], C.wood);
  }
  for (const z of [-4, -2.35, -0.65]) box([3, 3.83, z], [0.15, 4.8, 0.15], C.wood);
  for (const x of [-2, 0.03]) kit.box([x, 3.04, 1.005], [1.78, 1.43, 0.015], glass);
  kit.box([3.005, 2.75, -1.45], [0.015, 2.3, 4.8], glass);
  kit.box([3.005, 5.16, -1.45], [0.015, 1.68, 4.8], glass);
  for (const x of [-2, 0.03, 2]) {
    kit.box([x, 5.16, 1.005], [1.78, 1.66, 0.015], glass);
    box([x, 5.15, 1.025], [0.055, 1.7, 0.045], C.honey);
    box([x, 5.59, 1.025], [1.8, 0.04, 0.045], C.honey);
  }
  // The upper floor is set back, so the ground-floor book tables remain visible.
  box([0, 4.08, -2.05], [5.9, 0.2, 3.85], C.wood);
  for (let i = 0; i < 22; i++)
    box([-2.75 + i * 0.26, 4.19, -2.05], [0.245, 0.035, 3.78], "#b78e65");
  beam([-2.87, 6.02, 0.91], [-2.87, 4.4, -0.65], 0.045, C.honey);
  beam([2.88, 6.02, 0.91], [2.88, 4.4, -0.65], 0.045, C.honey);
  box([1.98, 2.55, 1.02], [1.3, 2.15, 0.09], C.wood);
  kit.box([1.98, 2.76, 1.08], [1.1, 1.51, 0.016], glass);
  box([1.98, 1.8, 1.09], [1.06, 0.39, 0.04], C.honey);
  beam([2.44, 2.25, 1.15], [2.44, 2.65, 1.15], 0.022, C.brass);
  for (let i = 0; i < 3; i++)
    box([1.98, 1.41 - i * 0.13, 1.25 + i * 0.28], [1.56, 0.13, 0.35], C.stone);
  kit.sign("夕凪書房", [0, 3.97, 1.13], 4.7, 0.44, C.wood, "#f3d39b", undefined, 82);
  kit.sign(
    "古本 ・ 珈琲 ・ 小さな物語",
    [-0.5, 1.87, 1.135],
    2.4,
    0.2,
    "#b77b54",
    "#f9e3b8",
    undefined,
    49,
  );
  const sideSign = kit.sign("BOOKS", [3.11, 4.01, -1.4], 2.1, 0.3, C.wood, C.paper);
  sideSign.rotation.y = Math.PI / 2;

  // Individually modeled terracotta tiles overlap on two pitched roof planes.
  const roofSlope = 0.38;
  for (const side of [-1, 1]) {
    const roof = box([0, 6.54, -1.52 + side * 1.43], [6.65, 0.15, 3.08], C.roof);
    roof.rotation.x = side * roofSlope;
    for (let row = 0; row < 8; row++) {
      const d = 0.23 + row * 0.365;
      for (let col = 0; col < 21; col++) {
        const tile = kit.mesh(
          new THREE.CylinderGeometry(0.089, 0.089, 0.42, 7, 1, true, 0, Math.PI),
          kit.toon((col + row) % 4 ? "#ae5b40" : "#c17a55"),
          [
            -3.17 + col * 0.317,
            7.16 - d * Math.sin(roofSlope),
            -1.52 + side * d * Math.cos(roofSlope),
          ],
        );
        tile.rotation.x = Math.PI / 2 + side * roofSlope;
      }
    }
  }
  beam([-3.36, 7.2, -1.52], [3.36, 7.2, -1.52], 0.13, "#a9563e");
  for (const z of [-4.36, 1.32]) {
    box([0, 6.06, z], [6.7, 0.18, 0.12], C.wood);
    beam([-3.3, 6, z], [3.3, 6, z], 0.055);
  }
  beam([3.29, 6, -4.33], [3.29, 1.43, -4.33], 0.055);
  box([-1.97, 6.91, -2.8], [0.54, 0.97, 0.57], "#9e6049");
  box([-1.97, 7.43, -2.8], [0.66, 0.1, 0.7], C.stone);

  shelf(-1.42, floor + 0.05, -3.62, 2.6, 4);
  shelf(1.37, floor + 0.05, -3.62, 2.45, 4);
  const sideShelves = new THREE.Group();
  sideShelves.position.set(-2.62, floor + 0.04, -0.82);
  sideShelves.rotation.y = Math.PI / 2;
  kit.root.add(sideShelves);
  shelf(0, 0, 0, 2.8, 4, sideShelves);
  shelf(-1.4, 4.24, -3.65, 2.6, 3);
  shelf(1.34, 4.24, -3.65, 2.5, 2);
  box([-0.55, floor + 0.83, -0.12], [2.2, 0.13, 1.08], C.honey);
  for (const x of [-1.45, 0.35])
    for (const z of [-0.5, 0.26]) box([x, floor + 0.39, z], [0.075, 0.78, 0.075], C.wood);
  for (let i = 0; i < 4; i++) stack(-1.26 + i * 0.49, floor + 0.93, -0.12 + (i % 2) * 0.2, 2 + i);
  box([1.79, floor + 0.66, -2.28], [1.7, 1.28, 0.73], C.honey);
  box([1.79, floor + 1.35, -2.28], [1.86, 0.12, 0.86], C.wood);
  box([1.97, floor + 1.52, -2.27], [0.46, 0.23, 0.36], C.iron);
  for (let i = 0; i < 8; i++)
    box(
      [1.81 + (i % 4) * 0.09, floor + 1.65, -2.18 - Math.floor(i / 4) * 0.08],
      [0.055, 0.025, 0.035],
      C.paper,
    );
  stack(1.26, floor + 1.44, -2.2, 3);
  kit.sign("文学", [-1.4, 3.85, -3.32], 0.6, 0.17, C.paper, C.wood);
  kit.sign("旅 と 暮らし", [1.4, 3.85, -3.32], 1.0, 0.17, C.paper, C.wood);

  chair(1.74, 4.23, -0.94, -0.25);
  chair(0.1, 4.23, -1.4, 0.25);
  kit.cylinder([0.95, 4.94, -1.12], 0.62, 0.09, C.honey);
  kit.cylinder([0.95, 4.6, -1.12], 0.055, 0.65, C.wood);
  kit.cylinder([0.95, 4.26, -1.12], 0.31, 0.07, C.wood);
  stack(0.88, 5, -1.1, 2);
  beam([2.51, 4.23, -2.34], [2.51, 5.49, -2.34], 0.033, C.brass);
  kit.cylinder([2.51, 4.26, -2.34], 0.21, 0.07, C.iron);
  kit.cylinder([2.51, 5.51, -2.34], 0.38, 0.36, "#e7bd70", undefined, 16, 0.18);
  kit.point([2.51, 5.34, -2.25], "#ffd399", 2.4, 3);
  for (const x of [-1.9, 1.3]) {
    beam([x, 3.87, -1.3], [x, 3.54, -1.3], 0.015);
    kit.cylinder([x, 3.5, -1.3], 0.22, 0.15, C.brass, undefined, 16, 0.06);
    kit.mesh(new THREE.SphereGeometry(0.065, 8, 6), kit.toon("#ffe7a7", 0.9), [x, 3.4, -1.3]);
  }
  kit.point([0.5, 3.2, -0.7], "#ffc57e", 6, 5);

  // Street stalls: open slatted crates, leaning magazines, and a tiny postal box.
  for (let n = 0; n < 3; n++) {
    const x = -2.45 + n * 0.84;
    const y = 1.43;
    box([x, y + 0.04, 1.77], [0.73, 0.08, 0.57], C.honey);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        box([x, y + 0.11 + i * 0.12, 1.77 + side * 0.285], [0.76, 0.075, 0.045], C.honey);
        box([x + side * 0.355, y + 0.11 + i * 0.12, 1.77], [0.045, 0.075, 0.57], C.honey);
      }
    }
    for (let j = 0; j < 5; j++) book(x - 0.27 + j * 0.13, y + 0.09, 1.79, 0.49, 0.1, j + n);
  }
  kit.sign("一冊 100円", [-1.62, 1.69, 2.075], 0.72, 0.18, C.paper, C.wood, undefined, 62);
  for (let row = 0; row < 3; row++) {
    box([3.72, 1.68 + row * 0.37, 0.95 - row * 0.14], [0.92, 0.065, 0.23], C.wood);
    for (let i = 0; i < 3; i++) {
      const mag = box(
        [3.42 + i * 0.3, 1.87 + row * 0.37, 0.93 - row * 0.14],
        [0.25, 0.36, 0.035],
        BOOKS[i + row],
      );
      mag.rotation.x = -0.18;
      box([3.42 + i * 0.3, 1.98 + row * 0.37, 0.964 - row * 0.14], [0.19, 0.028, 0.01], C.paper);
    }
  }
  for (const x of [3.24, 4.2]) beam([x, 1.42, 1.15], [x, 2.74, 0.52], 0.035, C.wood);
  kit.cylinder([5.12, 1.8, 1.17], 0.095, 0.8, "#8f3931");
  box([5.12, 2.42, 1.17], [0.58, 0.76, 0.48], "#ad4738");
  box([5.12, 2.64, 1.42], [0.36, 0.055, 0.02], C.iron);
  kit.sign("〒", [5.12, 2.39, 1.421], 0.28, 0.3, "#ad4738", C.paper, undefined, 140);
  box([5.12, 2.84, 1.17], [0.68, 0.08, 0.58], "#b65340");
  const board = box([4.57, 1.92, 2.05], [0.65, 0.95, 0.075], C.wood);
  board.rotation.x = -0.15;
  kit.sign("本日営業\n", [4.57, 2.03, 2.13], 0.53, 0.32, "#384039", C.paper, undefined, 83);
  for (const x of [4.28, 4.86]) beam([x, 1.42, 2.31], [x, 2.43, 1.96], 0.025, C.honey);
  pot(3.47, 1.41, -0.05, 0.27);
  pot(-2.84, 1.41, 0.43, 0.19);
  pot(5.8, 1.41, -1.75, 0.3);
  pot(-5.64, 2.87, 1.9, 0.25);
  for (let i = 0; i < 23; i++) {
    const y = 1.6 + i * 0.17;
    const z = -2.9 + Math.sin(i * 0.72) * 0.4;
    beam([-3.14, y, z], [-3.16, y + 0.19, z + 0.06], 0.017, "#667048");
    ball([-3.2, y, z], 0.12, i % 3 ? "#72794a" : "#a19448", [0.3, 1, 1]);
  }

  // Compact Japanese maple, built from branches and little lobed leaves.
  beam([-5.55, 1.375, -1.12], [-5.35, 5.35, -1.24], 0.13, C.wood);
  const leafShape = new THREE.Shape();
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const r = i % 2 ? 0.052 : 0.14;
    if (i === 0) leafShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else leafShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  leafShape.closePath();
  const leafGeometry = new THREE.ShapeGeometry(leafShape);
  const leafMaterials = ["#b25030", "#ce7338", "#bb913f", "#8d4934"].map((color) => {
    const material = kit.toon(color);
    material.side = THREE.DoubleSide;
    return material;
  });
  for (let branch = 0; branch < 8; branch++) {
    const a = branch * 2.4;
    const end: XYZ = [
      -5.35 + Math.cos(a) * 1.12,
      4.5 + (branch % 3) * 0.42,
      -1.24 + Math.sin(a) * 1.16,
    ];
    beam([-5.42, 3.8 + branch * 0.12, -1.2], end, 0.045, C.wood);
    const clusterLeafCount = 160;
    for (let j = 0; j < clusterLeafCount; j++) {
      const t = j * 2.399963 + branch * 0.73;
      const r = Math.sqrt(j / clusterLeafCount) * 0.72;
      const leaf = kit.mesh(leafGeometry, leafMaterials[(branch + j) % 4], [
        end[0] + Math.cos(t) * r,
        end[1] + Math.sin(j * 1.7 + branch) * 0.38,
        end[2] + Math.sin(t) * r,
      ]);
      leaf.name = "maple-canopy-leaf";
      leaf.scale.setScalar(1.05 + ((Math.sin(j * 3.71 + branch) + 1) / 2) * 0.35);
      leaf.rotation.set(
        -Math.PI / 2 + Math.sin(j * 1.7 + branch) * 0.55,
        Math.sin(j * 0.63 + branch) * 0.45,
        t,
      );
    }
  }
  scatterGroundLeaves(kit, leafGeometry, leafMaterials, {
    count: 46,
    seed: 240917,
    surfaces: leafSurfaces,
    sample(random) {
      const cluster = random();
      if (cluster < 0.62) {
        return [-5.25 + (random() + random() - 1) * 1.45, 5.48 + (random() + random() - 1) * 1.14];
      }
      if (cluster < 0.87) {
        return [-2.75 + (random() + random() - 1) * 1.2, 6.4 + (random() + random() - 1) * 0.55];
      }
      return [-6.7 + random() * 11.6, 4.95 + random() * 2.15];
    },
    accept: (_x, z) => z >= 4.9 && z <= 7.2,
  });
  const drifting = new THREE.Group();
  drifting.userData.dynamic = true;
  kit.root.add(drifting);
  const leaves = Array.from({ length: 7 }, (_, i) =>
    kit.mesh(leafGeometry, leafMaterials[i % 4], [-4.3, 4.4, 0.3], drifting),
  );
  return {
    update(_delta, time, reducedMotion) {
      const t = reducedMotion ? 0 : time;
      leaves.forEach((leaf, i) => {
        const phase = (t * 0.095 + i / leaves.length) % 1;
        leaf.position.set(
          -4.8 + phase * 1.65 + Math.sin(phase * 9 + i) * 0.24,
          4.4 - phase * 1.48,
          0.2 + phase * 1.6,
        );
        leaf.rotation.set(phase * 5 + i, phase * 8, phase * 3);
      });
    },
  };
}
