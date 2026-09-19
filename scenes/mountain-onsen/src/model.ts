import * as THREE from "three";
import { Kit, type XYZ } from "./kit.ts";
import type { SceneAnimation } from "./types.ts";
import { scatterGroundLeaves } from "./ground-leaves.ts";

const wood = "#62524c";
const darkWood = "#3e4845";
const moss = "#77846b";
const stone = "#8b9390";
const warm = "#ead6a8";

function rock(kit: Kit, p: XYZ, scale: XYZ, color = stone) {
  const mesh = kit.mesh(new THREE.DodecahedronGeometry(1, 0), kit.toon(color), p);
  mesh.scale.set(...scale);
  mesh.rotation.set(0.08, p[0] * 2.1, 0.16);
  return mesh;
}

function roof(kit: Kit, center: XYZ, width: number, depth: number, rise: number) {
  const [x, y, z] = center;
  const slope = Math.atan2(rise, depth / 2);
  const length = Math.hypot(depth / 2, rise);
  for (const side of [-1, 1]) {
    const panel = kit.box(
      [x, y + rise / 2, z + (side * depth) / 4],
      [width, 0.16, length],
      "#566b68",
    );
    panel.rotation.x = side * slope;
    for (let i = 0; i <= Math.floor(width / 0.29); i++) {
      const rib = kit.box(
        [x - width / 2 + i * 0.29, y + rise / 2 + 0.1, z + (side * depth) / 4],
        [0.025, 0.035, length],
        "#6c8179",
      );
      rib.rotation.x = side * slope;
    }
    kit.box([x, y - 0.02, z + (side * depth) / 2], [width + 0.04, 0.18, 0.13], darkWood);
  }
  kit.box([x, y + rise + 0.1, z], [width + 0.12, 0.17, 0.2], "#75887a");
}

