import * as THREE from "three";
import { Kit, type XYZ } from "./kit.ts";

export function buildStore(kit: Kit): void {
  const timber = "#493026";
  const trim = "#72503a";
  const wood = kit.toon("#b87e48", 0.2);
  const plaster = kit.toon("#e6d6ae", 0.22);
  const cream = kit.toon("#fff0ca", 0.3);
  const iron = "#34383b";
  const steel = kit.toon("#a5aca8", 0.15);
  const red = kit.toon("#aa392b", 0.2);
  const snow = kit.toon("#edf5ff", 0.12);
  const sphere = new THREE.SphereGeometry(1, 16, 10);
  const blob = (p: XYZ, scale: XYZ, material: THREE.Material) => {
    const mesh = kit.mesh(sphere, material, p);
    mesh.scale.set(...scale);
    return mesh;
  };
  const ring = (p: XYZ, radius: number, thickness: number, color: string) => {
    const mesh = kit.torus(p, radius, thickness, color);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  };
  const glass = new THREE.MeshBasicMaterial({
    color: "#d4efff",
    transparent: true,
    opacity: 0.04,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mist = new THREE.MeshBasicMaterial({
    color: "#eff9ff",
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  const windowPane = (p: XYZ, size: XYZ) => {
    const pane = kit.box(p, size, glass);
    pane.castShadow = false;
    pane.receiveShadow = false;
    const edge: XYZ = size[0] > size[2] ? [size[0], 0.035, 0.006] : [0.006, 0.035, size[2]];
    const fog = kit.box([p[0], p[1] - size[1] / 2 + 0.025, p[2]], edge, mist);
    fog.castShadow = false;
  };

  // Open glazing keeps the counter and the entire working kitchen visible.
  kit.box([-0.4, 0.35, -1.4], [7.15, 0.22, 5.95], "#62635e");
  kit.box([-0.4, 0.445, -1.4], [7.0, 0.03, 5.7], wood);
  for (let z = -4.1; z < 1.45; z += 0.29) {
    kit.box([-0.4, 0.466, z], [6.95, 0.012, 0.012], "#876043");
  }
  kit.box([-0.4, 2.06, -4.25], [7, 3.2, 0.16], plaster);
  kit.box([-3.85, 2.05, -1.42], [0.14, 3.18, 5.68], plaster);
  kit.box([-0.4, 0.79, 1.42], [7.0, 0.65, 0.15], timber);
  kit.box([3.08, 0.79, -1.4], [0.16, 0.65, 5.7], timber);
  for (let x = -3.8; x < 1.45; x += 0.22) {
    kit.box([x, 0.8, 1.512], [0.12, 0.59, 0.025], trim);
  }
  for (let z = -4.12; z < 1.4; z += 0.24) {
    kit.box([3.18, 0.8, z], [0.025, 0.58, 0.13], trim);
  }
  for (const x of [-3.82, 1.39, 3.08]) {
    kit.box([x, 2.08, 1.45], [0.15, 3.24, 0.17], timber);
  }
  for (const z of [-4.23, -2.42, -0.48, 1.44]) {
    kit.box([3.08, 2.09, z], [0.16, 3.25, 0.12], timber);
    kit.box([-3.79, 2.09, z], [0.16, 3.25, 0.12], timber);
  }
  for (const z of [-4.22, 1.45]) {
    kit.box([-0.37, 3.48, z], [7.11, 0.44, 0.2], timber);
    kit.box([-0.37, 1.12, z], [7.08, 0.1, 0.2], trim);
  }
  kit.box([3.08, 3.48, -1.39], [0.19, 0.44, 5.83], timber);
  kit.box([3.1, 1.13, -1.39], [0.2, 0.09, 5.82], trim);
  for (const x of [-3.11, -1.64, -0.16, 0.97]) {
    const width = x === 0.97 ? 0.72 : 1.38;
    windowPane([x, 2.17, 1.445], [width, 2.0, 0.018]);
  }
  for (const x of [-2.39, -0.9, 0.6]) {
    kit.box([x, 2.17, 1.49], [0.045, 2.1, 0.06], timber);
  }
  for (const z of [-3.32, -1.46, 0.47]) {
    windowPane([3.09, 2.17, z], [0.018, 2.0, 1.78]);
    kit.box([3.135, 2.84, z], [0.055, 0.035, 1.8], trim);
  }
  kit.box([-1.23, 2.84, 1.49], [5.15, 0.04, 0.055], trim);

  // The sliding entry is framed separately from the low window wainscot.
  kit.box([2.18, 0.49, 1.66], [1.53, 0.1, 0.56], "#a8a498");
  kit.box([2.17, 0.57, 1.47], [1.39, 0.08, 0.12], iron);
  kit.box([2.17, 0.88, 1.535], [1.3, 0.6, 0.055], wood);
  windowPane([2.17, 1.99, 1.53], [1.29, 1.6, 0.02]);
  for (const x of [1.48, 2.17, 2.86]) {
    kit.box([x, 1.76, 1.56], [0.055, 2.43, 0.055], timber);
  }
  kit.box([2.17, 2.94, 1.54], [1.44, 0.08, 0.1], timber);
  kit.rod([2.32, 1.5, 1.63], [2.32, 1.88, 1.63], 0.022, "#a38a57");
  kit.rod([1.37, 3.11, 1.7], [2.98, 3.11, 1.7], 0.026, timber);
  for (let i = 0; i < 4; i++) {
    const x = 1.58 + i * 0.385;
    kit.box([x, 2.89, 1.7], [0.365, 0.43, 0.025], "#263a59");
    kit.box([x, 2.68, 1.714], [0.355, 0.025, 0.012], "#516278");
    if (i === 1 || i === 2) {
      kit.sign(
        i === 1 ? "雪" : "灯",
        [x, 2.91, 1.72],
        0.25,
        0.25,
        "#263a59",
        "#eadbb4",
        undefined,
        680,
      );
    }
  }
  kit.box([-0.75, 3.48, 1.595], [4.9, 0.51, 0.14], "#bd915c");
  kit.box([-0.75, 3.48, 1.674], [4.75, 0.41, 0.018], cream);
  kit.sign("雪灯り", [-1.64, 3.48, 1.689], 2.74, 0.36, "#fff0ca", "#352b25", undefined, 116);
  kit.sign("らーめん", [0.51, 3.47, 1.69], 1.47, 0.3, "#fff0ca", "#352b25", undefined, 165);
  for (const x of [-3.05, 1.55]) {
    kit.cylinder([x, 3.49, 1.7], 0.018, 0.016, "#543d2e").rotation.x = Math.PI / 2;
  }

  const gable = new THREE.Shape();
  gable.moveTo(-4.64, 3.72);
  gable.lineTo(1.76, 3.72);
  gable.lineTo(-1.4, 4.87);
  gable.closePath();
  for (const x of [-3.86, 3.1]) {
    const mesh = kit.mesh(new THREE.ShapeGeometry(gable), plaster, [x, 0, 0]);
    mesh.rotation.y = -Math.PI / 2;
    mesh.material = new THREE.MeshToonMaterial({ color: "#e6d6ae", side: THREE.DoubleSide });
    kit.rod([x, 3.77, -4.39], [x, 4.9, -1.4], 0.065, timber);
    kit.rod([x, 4.9, -1.4], [x, 3.77, 1.45], 0.065, timber);
    kit.rod([x, 3.8, -1.4], [x, 4.88, -1.4], 0.06, timber);
  }
  // Each continuous snow slab follows the pitch; soft edge caps hide hard seams.
  for (const [end, rise] of [
    [1.76, 1.05],
    [-4.64, 1.05],
  ]) {
    const dz = end - -1.4;
    const angle = Math.atan2(rise, Math.abs(dz)) * Math.sign(dz);
    const center: XYZ = [-0.39, 4.435, (-1.4 + end) / 2];
    const roof = kit.box(center, [7.88, 0.19, Math.hypot(dz, rise)], timber);
    roof.rotation.x = angle;
    const cap = kit.box(
      [center[0], center[1] + 0.13, center[2]],
      [7.97, 0.23, Math.hypot(dz, rise) + 0.04],
      snow,
    );
    cap.rotation.x = angle;
    for (let x = -4.17; x <= 3.4; x += 0.26) {
      blob([x, 4.01 + Math.sin(x * 7) * 0.012, end], [0.22, 0.17, 0.15], snow);
    }
    for (const x of [-4.26, 3.48]) {
      for (let i = 0; i < 12; i++) {
        const t = i / 11;
        blob([x, 5.1 - rise * t, -1.4 + dz * t], [0.11, 0.14, 0.15], snow);
      }
    }
  }
  for (let x = -4.15; x < 3.45; x += 0.3) {
    blob([x, 5.1, -1.4], [0.25, 0.17, 0.22], snow);
  }
  for (const x of [-3.6, -2.8, -0.2, 0.3, 2.62]) {
    kit.cylinder([x, 3.81, 1.79], 0.012, 0.2, "#d8e8f3", undefined, 6, 0.04);
  }

  for (const x of [-3.4, 2.9]) {
    kit.rod([x, 3.73, 1.63], [x, 3.0, 1.7], 0.016, iron);
    blob([x, 2.63, 1.7], [0.25, 0.4, 0.245], kit.toon("#df4a34", 0.3));
    for (let i = 0; i < 9; i++) {
      const y = 2.31 + i * 0.079;
      const radius = 0.25 * Math.sqrt(1 - Math.pow((y - 2.63) / 0.42, 2));
      ring([x, y, 1.7], radius, 0.009, "#8d3026");
    }
    for (const y of [2.23, 3.03]) {
      kit.cylinder([x, y, 1.7], 0.125, 0.07, iron);
    }
    const label = kit.paint(128, 512, (ctx) => {
      ctx.fillStyle = "#27221c";
      ctx.textAlign = "center";
      ctx.font = 'bold 96px "Hiragino Mincho ProN", serif';
      ["ら", "ー", "め", "ん"].forEach((char, i) => ctx.fillText(char, 64, 110 + i * 115));
    });
    const ink = new THREE.MeshBasicMaterial({ map: label, transparent: true, depthWrite: false });
    kit.mesh(new THREE.PlaneGeometry(0.15, 0.57), ink, [x, 2.63, 1.949]);
    kit.rod([x, 2.2, 1.7], [x, 2.06, 1.7], 0.017, "#c29858");
  }

  kit.box([-0.78, 0.99, -0.15], [4.3, 1.05, 0.65], timber);
  kit.box([-0.78, 1.49, -0.15], [4.48, 0.15, 0.87], wood);
  kit.box([1.39, 0.99, -1.45], [0.64, 1.05, 2.7], timber);
  kit.box([1.4, 1.49, -1.45], [0.86, 0.15, 2.77], wood);
  kit.box([-0.78, 1.564, 0.245], [4.48, 0.018, 0.04], "#e5b273");
  for (let x = -2.83; x < 1.4; x += 0.21) {
    kit.box([x, 0.98, 0.185], [0.08, 0.9, 0.022], trim);
  }
  kit.rod([-2.9, 0.74, 0.42], [1.39, 0.74, 0.42], 0.034, "#b19762");
  kit.rod([1.88, 0.74, -2.7], [1.88, 0.74, 0.3], 0.034, "#b19762");
  const stool = (x: number, z: number) => {
    kit.cylinder([x, 0.51, z], 0.23, 0.08, iron);
    kit.cylinder([x, 0.79, z], 0.048, 0.5, "#64554a");
    ring([x, 0.7, z], 0.18, 0.018, "#a39275");
    kit.cylinder([x, 1.08, z], 0.255, 0.13, red, undefined, 24);
    ring([x, 1.13, z], 0.235, 0.015, "#d26648");
  };
  [-2.53, -1.48, -0.43, 0.62].forEach((x) => stool(x, 0.84));
  [-1.04, -2.25].forEach((z) => stool(2.19, z));

  const bowlShape = [
    new THREE.Vector2(0.07, 0),
    new THREE.Vector2(0.11, 0.018),
    new THREE.Vector2(0.2, 0.105),
    new THREE.Vector2(0.245, 0.215),
    new THREE.Vector2(0.225, 0.22),
    new THREE.Vector2(0.18, 0.105),
    new THREE.Vector2(0.085, 0.025),
  ];
  const bowlGeometry = new THREE.LatheGeometry(bowlShape, 24);
  const ramen = (x: number, z: number) => {
    kit.cylinder([x, 1.584, z], 0.275, 0.026, cream, undefined, 24);
    kit.mesh(bowlGeometry, cream, [x, 1.599, z]);
    ring([x, 1.8, z], 0.234, 0.012, "#a73b31");
    kit.cylinder([x, 1.746, z], 0.206, 0.015, kit.toon("#b67932", 0.25), undefined, 24);
    for (let i = 0; i < 7; i++) {
      const offset = -0.12 + i * 0.037;
      kit.tube(
        [
          [x - 0.13, 1.766, z + offset],
          [x - 0.04, 1.774, z + offset + 0.024],
          [x + 0.08, 1.767, z + offset - 0.015],
        ],
        0.008,
        "#f3d79a",
      );
    }
    for (const dx of [-0.07, 0.07]) {
      const egg = blob([x + dx, 1.79, z + 0.09], [0.06, 0.027, 0.081], cream);
      egg.rotation.y = dx * 5;
      blob([x + dx, 1.815, z + 0.1], [0.033, 0.009, 0.035], kit.toon("#efa633", 0.3));
    }
    const nori = kit.box([x + 0.12, 1.88, z - 0.1], [0.12, 0.21, 0.013], "#263e2a");
    nori.rotation.x = -0.35;
    for (let i = 0; i < 5; i++) {
      ring(
        [x - 0.09 + (i % 3) * 0.027, 1.795, z - 0.06 + Math.floor(i / 3) * 0.033],
        0.017,
        0.005,
        "#75a358",
      );
    }
    for (const offset of [-0.023, 0.023]) {
      kit.rod([x - 0.25, 1.831, z + offset], [x + 0.29, 1.84, z + 0.09 + offset], 0.009, "#805232");
    }
  };
  ramen(-2.48, -0.02);
  ramen(-1.36, -0.05);
  ramen(0.55, -0.03);
  ramen(1.4, -1.96);
  const bottle = (x: number, z: number, color: string) => {
    kit.cylinder([x, 1.69, z], 0.055, 0.24, kit.toon(color, 0.2));
    kit.cylinder([x, 1.84, z], 0.025, 0.065, iron);
    kit.box([x, 1.69, z + 0.055], [0.068, 0.085, 0.005], cream);
  };
  for (const x of [-2.02, -0.56]) {
    kit.box([x, 1.588, -0.39], [0.42, 0.035, 0.23], timber);
    bottle(x - 0.09, -0.39, "#4d2c1e");
    bottle(x + 0.08, -0.39, "#bd5930");
  }
  kit.cylinder([0.06, 1.7, -0.35], 0.079, 0.25, "#644733");
  for (let i = 0; i < 8; i++) {
    const x = 0.015 + (i % 3) * 0.029;
    kit.rod(
      [x, 1.72, -0.38 + Math.floor(i / 3) * 0.025],
      [x + 0.015, 2.0 + (i % 2) * 0.025, -0.38 + Math.floor(i / 3) * 0.025],
      0.007,
      "#e3bc78",
    );
  }
  kit.cylinder([1.4, 1.75, -0.7], 0.12, 0.34, steel);
  ring([1.4, 1.925, -0.7], 0.108, 0.012, "#e1ddd1");
  kit.tube(
    [
      [1.5, 1.87, -0.7],
      [1.65, 1.84, -0.7],
      [1.65, 1.64, -0.7],
      [1.5, 1.65, -0.7],
    ],
    0.024,
    "#9ba5a4",
  );
  for (const x of [-1.92, -0.86, 0.93]) {
    kit.cylinder([x, 1.652, 0.13], 0.064, 0.15, cream);
    kit.cylinder([x, 1.729, 0.13], 0.053, 0.003, "#71856b");
  }

  // The soup surfaces deliberately coincide with the scene's steam emitters.
  kit.box([-0.65, 0.83, -2.35], [2.96, 0.73, 1.13], steel);
  kit.box([-0.65, 1.22, -2.35], [3.04, 0.07, 1.21], iron);
  for (const x of [-1.4, 0.1]) {
    kit.cylinder([x, 1.42, -2.35], 0.425, 0.49, steel, undefined, 28);
    ring([x, 1.68, -2.35], 0.429, 0.026, "#d6d6c6");
    kit.cylinder([x, 1.7, -2.35], 0.397, 0.009, kit.toon("#d3a057", 0.3), undefined, 28);
    for (const dx of [-0.49, 0.49]) {
      kit.tube(
        [
          [x + dx * 0.82, 1.55, -2.47],
          [x + dx, 1.58, -2.47],
          [x + dx, 1.58, -2.23],
          [x + dx * 0.82, 1.55, -2.23],
        ],
        0.025,
        iron,
      );
    }
    kit.rod([x + 0.18, 1.71, -2.47], [x + 0.31, 2.01, -2.7], 0.016, "#7d5736");
    for (let i = 0; i < 8; i++) {
      const angle = i * 2.4;
      blob(
        [x + Math.cos(angle) * 0.25, 1.712, -2.35 + Math.sin(angle) * 0.22],
        [0.032, 0.007, 0.023],
        kit.toon("#f2cf87", 0.25),
      );
    }
  }
  for (const x of [-1.8, -1.2, -0.6, 0, 0.6]) {
    kit.cylinder([x, 1.06, -1.771], 0.048, 0.035, iron).rotation.x = Math.PI / 2;
    kit.box([x, 0.75, -1.771], [0.44, 0.32, 0.012], "#707b79");
  }
  kit.box([-0.64, 2.98, -2.64], [3.15, 0.25, 1.28], steel);
  kit.box([-0.64, 3.2, -2.79], [2.6, 0.25, 0.87], "#87938f");
  kit.box([-0.64, 3.51, -2.86], [0.68, 0.47, 0.6], steel);
  kit.box([-0.64, 2.844, -2.53], [2.68, 0.022, 0.73], "#4a5553");
  for (let x = -1.84; x < 0.68; x += 0.16) {
    kit.box([x, 2.826, -2.53], [0.035, 0.012, 0.7], "#a8af9f");
  }
  kit.box([-0.6, 2.83, -2.015], [2.75, 0.026, 0.025], kit.toon("#ffe4a1", 0.35));

  kit.box([-0.85, 1.02, -3.8], [3.88, 1.07, 0.61], wood);
  kit.box([-0.85, 1.58, -3.77], [4.0, 0.09, 0.75], steel);
  for (const x of [-2.35, -1.39, -0.43, 0.53]) {
    kit.box([x, 1.04, -3.478], [0.87, 0.86, 0.025], "#a97546");
    kit.rod([x - 0.11, 1.29, -3.443], [x + 0.11, 1.29, -3.443], 0.016, iron);
  }
  kit.box([-2.06, 1.64, -3.75], [0.73, 0.04, 0.48], "#d8ac67");
  kit.box([-2.06, 1.673, -3.75], [0.35, 0.025, 0.07], "#719752");
  kit.box([-1.89, 1.682, -3.67], [0.2, 0.016, 0.065], steel);
  kit.box([-1.72, 1.687, -3.67], [0.14, 0.025, 0.045], timber);
  kit.box([-0.74, 1.634, -3.77], [0.79, 0.014, 0.46], "#535f5c");
  kit.box([-0.74, 1.639, -3.77], [0.64, 0.015, 0.34], "#849b99");
  kit.tube(
    [
      [-0.74, 1.63, -4.03],
      [-0.74, 1.99, -4.03],
      [-0.74, 2.05, -3.8],
      [-0.74, 1.96, -3.77],
    ],
    0.024,
    "#c3cac1",
  );
  for (const x of [-0.97, -0.51]) {
    kit.cylinder([x, 1.68, -4.01], 0.032, 0.07, steel);
  }
  for (let i = 0; i < 6; i++) {
    const plate = kit.cylinder([0.38 + i * 0.085, 1.84, -3.83], 0.2, 0.018, cream, undefined, 20);
    plate.rotation.z = Math.PI / 2 - 0.2;
  }
  kit.box([0.59, 1.67, -3.83], [0.68, 0.075, 0.49], timber);
  for (let i = 0; i < 5; i++) {
    kit.cylinder([0.72, 1.62 + i * 0.03, -3.41], 0.15, 0.026, cream, undefined, 20);
  }
  kit.rod([-2.63, 2.28, -4.11], [0.89, 2.28, -4.11], 0.022, iron);
  for (let i = 0; i < 5; i++) {
    const x = -2.43 + i * 0.34;
    kit.tube(
      [
        [x, 2.31, -4.1],
        [x, 2.35, -4.02],
        [x, 2.2, -4.0],
      ],
      0.012,
      "#b6bbae",
    );
    kit.rod([x, 2.2, -4.0], [x, 1.98, -4.0], 0.014, "#9b8a66");
    if (i % 2 === 0) blob([x, 1.92, -4.0], [0.065, 0.085, 0.022], steel);
    else kit.box([x, 1.93, -4.0], [0.075, 0.12, 0.018], steel);
  }
  kit.box([-3.22, 1.67, -3.57], [0.82, 2.4, 1.03], "#c4c9bd");
  kit.box([-3.22, 2.3, -3.04], [0.74, 1.0, 0.03], cream);
  kit.box([-3.22, 1.15, -3.04], [0.74, 1.18, 0.03], "#d7d8c9");
  for (const y of [1.51, 2.25])
    kit.rod([-2.96, y - 0.17, -2.99], [-2.96, y + 0.17, -2.99], 0.023, iron);
  kit.sign("仕込み中", [-3.24, 2.55, -3.017], 0.47, 0.17, "#e9ddba", "#6a5943", undefined, 180);
  kit.box([2.35, 0.93, -3.76], [1.14, 0.94, 0.7], wood);
  kit.box([2.35, 1.42, -3.76], [1.22, 0.07, 0.77], steel);
  kit.cylinder([2.34, 1.62, -3.78], 0.24, 0.35, cream);
  blob([2.34, 1.82, -3.78], [0.245, 0.07, 0.245], steel);
  kit.box([2.34, 1.91, -3.78], [0.15, 0.035, 0.045], iron);
  kit.box([2.32, 1.62, -3.535], [0.1, 0.07, 0.016], iron);

  for (const [i, text] of ["醤油", "味噌", "塩", "煮玉子", "餃子"].entries()) {
    const x = 1.28 + i * 0.32;
    kit.box([x, 2.65, -4.125], [0.26, 1.02, 0.035], cream);
    const texture = kit.paint(128, 512, (ctx) => {
      ctx.fillStyle = "#fff0ca";
      ctx.fillRect(0, 0, 128, 512);
      ctx.textAlign = "center";
      ctx.fillStyle = "#49352a";
      ctx.font = 'bold 74px "Hiragino Mincho ProN", serif';
      [...text].forEach((char, j) => ctx.fillText(char, 64, 89 + j * 90));
      ctx.fillStyle = "#a4422b";
      ctx.font = "37px serif";
      ctx.fillText(i < 3 ? "八五〇" : "三五〇", 64, 465);
    });
    kit.mesh(new THREE.PlaneGeometry(0.25, 0.98), new THREE.MeshBasicMaterial({ map: texture }), [
      x,
      2.65,
      -4.102,
    ]);
  }
  const clockFace = kit.paint(256, 256, (ctx) => {
    ctx.fillStyle = "#f7e8bf";
    ctx.fillRect(0, 0, 256, 256);
    ctx.translate(128, 128);
    ctx.strokeStyle = "#4a3929";
    ctx.lineWidth = 6;
    for (let i = 0; i < 12; i++) {
      ctx.rotate(Math.PI / 6);
      ctx.beginPath();
      ctx.moveTo(0, -98);
      ctx.lineTo(0, -112);
      ctx.stroke();
    }
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(-43, -32);
    ctx.lineTo(0, 0);
    ctx.lineTo(62, -70);
    ctx.stroke();
  });
  kit.cylinder([-2.84, 3.04, -4.1], 0.28, 0.06, timber, undefined, 32).rotation.x = Math.PI / 2;
  kit.mesh(
    new THREE.CircleGeometry(0.247, 32),
    new THREE.MeshBasicMaterial({ map: clockFace }),
    [-2.84, 3.04, -4.062],
  );
  for (const x of [-2.14, 0.28]) {
    kit.rod([x, 3.7, -0.15], [x, 2.92, -0.15], 0.013, iron);
    kit.cylinder([x, 2.84, -0.15], 0.26, 0.18, "#655548", undefined, 24, 0.085);
    kit.cylinder([x, 2.743, -0.15], 0.233, 0.016, kit.toon("#ffe4aa", 0.35), undefined, 24);
    blob([x, 2.725, -0.15], [0.062, 0.035, 0.062], kit.basic("#ffefbf"));
  }
  kit.point([-1.6, 2.65, 0.03], "#ffc276", 19, 7);
  kit.point([1.04, 2.58, -2.48], "#ffd397", 16, 6);
}
