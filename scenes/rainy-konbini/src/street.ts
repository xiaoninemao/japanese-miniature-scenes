import * as THREE from "three";
import { Kit, type XYZ } from "./kit.ts";

export const STREET_LEVEL = 0.135;

function vendingMachine(kit: Kit, x: number, z: number) {
  const group = new THREE.Group();
  group.position.set(x, 0.35, z);
  kit.root.add(group);
  kit.box([0, 1.04, 0], [1.12, 2.06, 0.72], "#bb6567", group, true);
  kit.box([0, 2.08, 0], [1.15, 0.08, 0.76], "#e3aaa0", group);
  kit.box([-0.1, 1.34, 0.371], [0.82, 1.08, 0.025], "#25394a", group);
  kit.box([-0.1, 1.34, 0.391], [0.75, 1.01, 0.012], kit.basic("#d7e9d5"), group);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      const px = -0.4 + col * 0.15;
      const py = 1.06 + row * 0.31;
      const colors = ["#de9b67", "#85b0bc", "#b2be6d", "#e2cc93", "#da898e"];
      kit.cylinder([px, py, 0.423], 0.039, 0.17, colors[(col + row) % 5], group, 10);
      kit.cylinder([px, py + 0.096, 0.423], 0.024, 0.02, "#e6e6d6", group, 8);
      kit.box([px, py - 0.13, 0.43], [0.093, 0.036, 0.015], "#f7e5b4", group);
    }
    kit.box([-0.1, 0.925 + row * 0.31, 0.427], [0.76, 0.022, 0.035], "#526c68", group);
  }
  kit.box([-0.12, 0.4, 0.38], [0.64, 0.22, 0.04], "#24333d", group);
  kit.box([-0.12, 0.3, 0.405], [0.64, 0.035, 0.08], "#d39490", group);
  kit.box([0.424, 1.04, 0.38], [0.12, 0.29, 0.035], "#4c5d60", group);
  kit.box([0.424, 1.15, 0.403], [0.07, 0.035, 0.01], kit.basic("#b0dac0"), group);
  kit.box([0.424, 1.025, 0.409], [0.075, 0.02, 0.01], "#152e36", group);
  kit.sign("つめたい", [-0.06, 1.96, 0.389], 0.86, 0.14, "#bb6567", "#fff1db", group, 105);
  kit.sign("DRINKS", [-0.15, 0.65, 0.389], 0.68, 0.15, "#bb6567", "#fff1db", group, 110);
  for (const dx of [-0.38, 0.38]) {
    kit.box([dx, 0.045, 0], [0.14, 0.09, 0.55], "#283944", group);
  }
}

