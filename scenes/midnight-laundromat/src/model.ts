import * as THREE from "three";
import type { Kit, XYZ } from "./kit.ts";
import type { SceneAnimation } from "./types.ts";

export function buildScene(kit: Kit): SceneAnimation {
  const root = kit.root;
  let seed = 917;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const glass = new THREE.MeshBasicMaterial({
    color: "#b6d6e7",
    transparent: true,
    opacity: 0.075,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const drumGlass = new THREE.MeshBasicMaterial({
    color: "#a1ccd9",
    transparent: true,
    opacity: 0.19,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const puddleMaterial = new THREE.MeshBasicMaterial({
    color: "#9cadcc",
    transparent: true,
    opacity: 0.17,
    depthWrite: false,
  });
  const metal = "#90a9bb";
  const clothes = ["#d5aec8", "#a7c5cc", "#d0caa6", "#8894b9", "#e2ddd0"];
  const clothGeometry = new THREE.SphereGeometry(1, 8, 6);
  const rotations: THREE.Group[] = [];
  const disc = (
    position: XYZ,
    radius: number,
    depth: number,
    material: string | THREE.Material,
    parent: THREE.Object3D = root,
  ) => {
    const mesh = kit.cylinder(position, radius, depth, material, parent, 32);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  };
  const towel = (position: XYZ, color: string, width = 0.6, parent = root) => {
    kit.box(position, [width, 0.13, 0.47], color, parent);
    kit.box(
      [position[0], position[1] - 0.035, position[2] + 0.242],
      [width * 0.9, 0.018, 0.015],
      "#ebe5d7",
      parent,
    );
    for (const x of [-1, 1])
      kit.box(
        [position[0] + x * width * 0.37, position[1] + 0.071, position[2]],
        [0.022, 0.009, 0.42],
        "#e9e6d7",
        parent,
      );
  };
  const basket = (position: XYZ, color: string, full: boolean) => {
    const [x, y, z] = position;
    kit.box([x, y + 0.04, z], [0.8, 0.08, 0.6], color);
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 6; i++)
        kit.box([x + sx * 0.4, y + 0.31, z - 0.27 + i * 0.108], [0.034, 0.55, 0.035], color);
      kit.box([x + sx * 0.4, y + 0.58, z], [0.065, 0.08, 0.65], color);
      kit.box([x + sx * 0.4, y + 0.27, z], [0.04, 0.05, 0.6], color);
    }
    for (const sz of [-1, 1]) {
      for (let i = 0; i < 7; i++)
        kit.box([x - 0.37 + i * 0.123, y + 0.31, z + sz * 0.3], [0.035, 0.55, 0.035], color);
      kit.box([x, y + 0.58, z + sz * 0.3], [0.84, 0.08, 0.06], color);
      kit.box([x, y + 0.27, z + sz * 0.3], [0.8, 0.05, 0.04], color);
    }
    if (full) {
      for (let i = 0; i < 4; i++) {
        const cloth = kit.mesh(clothGeometry, kit.toon(clothes[i]), [
          x - 0.21 + (i % 2) * 0.4,
          y + 0.29 + Math.floor(i / 2) * 0.16,
          z + (random() - 0.5) * 0.25,
        ]);
        cloth.scale.set(0.24, 0.17, 0.21);
        cloth.rotation.y = random() * Math.PI;
      }
    }
  };
  const washer = (x: number, y: number, z: number, index: number) => {
    kit.box([x, y, z], [1.77, 1.72, 1.47], "#b5c6d2");
    kit.box([x, y, z + 0.755], [1.64, 1.58, 0.06], "#d6e0e0");
    kit.box([x, y + 0.62, z + 0.8], [1.53, 0.29, 0.05], "#a5bdcd");
    kit.box([x - 0.42, y + 0.64, z + 0.84], [0.48, 0.19, 0.027], "#40596a");
    kit.sign(
      index % 2 ? "28:00" : "16:42",
      [x - 0.42, y + 0.64, z + 0.86],
      0.42,
      0.13,
      "#40596a",
      "#b9ddd4",
      root,
      62,
    );
    disc([x + 0.23, y + 0.63, z + 0.87], 0.092, 0.04, "#e5e6dc");
    disc([x + 0.57, y + 0.63, z + 0.87], 0.045, 0.045, kit.basic("#a7d5ce"));
    disc([x, y - 0.15, z + 0.804], 0.62, 0.025, "#718ba1");
    disc([x, y - 0.15, z + 0.825], 0.52, 0.03, "#314c65");
    kit.torus([x, y - 0.15, z + 0.865], 0.565, 0.075, "#b5cbd4");
    kit.torus([x, y - 0.15, z + 0.89], 0.505, 0.022, "#617e94");
    const load = new THREE.Group();
    load.position.set(x, y - 0.15, z + 0.866);
    load.userData.dynamic = true;
    root.add(load);
    rotations.push(load);
    for (let i = 0; i < 5; i++) {
      const a = i * 1.256;
      const cloth = kit.mesh(
        clothGeometry,
        kit.toon(clothes[(index + i) % 5]),
        [Math.cos(a) * 0.26, Math.sin(a) * 0.25, 0.015],
        load,
      );
      cloth.scale.set(0.21, 0.14, 0.055);
      cloth.rotation.z = a + 0.35;
      kit.box(
        [Math.cos(a) * 0.29, Math.sin(a) * 0.29, 0.065],
        [0.13, 0.027, 0.012],
        "#e1e5db",
        load,
      ).rotation.z = a;
    }
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      disc(
        [x + Math.cos(a) * 0.43, y - 0.15 + Math.sin(a) * 0.43, z + 0.868],
        0.017,
        0.005,
        "#a1b6c5",
      );
    }
    disc([x, y - 0.15, z + 0.96], 0.48, 0.015, drumGlass);
    kit.box([x + 0.54, y - 0.15, z + 0.97], [0.12, 0.3, 0.1], "#d7e1de");
    kit.box([x - 0.2, y - 0.83, z + 0.8], [0.86, 0.045, 0.035], "#829dac");
    kit.sign(
      `${String(index + 1).padStart(2, "0")}   ${index < 3 ? "WASH" : "DRY"}`,
      [x + 0.13, y + 0.38, z + 0.8],
      0.68,
      0.115,
      "#d6e0e0",
      "#667f8c",
      root,
      48,
    );
  };

  kit.box([0, -0.2, 0], [15, 0.6, 15], "#586378");
  kit.box([0, 0.14, -1.4], [14.8, 0.08, 11.9], "#77859a");
  kit.box([0, 0.14, 5.24], [15, 0.07, 4.25], "#515e75");
  kit.box([0, 0.31, 3.13], [14.8, 0.25, 0.33], "#a8b3bd");
  for (let x = -7.1; x < 7.2; x += 0.65) {
    kit.box([x, 0.28, 2.87], [0.59, 0.055, 0.35], "#94a4b4");
    for (let z = -6.8; z < 2.6; z += 0.66) {
      if (x > -6.4 && x < 3.4 && z < 1.25 && z > -5.85) continue;
      kit.box(
        [x, 0.2, z],
        [0.6, 0.035, 0.6],
        ["#8b99aa", "#7e8ea1", "#8394a5"][Math.floor(random() * 3)],
      );
    }
  }
  for (let i = 0; i < 5; i++) kit.box([4.3, 0.185, 3.9 + i * 0.66], [2.15, 0.018, 0.36], "#c1c7cb");
  for (const x of [-6, -2.7, 0.6]) kit.box([x, 0.185, 5.4], [1.35, 0.02, 0.095], "#bcc1c9");
  for (let i = 0; i < 10; i++) {
    const patch = kit.mesh(new THREE.CircleGeometry(0.35 + random() * 0.45, 28), puddleMaterial, [
      -6.7 + random() * 13,
      0.22,
      3.5 + random() * 3.4,
    ]);
    patch.rotation.x = -Math.PI / 2;
    patch.scale.y = 0.32 + random() * 0.4;
    patch.castShadow = false;
  }
  const manhole = kit.cylinder([-3.8, 0.205, 5.73], 0.47, 0.035, "#414f65", root, 24);
  for (let i = -2; i <= 2; i++)
    kit.box([-3.8 + i * 0.125, manhole.position.y + 0.027, 5.73], [0.034, 0.01, 0.59], "#6c7c91");
  kit.box([-0.35, 0.31, 3.34], [1.25, 0.045, 0.19], "#46536b");
  for (let i = 0; i < 9; i++)
    kit.box([-0.86 + i * 0.13, 0.34, 3.34], [0.04, 0.015, 0.15], "#8998aa");

  // A broad, low, powder-blue tiled pavilion contrasts with the florist cottage.
  kit.box([-1.5, 0.39, -2.27], [9.7, 0.42, 7.1], "#a6b8c8");
  kit.box([-1.5, 0.63, -2.27], [9.35, 0.06, 6.8], "#c0cacc");
  for (let x = -6; x < 3.1; x += 0.53)
    for (let z = -5.5; z < 1.1; z += 0.53) kit.box([x, 0.666, z], [0.018, 0.009, 0.53], "#9bafbb");
  for (let z = -5.5; z < 1.1; z += 0.53) kit.box([-1.5, 0.666, z], [9.1, 0.009, 0.018], "#9bafbb");
  kit.box([-1.5, 2.86, -5.68], [9.65, 4.5, 0.2], "#94b3c9");
  kit.box([-6.25, 2.86, -2.25], [0.2, 4.5, 6.7], "#91adc4");
  for (let x = -6; x < 3.1; x += 0.44) {
    for (const y of [0.9, 1.19, 4.61, 4.89]) {
      kit.box([x, y, 1.2], [0.4, 0.25, 0.1], Math.round(x * 10) % 3 ? "#9dbdd0" : "#abc6d7");
    }
  }
  for (let z = -5.5; z < 1.1; z += 0.44) {
    for (const y of [0.9, 1.19, 4.61, 4.89]) kit.box([3.25, y, z], [0.1, 0.25, 0.4], "#9ebcd0");
  }
  kit.box([-1.5, 2.9, 1.2], [9.4, 3.13, 0.028], glass);
  kit.box([3.25, 2.9, -2.2], [0.028, 3.13, 6.67], glass);
  for (const x of [-6.23, -3.93, -1.63, 0.62, 3.25])
    kit.box([x, 2.88, 1.22], [0.075, 3.25, 0.085], "#7d9db3");
  for (const z of [-5.58, -3.38, -1.18, 1.2])
    kit.box([3.25, 2.88, z], [0.085, 3.25, 0.075], "#7d9db3");
  for (const y of [1.3, 4.48]) {
    kit.box([-1.5, y, 1.22], [9.6, 0.075, 0.085], "#7899b0");
    kit.box([3.25, y, -2.2], [0.085, 0.075, 6.8], "#7899b0");
  }
  kit.box([-0.51, 2.89, 1.24], [0.055, 3.15, 0.1], "#a7becc");
  for (const x of [-0.67, -0.37]) kit.rod([x, 2.1, 1.35], [x, 2.7, 1.35], 0.032, "#c9d7dc");
  kit.sign("PULL", [-0.37, 2.94, 1.29], 0.26, 0.13, "#b4c9d2", "#506f87", root, 60);
  kit.box([-0.51, 0.69, 0.93], [1.5, 0.045, 0.58], "#768c9c");
  kit.box([-1.5, 5.11, -2.25], [10.05, 0.25, 7.48], "#7288a3");
  kit.box([-1.5, 5.27, -2.25], [9.85, 0.075, 7.25], "#8899ac");
  for (const x of [-6.35, 3.35]) kit.box([x, 5.36, -2.25], [0.12, 0.22, 7.32], "#a6b6c6");
  kit.box([-1.5, 5.36, -5.85], [9.9, 0.22, 0.12], "#a6b6c6");
  kit.box([-1.5, 5.36, 1.35], [9.9, 0.22, 0.12], "#a6b6c6");
  for (const x of [-4.5, 0.9]) {
    kit.box([x, 5.62, -3.67], [1.17, 0.63, 1.33], "#a9b7c4");
    kit.box([x, 5.97, -3.67], [1.3, 0.08, 1.45], "#c0c8ce");
    for (let i = 0; i < 7; i++)
      kit.box([x, 5.44 + i * 0.065, -2.99], [0.94, 0.028, 0.025], "#677e97");
  }
  kit.cylinder([-1.8, 5.65, -4.63], 0.21, 0.72, "#9aacbe");
  kit.cylinder([-1.8, 6.02, -4.63], 0.32, 0.13, "#bdc9d1");
  kit.box([-1.5, 4.19, 1.96], [10.04, 0.13, 1.5], "#9bb4c8");
  for (const x of [-6.23, 3.25]) kit.box([x, 2.25, 2.55], [0.11, 3.9, 0.11], "#a2b8c9");
  kit.box([-1.5, 4.42, 2.67], [10.05, 0.55, 0.16], "#88a9c2");
  kit.sign("月あかりランドリー", [-1.5, 4.44, 2.763], 6.9, 0.42, "#88a9c2", "#e2eeee", root, 86);
  kit.sign(
    "COIN LAUNDRY   ·   24 HOURS",
    [-1.5, 4.08, 2.045],
    4.4,
    0.16,
    "#9bb4c8",
    "#486c87",
    root,
    43,
  );

  for (let row = 0; row < 2; row++)
    for (let col = 0; col < 3; col++)
      washer(-4.86 + col * 1.88, 1.59 + row * 1.83, -3.63, row * 3 + col);
  kit.box([-2.98, 0.71, -3.64], [5.76, 0.14, 1.66], "#637d98");
  kit.box([-2.98, 4.47, -3.64], [5.76, 0.1, 1.66], "#a2bbca");
  kit.sign(
    "洗濯  30分  ¥400    /    乾燥  10分  ¥100",
    [-2.95, 4.73, -5.55],
    5.4,
    0.25,
    "#94b3c9",
    "#e0e9e8",
    root,
    65,
  );
  // Six real circular portholes stay visible through the long front window.
  kit.box([1.32, 1.75, -1.87], [2.18, 0.14, 1.12], "#d2d2c3");
  for (const x of [0.46, 2.18])
    for (const z of [-2.25, -1.49]) kit.box([x, 1.2, z], [0.07, 1.1, 0.07], "#8fa6b6");
  kit.box([1.32, 0.9, -1.87], [1.9, 0.065, 0.92], "#a4b5bc");
  for (let i = 0; i < 4; i++) towel([0.76, 1.88 + i * 0.13, -1.91], clothes[i]);
  for (let i = 0; i < 3; i++) towel([1.78, 1.88 + i * 0.13, -1.8], clothes[(i + 2) % 5], 0.7);
  basket([1.52, 0.95, -1.87], "#b0c2cc", false);
  basket([-2.33, 0.69, -1.48], "#c7c9b0", true);
  basket([-5.19, 0.7, -1.17], "#b3c4cb", true);
  for (const x of [-5.26, -4.2]) {
    kit.box([x, 1.16, 0.05], [0.77, 0.15, 0.68], "#93aebc");
    kit.box([x, 1.54, -0.23], [0.77, 0.67, 0.09], "#93aebc");
    for (const dx of [-0.26, 0.26])
      kit.rod([x + dx, 0.7, 0.16], [x + dx, 1.14, 0.02], 0.035, metal);
    kit.box([x, 1.56, -0.166], [0.52, 0.028, 0.01], "#afc3cd");
  }
  kit.box([-3.25, 1.18, 0.06], [0.69, 0.08, 0.56], "#b2c1c7");
  kit.box([-3.25, 0.94, 0.06], [0.085, 0.49, 0.085], metal);
  kit.box([-3.25, 1.25, 0.06], [0.41, 0.055, 0.33], "#cad1c4");
  kit.sign("くらし", [-3.25, 1.283, 0.06], 0.33, 0.25, "#cad1c4", "#8297a2").rotation.x =
    -Math.PI / 2;
  for (let i = 0; i < 2; i++) {
    const slipper = kit.mesh(clothGeometry, kit.toon("#b6b5c6"), [-0.96 + i * 0.3, 0.75, 0.48]);
    slipper.scale.set(0.12, 0.06, 0.25);
    kit.box([-0.96 + i * 0.3, 0.79, 0.41], [0.18, 0.025, 0.12], "#8e9caf");
  }

  kit.box([1.88, 1.85, -4.76], [1.15, 2.37, 0.94], "#bed0d6");
  kit.box([1.88, 2.27, -4.265], [0.98, 1.06, 0.045], "#526f88");
  kit.sign("洗剤  ·  SOFTENER", [1.88, 2.94, -4.24], 1.03, 0.22, "#bed0d6", "#4c718d", root, 66);
  for (let row = 0; row < 2; row++)
    for (let col = 0; col < 3; col++) {
      const x = 1.58 + col * 0.3;
      kit.box([x, 2.05 + row * 0.44, -4.215], [0.17, 0.3, 0.05], clothes[(row + col) % 5]);
      kit.box([x, 2.08 + row * 0.44, -4.18], [0.12, 0.08, 0.01], "#e6e8dd");
    }
  kit.box([1.88, 1.57, -4.23], [0.79, 0.13, 0.055], "#839dad");
  for (let i = 0; i < 3; i++) disc([1.59 + i * 0.29, 1.57, -4.19], 0.046, 0.024, "#c0d9d5");
  kit.box([1.88, 1.12, -4.245], [0.79, 0.26, 0.045], "#50687e");
  kit.box([0.75, 1.86, -5.25], [0.78, 1.91, 0.65], "#8eabba");
  kit.sign("両替", [0.75, 2.56, -4.907], 0.63, 0.24, "#8eabba", "#e9ecdc", root, 100);
  kit.box([0.75, 2.06, -4.905], [0.43, 0.07, 0.025], "#415e78");
  kit.box([0.75, 1.5, -4.9], [0.4, 0.19, 0.035], "#526f83");
  kit.box([0.75, 1.93, -4.91], [0.4, 0.055, 0.045], "#c4ced0");
  kit.box([1.49, 3.97, -5.49], [2.31, 1.08, 0.09], "#bdc7ba");
  kit.box([1.49, 3.97, -5.425], [2.15, 0.94, 0.045], "#909f9b");
  kit.sign("お忘れもの", [1.49, 4.31, -5.39], 1.87, 0.17, "#909f9b", "#e3e4d4");
  for (let i = 0; i < 4; i++) {
    kit.box(
      [0.77 + i * 0.47, 3.93 + (i % 2) * 0.07, -5.383],
      [0.34, 0.43, 0.02],
      ["#d6d8c7", "#c1cbd0", "#d5c6c5"][i % 3],
    ).rotation.z = (i % 2 ? 1 : -1) * 0.08;
    disc([0.77 + i * 0.47, 4.1 + (i % 2) * 0.07, -5.36], 0.022, 0.009, "#899bb2");
    kit.box([0.77 + i * 0.47, 3.97, -5.365], [0.23, 0.015, 0.005], "#8897a2");
    kit.box([0.77 + i * 0.47, 3.88, -5.365], [0.19, 0.015, 0.005], "#8897a2");
  }
  disc([-5.62, 4.63, -5.51], 0.3, 0.065, "#d5dfdf");
  kit.torus([-5.62, 4.63, -5.46], 0.285, 0.025, "#7f9aad");
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    kit.box(
      [-5.62 + Math.sin(a) * 0.235, 4.63 + Math.cos(a) * 0.235, -5.465],
      [0.018, 0.034, 0.009],
      "#58778c",
    ).rotation.z = -a;
  }
  kit.rod([-5.62, 4.63, -5.445], [-5.73, 4.76, -5.445], 0.015, "#58778c");
  kit.rod([-5.62, 4.63, -5.44], [-5.42, 4.67, -5.44], 0.012, "#58778c");
  for (const x of [-4.19, 0.89]) {
    kit.box([x, 4.89, -2.5], [2.1, 0.12, 0.29], "#b1c3d0");
    kit.box([x, 4.81, -2.5], [1.95, 0.04, 0.19], kit.basic("#d6e9ec"));
    kit.point([x, 3.95, -1.9], "#c2e5f2", 5.8, 6.6);
  }
  kit.box([-1.5, 4.07, 2.24], [2.75, 0.035, 0.15], kit.basic("#cbdfe8"));

  // Street furniture is kept low so the side glazing remains a second view in.
  for (let i = 0; i < 4; i++)
    kit.box([1.65, 0.86, 2.03 + i * 0.14], [2.05, 0.09, 0.105], "#99a7b8");
  for (let i = 0; i < 3; i++)
    kit.box([1.65, 1.22 + i * 0.16, 1.96], [2.05, 0.115, 0.075], "#99a7b8");
  for (const x of [0.92, 2.37]) kit.box([x, 0.54, 2.25], [0.09, 0.66, 0.55], "#62758e");
  kit.box([2.08, 0.96, 2.22], [0.5, 0.065, 0.33], "#b4c4c4");
  kit.cylinder([1.82, 1.065, 2.2], 0.06, 0.16, "#d4dcd9");
  kit.box([5.8, 1.6, -0.83], [1.38, 2.74, 1.1], "#648eaf");
  kit.box([5.8, 2.08, -0.252], [1.13, 1.42, 0.045], "#344d6c");
  kit.sign("ひといき", [5.8, 2.81, -0.24], 1.11, 0.22, "#648eaf", "#e1eaeb", root, 95);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const x = 5.39 + col * 0.274;
      const y = 1.62 + row * 0.42;
      kit.cylinder(
        [x, y, -0.188],
        0.074,
        0.23,
        ["#b9c9d0", "#aecfc7", "#d8c9b0", "#a6b2d0"][col],
        root,
        10,
      );
      kit.cylinder([x, y + 0.12, -0.188], 0.052, 0.018, "#d2dfe1", root, 10);
      kit.box([x, y - 0.16, -0.14], [0.13, 0.044, 0.018], kit.basic("#abc6d9"));
    }
    kit.box([5.8, 1.43 + row * 0.42, -0.19], [1.12, 0.04, 0.15], "#879eaf");
  }
  kit.box([5.75, 0.68, -0.25], [0.8, 0.23, 0.065], "#344b67");
  kit.box([6.26, 1.15, -0.245], [0.1, 0.35, 0.035], "#b3c4cf");
  kit.box([6.26, 1.24, -0.22], [0.055, 0.045, 0.02], "#4d647e");
  kit.point([5.8, 2.15, 0.1], "#a7cfed", 1.5, 2.8);
  kit.cylinder([6.63, 0.67, -0.97], 0.29, 0.93, "#8da4b7", root, 16);
  kit.cylinder([6.63, 1.16, -0.97], 0.3, 0.08, "#a5b9c6", root, 16);
  disc([6.63, 1.11, -0.701], 0.1, 0.01, "#455e78");
  kit.box([6.65, 2.46, 2.01], [0.1, 4.4, 0.1], "#65778f");
  kit.rod([6.65, 4.62, 2.01], [6.25, 4.62, 2.01], 0.06, "#65778f");
  kit.box([6.22, 4.53, 2.01], [0.65, 0.16, 0.43], "#aebdcc");
  kit.box([6.22, 4.437, 2.01], [0.48, 0.035, 0.3], kit.basic("#dedfc8"));
  kit.point([6.22, 4.17, 2.01], "#dce0cd", 4, 5);
  kit.box([-6.86, 0.65, -3.8], [0.55, 0.94, 1.32], "#7e95aa");
  for (let i = 0; i < 8; i++)
    kit.box([-6.563, 0.37 + i * 0.084, -3.8], [0.025, 0.029, 1.1], "#4f6a87");
  kit.tube(
    [
      [-6.87, 0.3, -4.53],
      [-6.87, 1.15, -4.53],
      [-6.32, 1.35, -4.53],
    ],
    0.044,
    "#9cafbf",
  );
  for (let i = 0; i < 3; i++) {
    kit.cylinder([4.03, 0.27, -5.3 + i * 0.65], 0.1, 0.14, "#91a3b4");
    kit.rod([4.03, 0.3, -5.3 + i * 0.65], [4.06, 0.55, -5.3 + i * 0.65], 0.026, "#859d9b");
  }

  const droplets = new THREE.Group();
  droplets.userData.dynamic = true;
  root.add(droplets);
  const beadGeometry = new THREE.SphereGeometry(1, 5, 4);
  const beadMaterial = new THREE.MeshBasicMaterial({
    color: "#c9dce5",
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
  });
  const beads: { mesh: THREE.Mesh; y: number; speed: number }[] = [];
  for (let i = 0; i < 52; i++) {
    const x = -6.03 + random() * 9.07;
    const y = 1.42 + random() * 2.88;
    const mesh = kit.mesh(beadGeometry, beadMaterial, [x, y, 1.265], droplets);
    mesh.scale.set(0.011 + random() * 0.01, 0.03 + random() * 0.055, 0.008);
    mesh.castShadow = false;
    beads.push({ mesh, y, speed: 0.04 + random() * 0.05 });
  }
  for (let i = 0; i < 22; i++) {
    const mesh = kit.mesh(
      beadGeometry,
      beadMaterial,
      [3.29, 1.4 + random() * 2.87, -5.36 + random() * 6.3],
      droplets,
    );
    mesh.scale.set(0.008, 0.05, 0.016);
    mesh.castShadow = false;
  }
  const count = 95;
  const positions = new Float32Array(count * 6);
  const drops = Array.from({ length: count }, () => {
    let x: number;
    let z: number;
    do {
      x = -7.16 + random() * 14.32;
      z = -7.14 + random() * 14.28;
    } while (x > -6.65 && x < 3.7 && z > -6.05 && z < 2.85);
    return { x, z, phase: random() * 5.8 };
  });
  const rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const rainMaterial = new THREE.LineBasicMaterial({
    color: "#aabed8",
    transparent: true,
    opacity: 0.17,
    depthWrite: false,
  });
  const rain = new THREE.LineSegments(rainGeometry, rainMaterial);
  rain.frustumCulled = false;
  root.add(rain);
  const ringsMaterial = new THREE.MeshBasicMaterial({
    color: "#b5c7d9",
    transparent: true,
    opacity: 0.17,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const ringsGeometry = new THREE.RingGeometry(0.94, 1, 24);
  const rings = Array.from({ length: 7 }, (_, i) => {
    const ring = kit.mesh(ringsGeometry, ringsMaterial, [
      -5.8 + i * 1.73,
      0.245,
      3.8 + (i % 3) * 1.16,
    ]);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.dynamic = true;
    ring.castShadow = false;
    return ring;
  });
  return {
    update(_delta, time, reduced) {
      rain.visible = !reduced;
      if (!reduced)
        rotations.forEach((load, i) => {
          load.rotation.z = time * (i < 3 ? 0.36 : -0.23) + i * 0.7;
        });
      beads.forEach(({ mesh, y, speed }) => {
        mesh.position.y = reduced ? y : 1.4 + ((((y - 1.4 - time * speed) % 2.9) + 2.9) % 2.9);
      });
      rings.forEach((ring, i) => {
        const phase = (time * 0.43 + i * 0.23) % 1;
        ring.visible = !reduced && phase < 0.82;
        ring.scale.setScalar(0.02 + phase * 0.36);
      });
      if (reduced) return;
      drops.forEach(({ x, z, phase }, i) => {
        const y = 0.3 + ((((phase - time * 2.9) % 5.8) + 5.8) % 5.8);
        positions.set([x, y, z, x - 0.018, y + 0.19, z], i * 6);
      });
      rainGeometry.attributes.position.needsUpdate = true;
    },
    dispose() {
      rainGeometry.dispose();
      rainMaterial.dispose();
    },
  };
}