function windowFrame(kit: Kit, p: XYZ, width: number, height: number, side = false) {
  const g = new THREE.Group();
  g.position.set(...p);
  if (side) g.rotation.y = Math.PI / 2;
  kit.root.add(g);
  const glass = new THREE.MeshBasicMaterial({
    color: "#e3e4c6",
    transparent: true,
    opacity: 0.065,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  kit.mesh(new THREE.PlaneGeometry(width, height), glass, [0, 0, 0], g);
  for (const x of [-width / 2, width / 2])
    kit.box([x, 0, 0.04], [0.065, height, 0.09], darkWood, g);
  for (const y of [-height / 2, height / 2])
    kit.box([0, y, 0.04], [width, 0.07, 0.09], darkWood, g);
  for (let x = -width / 2 + 0.55; x < width / 2; x += 0.55)
    kit.box([x, 0, 0.04], [0.045, height, 0.07], wood, g);
  kit.box([0, height * 0.23, 0.04], [width, 0.05, 0.07], wood, g);
}

function paperLantern(kit: Kit, p: XYZ, radius = 0.26) {
  kit.rod([p[0], p[1] + 0.38, p[2]], [p[0], p[1] + 0.64, p[2]], 0.018, darkWood);
  const lantern = kit.mesh(new THREE.SphereGeometry(radius, 14, 12), kit.toon("#f3d49a", 0.55), p);
  lantern.scale.y = 1.32;
  for (let i = -3; i <= 3; i++) {
    const y = i * radius * 0.29;
    const r = Math.sqrt(Math.max(0.01, radius * radius - (y / 1.32) ** 2));
    const ring = kit.torus([p[0], p[1] + y, p[2]], r, 0.008, "#ae9977");
    ring.rotation.x = -Math.PI / 2;
  }
  kit.cylinder([p[0], p[1] + radius * 1.29, p[2]], radius * 0.44, 0.06, wood);
  kit.cylinder([p[0], p[1] - radius * 1.29, p[2]], radius * 0.44, 0.05, wood);
}

function inn(kit: Kit) {
  kit.box([-2.1, 0.4, -2.6], [7.6, 0.5, 4.6], "#5f6d66", undefined, true);
  kit.box([-2.1, 0.68, -2.6], [7.5, 0.09, 4.5], "#bdab83");
  kit.box([-2.1, 2.15, -4.85], [7.6, 3, 0.14], "#c8bea1");
  kit.box([-5.86, 2.15, -2.6], [0.14, 3, 4.6], "#b1ad91");
  kit.box([-2.1, 1.0, -0.3], [7.6, 0.65, 0.13], wood);
  kit.box([-2.1, 3.4, -0.3], [7.6, 0.43, 0.15], darkWood);
  for (const x of [-5.86, -3.45, -0.65, 1.66]) {
    kit.box([x, 2.1, -0.25], [0.16, 3, 0.17], darkWood);
    kit.box([x, 2.1, -4.8], [0.15, 3, 0.15], darkWood);
  }
  windowFrame(kit, [-3.85, 2.19, -0.2], 3.72, 1.77);
  windowFrame(kit, [0.4, 2.08, -0.2], 2.35, 2.35);
  windowFrame(kit, [1.75, 2.0, -2.5], 4.3, 2.35, true);
  kit.box([1.7, 1.0, -2.6], [0.13, 0.65, 4.6], wood);
  roof(kit, [-2.1, 3.64, -2.6], 8.2, 5.16, 1.05);
  for (const x of [-5.87, 1.67]) {
    const gable = new THREE.BufferGeometry();
    gable.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([x, 3.6, -4.9, x, 4.65, -2.6, x, 3.6, -0.3], 3),
    );
    gable.computeVertexNormals();
    kit.mesh(
      gable,
      new THREE.MeshToonMaterial({ color: "#bcb497", side: THREE.DoubleSide }),
      [0, 0, 0],
    );
    kit.rod([x, 3.61, -2.6], [x, 4.59, -2.6], 0.035, darkWood);
  }
  // Visible tatami lounge and tea table behind the long garden window.
  for (let i = 0; i < 4; i++) {
    const x = -5.02 + (i % 2) * 1.43,
      z = -3.65 + Math.floor(i / 2) * 1.5;
    kit.box([x, 0.755, z], [1.35, 0.03, 1.42], kit.toon("#bfc093", 0.2));
    kit.box([x - 0.66, 0.777, z], [0.034, 0.015, 1.42], "#647866");
  }
  kit.box([-3.97, 1.21, -2.04], [1.64, 0.12, 0.94], kit.toon("#946f4f", 0.22), undefined, true);
  for (const x of [-4.57, -3.37])
    for (const z of [-2.35, -1.72]) kit.box([x, 0.97, z], [0.065, 0.42, 0.065], wood);
  for (const x of [-4.48, -3.47]) kit.box([x, 0.84, -1.12], [0.68, 0.16, 0.53], "#9d6c65");
  kit.cylinder([-4.1, 1.37, -2.04], 0.14, 0.22, "#616e65");
  kit.cylinder([-4.1, 1.5, -2.04], 0.15, 0.035, "#839382");
  kit.torus([-4.27, 1.4, -2.04], 0.09, 0.023, "#697867");
  kit.rod([-4.01, 1.38, -2.04], [-3.82, 1.48, -2.04], 0.046, "#758776");
  for (const x of [-4.43, -3.51]) {
    kit.cylinder([x, 1.295, -1.91], 0.12, 0.02, "#ceb991");
    kit.cylinder([x, 1.36, -1.91], 0.068, 0.1, "#e6d4b2");
  }
  kit.box([-0.18, 1.13, -2.48], [2.1, 0.8, 0.64], kit.toon("#8a6851", 0.25), undefined, true);
  kit.box([-0.18, 1.57, -2.48], [2.22, 0.09, 0.74], "#b89772");
  kit.box([-0.59, 1.65, -2.47], [0.45, 0.04, 0.32], "#dccba5");
  kit.cylinder([0.45, 1.71, -2.48], 0.1, 0.21, "#a39770");
  kit.box([0.45, 1.85, -2.46], [0.23, 0.015, 0.1], "#cfb777");
  kit.sign("帳場", [-0.15, 2.32, -4.75], 0.65, 0.46, "#c8bea1", "#655747", undefined, 360);
  kit.box([0.95, 1.54, -4.52], [0.96, 1.64, 0.45], darkWood);
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 3; c++) {
      const x = 0.63 + c * 0.32,
        y = 0.89 + r * 0.31;
      kit.box([x, y, -4.28], [0.29, 0.27, 0.025], "#b7a17b");
      kit.cylinder([x + 0.08, y, -4.25], 0.022, 0.05, "#6a604d").rotation.x = Math.PI / 2;
    }
  kit.sign("もみじ庵", [-1.9, 3.39, -0.155], 2.0, 0.32, "#c5b58f", "#43534a", undefined, 125);
  kit.rod([-0.81, 2.99, -0.05], [1.6, 2.99, -0.05], 0.03, darkWood);
  for (let i = 0; i < 4; i++) {
    kit.box([-0.5 + i * 0.58, 2.7, -0.04], [0.55, 0.56, 0.025], "#657d71");
  }
  kit.sign("湯", [0.38, 2.68, -0.02], 0.48, 0.39, "#657d71", "#e0dabd", undefined, 660);
  kit.box([-1.2, 0.6, 0.86], [8.1, 0.2, 2.1], "#776553");
  for (let x = -5.2; x < 2.8; x += 0.18) kit.box([x, 0.714, 0.86], [0.162, 0.025, 2.1], "#9b805f");
  for (let i = 0; i < 3; i++)
    kit.box([-2.3, 0.24 + i * 0.16, 2.38 - i * 0.28], [2.1, 0.16, 0.34], "#8f7d68");
  for (const x of [-5, 2.45]) {
    kit.box([x, 1.24, 1.81], [0.07, 1.14, 0.07], darkWood);
    kit.box([x, 1.66, 0.8], [0.07, 0.06, 2], wood);
  }
  paperLantern(kit, [-4.9, 2.98, -0.05], 0.23);
  paperLantern(kit, [1.25, 2.98, -0.05], 0.23);
  kit.point([-3.5, 2.7, -1.85], "#ffd796", 16, 7);
  kit.point([0, 2.7, -1.85], "#ffdfaa", 11, 6);
  // Service wing makes an L-shaped silhouette and a sheltered courtyard.
  kit.box([-4.59, 0.52, 0.47], [2.65, 0.26, 2.43], "#647366");
  kit.box([-5.86, 1.95, 0.45], [0.13, 2.7, 2.43], "#b5ad8c");
  kit.box([-4.59, 1.95, 1.65], [2.65, 2.7, 0.14], wood);
  windowFrame(kit, [-3.2, 1.98, 0.48], 2.3, 2.3, true);
  roof(kit, [-4.56, 3.25, 0.44], 3.2, 3.03, 0.7);
  kit.sign("露天風呂", [-4.6, 2.28, 1.73], 1.52, 0.43, "#b8a782", "#48564a", undefined, 185);
  for (let i = 0; i < 7; i++) kit.box([-5.65 + i * 0.35, 1.23, 1.74], [0.08, 1.1, 0.06], "#917958");
}