function bicycle(kit: Kit, x: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, 0.38, z);
  g.rotation.y = -0.12;
  g.rotation.z = -0.06;
  kit.root.add(g);
  const blue = "#80afbc";
  for (const wx of [-0.69, 0.69]) {
    kit.torus([wx, 0.45, 0], 0.425, 0.044, "#24303b", g);
    kit.torus([wx, 0.45, 0], 0.378, 0.015, "#c6cecf", g);
    kit.cylinder([wx, 0.45, 0], 0.045, 0.09, "#d7d9cb", g).rotation.x = Math.PI / 2;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      kit.rod(
        [wx, 0.45, 0],
        [wx + Math.cos(a) * 0.376, 0.45 + Math.sin(a) * 0.376, 0],
        0.006,
        "#a5b4bb",
        g,
      );
    }
  }
  const back: XYZ = [-0.69, 0.45, 0];
  const crank: XYZ = [-0.07, 0.39, 0];
  const seat: XYZ = [-0.3, 1.02, 0];
  const steering: XYZ = [0.46, 1.04, 0];
  [
    [back, crank],
    [back, seat],
    [crank, seat],
    [crank, steering],
    [seat, steering],
    [steering, [0.69, 0.45, 0] as XYZ],
  ].forEach(([a, b]) => kit.rod(a, b, 0.027, blue, g));
  kit.rod(seat, [-0.35, 1.2, 0], 0.025, "#b7c2c0", g);
  kit.box([-0.37, 1.21, 0], [0.33, 0.075, 0.2], "#4b383e", g);
  kit.torus(crank, 0.13, 0.024, "#b5b9ad", g);
  kit.rod([-0.07, 0.39, 0.035], [0.13, 0.29, 0.08], 0.018, "#c4cccb", g);
  kit.box([0.13, 0.29, 0.11], [0.15, 0.04, 0.14], "#33424a", g);
  kit.tube(
    [
      [0.46, 1.04, 0],
      [0.42, 1.35, 0],
      [0.38, 1.37, 0.2],
    ],
    0.025,
    "#bdc9c6",
    g,
  );
  kit.rod([0.38, 1.37, -0.24], [0.38, 1.37, 0.24], 0.025, "#b7c5c7", g);
  kit.rod([0.38, 1.37, 0.15], [0.28, 1.37, 0.27], 0.035, "#3b4147", g);
  kit.rod([0.38, 1.37, -0.15], [0.28, 1.37, -0.27], 0.035, "#3b4147", g);
  kit.box([0.68, 1.04, 0], [0.41, 0.035, 0.38], "#768b91", g);
  for (let i = 0; i < 6; i++) {
    const a = i * 0.075;
    kit.rod([0.47 + a, 1.05, -0.19], [0.47 + a, 1.38, -0.22], 0.011, "#97a9ad", g);
    kit.rod([0.47 + a, 1.05, 0.19], [0.47 + a, 1.38, 0.22], 0.011, "#97a9ad", g);
    kit.rod([0.48, 1.05, -0.19 + a], [0.45, 1.38, -0.19 + a], 0.011, "#97a9ad", g);
    kit.rod([0.89, 1.05, -0.19 + a], [0.92, 1.38, -0.19 + a], 0.011, "#97a9ad", g);
  }
  kit.tube(
    [
      [0.45, 1.38, -0.22],
      [0.92, 1.38, -0.22],
      [0.92, 1.38, 0.22],
      [0.45, 1.38, 0.22],
      [0.45, 1.38, -0.22],
    ],
    0.016,
    "#b1bfbc",
    g,
  );
  kit.box([-0.78, 0.97, 0], [0.44, 0.038, 0.25], "#8d9f9e", g);
  kit.rod([-0.1, 0.45, 0], [-0.27, 0.03, 0.24], 0.018, "#a7b0a9", g);
}

function umbrellas(kit: Kit) {
  const g = new THREE.Group();
  g.position.set(2.9, 0.36, 1.95);
  kit.root.add(g);
  kit.box([0, 0.05, 0], [0.56, 0.06, 0.36], "#677d7d", g);
  for (const x of [-0.25, 0.25]) {
    for (const z of [-0.15, 0.15]) kit.rod([x, 0, z], [x, 0.57, z], 0.017, "#b6c1b7", g);
    kit.rod([x, 0.57, -0.15], [x, 0.57, 0.15], 0.018, "#b6c1b7", g);
  }
  for (const z of [-0.15, 0.15]) kit.rod([-0.25, 0.57, z], [0.25, 0.57, z], 0.018, "#b6c1b7", g);
  [-0.16, 0, 0.16].forEach((x, i) => {
    kit.mesh(
      new THREE.ConeGeometry(0.07, 0.66, 7),
      kit.toon(["#acbfc0", "#c79696", "#abc0a4"][i]),
      [x, 0.5, 0],
      g,
    ).rotation.z = Math.PI;
    kit.rod([x, 0.14, 0], [x, 1.04, 0], 0.013, "#d8d8cb", g);
    kit.tube(
      [
        [x, 1, 0],
        [x, 1.12, 0],
        [x + 0.07, 1.14, 0],
        [x + 0.09, 1.04, 0],
      ],
      0.02,
      "#657b80",
      g,
    );
  });
}

