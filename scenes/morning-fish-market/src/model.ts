import * as THREE from "three";
import type { Kit, XYZ } from "./kit.ts";
import type { SceneAnimation } from "./types.ts";

export function buildScene(kit: Kit): SceneAnimation {
  const c = {
    white: "#e8e6d5",
    foam: "#f3eee0",
    gray: "#98a9aa",
    blue: "#647e8b",
    dark: "#354d59",
    roof: "#a26153",
    rust: "#bc7964",
    wood: "#9c8c74",
    lightWood: "#b8a78a",
    rope: "#c6b791",
    steel: "#aebebc",
    water: "#527f98",
    ice: "#c7e0df",
  };
  const box = (p: XYZ, s: XYZ, color: string, parent: THREE.Object3D = kit.root, outline = false) =>
    kit.box(p, s, color, parent, outline);
  const sphere = new THREE.SphereGeometry(1, 10, 8);
  const oval = (p: XYZ, s: XYZ, color: string, parent: THREE.Object3D = kit.root) => {
    const mesh = kit.mesh(sphere, kit.toon(color), p, parent);
    mesh.scale.set(...s);
    return mesh;
  };
  const fishTail = new THREE.BufferGeometry();
  fishTail.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        0, 0, 0, -0.18, 0.018, -0.115, -0.18, 0.018, 0.115, 0, 0.045, 0, -0.18, 0.018, 0.115, -0.18,
        0.018, -0.115, 0, 0, 0, -0.18, 0.018, 0.115, 0, 0.045, 0, 0, 0, 0, 0, 0.045, 0, -0.18,
        0.018, -0.115,
      ],
      3,
    ),
  );
  fishTail.computeVertexNormals();
  const fish = (x: number, y: number, z: number, index: number) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = index % 2 ? 0.17 : -0.13;
    kit.root.add(group);
    oval([0, 0, 0], [0.29, 0.07, 0.104], index % 3 ? "#a9c4c7" : "#bca9a6", group);
    oval([0.025, 0.044, 0], [0.25, 0.037, 0.051], c.blue, group);
    kit.mesh(fishTail, kit.toon(c.blue), [-0.245, 0, 0], group);
    oval([0.205, 0.036, 0.065], [0.028, 0.022, 0.019], c.foam, group);
    oval([0.21, 0.048, 0.071], [0.013, 0.012, 0.012], c.dark, group);
    kit.rod([0.135, 0.065, -0.052], [0.135, 0.065, 0.052], 0.01, c.gray, group);
  };
  const iceGeometry = new THREE.OctahedronGeometry(0.08);
  const crate = (x: number, y: number, z: number, seafood = true) => {
    box([x, y, z], [1.26, 0.08, 0.89], c.foam);
    for (const dx of [-0.61, 0.61]) {
      box([x + dx, y + 0.17, z], [0.075, 0.3, 0.91], c.foam);
      box([x + dx, y + 0.21, z + 0.455], [0.065, 0.06, 0.012], c.gray);
    }
    for (const dz of [-0.42, 0.42]) {
      box([x, y + 0.17, z + dz], [1.17, 0.3, 0.075], c.foam);
      box([x, y + 0.32, z + dz], [1.3, 0.055, 0.085], c.white);
    }
    if (!seafood) return;
    box([x, y + 0.11, z], [1.1, 0.1, 0.72], c.ice);
    for (let i = 0; i < 17; i++) {
      const chip = kit.mesh(iceGeometry, kit.toon(i % 2 ? c.ice : c.foam), [
        x - 0.46 + ((i * 7) % 11) * 0.089,
        y + 0.18 + (i % 3) * 0.02,
        z - 0.3 + ((i * 3) % 7) * 0.1,
      ]);
      chip.rotation.set(i * 0.72, i * 0.38, 0.3);
      chip.scale.set(1, 0.58, 0.85);
    }
    fish(x - 0.18, y + 0.24, z - 0.18, 0);
    fish(x + 0.15, y + 0.25, z + 0.17, 1);
  };
  const woodCrate = (x: number, y: number, z: number) => {
    box([x, y + 0.04, z], [0.83, 0.08, 0.72], c.wood);
    for (const dx of [-0.38, 0.38]) {
      for (const dz of [-0.31, 0.31])
        box([x + dx, y + 0.36, z + dz], [0.075, 0.65, 0.075], c.lightWood);
    }
    for (let j = 0; j < 3; j++) {
      for (const dz of [-0.34, 0.34])
        box([x, y + 0.15 + j * 0.22, z + dz], [0.85, 0.14, 0.045], c.wood);
      for (const dx of [-0.405, 0.405])
        box([x + dx, y + 0.15 + j * 0.22, z], [0.045, 0.14, 0.67], c.wood);
    }
  };
  const bucket = (x: number, y: number, z: number, color = c.blue) => {
    kit.cylinder([x, y + 0.23, z], 0.21, 0.45, color, undefined, 12, 0.27);
    kit.cylinder([x, y + 0.46, z], 0.238, 0.012, c.dark, undefined, 12);
    const rim = kit.torus([x, y + 0.47, z], 0.262, 0.025, c.steel);
    rim.rotation.x = Math.PI / 2;
    kit.tube(
      [
        [x - 0.26, y + 0.36, z],
        [x - 0.24, y + 0.66, z],
        [x, y + 0.78, z],
        [x + 0.24, y + 0.66, z],
        [x + 0.26, y + 0.36, z],
      ],
      0.015,
      c.steel,
    );
  };

  box([0, -0.2, 0], [15, 0.6, 15], "#718a96", kit.root, true);
  box([0, 0.13, 0], [14.88, 0.07, 14.88], c.water);
  box([3.67, 0.172, -2.84], [7.46, 0.02, 9.08], "#608e9f");
  box([-2.72, 0.34, -2.19], [9.5, 0.42, 10.5], "#9da6a1");
  box([-2.72, 0.58, -2.19], [9.48, 0.08, 10.5], "#b7b9ab");
  box([2.04, 0.39, -2.2], [0.24, 0.59, 10.5], "#8b9b98");
  box([2.04, 0.72, -2.2], [0.37, 0.1, 10.54], c.white);
  box([-2.72, 0.39, 3.07], [9.55, 0.59, 0.24], "#8b9b98");
  box([-2.72, 0.72, 3.07], [9.55, 0.1, 0.37], c.white);
  for (let x = -7.1; x < 2; x += 0.65) {
    box([x, 0.32, 3.199], [0.018, 0.23, 0.015], "#6c8689");
    box([x + 0.22, 0.5, 3.199], [0.018, 0.12, 0.015], "#6c8689");
  }
  for (let z = -7; z < 2.8; z += 0.65) {
    box([2.169, 0.3, z], [0.015, 0.24, 0.018], "#6c8689");
  }
  for (let i = 0; i < 14; i++) {
    const x = -6.8 + (i % 7) * 1.23;
    const z = -6.8 + Math.floor(i / 7) * 8.6;
    box([x, 0.628, z], [0.64, 0.014, 0.018], "#9aa59f");
  }
  box([-3.32, 0.76, -2.38], [6.77, 0.28, 5.95], "#909e9a");
  box([-3.32, 0.927, -2.38], [6.79, 0.055, 5.96], "#c9c7b7");
  const roofAngle = 0.12;
  const roofThickness = 0.13;
  const roofCenter: XYZ = [-3.33, 3.99, -2.42];
  const wallBottom = 0.95;
  const roofUndersideAt = (z: number) =>
    roofCenter[1] -
    Math.tan(roofAngle) * (z - roofCenter[2]) -
    roofThickness / (2 * Math.cos(roofAngle));
  const rearWallTop = roofUndersideAt(-5.38) + 0.012;
  const rearWall = box(
    [-3.32, (wallBottom + rearWallTop) / 2, -5.3],
    [6.77, rearWallTop - wallBottom, 0.16],
    c.white,
  );
  rearWall.name = "fish-market-rear-wall";
  // The high rear eave needs a trapezoidal side wall, not another level-topped box.
  const sideProfile = new THREE.Shape();
  sideProfile.moveTo(-0.565, wallBottom);
  sideProfile.lineTo(5.365, wallBottom);
  sideProfile.lineTo(5.365, roofUndersideAt(-5.365) + 0.012);
  sideProfile.lineTo(-0.565, roofUndersideAt(0.565) + 0.012);
  sideProfile.closePath();
  const sideWall = kit.mesh(
    new THREE.ExtrudeGeometry(sideProfile, { depth: 0.16, bevelEnabled: false }),
    kit.toon(c.white),
    [-6.71, 0, 0],
  );
  sideWall.rotation.y = Math.PI / 2;
  sideWall.name = "fish-market-side-wall";
  box([-0.02, 1.47, -3.53], [0.15, 1.04, 3.66], c.white);
  for (let i = 0; i < 22; i++) {
    const top = roofUndersideAt(-5.196) - 0.08;
    box([-6.48 + i * 0.3, (1.015 + top) / 2, -5.196], [0.026, top - 1.015, 0.022], "#c0c3b7");
  }
  for (let z = -5.14; z < 0.31; z += 0.3) {
    const top = roofUndersideAt(z) - 0.08;
    box([-6.723, (0.995 + top) / 2, z], [0.02, top - 0.995, 0.024], "#b3bcb3");
  }
  box([-3.32, 1.2, -5.185], [6.54, 0.49, 0.045], c.blue);
  box([-6.527, 1.2, -2.42], [0.044, 0.49, 5.56], c.blue);
  for (const x of [-6.58, -3.35, -0.07]) {
    for (const z of [0.39, -5.2]) {
      const top = roofUndersideAt(z) + 0.015;
      const post = box([x, (wallBottom + top) / 2, z], [0.17, top - wallBottom, 0.17], c.dark);
      post.name = "fish-market-roof-post";
    }
    kit.rod([x, 2.97, 0.4], [x + (x > -1 ? -0.43 : 0.43), 3.48, 0.4], 0.055, c.wood);
  }
  box([-3.34, 3.6, 0.45], [7.25, 0.2, 0.18], c.white);
  box([-3.34, roofUndersideAt(-5.33) - 0.085, -5.33], [7.25, 0.2, 0.18], c.wood);
  for (const x of [-6.58, -0.07]) {
    kit.rod(
      [x, roofUndersideAt(0.39) - 0.055, 0.39],
      [x, roofUndersideAt(-5.2) - 0.055, -5.2],
      0.075,
      c.dark,
    );
  }
  const roof = box(roofCenter, [7.34, roofThickness, 6.36], c.roof);
  roof.name = "fish-market-roof";
  roof.rotation.x = roofAngle;
  for (let i = 0; i < 40; i++) {
    const rib = box(
      [-6.87 + i * 0.181, 4.079, -2.42],
      [0.045, 0.035, 6.38],
      i % 7 ? c.rust : c.roof,
    );
    rib.rotation.x = roofAngle;
  }
  for (let i = 0; i < 7; i++) {
    const x = -6.6 + i;
    kit.rod([x, 3.53, 0.73], [x, 4.28, -5.55], 0.048, c.dark);
  }
  box([-3.33, 3.69, 0.76], [7.42, 0.2, 0.09], c.rust);
  box([-3.37, 3.2, 0.576], [3.1, 0.69, 0.13], c.dark, kit.root, true);
  kit.sign("朝凪鮮魚", [-3.37, 3.23, 0.65], 2.87, 0.39, c.white, c.dark, undefined, 122);
  kit.sign(
    "ASANAGI • FISH MARKET",
    [-3.37, 2.99, 0.65],
    2.62,
    0.105,
    c.white,
    c.roof,
    undefined,
    58,
  );
  box([-6.8, 2.12, 0.62], [0.08, 2.81, 0.08], c.gray);
  kit.tube(
    [
      [-6.8, 3.7, 0.78],
      [-6.8, 3.5, 0.64],
      [-6.8, 3.2, 0.62],
    ],
    0.06,
    c.gray,
  );
  kit.tube(
    [
      [-6.8, 0.75, 0.62],
      [-6.7, 0.69, 0.8],
      [-6.51, 0.67, 0.84],
    ],
    0.055,
    c.gray,
  );

  // A shallow open stall exposes the working counter, fish boxes and back-wall equipment.
  box([-3.29, 1.53, -0.3], [5.93, 0.18, 1.27], c.steel);
  box([-3.29, 1.19, 0.255], [5.82, 0.51, 0.085], c.blue);
  for (const x of [-5.93, -3.34, -0.65]) {
    box([x, 1.18, -0.7], [0.075, 0.47, 0.65], c.dark);
  }
  crate(-5.46, 1.66, -0.24);
  crate(-4.05, 1.66, -0.24);
  crate(-2.64, 1.66, -0.24);
  for (const [x, label, price] of [
    [-5.46, "さば", "¥380"],
    [-4.05, "あじ", "¥280"],
    [-2.64, "朝どれ", "¥450"],
  ] as const) {
    kit.rod([x + 0.43, 1.68, -0.6], [x + 0.43, 2.36, -0.6], 0.018, c.dark);
    box([x + 0.36, 2.36, -0.589], [0.49, 0.34, 0.025], c.white);
    kit.sign(
      `${label} ${price}`,
      [x + 0.36, 2.36, -0.569],
      0.45,
      0.27,
      c.white,
      c.roof,
      undefined,
      75,
    );
  }
  box([-1.22, 1.74, -0.21], [0.71, 0.2, 0.68], c.white);
  box([-1.22, 1.9, -0.4], [0.44, 0.22, 0.18], c.blue);
  const scaleDial = kit.cylinder([-1.22, 2.1, -0.29], 0.27, 0.12, c.white, undefined, 20);
  scaleDial.rotation.x = Math.PI / 2;
  const dialTexture = kit.paint(256, 256, (ctx) => {
    ctx.fillStyle = "#f3eee0";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#354d59";
    ctx.lineWidth = 4;
    for (let i = 0; i < 11; i++) {
      const a = Math.PI * 0.8 + i * Math.PI * 0.14;
      ctx.beginPath();
      ctx.moveTo(128 + Math.cos(a) * 85, 132 + Math.sin(a) * 85);
      ctx.lineTo(128 + Math.cos(a) * 103, 132 + Math.sin(a) * 103);
      ctx.stroke();
    }
    ctx.strokeStyle = "#a26153";
    ctx.beginPath();
    ctx.moveTo(128, 132);
    ctx.lineTo(85, 66);
    ctx.stroke();
    ctx.fillStyle = "#354d59";
    ctx.font = "28px monospace";
    ctx.textAlign = "center";
    ctx.fillText("5 kg", 128, 190);
  });
  kit.mesh(
    new THREE.CircleGeometry(0.235, 24),
    new THREE.MeshBasicMaterial({ map: dialTexture }),
    [-1.22, 2.1, -0.222],
  );
  const scalePan = kit.cylinder([-1.22, 1.94, 0.01], 0.35, 0.045, c.steel, undefined, 16);
  scalePan.scale.z = 0.77;

  box([-4.99, 1.78, -4.4], [2.16, 0.12, 1.14], c.steel);
  for (const x of [-5.87, -4.12]) box([x, 1.35, -4.4], [0.09, 0.8, 0.9], c.gray);
  box([-5.11, 1.835, -4.37], [1.18, 0.055, 0.71], c.dark);
  box([-5.11, 1.847, -4.37], [0.95, 0.04, 0.51], c.gray);
  for (const x of [-5.67, -4.55]) box([x, 1.89, -4.37], [0.09, 0.11, 0.8], c.steel);
  for (const z of [-4.73, -4.01]) box([-5.11, 1.89, z], [1.17, 0.11, 0.09], c.steel);
  kit.tube(
    [
      [-5.14, 1.84, -4.89],
      [-5.14, 2.32, -4.89],
      [-5.14, 2.41, -4.7],
      [-5.14, 2.3, -4.56],
    ],
    0.038,
    c.steel,
  );
  kit.rod([-5.38, 1.89, -4.9], [-5.38, 2.02, -4.9], 0.023, c.steel);
  box([-5.38, 2.03, -4.9], [0.16, 0.027, 0.042], c.rust);
  box([-3.12, 1.46, -4.52], [1.14, 1.02, 1.14], c.white, kit.root, true);
  box([-3.12, 2.003, -4.52], [1.2, 0.085, 1.2], c.steel);
  box([-3.12, 1.54, -3.936], [0.86, 0.82, 0.035], "#d0d4c9");
  box([-2.75, 1.74, -3.902], [0.06, 0.28, 0.053], c.dark);
  box([-3.08, 2.085, -4.48], [0.76, 0.068, 0.59], c.lightWood);
  box([-3.03, 2.137, -4.48], [0.39, 0.022, 0.075], c.steel);
  box([-2.74, 2.138, -4.48], [0.21, 0.04, 0.071], c.dark);
  bucket(-5.84, 0.96, -2.91);
  bucket(-0.77, 0.96, -3.94, c.rust);
  crate(-4.65, 1.01, -2.42, false);
  crate(-4.65, 1.4, -2.42, false);
  woodCrate(-1.14, 0.97, -2.42);
  woodCrate(-1.14, 1.65, -2.42);
  woodCrate(-6.2, 0.64, 1.57);
  woodCrate(-5.24, 0.64, 1.76);
  for (const x of [-3.72, -3.38]) {
    kit.cylinder([x, 1.26, -3.17], 0.105, 0.58, c.dark, undefined, 10, 0.14);
    oval([x, 1.01, -3.05], [0.14, 0.12, 0.24], c.dark);
    kit.cylinder([x, 1.565, -3.17], 0.113, 0.015, c.gray, undefined, 10);
  }
  kit.sign("本日のおさかな", [-1.37, 2.75, -5.188], 1.75, 0.7, c.dark, c.foam, undefined, 93);
  kit.sign("定置網・地魚", [-1.37, 2.23, -5.188], 1.42, 0.2, c.dark, c.foam, undefined, 110);
  kit.rod([-5.83, 3.44, -1.85], [-5.83, 2.98, -1.85], 0.018, c.dark);
  kit.cylinder([-5.83, 2.98, -1.85], 0.26, 0.13, c.white, undefined, 16, 0.12);
  kit.cylinder([-5.83, 2.9, -1.85], 0.19, 0.025, "#f5dcb0", undefined, 16);

  for (let i = 0; i < 11; i++) {
    const x = -2.47 + i * 0.21;
    kit.tube(
      [
        [x, 3.28, -5.08],
        [x + 0.07, 2.72, -4.94],
        [x + 0.03, 2.13 + Math.sin(i * 0.3) * 0.09, -4.9],
      ],
      0.012,
      c.rope,
    );
  }
  for (let j = 0; j < 7; j++) {
    const y = 2.17 + j * 0.175;
    kit.tube(
      [
        [-2.47, y, -4.96],
        [-1.4, y - 0.08, -4.91],
        [-0.36, y, -4.97],
      ],
      0.012,
      c.rope,
    );
  }
  const trolley = new THREE.Group();
  trolley.position.set(0.94, 0.66, 0.49);
  trolley.rotation.y = -0.33;
  kit.root.add(trolley);
  for (const x of [-0.33, 0.33]) {
    kit.rod([x, 0.12, 0.14], [x, 1.53, -0.18], 0.04, c.rust, trolley);
    const wheel = kit.cylinder([x * 1.24, 0.2, 0.09], 0.18, 0.105, c.dark, trolley, 12);
    wheel.rotation.z = Math.PI / 2;
  }
  for (const y of [0.39, 0.79, 1.2, 1.53])
    kit.rod([-0.33, y, 0.14 - y * 0.21], [0.33, y, 0.14 - y * 0.21], 0.035, c.rust, trolley);
  box([0, 0.17, 0.3], [0.76, 0.065, 0.58], c.gray, trolley);

  // Offset timber pier leaves the foreground harbor and the moored boat unobstructed.
  box([0.62, 0.57, 4.83], [1.8, 0.17, 3.75], c.wood);
  box([3.26, 0.57, 5.92], [6.99, 0.17, 1.56], c.wood);
  for (let z = 3.14; z < 6.62; z += 0.23) {
    box([0.62, 0.704, z], [1.87, 0.11, 0.205], c.lightWood);
  }
  for (let x = 1.7; x < 6.63; x += 0.23) {
    box([x, 0.704, 5.92], [0.205, 0.11, 1.64], Math.round(x * 10) % 3 ? c.lightWood : c.wood);
  }
  for (const x of [-0.13, 1.35]) {
    for (const z of [3.44, 4.73, 6.46]) {
      kit.cylinder([x, 0.43, z], 0.11, 0.81, c.wood, undefined, 10);
      kit.cylinder([x, 0.875, z], 0.13, 0.085, c.dark, undefined, 10);
    }
  }
  for (const x of [3.02, 4.62, 6.48]) {
    for (const z of [5.28, 6.53]) kit.cylinder([x, 0.43, z], 0.1, 0.85, c.wood, undefined, 10);
  }
  for (const [x, z] of [
    [0.62, 3.56],
    [2.13, 5.48],
    [5.97, 5.48],
  ]) {
    kit.cylinder([x, 0.94, z], 0.1, 0.39, c.dark, undefined, 10);
    box([x, 1.1, z], [0.39, 0.085, 0.13], c.dark);
    box([x, 0.795, z], [0.3, 0.04, 0.3], c.gray);
  }
  for (let i = 0; i < 4; i++) {
    const coil = kit.torus([2.88, 0.795 + i * 0.033, 5.91], 0.24 + i * 0.015, 0.021, c.rope);
    coil.rotation.x = Math.PI / 2;
  }
  kit.tube(
    [
      [2.63, 0.8, 5.91],
      [2.21, 0.79, 6.04],
      [1.85, 0.8, 5.73],
      [2.13, 1.06, 5.48],
    ],
    0.022,
    c.rope,
  );
  woodCrate(0.58, 0.77, 4.59);
  bucket(4.98, 0.77, 6.17, c.white);
  for (const x of [-5.45, -3.48, -1.82]) {
    const tire = kit.torus([x, 0.34, 3.29], 0.24, 0.08, c.dark);
    tire.rotation.y = 0.07;
    kit.rod([x, 0.78, 3.02], [x, 0.49, 3.3], 0.021, c.rope);
  }

  const boat = new THREE.Group();
  boat.userData.dynamic = true;
  boat.position.set(4.76, 0.22, 2.1);
  boat.rotation.y = -0.13;
  kit.root.add(boat);
  const outline: [number, number][] = [
    [-0.64, -1.68],
    [-0.77, -0.95],
    [-0.79, 0.64],
    [-0.51, 1.39],
    [0, 1.94],
    [0.51, 1.39],
    [0.79, 0.64],
    [0.77, -0.95],
    [0.64, -1.68],
  ];
  const hullGeometry = (lowerScale: number, lowerY: number, upperY: number) => {
    const vertices: number[] = [];
    for (let i = 0; i < outline.length; i++) {
      const [ax, az] = outline[i];
      const [bx, bz] = outline[(i + 1) % outline.length];
      vertices.push(
        ax,
        upperY,
        az,
        bx * lowerScale,
        lowerY,
        bz * lowerScale,
        bx,
        upperY,
        bz,
        ax,
        upperY,
        az,
        ax * lowerScale,
        lowerY,
        az * lowerScale,
        bx * lowerScale,
        lowerY,
        bz * lowerScale,
      );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return geometry;
  };
  kit.mesh(hullGeometry(0.73, -0.12, 0.3), kit.toon(c.roof), [0, 0, 0], boat);
  kit.mesh(hullGeometry(0.97, 0.3, 0.61), kit.toon(c.white), [0, 0, 0], boat);
  const deckShape = new THREE.Shape();
  outline.forEach(([x, z], i) => (i ? deckShape.lineTo(x, -z) : deckShape.moveTo(x, -z)));
  deckShape.closePath();
  const deck = kit.mesh(
    new THREE.ShapeGeometry(deckShape),
    kit.toon("#b5ae96"),
    [0, 0.43, 0],
    boat,
  );
  deck.rotation.x = -Math.PI / 2;
  for (let i = 0; i < outline.length; i++) {
    const [ax, az] = outline[i];
    const [bx, bz] = outline[(i + 1) % outline.length];
    kit.rod([ax, 0.635, az], [bx, 0.635, bz], 0.045, c.blue, boat);
  }
  box([0, 0.91, -0.56], [1.08, 0.97, 1.16], c.white, boat);
  box([0, 1.47, -0.58], [1.29, 0.16, 1.34], c.blue, boat);
  box([0, 1.12, 0.028], [0.89, 0.39, 0.024], "#6a9ea8", boat);
  box([0, 1.12, 0.046], [0.065, 0.43, 0.035], c.white, boat);
  box([0.553, 1.12, -0.51], [0.027, 0.37, 0.92], "#6a9ea8", boat);
  box([-0.553, 1.12, -0.51], [0.027, 0.37, 0.92], "#6a9ea8", boat);
  for (const x of [-0.571, 0.571]) box([x, 1.12, -0.6], [0.03, 0.43, 0.055], c.white, boat);
  box([0, 0.69, 0.051], [0.24, 0.047, 0.026], c.rust, boat);
  kit.rod([0.24, 0.95, 0.067], [0.34, 1.28, 0.067], 0.012, c.dark, boat);
  kit.sign("朝凪丸", [0.802, 0.48, 0.06], 0.79, 0.17, c.white, c.dark, boat, 120).rotation.y =
    Math.PI / 2;
  box([0, 0.62, -1.67], [0.36, 0.58, 0.28], c.dark, boat);
  box([0, 0.91, -1.67], [0.45, 0.14, 0.35], c.blue, boat);
  kit.rod([0, 1.53, -0.5], [0, 2.72, -0.5], 0.027, c.dark, boat);
  kit.rod([-0.47, 2.3, -0.5], [0.47, 2.3, -0.5], 0.023, c.white, boat);
  kit.cylinder([0, 2.77, -0.5], 0.063, 0.11, c.white, boat, 10);
  box([0.25, 2.57, -0.5], [0.42, 0.22, 0.018], c.rust, boat);
  kit.rod([0, 2.48, -0.5], [0.61, 0.67, 1.07], 0.01, c.rope, boat);
  for (const x of [-0.86, 0.86]) {
    for (const z of [-0.97, 0.24]) {
      oval([x, 0.37, z], [0.09, 0.22, 0.1], c.foam, boat);
      kit.rod([x * 0.9, 0.65, z], [x, 0.49, z], 0.015, c.rope, boat);
    }
  }
  const lifeRing = kit.torus([0.564, 0.92, -1.1], 0.215, 0.06, c.rust, boat);
  lifeRing.rotation.y = Math.PI / 2;
  box([0.61, 1.1, -1.1], [0.035, 0.1, 0.083], c.foam, boat);
  box([0.61, 0.74, -1.1], [0.035, 0.1, 0.083], c.foam, boat);
  box([0, 0.52, 0.71], [0.7, 0.14, 0.73], c.blue, boat);
  for (let i = 0; i < 7; i++) {
    kit.tube(
      [
        [-0.34, 0.6, 0.39 + i * 0.105],
        [0, 0.73, 0.39 + i * 0.105],
        [0.34, 0.6, 0.39 + i * 0.105],
      ],
      0.012,
      c.rope,
      boat,
    );
    kit.tube(
      [
        [-0.31 + i * 0.105, 0.61, 0.38],
        [-0.31 + i * 0.105, 0.73, 0.7],
        [-0.31 + i * 0.105, 0.61, 1.03],
      ],
      0.012,
      c.rope,
      boat,
    );
  }
  kit.rod([0, 0.63, 1.53], [0, 0.93, 1.53], 0.025, c.dark, boat);
  kit.rod([-0.16, 0.89, 1.53], [0.16, 0.89, 1.53], 0.025, c.dark, boat);
  kit.tube(
    [
      [5.97, 1.05, 5.48],
      [5.35, 0.48, 4.55],
      [4.56, 1.1, 3.62],
    ],
    0.021,
    c.rope,
  );

  const ripples = new THREE.Group();
  ripples.userData.dynamic = true;
  kit.root.add(ripples);
  const waveMeshes: THREE.Mesh[] = [];
  for (let i = 0; i < 20; i++) {
    const x = i < 12 ? 2.84 + (i % 3) * 1.75 : -6.4 + (i - 12) * 0.99;
    const z = i < 12 ? -6.45 + Math.floor(i / 3) * 2.04 : 4.37 + (i % 2) * 1.79;
    waveMeshes.push(
      kit.tube(
        [
          [x - 0.37, 0.192, z],
          [x, 0.2, z + 0.06],
          [x + 0.43, 0.192, z],
        ],
        0.014,
        i % 3 ? "#8bb0bb" : "#acc6c6",
        ripples,
      ),
    );
  }
  for (const x of [-4.9, -2.8]) {
    for (let i = 0; i < 3; i++) {
      box([x + i * 0.14, 0.184, 3.45 + i * 0.24], [0.69 - i * 0.12, 0.012, 0.04], "#739eaa");
    }
  }

  return {
    update(_delta, time, reducedMotion) {
      const t = reducedMotion ? 0 : time;
      boat.position.y = 0.22 + Math.sin(t * 0.74) * 0.019;
      boat.rotation.z = Math.sin(t * 0.63) * 0.011;
      boat.rotation.x = Math.sin(t * 0.52) * 0.006;
      waveMeshes.forEach((wave, i) => {
        wave.position.z = Math.sin(t * 0.43 + i * 0.71) * 0.08;
        wave.position.y = Math.sin(t * 0.6 + i) * 0.006;
      });
    },
  };
}
