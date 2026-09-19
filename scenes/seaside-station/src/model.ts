import * as THREE from "three";
import type { Kit, XYZ } from "./kit.ts";
import type { SceneAnimation } from "./types.ts";

export function buildScene(kit: Kit): SceneAnimation {
  const c = {
    ivory: "#eee9d4",
    white: "#fff8df",
    mint: "#77bcb1",
    roof: "#63a79a",
    darkMint: "#396e68",
    red: "#bb594c",
    wood: "#9c8060",
    darkWood: "#6e6253",
    concrete: "#c6c5b6",
    edge: "#e0daca",
    steel: "#6f8588",
    dark: "#3c5052",
    yellow: "#ead481",
    green: "#789c70",
    deepGreen: "#4c775e",
  };
  const box = (p: XYZ, s: XYZ, color: string, parent: THREE.Object3D = kit.root, outline = false) =>
    kit.box(p, s, color, parent, outline);
  const sphere = new THREE.SphereGeometry(1, 10, 7);
  const leaf = (p: XYZ, s: XYZ, color = c.green) => {
    const mesh = kit.mesh(sphere, kit.toon(color), p);
    mesh.scale.set(...s);
    return mesh;
  };
  const pot = (x: number, z: number, size = 0.32) => {
    kit.cylinder([x, 0.93, z], size * 0.8, 0.46, c.red, undefined, 10, size);
    kit.cylinder([x, 1.18, z], size + 0.025, 0.07, c.red, undefined, 12);
    kit.cylinder([x, 1.22, z], size * 0.86, 0.025, c.darkWood, undefined, 12);
    for (let i = 0; i < 7; i++) {
      const a = i * 2.4;
      const frond = leaf(
        [x + Math.cos(a) * size * 0.7, 1.43, z + Math.sin(a) * size * 0.7],
        [0.095, 0.4 + (i % 3) * 0.07, 0.085],
        i % 2 ? c.green : c.deepGreen,
      );
      frond.rotation.z = Math.cos(a) * 0.55;
      frond.rotation.x = Math.sin(a) * 0.55;
    }
  };
  const platformTop = 0.85;
  const bench = (x: number, z: number) => {
    const group = new THREE.Group();
    group.name = "station-bench";
    group.position.set(x, platformTop, z);
    kit.root.add(group);
    for (const dx of [-0.76, 0.76]) {
      for (const dz of [-0.2, 0.2]) {
        const foot = box([dx, 0.0175, dz], [0.115, 0.035, 0.115], c.darkMint, group);
        foot.name = "bench-foot";
        const leg = kit.cylinder([dx, 0.2175, dz], 0.035, 0.385, c.darkMint, group, 10);
        leg.name = "bench-leg";
      }
      const rail = box([dx, 0.397, 0], [0.11, 0.065, 0.56], c.darkMint, group);
      rail.name = "bench-seat-rail";
      const back = kit.rod([dx, 0.38, -0.2], [dx, 1.07, -0.34], 0.035, c.darkMint, group);
      back.name = "bench-back-support";
      const armSupport = kit.rod([dx, 0.48, 0.2], [dx, 0.695, 0.2], 0.025, c.darkMint, group);
      armSupport.name = "bench-arm-support";
      const arm = box([dx, 0.695, 0], [0.075, 0.055, 0.54], c.darkMint, group);
      arm.name = "bench-armrest";
    }
    for (let j = 0; j < 4; j++) {
      const slat = box([0, 0.45, -0.225 + j * 0.15], [2.1, 0.07, 0.125], c.wood, group);
      slat.name = "bench-seat-slat";
    }
    for (let j = 0; j < 3; j++) {
      const y = 0.675 + j * 0.145;
      const slat = box([0, y, -0.2 - ((y - 0.38) * 0.14) / 0.69], [2.1, 0.13, 0.06], c.wood, group);
      slat.rotation.x = -Math.atan2(0.14, 0.69);
      slat.name = "bench-back-slat";
    }
  };

  box([0, -0.2, 0], [15, 0.6, 15], "#b1bfae", kit.root, true);
  box([-1.75, 0.12, 0], [11.5, 0.08, 14.9], "#d1d4bd");
  box([5.74, 0.13, 0], [3.48, 0.1, 14.88], "#468f9e");
  box([4.42, 0.192, -1.9], [0.75, 0.025, 10.7], "#74b3b3");
  box([5.13, 0.19, -1.9], [0.68, 0.02, 10.7], "#5ca6ad");
  box([6.83, 0.185, 0], [1.2, 0.018, 14.7], "#3e879e");
  box([3.82, 0.46, -1.92], [0.36, 0.68, 10.85], "#a9b9b2");
  box([3.82, 0.83, -1.92], [0.51, 0.1, 10.92], c.edge);
  for (let z = -7.05; z < 3.45; z += 0.7) {
    box([4.008, 0.39, z], [0.016, 0.045, 0.59], "#859c97");
    box([4.012, 0.64, z + 0.3], [0.016, 0.035, 0.59], "#859c97");
  }
  for (let i = 0; i < 6; i++) {
    const rock = leaf(
      [4.27 + (i % 2) * 0.18, 0.28, -6.6 + i * 1.67],
      [0.34, 0.25, 0.45],
      "#8caaa4",
    );
    rock.rotation.y = i * 0.8;
  }

  // The line continues over a low coastal bridge instead of ending at the seawall.
  box([0, 0.24, 4.69], [14.86, 0.22, 2.2], "#8e9690");
  box([5.64, 0.32, 4.72], [3.66, 0.27, 2.4], c.concrete);
  for (const x of [4.6, 6.65]) {
    box([x, 0.16, 4.72], [0.38, 0.38, 1.9], "#8eaaa3");
  }
  for (let i = 0; i < 39; i++) {
    const x = -7.16 + i * 0.375;
    box([x, 0.41, 4.71], [0.16, 0.11, 1.83], c.darkWood);
    for (const z of [4.21, 5.21]) {
      box([x, 0.475, z], [0.23, 0.045, 0.24], c.dark);
      for (const dz of [-0.1, 0.1]) {
        kit.cylinder([x, 0.515, z + dz], 0.029, 0.04, c.steel, undefined, 6);
      }
    }
    if (i % 3 === 0) {
      box([x + 0.14, 0.365, 3.79], [0.11, 0.07, 0.13], "#b5b6a5");
      box([x - 0.06, 0.365, 5.59], [0.15, 0.06, 0.1], "#6f807b");
    }
  }
  for (const z of [4.21, 5.21]) {
    box([0, 0.525, z], [14.8, 0.12, 0.07], c.dark);
    box([0, 0.598, z], [14.8, 0.04, 0.125], "#b9c7c5");
  }
  box([-1.13, 0.46, 2.22], [9.25, 0.61, 2.61], c.concrete);
  const platform = box([-1.13, platformTop - 0.05, 2.22], [9.32, 0.1, 2.65], c.edge);
  platform.name = "station-platform-deck";
  box([-1.13, 0.87, 3.28], [9.19, 0.04, 0.21], c.yellow);
  for (let i = 0; i < 38; i++) {
    box([-5.57 + i * 0.24, 0.899, 3.27], [0.038, 0.014, 0.15], "#b49e63");
  }
  for (let x = -5.2; x < 3.1; x += 1.15) {
    box([x, 0.87, 2.19], [0.012, 0.008, 1.82], "#aaa999");
    box([x, 0.42, 3.536], [0.02, 0.55, 0.01], "#a8aaa0");
  }
  for (let i = 0; i < 3; i++) {
    box([-6.37 + i * 0.23, 0.26 + i * 0.16, 1.55], [0.5, 0.23 + i * 0.16, 1.18], c.concrete);
  }
  box([-1.16, 0.52, -1.23], [7.03, 0.71, 5.13], c.edge);
  box([-1.16, 0.9, -1.23], [7.03, 0.055, 5.13], "#d1c8ae");
  for (let x = -4.54; x < 2.2; x += 0.41) {
    box([x, 0.934, -1.2], [0.015, 0.012, 4.96], "#b6ad96");
  }

  box([-2.05, 2.02, -3.22], [4.97, 2.2, 0.16], c.ivory);
  box([-4.49, 2.02, -1.61], [0.16, 2.2, 3.35], c.ivory);
  box([0.38, 1.43, -1.6], [0.14, 1.03, 3.27], c.ivory);
  box([-1.32, 1.41, -0.14], [3.48, 1.01, 0.16], c.ivory);
  box([-1.32, 2.83, -0.14], [3.48, 0.61, 0.16], c.ivory);
  for (const x of [-3.07, -0.13, 0.39]) {
    box([x, 2.06, -0.13], [0.13, 2.32, 0.2], c.mint);
  }
  box([-1.58, 1.93, -0.01], [2.84, 0.13, 0.42], c.wood);
  box([-1.58, 2.57, -0.015], [2.84, 0.085, 0.16], c.mint);
  for (const x of [-2.96, -1.57, -0.2]) {
    box([x, 2.24, -0.04], [0.065, 0.68, 0.075], c.darkMint);
  }
  box([-1.08, 2.24, -0.048], [0.06, 0.61, 0.068], c.mint);
  kit.sign("きっぷ", [-1.56, 2.85, -0.045], 1.16, 0.28, c.ivory, c.darkMint, undefined, 95);
  kit.sign("入口", [-3.76, 2.79, 0.04], 0.62, 0.27, c.ivory, c.darkMint, undefined, 85);
  for (let y = 1.12; y < 2.95; y += 0.27) {
    box([-4.584, y, -1.64], [0.015, 0.024, 3.08], "#d2cfb9");
    box([-2.03, y, -3.311], [4.82, 0.024, 0.015], "#d2cfb9");
  }
  for (const x of [-4.51, 0.43, 2.3]) {
    for (const z of [-3.28, 1.06]) {
      const column = box([x, 2.1, z], [0.15, 2.39, 0.15], c.darkMint);
      column.name = "station-shelter-column";
      box([x, 0.99, z], [0.23, 0.18, 0.23], c.concrete);
      kit.rod([x, 2.78, z], [x + (x > 1 ? -0.43 : 0.43), 3.23, z], 0.046, c.mint);
    }
  }
  box([-1.1, 3.24, 1.1], [7.58, 0.16, 0.17], c.ivory);
  box([-1.1, 3.24, -3.49], [7.58, 0.16, 0.17], c.ivory);
  const roofAngle = Math.atan2(0.84, 2.48);
  for (const front of [-1, 1]) {
    const roof = box([-1.1, 3.7, -1.18 + front * 1.24], [7.75, 0.15, 2.63], c.roof);
    roof.rotation.x = front * roofAngle;
    for (let x = -4.85; x < 2.73; x += 0.26) {
      const seam = box([x, 3.794, -1.18 + front * 1.24], [0.035, 0.032, 2.65], c.mint);
      seam.rotation.x = front * roofAngle;
    }
    for (let x = -4.6; x < 2.4; x += 1.15) {
      kit.rod([x, 4.02, -1.18], [x, 3.15, -1.18 + front * 2.5], 0.06, c.darkWood);
    }
  }
  box([-1.1, 4.18, -1.18], [7.85, 0.12, 0.15], c.darkMint);
  box([-1.1, 3.25, 1.4], [7.8, 0.19, 0.1], c.darkMint);
  box([2.62, 1.96, 0.94], [0.065, 2.44, 0.065], c.steel);
  kit.tube(
    [
      [2.62, 3.23, 1.4],
      [2.62, 3.13, 1.34],
      [2.62, 2.98, 0.94],
    ],
    0.045,
    c.steel,
  );
  box([-1.1, 2.97, 1.205], [2.65, 0.63, 0.13], c.darkMint, kit.root, true);
  kit.sign("潮風駅", [-1.1, 3.02, 1.277], 2.48, 0.36, c.ivory, c.darkMint, undefined, 132);
  kit.sign("SHIOKAZE", [-1.1, 2.79, 1.278], 1.6, 0.1, c.ivory, c.darkMint, undefined, 65);
  box([-1.1, 2.71, 1.284], [2.5, 0.055, 0.015], c.mint);

  // Open ticket counter and the tiny equipment inside remain visible under the eaves.
  box([-1.61, 1.69, -1.13], [2.53, 0.12, 0.66], c.wood);
  for (const x of [-2.61, -0.6]) box([x, 1.27, -1.13], [0.1, 0.79, 0.5], c.darkWood);
  box([-1.98, 1.81, -1.06], [0.51, 0.15, 0.31], c.dark);
  box([-1.99, 1.93, -1.13], [0.4, 0.1, 0.08], c.steel);
  for (let i = 0; i < 5; i++) {
    box([-1.0 + i * 0.085, 1.783 + i * 0.01, -0.99], [0.22, 0.014, 0.25], c.white);
  }
  box([-0.92, 2.3, -3.09], [1.7, 1.06, 0.17], c.darkWood);
  for (let i = 0; i < 6; i++) {
    box([-1.6 + i * 0.27, 2.29, -2.975], [0.045, 1.02, 0.12], c.wood);
    for (let j = 0; j < 4; j++) {
      box([-1.48 + i * 0.27, 1.9 + j * 0.255, -2.94], [0.19, 0.026, 0.2], c.ivory);
    }
  }
  kit.sign("運賃表", [-2.82, 2.38, -3.116], 1.11, 0.66, c.white, c.dark, undefined, 110);
  bench(1.05, 2.05);
  bench(-3.63, 2.05);
  pot(2.65, 2.6, 0.26);
  pot(-4.88, 0.85, 0.29);

  const timetable = kit.paint(384, 512, (ctx) => {
    ctx.fillStyle = "#f5f0d9";
    ctx.fillRect(0, 0, 384, 512);
    ctx.fillStyle = "#396e68";
    ctx.fillRect(16, 18, 352, 74);
    ctx.fillStyle = "#fff8df";
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("時 刻 表", 192, 69);
    ctx.textAlign = "left";
    ctx.font = "25px monospace";
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = i % 2 ? "#dedec8" : "#f5f0d9";
      ctx.fillRect(17, 111 + i * 39, 350, 36);
      ctx.fillStyle = "#396e68";
      ctx.fillText(`${String(6 + i).padStart(2, "0")}   12   38`, 35, 139 + i * 39);
    }
    ctx.fillStyle = "#bb594c";
    ctx.font = "20px sans-serif";
    ctx.fillText("海岸線・上り", 112, 494);
  });
  box([2.31, 2.11, 1.08], [0.79, 1.08, 0.09], c.darkMint);
  kit.mesh(
    new THREE.PlaneGeometry(0.69, 0.96),
    new THREE.MeshBasicMaterial({ map: timetable }),
    [2.31, 2.11, 1.132],
  );
  for (const x of [-5.02, -4.08]) {
    box([x, 1.29, -0.44], [0.14, 0.81, 0.64], c.darkMint);
    box([x, 1.71, -0.44], [0.25, 0.05, 0.78], c.wood);
  }
  box([-5.02, 1.52, -0.02], [0.23, 0.25, 0.21], c.ivory);
  box([-5.02, 1.662, 0], [0.12, 0.014, 0.045], c.dark);

  const vending = new THREE.Group();
  vending.position.set(1.38, 0.92, -2.44);
  kit.root.add(vending);
  box([0, 1, 0], [1.15, 2, 0.71], c.ivory, vending, true);
  box([0, 1.85, 0.37], [1.05, 0.17, 0.04], c.red, vending);
  kit.sign("つめたい", [0, 1.86, 0.395], 0.81, 0.13, c.red, c.white, vending, 110);
  box([-0.09, 1.2, 0.38], [0.82, 1.01, 0.045], "#719c9d", vending);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const x = -0.39 + col * 0.2;
      const y = 0.85 + row * 0.29;
      kit.cylinder([x, y, 0.432], 0.052, 0.18, [c.white, c.mint, c.red, c.yellow][col], vending, 8);
      box([x, y + 0.09, 0.432], [0.061, 0.025, 0.061], c.white, vending);
      box([x, y - 0.12, 0.423], [0.084, 0.03, 0.028], c.white, vending);
    }
  }
  box([0.43, 1.16, 0.409], [0.13, 0.31, 0.04], c.dark, vending);
  box([0.43, 1.23, 0.433], [0.068, 0.023, 0.009], c.yellow, vending);
  box([-0.05, 0.32, 0.387], [0.76, 0.23, 0.04], c.dark, vending);
  box([-0.05, 0.23, 0.436], [0.8, 0.045, 0.13], c.steel, vending);
  for (let i = 0; i < 6; i++)
    box([0.578, 0.38 + i * 0.07, 0], [0.01, 0.019, 0.41], c.steel, vending);
  kit.cylinder([2.52, 1.25, -2.24], 0.26, 0.66, c.mint, undefined, 14);
  kit.cylinder([2.52, 1.62, -2.24], 0.28, 0.07, c.darkMint, undefined, 14);
  box([2.52, 1.667, -2.24], [0.22, 0.012, 0.11], c.dark);

  box([-6.51, 0.215, 0], [1.65, 0.14, 14.76], "#a7b0a4");
  for (const z of [4.01, 4.48, 4.87, 5.38]) {
    box([-6.51, 0.535, z], [1.69, 0.1, 0.31], c.wood);
  }
  for (let z = -6.8; z < 7.2; z += 1.05) {
    if (z < 3.2 || z > 5.8) box([-6.51, 0.294, z], [0.057, 0.015, 0.48], c.white);
  }
  for (const z of [3.13, 6.1]) {
    box([-5.66, 0.77, z], [0.3, 1.02, 0.3], c.yellow);
    for (let i = 0; i < 4; i++)
      box([-5.66, 0.37 + i * 0.25, z + 0.157], [0.3, 0.105, 0.018], c.dark);
    kit.cylinder([-5.66, 1.42, z], 0.077, 1.18, c.dark, undefined, 10);
    const barrier = box([-6.4, 1.08, z], [1.53, 0.085, 0.09], c.yellow);
    for (let j = 0; j < 7; j++)
      box([-7.08 + j * 0.215, 1.082, z + 0.002], [0.09, 0.09, 0.095], c.dark);
    barrier.rotation.z = 0;
    for (const direction of [-1, 1]) {
      const cross = box([-5.66, 2.04, z], [0.66, 0.095, 0.08], c.yellow);
      cross.rotation.z = (direction * Math.PI) / 4;
    }
    for (const dx of [-0.16, 0.16]) {
      const signal = kit.cylinder([-5.66 + dx, 1.64, z + 0.1], 0.113, 0.13, c.dark, undefined, 12);
      signal.rotation.x = Math.PI / 2;
      const lens = kit.cylinder([-5.66 + dx, 1.64, z + 0.173], 0.069, 0.015, c.red, undefined, 12);
      lens.rotation.x = Math.PI / 2;
    }
  }
  kit.sign("とまれ", [-5.66, 1.19, 6.275], 0.3, 0.13, c.white, c.red, undefined, 120);
  for (const x of [-5.27, 2.94]) {
    kit.cylinder([x, 2.67, -4.49], 0.1, 5.05, c.darkWood, undefined, 10);
    box([x, 4.98, -4.49], [0.2, 0.16, 1.55], c.darkWood);
    for (const dz of [-0.61, 0, 0.61]) {
      kit.cylinder([x, 5.13, -4.49 + dz], 0.07, 0.21, c.ivory, undefined, 8);
    }
    for (let y = 0.7; y < 4.35; y += 0.46) {
      kit.rod([x - 0.17, y, -4.49], [x + 0.17, y, -4.49], 0.024, c.steel);
    }
  }
  for (const dz of [-0.61, 0, 0.61]) {
    kit.tube(
      [
        [-5.27, 5.22, -4.49 + dz],
        [-1.17, 4.66, -4.49 + dz],
        [2.94, 5.22, -4.49 + dz],
      ],
      0.018,
      c.dark,
    );
  }
  box([-5.27, 3.53, -4.26], [0.4, 0.64, 0.23], c.steel);
  kit.tube(
    [
      [-5.22, 3.38, -4.18],
      [-4.95, 3.15, -3.83],
      [-4.45, 3.08, -3.23],
    ],
    0.025,
    c.dark,
  );
  for (let x = -4.75; x < 3.25; x += 0.58) {
    box([x, 0.8, -5.17], [0.085, 1.25, 0.085], c.ivory);
  }
  for (const y of [0.46, 1.09]) box([-0.82, y, -5.17], [8.05, 0.085, 0.055], c.ivory);
  for (let i = 0; i < 28; i++) {
    const x = -4.63 + (i % 14) * 0.55;
    const z = -6.16 - Math.floor(i / 14) * 0.77;
    leaf([x, 0.29, z], [0.32, 0.19 + (i % 3) * 0.07, 0.29], i % 2 ? "#a5b985" : c.green);
  }
  for (let i = 0; i < 17; i++) {
    const x = -4.85 + i * 0.48;
    const z = 6.38 + Math.sin(i * 1.7) * 0.34;
    for (let j = 0; j < 3; j++) {
      kit.rod([x, 0.2, z], [x + (j - 1) * 0.09, 0.42 + j * 0.08, z + j * 0.03], 0.016, c.green);
    }
  }
  box([5.65, 0.39, 6.02], [3.5, 0.43, 0.18], c.concrete);
  box([5.65, 0.63, 6.02], [3.57, 0.08, 0.27], c.edge);
  for (const x of [4.17, 5.64, 7.09]) {
    kit.rod([x, 0.85, -6.87], [x, 1.42, -6.87], 0.035, c.ivory);
  }
  kit.rod([4.17, 1.35, -6.87], [7.09, 1.35, -6.87], 0.029, c.ivory);

  const waves = new THREE.Group();
  waves.userData.dynamic = true;
  kit.root.add(waves);
  const waveBands: THREE.Mesh[] = [];
  for (let i = 0; i < 11; i++) {
    const x = 4.55 + (i % 3) * 0.88;
    const z = -6.32 + Math.floor(i / 3) * 2.6 + (i % 3) * 0.45;
    if (z > 3.4) continue;
    waveBands.push(
      kit.tube(
        [
          [x - 0.12, 0.219, z - 0.65],
          [x + 0.07, 0.219, z],
          [x - 0.04, 0.219, z + 0.6],
        ],
        0.016,
        "#c0e1d7",
        waves,
      ),
    );
  }
  const chime = new THREE.Group();
  chime.userData.dynamic = true;
  chime.position.set(1.64, 3.17, 1.02);
  kit.root.add(chime);
  kit.rod([0, 0, 0], [0, -0.3, 0], 0.009, c.darkMint, chime);
  kit.mesh(
    new THREE.SphereGeometry(0.145, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    kit.toon("#b8d9ca"),
    [0, -0.44, 0],
    chime,
  );
  kit.rod([0, -0.34, 0], [0, -0.64, 0], 0.009, c.darkMint, chime);
  box([0, -0.76, 0], [0.095, 0.26, 0.014], c.white, chime);
  box([0, -0.79, 0.01], [0.04, 0.1, 0.008], c.red, chime);

  return {
    update(_delta, time, reducedMotion) {
      const t = reducedMotion ? 0 : time;
      waveBands.forEach((wave, i) => {
        wave.position.x = Math.sin(t * 0.46 + i * 0.85) * 0.075;
        wave.position.y = Math.sin(t * 0.6 + i) * 0.008;
      });
      chime.rotation.z = Math.sin(t * 1.32) * 0.075;
      chime.rotation.x = Math.sin(t * 0.83) * 0.03;
    },
  };
}