function bins(kit: Kit) {
  for (let i = 0; i < 2; i++) {
    const x = 3.81;
    const z = -2.65 - i * 0.66;
    kit.box([x, 0.85, z], [0.57, 0.97, 0.52], "#bdc9bd", undefined, true);
    kit.box([x, 1.35, z], [0.6, 0.085, 0.55], i ? "#849796" : "#6b9a94");
    kit.box([x + 0.292, 1.15, z], [0.014, 0.15, 0.3], "#2a4148");
    const label = kit.sign(
      i ? "缶・びん" : "もえる",
      [x + 0.299, 0.83, z],
      0.36,
      0.17,
      "#dae0cf",
      "#486662",
      undefined,
      110,
    );
    label.rotation.y = Math.PI / 2;
  }
}

function utilityPole(kit: Kit, x: number, z: number, height: number) {
  kit.cylinder([x, height / 2 + 0.34, z], 0.14, height, "#75818a", undefined, 12, 0.105);
  kit.cylinder([x, 0.69, z], 0.2, 0.7, "#5b6971", undefined, 12);
  for (let i = 0; i < 7; i++) {
    const band = kit.box(
      [x, 1 + i * 0.12, z + 0.15],
      [0.25, 0.063, 0.04],
      i % 2 ? "#344653" : "#d6ba79",
    );
    band.rotation.z = -0.22;
  }
  kit.box([x, height + 0.05, z], [1.68, 0.09, 0.12], "#586874");
  for (const offset of [-0.68, 0, 0.68]) {
    kit.cylinder([x + offset, height + 0.24, z], 0.062, 0.3, "#b5c9c2");
    for (let j = 0; j < 3; j++)
      kit.cylinder([x + offset, height + 0.15 + j * 0.07, z], 0.09, 0.032, "#9baeb0");
  }
  kit.cylinder([x + 0.32, height - 0.85, z], 0.24, 0.6, "#81929c");
  kit.cylinder([x + 0.32, height - 0.52, z], 0.27, 0.06, "#9aacb1");
  kit.rod([x, height - 1.2, z], [x + 0.53, height - 1.2, z], 0.04, "#455662");
  for (let i = 0; i < 6; i++)
    kit.rod([x, 2.4 + i * 0.38, z], [x + 0.28, 2.4 + i * 0.38, z], 0.018, "#6d7c83");
}

function streetLamp(kit: Kit) {
  const x = 4.05,
    z = 2.95;
  kit.cylinder([x, 0.51, z], 0.17, 0.35, "#4a6370");
  kit.cylinder([x, 2.51, z], 0.068, 4.13, "#739299");
  kit.tube(
    [
      [x, 4.52, z],
      [x, 4.91, z],
      [x + 0.25, 5.1, z],
      [x + 0.78, 5.09, z],
    ],
    0.065,
    "#739299",
  );
  kit.box([x + 0.78, 5.04, z], [0.6, 0.11, 0.28], "#567580", undefined, true);
  kit.box(
    [x + 0.78, 4.975, z],
    [0.46, 0.017, 0.2],
    new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffe8b4").multiplyScalar(2) }),
  );
  kit.point([x + 0.78, 4.7, z], "#ffe7bb", 12, 8);
  kit.box([x, 2.48, z + 0.04], [0.8, 0.37, 0.06], "#607f88", undefined, true);
  kit.sign("雨宿り横丁", [x, 2.49, z + 0.078], 0.75, 0.24, "#607f88", "#e1eadb", undefined, 130);
}

function guardrail(kit: Kit, x: number, z: number, length: number, angle = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0.35, z);
  g.rotation.y = angle;
  kit.root.add(g);
  for (const px of [-length / 2, length / 2]) {
    kit.cylinder([px, 0.07, 0], 0.1, 0.13, "#667982", g);
    kit.cylinder([px, 0.49, 0], 0.036, 0.94, "#afc2bd", g);
  }
  for (const y of [0.45, 0.91])
    kit.rod([-length / 2, y, 0], [length / 2, y, 0], 0.037, "#b4c6bc", g);
  for (const px of [-length / 2, length / 2])
    kit.box([px, 0.79, 0.04], [0.066, 0.1, 0.015], "#e5c495", g);
}