function maple(kit: Kit, position: XYZ, scale = 1) {
  const g = new THREE.Group();
  g.position.set(...position);
  g.scale.setScalar(scale);
  kit.root.add(g);
  kit.cylinder([0, 1.44, 0], 0.14, 2.9, "#666159", g, 7, 0.075);
  for (let i = 0; i < 7; i++) {
    const a = i * 2.4,
      x = Math.cos(a) * (0.7 + i * 0.06),
      z = Math.sin(a) * 0.85,
      y = 2.35 + (i % 3) * 0.32;
    kit.rod([0, 1.6, 0], [x, y, z], 0.065, "#716451", g);
    for (let j = 0; j < 5; j++) {
      const leaf = kit.mesh(
        new THREE.IcosahedronGeometry(0.52, 0),
        kit.toon(["#a46754", "#b78d58", "#975c53", "#ba774e"][(i + j) % 4]),
        [x + Math.sin(j * 2) * 0.4, y + j * 0.035, z + Math.cos(j * 2) * 0.36],
        g,
      );
      leaf.scale.set(1.25, 0.32, 1);
    }
  }
}

export function buildScene(kit: Kit): SceneAnimation {
  kit.box([0, -0.26, 0], [15, 0.65, 15], "#3c5554", undefined, true);
  const ground = kit.box([0, 0.105, 0], [14.97, 0.12, 14.97], "#74856f");
  const leafSurfaces = [ground];
  for (let i = 0; i < 45; i++) {
    const x = Math.sin(i * 7.3) * 6.7,
      z = Math.cos(i * 4.1) * 6.7;
    leafSurfaces.push(
      rock(kit, [x, 0.17, z], [0.24 + (i % 3) * 0.1, 0.035, 0.19], i % 2 ? "#86927b" : "#607564"),
    );
  }
  inn(kit);
  for (let i = 0; i < 44; i++) {
    const x = -6.7 + i * 0.31;
    kit.cylinder([x, 1.2, -6.5], 0.065, 1.95, "#8e9874", undefined, 7);
    kit.cylinder([-6.55, 1.05, x], 0.06, 1.65, "#85906d", undefined, 7);
    if (i % 5 === 0) {
      for (const y of [0.8, 1.55])
        kit.rod([x, y, -6.47], [Math.min(x + 1.6, 6.7), y, -6.47], 0.045, "#667962");
    }
  }
  for (let i = 0; i < 7; i++) {
    const x = -2.25 + Math.sin(i * 0.5) * 0.5,
      z = 2.7 + i * 0.53;
    leafSurfaces.push(rock(kit, [x, 0.26, z], [0.56, 0.12, 0.38], "#b2b4a1"));
  }
  const pool = new THREE.Group();
  pool.position.set(3.55, 0.15, 2.98);
  kit.root.add(pool);
  const basin = kit.cylinder([0, 0.015, 0], 2.48, 0.22, "#3f6866", pool, 48);
  basin.scale.z = 0.73;
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform float time; varying vec2 vUv;
      void main(){float ripple=sin(length(vUv-vec2(.25,.55))*95.0-time*1.4);
      float bands=sin(vUv.x*67.0+sin(vUv.y*25.0+time)*.8)*.5+.5;
      vec3 color=mix(vec3(.19,.39,.38),vec3(.42,.62,.56),bands*.16+ripple*.03+.15);
      gl_FragColor=vec4(color,1.0); #include <colorspace_fragment> }`.replace(
      "#include <colorspace_fragment> }",
      "\n#include <colorspace_fragment>\n}",
    ),
  });
  const water = kit.mesh(new THREE.CircleGeometry(2.34, 64), waterMaterial, [0, 0.17, 0], pool);
  water.rotation.x = -Math.PI / 2;
  water.scale.y = 0.73;
  water.userData.dynamic = true;
  for (let i = 0; i < 24; i++) {
    const a = (i * Math.PI) / 12;
    rock(
      kit,
      [3.55 + Math.cos(a) * 2.51, 0.38 + (i % 3) * 0.025, 2.98 + Math.sin(a) * 1.84],
      [0.4 + Math.sin(i) * 0.07, 0.35, 0.3],
      ["#8c9991", "#748b85", "#a2a89b"][i % 3],
    );
  }
  kit.rod([1.23, 0.23, 2.8], [1.23, 1.12, 2.8], 0.075, "#9caa76");
  kit.rod([1.23, 1.02, 2.8], [1.88, 1.02, 2.8], 0.08, "#aebc85");
  kit.cylinder([1.88, 0.68, 2.8], 0.022, 0.66, kit.basic("#b1d2c3"));
  kit.cylinder([0.73, 0.36, 1.7], 0.29, 0.34, "#b59b68");
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    kit.rod(
      [0.73 + Math.cos(a) * 0.287, 0.2, 1.7 + Math.sin(a) * 0.287],
      [0.73 + Math.cos(a) * 0.287, 0.52, 1.7 + Math.sin(a) * 0.287],
      0.015,
      "#8e8159",
    );
  }
  kit.box([0.75, 0.59, 1.72], [0.47, 0.08, 0.32], "#ded9b8");
  for (let i = 0; i < 15; i++) {
    kit.cylinder([6.1, 1.08, -3.2 + i * 0.24], 0.055, 1.8, "#a4aa7a", undefined, 8);
    for (const y of [0.75, 1.35]) kit.cylinder([6.1, y, -3.2 + i * 0.24], 0.062, 0.028, "#7f9468");
  }
  maple(kit, [4.3, 0.18, -4.25], 1.32);
  maple(kit, [-5.27, 0.18, 4.37], 0.92);
  maple(kit, [5.4, 0.18, -0.8], 0.77);
  for (let i = 0; i < 9; i++)
    rock(
      kit,
      [4.8 + Math.sin(i * 1.6), 0.37, -4.7 + Math.cos(i * 1.6) * 0.7],
      [0.44, 0.32, 0.36],
      "#6d7e6b",
    );
  // Stone lantern with a warm cavity and a broad carved cap.
  kit.box([-4.64, 0.31, 3.5], [0.8, 0.22, 0.8], "#a4ad9b");
  kit.cylinder([-4.64, 0.92, 3.5], 0.17, 1.08, "#869a8e", undefined, 8);
  kit.box([-4.64, 1.55, 3.5], [0.57, 0.48, 0.57], kit.basic("#e7c88c"));
  for (const x of [-4.95, -4.33])
    for (const z of [3.19, 3.81]) kit.box([x, 1.56, z], [0.1, 0.61, 0.1], "#92a38f");
  kit.mesh(
    new THREE.ConeGeometry(0.63, 0.3, 4),
    kit.toon("#96a28d"),
    [-4.64, 2.02, 3.5],
  ).rotation.y = Math.PI / 4;
  kit.cylinder([-4.64, 2.26, 3.5], 0.1, 0.22, "#aeb59a");
  kit.point([-4.64, 1.59, 3.5], "#ffdc9c", 5, 4);

  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0.16);
  [
    [0.025, 0.055],
    [0.11, 0.11],
    [0.075, 0.025],
    [0.16, 0],
    [0.05, -0.04],
    [0.06, -0.12],
    [0, -0.065],
    [-0.06, -0.12],
    [-0.05, -0.04],
    [-0.16, 0],
    [-0.075, 0.025],
    [-0.11, 0.11],
    [-0.025, 0.055],
    [0, 0.16],
  ].forEach(([x, y]) => leafShape.lineTo(x, y));
  const leafGeometry = new THREE.ShapeGeometry(leafShape);
  const leafMaterials = ["#b88454", "#bd7054", "#955a51"].map(
    (color) => new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
  );
  const leaves: THREE.Mesh[] = [];
  for (let i = 0; i < 21; i++) {
    const leaf = kit.mesh(leafGeometry, leafMaterials[i % 3], [0, 0, 0]);
    leaf.userData.dynamic = true;
    leaves.push(leaf);
  }
  scatterGroundLeaves(kit, leafGeometry, leafMaterials, {
    count: 38,
    seed: 731029,
    surfaces: leafSurfaces,
    sample(random) {
      const cluster = random();
      if (cluster < 0.55) {
        return [-5.05 + (random() + random() - 1) * 1.8, 4.7 + (random() + random() - 1) * 1.6];
      }
      if (cluster < 0.82) {
        return [-0.8 + (random() + random() - 1) * 2, 4.55 + random() * 2.15];
      }
      return [3.5 + random() * 3.25, 5.35 + random() * 1.4];
    },
    accept: (x, z) =>
      x > -6.7 &&
      x < 6.9 &&
      z > 2.9 &&
      z < 7 &&
      Math.hypot((x - 3.55) / 3.15, (z - 2.98) / 2.4) > 1 &&
      Math.hypot(x + 4.64, z - 3.5) > 0.7 &&
      Math.hypot(x + 5.27, z - 4.37) > 0.28,
  });
  const steamPositions = new Float32Array(28 * 3);
  const opacities = new Float32Array(28);
  const sizes = new Float32Array(28);
  const steamGeometry = new THREE.BufferGeometry();
  steamGeometry.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));
  steamGeometry.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
  steamGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  const steamMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { pixels: { value: 70 } },
    vertexShader: `attribute float aOpacity;attribute float aSize;uniform float pixels;varying float opacity;
      void main(){opacity=aOpacity;gl_PointSize=aSize*pixels;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `varying float opacity;void main(){vec2 p=gl_PointCoord*2.0-1.0;float a=max(0.0,1.0-dot(p,p));gl_FragColor=vec4(.81,.89,.84,a*a*opacity);}`,
  });
  const steam = new THREE.Points(steamGeometry, steamMaterial);
  steam.frustumCulled = false;
  kit.root.add(steam);
  return {
    update(_delta, time, reduced, pixels) {
      const t = reduced ? 2.4 : time;
      waterMaterial.uniforms.time.value = t;
      steamMaterial.uniforms.pixels.value = pixels;
      leaves.forEach((leaf, i) => {
        const phase = (t * 0.055 + i * 0.618) % 1;
        leaf.position.set(
          3.6 + Math.sin(i * 2.4) * 1.6 + Math.sin(phase * 7) * 0.5,
          4.1 - phase * 3.72,
          -3.5 + phase * 5.8 + Math.cos(i) * 0.3,
        );
        leaf.rotation.set(phase * 4, i + phase * 2, phase * 5);
      });
      for (let i = 0; i < 28; i++) {
        const phase = (t * 0.11 + i * 0.618) % 1;
        steamPositions[i * 3] =
          3.55 + Math.sin(i * 2.4) * 1.6 + phase * Math.sin(t * 0.12 + i) * 0.25;
        steamPositions[i * 3 + 1] = 0.42 + phase * 1.8;
        steamPositions[i * 3 + 2] = 2.98 + Math.cos(i * 2.4) * 1.1;
        opacities[i] = Math.sin(phase * Math.PI) * 0.075;
        sizes[i] = 0.5 + phase * 1.12;
      }
      steamGeometry.attributes.position.needsUpdate = true;
      steamGeometry.attributes.aOpacity.needsUpdate = true;
      steamGeometry.attributes.aSize.needsUpdate = true;
    },
  };
}
