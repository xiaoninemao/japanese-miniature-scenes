import * as THREE from "three";
import { Kit, type XYZ } from "./kit.ts";

const snowColor = "#cfdeeb";
const shadowSnow = "#b0c4d8";
const iron = "#445367";
const timber = "#60534f";

function snow(kit: Kit, position: XYZ, size: XYZ, parent = kit.root) {
  const mesh = kit.mesh(new THREE.SphereGeometry(1, 12, 7), kit.toon(snowColor), position, parent);
  mesh.scale.set(...size);
  return mesh;
}

function tree(kit: Kit, x: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, 0.32, z);
  kit.root.add(g);
  kit.cylinder([0, 1.55, 0], 0.16, 3.1, "#645d65", g, 7, 0.095);
  const limbs: [XYZ, XYZ, number][] = [
    [[0, 1.4, 0], [-0.9, 2.65, 0.1], 0.08],
    [[-0.9, 2.65, 0.1], [-1.32, 3.25, 0.1], 0.04],
    [[-0.65, 2.25, 0.05], [-1.48, 2.63, -0.25], 0.035],
    [[0, 2.2, 0], [0.8, 3.28, 0.18], 0.066],
    [[0.8, 3.28, 0.18], [1.35, 3.72, 0.1], 0.035],
    [[0.8, 3.28, 0.18], [0.83, 4, 0.38], 0.03],
    [[0, 2.8, 0], [-0.28, 4, -0.17], 0.055],
    [[-0.2, 3.65, -0.1], [-0.76, 4.14, -0.25], 0.026],
    [[-0.28, 4, -0.17], [0.04, 4.55, -0.28], 0.021],
    [[0, 2.3, 0], [0.25, 3, -0.95], 0.055],
    [[0.25, 3, -0.95], [0.65, 3.65, -1.2], 0.028],
  ];
  for (const [a, b, radius] of limbs) {
    kit.rod(a, b, radius, "#726774", g);
    const upperA: XYZ = [a[0], a[1] + radius, a[2]];
    const upperB: XYZ = [b[0], b[1] + radius, b[2]];
    kit.rod(upperA, upperB, radius * 0.62, snowColor, g);
  }
  snow(kit, [0, 0.08, 0], [0.77, 0.23, 0.71], g);
  kit.cylinder([0, 0.18, 0], 0.6, 0.19, "#788796", g, 12);
}

function pine(kit: Kit, x: number, z: number, height: number) {
  kit.cylinder([x, 0.9, z], 0.14, 1.5, timber, undefined, 8);
  for (let i = 0; i < 4; i++) {
    const radius = (1 - i * 0.19) * height * 0.31;
    const y = 0.86 + i * height * 0.205;
    const green = kit.mesh(new THREE.ConeGeometry(radius, height * 0.43, 9), kit.toon("#526c70"), [
      x,
      y,
      z,
    ]);
    green.rotation.y = i * 0.2;
    const cap = kit.mesh(
      new THREE.ConeGeometry(radius * 0.95, height * 0.38, 9),
      kit.toon(snowColor),
      [x, y + 0.13, z],
    );
    cap.rotation.y = i * 0.2;
  }
  snow(kit, [x, 0.33, z], [0.85, 0.23, 0.7]);
}