function alleyDetails(kit: Kit) {
  kit.box([-5.03, 0.8, -4.18], [0.89, 0.8, 0.47], "#acb5ae", undefined, true);
  const fan = kit.cylinder([-5.03, 0.81, -3.93], 0.27, 0.03, "#637779", undefined, 24);
  fan.rotation.x = Math.PI / 2;
  for (let i = 0; i < 9; i++)
    kit.rod([-5.29, 0.6 + i * 0.053, -3.905], [-4.77, 0.6 + i * 0.053, -3.905], 0.009, "#a9bcb7");
  kit.tube(
    [
      [-4.68, 0.8, -4.15],
      [-4.52, 0.8, -4.15],
      [-4.51, 1.9, -4.15],
      [-4.4, 1.9, -4.15],
    ],
    0.04,
    "#a5bcb2",
  );
  kit.box([-6.25, 0.9, -5.7], [1.0, 1.1, 0.14], "#647579", undefined, true);
  kit.sign(
    "町内のお知らせ",
    [-6.25, 1.38, -5.61],
    0.88,
    0.15,
    "#a4b5aa",
    "#334e51",
    undefined,
    100,
  );
  for (let i = 0; i < 4; i++) {
    kit.sign(
      ["夏まつり", "花火", "回覧板", "お知らせ"][i],
      [-6.48 + (i % 2) * 0.43, 0.7 + Math.floor(i / 2) * 0.36, -5.615],
      0.36,
      0.3,
      ["#d3c0a0", "#b8cfc4", "#bba6a6", "#bdc9cf"][i],
      "#59636b",
      undefined,
      90,
    );
  }
  kit.box([-6.7, 0.55, -4.9], [0.5, 0.36, 0.5], "#bb927c", undefined, true);
  for (let i = 0; i < 5; i++) {
    const leaf = kit.mesh(
      new THREE.SphereGeometry(0.24, 6, 4),
      kit.toon(i % 2 ? "#748f87" : "#577b76"),
      [-6.7 + Math.sin(i * 2) * 0.16, 0.9 + i * 0.045, -4.9 + Math.cos(i * 2) * 0.15],
    );
    leaf.scale.y = 1.6;
  }
}

export function buildStreet(kit: Kit): void {
  kit.box([0, -0.3, 0], [15, 0.72, 15], "#243645", undefined, true);
  kit.box([0, 0.072, 0], [15, 0.08, 15], "#879294");
  kit.box([0, 0.115, 0], [14.97, 0.04, 14.97], "#374954");
  kit.box([-0.96, 0.24, -1.28], [10.58, 0.2, 9.54], "#7d8c8d", undefined, true);
  const sidewalkColors = ["#869898", "#8d9a96", "#83928f", "#8a9795"];
  for (let x = -6; x < 4; x += 0.57) {
    for (let z = -5.8; z < 3.3; z += 0.57) {
      if (x > -4.5 && x < 3.3 && z > -4.8 && z < 1.3) continue;
      kit.box(
        [x, 0.346, z],
        [0.55, 0.016, 0.55],
        sidewalkColors[Math.abs(Math.round(x * 17 + z * 13)) % 4],
      );
    }
  }
  for (let x = -6.0; x <= 4.0; x += 0.64) {
    kit.box([x, 0.29, 3.47], [0.615, 0.21, 0.2], "#b4bcb4", undefined, true);
  }
  for (let z = -5.8; z < 3.4; z += 0.64) {
    kit.box([4.26, 0.29, z], [0.2, 0.21, 0.615], "#b4bcb4", undefined, true);
  }
  // An L-shaped drain traces the corner instead of letting the street read as a flat plaza.
  kit.box([-0.95, 0.15, 3.68], [10.65, 0.019, 0.19], "#233640");
  kit.box([4.47, 0.15, -1.12], [0.18, 0.019, 9.81], "#233640");
  for (let x = -6.2; x < 4.4; x += 0.22) kit.box([x, 0.164, 3.68], [0.042, 0.025, 0.16], "#677e82");
  for (let z = -6; z < 3.7; z += 0.22) kit.box([4.47, 0.164, z], [0.16, 0.025, 0.042], "#677e82");
  const white = "#b5c8c4";
  for (let i = 0; i < 7; i++) kit.box([0.3, 0.16, 4.1 + i * 0.46], [2.5, 0.014, 0.25], white);
  for (let i = 0; i < 6; i++) kit.box([4.7 + i * 0.46, 0.16, -0.55], [0.25, 0.014, 1.9], white);
  kit.box([-4.08, 0.16, 6.8], [3.35, 0.014, 0.075], "#9cafb3");
  for (const x of [-5.72, -2.45]) kit.box([x, 0.16, 5.36], [0.075, 0.014, 2.85], "#9cafb3");
  kit.box([-4.12, 0.23, 4.48], [1.2, 0.17, 0.24], "#85918f", undefined, true);
  for (const x of [-4.6, -3.64]) kit.box([x, 0.322, 4.48], [0.1, 0.012, 0.24], "#d5c28e");
  const parking = kit.sign(
    "P",
    [-4.1, 0.172, 5.6],
    0.66,
    0.73,
    "#374954",
    "#a7bcbd",
    undefined,
    760,
  );
  parking.rotation.x = -Math.PI / 2;
  for (let x = -6.8; x < 7; x += 1.4) {
    if (x > -1.3 && x < 1.7) continue;
    kit.box([x, 0.161, 7.06], [0.68, 0.015, 0.045], "#c5be9f");
  }
  const manhole = kit.cylinder([5.9, 0.165, 4.82], 0.46, 0.03, "#293f4b", undefined, 40);
  manhole.receiveShadow = true;
  for (let i = -4; i <= 4; i++) {
    const len = Math.sqrt(0.4 ** 2 - (i * 0.083) ** 2) * 2;
    kit.box([5.9, 0.183, 4.82 + i * 0.083], [len, 0.012, 0.012], "#5c727a");
  }
  const rim = kit.torus([5.9, 0.189, 4.82], 0.41, 0.012, "#819597");
  rim.rotation.x = -Math.PI / 2;
  vendingMachine(kit, -5.48, 0.85);
  bicycle(kit, -3.65, 2.73);
  umbrellas(kit);
  bins(kit);
  alleyDetails(kit);
  guardrail(kit, -5.2, 3.24, 1.5);
  guardrail(kit, 3.97, 0.7, 1.6, Math.PI / 2);
  guardrail(kit, 3.97, -4.8, 1.6, Math.PI / 2);
  streetLamp(kit);
  utilityPole(kit, -6.15, 3.05, 6.8);
  utilityPole(kit, 4.1, -5.7, 6.2);
  for (const offset of [-0.6, 0, 0.6]) {
    kit.tube(
      [
        [-6.15 + offset, 7.2, 3.05],
        [-3.1 + offset, 6.48, 0.1],
        [0.8 + offset, 6.07, -3.2],
        [4.1 + offset, 6.6, -5.7],
      ],
      0.014,
      "#223642",
    );
  }
  kit.tube(
    [
      [-6.15, 6.03, 3.05],
      [-5.75, 5.53, -0.3],
      [-4.34, 4.44, -1.2],
    ],
    0.025,
    "#263b47",
  );
  kit.box([-6.15, 2.5, 3.07], [0.42, 0.65, 0.12], "#526d79", undefined, true);
  kit.sign(
    "雨宿り\n一丁目",
    [-6.15, 2.52, 3.141],
    0.35,
    0.46,
    "#526d79",
    "#dce4d1",
    undefined,
    120,
  );
  // A small real street sign, not an interface label.
  kit.cylinder([6.8, 1.52, 0.95], 0.036, 2.8, "#9bacb3");
  const stop = kit.mesh(new THREE.CircleGeometry(0.34, 3), kit.toon("#c37d7b"), [6.8, 2.7, 0.95]);
  stop.rotation.z = Math.PI;
  kit.sign("止まれ", [6.8, 2.73, 0.961], 0.39, 0.17, "#c37d7b", "#f0e2c6", undefined, 180);
  for (const z of [-2.5, -5.0]) {
    kit.box([7.04, 0.161, z], [0.045, 0.015, 0.7], "#b8bdaa");
  }
}