function bicycle(kit: Kit) {
  const g = new THREE.Group();
  g.position.set(-4.8, 0.37, 2.45);
  g.rotation.y = -0.15;
  g.rotation.z = -0.075;
  kit.root.add(g);
  for (const x of [-0.64, 0.64]) {
    kit.torus([x, 0.44, 0], 0.42, 0.049, "#2b3544", g);
    kit.torus([x, 0.44, 0], 0.36, 0.015, "#b5c1c9", g);
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5;
      kit.rod(
        [x, 0.44, 0],
        [x + Math.cos(a) * 0.35, 0.44 + Math.sin(a) * 0.35, 0],
        0.006,
        "#acb7c6",
        g,
      );
    }
    snow(kit, [x, 0.84, 0], [0.26, 0.07, 0.07], g);
  }
  const joints: [XYZ, XYZ][] = [
    [
      [-0.64, 0.44, 0],
      [-0.28, 1.05, 0],
    ],
    [
      [-0.64, 0.44, 0],
      [-0.04, 0.39, 0],
    ],
    [
      [-0.28, 1.05, 0],
      [-0.04, 0.39, 0],
    ],
    [
      [-0.28, 1.05, 0],
      [0.43, 1.08, 0],
    ],
    [
      [-0.04, 0.39, 0],
      [0.43, 1.08, 0],
    ],
    [
      [0.43, 1.08, 0],
      [0.64, 0.44, 0],
    ],
  ];
  joints.forEach(([a, b]) => kit.rod(a, b, 0.026, "#b28a78", g));
  kit.rod([-0.28, 1, 0], [-0.33, 1.2, 0], 0.024, "#adb7be", g);
  kit.box([-0.36, 1.23, 0], [0.31, 0.08, 0.2], "#403d46", g);
  snow(kit, [-0.36, 1.28, 0], [0.18, 0.06, 0.12], g);
  kit.tube(
    [
      [0.43, 1.05, 0],
      [0.38, 1.35, 0],
      [0.32, 1.36, 0.24],
    ],
    0.024,
    "#adb7be",
    g,
  );
  kit.rod([0.32, 1.36, -0.23], [0.32, 1.36, 0.23], 0.025, "#c4cbd2", g);
  kit.torus([-0.04, 0.39, 0], 0.12, 0.02, "#afb5b6", g);
  kit.box([0.64, 1.06, 0], [0.38, 0.034, 0.36], "#77858e", g);
  for (let i = 0; i < 6; i++) {
    for (const z of [-0.18, 0.18])
      kit.rod([0.46 + i * 0.074, 1.07, z], [0.46 + i * 0.074, 1.4, z * 1.2], 0.012, "#8e9da7", g);
    kit.rod([0.45, 1.07, -0.18 + i * 0.072], [0.42, 1.4, -0.18 + i * 0.072], 0.012, "#8e9da7", g);
  }
  snow(kit, [0.64, 1.16, 0], [0.19, 0.07, 0.18], g);
  kit.rod([-0.1, 0.4, 0], [-0.3, 0, 0.3], 0.02, iron, g);
}

function bench(kit: Kit) {
  const g = new THREE.Group();
  g.position.set(-1.75, 0.36, 2.8);
  kit.root.add(g);
  for (const x of [-0.72, 0.72]) {
    kit.box([x, 0.24, 0], [0.09, 0.48, 0.55], iron, g);
    kit.rod([x, 0.2, -0.25], [x, 1.01, -0.25], 0.035, iron, g);
  }
  for (let i = 0; i < 4; i++)
    kit.box([0, 0.52, -0.21 + i * 0.14], [1.85, 0.07, 0.12], "#a48670", g);
  for (const y of [0.76, 0.97]) kit.box([0, y, -0.27], [1.85, 0.14, 0.06], "#9c7b69", g);
  snow(kit, [-0.58, 0.59, 0], [0.32, 0.055, 0.24], g);
  snow(kit, [0.05, 1.055, -0.27], [0.92, 0.055, 0.077], g);
}

function menuBoard(kit: Kit) {
  const g = new THREE.Group();
  g.position.set(2.9, 0.36, 2.8);
  g.rotation.y = -0.18;
  kit.root.add(g);
  for (const x of [-0.42, 0.42]) {
    kit.rod([x, 0, 0.35], [x, 1.45, -0.02], 0.035, "#99765c", g);
    kit.rod([x, 0, -0.45], [x, 1.45, -0.02], 0.035, "#99765c", g);
  }
  kit.box([0, 0.91, 0.11], [0.91, 1.13, 0.06], "#755b4e", g, true);
  const texture = kit.paint(512, 640, (ctx) => {
    ctx.fillStyle = "#293b43";
    ctx.fillRect(0, 0, 512, 640);
    ctx.strokeStyle = "#c3b9a0";
    ctx.lineWidth = 3;
    ctx.strokeRect(17, 17, 478, 606);
    ctx.fillStyle = "#f2d5a2";
    ctx.textAlign = "center";
    ctx.font = '600 57px "Hiragino Sans",sans-serif';
    ctx.fillText("おしながき", 256, 94);
    ctx.font = '40px "Hiragino Sans",sans-serif';
    ["醤油らーめん", "味噌らーめん", "餃子 ・ ごはん"].forEach((s, i) =>
      ctx.fillText(s, 256, 178 + i * 74),
    );
    ctx.strokeStyle = "#d8bda0";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.ellipse(256, 461, 118, 41, 0, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(256, 443, 118, 25, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#cd9882";
    ctx.font = '33px "Hiragino Sans",sans-serif';
    ctx.fillText("あたたかい一杯を", 256, 571);
  });
  kit.mesh(
    new THREE.PlaneGeometry(0.82, 1.02),
    new THREE.MeshBasicMaterial({ map: texture }),
    [0, 0.92, 0.146],
    g,
  );
  snow(kit, [0, 1.51, 0.07], [0.5, 0.072, 0.12], g);
}

function lamp(kit: Kit) {
  const x = 4.55,
    z = 3.08;
  kit.cylinder([x, 0.49, z], 0.19, 0.27, iron);
  kit.cylinder([x, 2.05, z], 0.065, 3.15, iron);
  kit.box([x, 3.72, z], [0.57, 0.76, 0.57], kit.basic("#f8d28f"));
  for (const dx of [-0.3, 0.3]) {
    for (const dz of [-0.3, 0.3])
      kit.rod([x + dx, 3.28, z + dz], [x + dx, 4.15, z + dz], 0.03, iron);
  }
  for (const y of [3.3, 4.12]) kit.box([x, y, z], [0.69, 0.07, 0.69], iron);
  kit.mesh(new THREE.ConeGeometry(0.62, 0.28, 4), kit.toon(iron), [x, 4.28, z]).rotation.y =
    Math.PI / 4;
  snow(kit, [x, 4.36, z], [0.46, 0.16, 0.46]);
  kit.point([x, 3.7, z], "#ffd292", 15, 7);
  kit.sign("雪灯り横丁", [x, 2.67, z + 0.065], 0.95, 0.27, "#536178", "#e0e2d9", undefined, 140);
}

function backDetails(kit: Kit) {
  kit.box([-4.27, 1.05, -2.5], [0.58, 1.14, 0.82], "#949da6", undefined, true);
  for (let i = 0; i < 11; i++)
    kit.box([-4.57, 0.7 + i * 0.065, -2.5], [0.025, 0.025, 0.65], "#566579");
  snow(kit, [-4.27, 1.64, -2.5], [0.4, 0.12, 0.49]);
  kit.tube(
    [
      [-4.3, 1, -2.9],
      [-4.2, 1.4, -3.1],
      [-4.0, 2.4, -3.1],
    ],
    0.04,
    "#92999c",
  );
  for (let i = 0; i < 2; i++) {
    kit.cylinder([3.68, 0.84, -3.2 - i * 0.6], 0.2, 0.92, "#8d9ea7", undefined, 16);
    kit.cylinder([3.68, 1.34, -3.2 - i * 0.6], 0.12, 0.11, "#53667b");
    snow(kit, [3.68, 1.41, -3.2 - i * 0.6], [0.18, 0.045, 0.18]);
  }
  kit.box([-4.6, 0.62, -0.6], [0.57, 0.45, 0.68], "#9a634f", undefined, true);
  kit.box([-4.6, 0.87, -0.6], [0.5, 0.06, 0.6], "#b68766");
  for (let i = 0; i < 7; i++)
    kit.cylinder(
      [-4.79 + (i % 3) * 0.17, 0.92, -0.84 + Math.floor(i / 3) * 0.18],
      0.053,
      0.26,
      "#787560",
    );
  kit.box([-5.26, 0.75, -0.25], [0.33, 0.57, 0.27], "#b67260", undefined, true);
  kit.tube(
    [
      [-5.36, 1.06, -0.25],
      [-5.36, 1.15, -0.25],
      [-5.14, 1.15, -0.25],
      [-5.14, 1.06, -0.25],
    ],
    0.025,
    "#adb6bc",
  );
  snow(kit, [-5.26, 1.06, -0.25], [0.18, 0.045, 0.14]);
  // A short snowy rear garden wall closes the miniature without using a backdrop.
  for (let i = 0; i < 11; i++) {
    kit.box([-5.9 + i * 0.88, 0.8, -5.38], [0.84, 0.97, 0.18], "#767e8b");
    snow(kit, [-5.9 + i * 0.88, 1.31, -5.38], [0.46, 0.08, 0.15]);
  }
}

export function buildStreet(kit: Kit): void {
  kit.box([0, -0.27, 0], [15, 0.7, 15], "#3c485f", undefined, true);
  kit.box([0, 0.085, 0], [15, 0.045, 15], "#849bb3");
  kit.box([0, 0.13, 0], [14.98, 0.06, 14.98], "#ccdceb");
  kit.box([-0.85, 0.23, -1.23], [10.9, 0.21, 9.75], "#a7b9cc", undefined, true);
  kit.box([-0.85, 0.35, -1.23], [10.9, 0.035, 9.75], shadowSnow);
  kit.box([0, 0.178, 5.5], [14.96, 0.017, 3.2], "#53627b");
  kit.box([5.74, 0.179, -1.32], [2.6, 0.018, 10.35], "#53627b");
  // Shovelled paving makes a legible route to the warm entrance.
  for (let x = -5.9; x < 4.35; x += 0.51) {
    for (let z = 1.73; z < 3.58; z += 0.46) {
      kit.box(
        [x, 0.38, z],
        [0.485, 0.055, 0.433],
        Math.round(x * 7 + z * 5) % 3 ? "#858b97" : "#959aa3",
      );
    }
  }
  for (let z = -4.9; z < 3.4; z += 0.52) kit.box([3.89, 0.38, z], [0.95, 0.055, 0.49], "#8d96a2");
  for (let i = 0; i < 24; i++) {
    const x = -6.94 + i * 0.602;
    snow(kit, [x, 0.18, 7.01], [0.57, 0.13 + Math.sin(i * 2) * 0.05, 0.44]);
    snow(kit, [x, 0.37, 3.79], [0.48, 0.16 + Math.sin(i) * 0.065, 0.26]);
    if (i < 17) snow(kit, [4.45, 0.32, -6.6 + i * 0.6], [0.3, 0.16, 0.48]);
  }
  for (let i = 0; i < 19; i++) {
    snow(kit, [-6.35, 0.38, -6.18 + i * 0.52], [0.46 + Math.sin(i) * 0.1, 0.19, 0.5]);
  }
  for (let i = 0; i < 17; i++) snow(kit, [-5.9 + i * 0.55, 0.38, -5.9], [0.5, 0.15, 0.52]);
  // Thin slushy wheel tracks, not a broad unbroken mirror.
  for (const z of [4.7, 5.95]) {
    for (let i = 0; i < 36; i++) {
      kit.box([-7.25 + i * 0.41, 0.192, z], [0.32, 0.006, 0.16], i % 3 ? "#71829a" : "#7d8ea4");
    }
  }
  for (let i = 0; i < 6; i++)
    kit.box([2.0, 0.198, 4.15 + i * 0.44], [1.65, 0.012, 0.24], "#bdc9d3");
  const manhole = kit.cylinder([-2.95, 0.203, 5.28], 0.43, 0.022, "#38495c", undefined, 32);
  manhole.receiveShadow = true;
  for (let i = -3; i <= 3; i++)
    kit.box([-2.95, 0.22, 5.28 + i * 0.1], [0.5, 0.01, 0.012], "#798896");
  for (let i = 0; i < 10; i++) {
    const x = 1.86 + Math.sin(i * 0.33) * 0.36 + (i % 2 ? 0.14 : -0.14);
    const foot = kit.mesh(new THREE.CircleGeometry(1, 12), kit.toon("#7e91a5"), [
      x,
      i < 5 ? 0.387 : 0.201,
      2.3 + i * 0.33,
    ]);
    foot.rotation.x = -Math.PI / 2;
    foot.rotation.z = i % 2 ? 0.19 : -0.19;
    foot.scale.set(0.065, 0.14, 1);
  }
  bicycle(kit);
  bench(kit);
  menuBoard(kit);
  lamp(kit);
  tree(kit, 5.48, -3.65);
  pine(kit, -5.2, -4.6, 3.0);
  pine(kit, -5.85, -3.25, 2.15);
  backDetails(kit);
  kit.cylinder([-2.75, 5.05, -3.4], 0.13, 1.45, "#798796", undefined, 16);
  kit.cylinder([-2.75, 5.78, -3.4], 0.18, 0.06, "#4c5b70", undefined, 16);
  kit.cylinder([-2.75, 5.817, -3.4], 0.11, 0.015, "#303e51", undefined, 16);
  snow(kit, [-2.75, 4.46, -3.4], [0.32, 0.14, 0.3]);
  const poleX = -5.65,
    poleZ = 3.18;
  kit.cylinder([poleX, 3.5, poleZ], 0.12, 6.25, "#6d6d7b", undefined, 12, 0.085);
  kit.cylinder([poleX, 0.83, poleZ], 0.18, 0.92, "#4b5b6e");
  kit.box([poleX, 6.35, poleZ], [1.38, 0.11, 0.15], "#687389");
  snow(kit, [poleX, 6.43, poleZ], [0.78, 0.06, 0.12]);
  for (const dx of [-0.54, 0.54]) {
    kit.cylinder([poleX + dx, 6.55, poleZ], 0.055, 0.28, "#c2cdd2");
    kit.tube(
      [
        [poleX + dx, 6.67, poleZ],
        [-5.9 + dx, 6, -0.5],
        [-5.15 + dx, 5.9, -5.25],
      ],
      0.014,
      "#354256",
    );
  }
  kit.cylinder([-5.15, 3.18, -5.25], 0.1, 5.72, "#6d6d7b", undefined, 10);
  kit.box([-5.15, 6.03, -5.25], [1.38, 0.11, 0.15], "#687389");
  for (let i = 0; i < 5; i++)
    kit.box([poleX, 1 + i * 0.14, poleZ + 0.14], [0.2, 0.06, 0.025], i % 2 ? "#a9a18b" : "#3b4d61");
  snow(kit, [poleX, 0.38, poleZ], [0.43, 0.18, 0.35]);
  for (let i = 0; i < 4; i++) {
    kit.cylinder([4.35, 0.79, 0.45 - i * 0.85], 0.04, 0.85, "#828e9b");
    snow(kit, [4.35, 1.24, 0.45 - i * 0.85], [0.074, 0.07, 0.074]);
    if (i < 3)
      kit.tube(
        [
          [4.35, 1.02, 0.45 - i * 0.85],
          [4.35, 0.83, 0.02 - i * 0.85],
          [4.35, 1.02, -0.4 - i * 0.85],
        ],
        0.017,
        "#adb6bc",
      );
  }
  const shovel = new THREE.Group();
  shovel.position.set(-3.65, 0.42, 1.92);
  shovel.rotation.z = -0.18;
  kit.root.add(shovel);
  kit.box([0, 0.15, 0], [0.32, 0.36, 0.055], "#8494a7", shovel);
  kit.rod([0, 0.25, 0], [0, 1.28, 0], 0.025, "#b9a080", shovel);
  kit.torus([0, 1.33, 0], 0.087, 0.02, "#778796", shovel);
}
