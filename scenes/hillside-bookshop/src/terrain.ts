import * as THREE from "three";
import type { Kit, XYZ } from "./kit.ts";

interface Palette {
  earth: string;
  stone: string;
  mortar: string;
  iron: string;
}

interface Step {
  left: number;
  right: number;
  front: number;
  height: number;
  mesh: THREE.Mesh;
}

export function buildBookshopTerrain(kit: Kit, colors: Palette): THREE.Mesh[] {
  const base = 0.1;
  const shopHeight = 1.41;
  const highHeight = 2.87;
  const back = 2.25;
  const bottomX = 6.25;
  const topX = -3.63;
  const landingLeft = 0.5;
  const landingRight = 2.25;
  const roadHeight = (x: number) => 2.3 - ((x + 7.45) / 14.9) * 2.16;
  const frontAt = (x: number) => 3.3 + ((x - topX) / (bottomX - topX)) * 1.25;
  const box = (name: string, position: XYZ, size: XYZ, color: string) => {
    const mesh = kit.box(position, size, color);
    mesh.name = name;
    return mesh;
  };

  box("bookshop-base", [0, -0.2, 0], [15, 0.6, 15], colors.earth);
  box("bookshop-foundation", [0, 0.715, -2.4], [13.8, 1.23, 9.3], colors.mortar);
  box("bookshop-platform", [0, shopHeight - 0.04, -2.4], [13.8, 0.08, 9.3], colors.stone);
  box(
    "bookshop-high-foundation",
    [-5.265, (base + highHeight - 0.06) / 2, 1.7],
    [3.27, highHeight - 0.06 - base, 3.4],
    colors.mortar,
  );
  const highLanding = box(
    "bookshop-high-landing",
    [-5.265, highHeight - 0.03, 1.7],
    [3.27, 0.06, 3.4],
    colors.stone,
  );

  const steps: Step[] = [];
  const tread = (left: number, right: number, height: number, front: number, landing = false) => {
    const mesh = box(
      landing ? "bookshop-stair-landing" : "bookshop-stair-tread",
      [(left + right) / 2, (base + height) / 2, (back + front) / 2],
      [right - left, height - base, front - back],
      colors.stone,
    );
    const step = { left, right, front, height, mesh };
    steps.push(step);
    const edge = kit.mesh(
      new THREE.PlaneGeometry(right - left - 0.018, 0.065),
      kit.toon("#d1bda0"),
      [(left + right) / 2, height - 0.045, front + 0.002],
    );
    edge.name = "bookshop-stair-nosing";
    return step;
  };

  const lowSteps: Step[] = [];
  const lowRise = (shopHeight - roadHeight(bottomX)) / 7;
  for (let i = 0; i < 7; i++) {
    const right = bottomX - (i * (bottomX - landingRight)) / 7;
    const left = bottomX - ((i + 1) * (bottomX - landingRight)) / 7;
    lowSteps.push(tread(left, right, roadHeight(bottomX) + (i + 1) * lowRise, frontAt(right)));
  }
  const landing = tread(landingLeft, landingRight, shopHeight, frontAt(landingRight), true);
  const highSteps: Step[] = [];
  for (let i = 0; i < 9; i++) {
    const right = landingLeft - (i * (landingLeft - topX)) / 9;
    const left = landingLeft - ((i + 1) * (landingLeft - topX)) / 9;
    highSteps.push(
      tread(left, right, shopHeight + ((i + 1) * (highHeight - shopHeight)) / 9, frontAt(right)),
    );
  }

  // Match the ramp's inner boundary to every tread, rather than overlapping a rectangular wedge.
  const boundary: [number, number][] = [
    [-7.45, 3.4],
    [topX, 3.4],
  ];
  for (const step of [...steps].sort((a, b) => a.left - b.left)) {
    boundary.push([step.left, step.front], [step.right, step.front]);
  }
  boundary.push([bottomX, back], [7.45, back], [7.45, 7.45], [-7.45, 7.45]);
  const footprint = new THREE.Shape();
  boundary.forEach(([x, z], i) => {
    if (i === 0) footprint.moveTo(x, -z);
    else footprint.lineTo(x, -z);
  });
  footprint.closePath();
  const rampGeometry = new THREE.ExtrudeGeometry(footprint, {
    depth: 1,
    bevelEnabled: false,
  });
  const rampPositions = rampGeometry.getAttribute("position");
  for (let i = 0; i < rampPositions.count; i++) {
    const x = rampPositions.getX(i),
      z = -rampPositions.getY(i),
      fraction = rampPositions.getZ(i);
    rampPositions.setXYZ(i, x, base + fraction * (roadHeight(x) - base), z);
  }
  rampGeometry.computeVertexNormals();
  const street = kit.mesh(rampGeometry, kit.toon(colors.mortar), [0, 0, 0]);
  street.name = "bookshop-street";

  const paving = kit.paint(512, 512, (ctx) => {
    ctx.fillStyle = "#887e70";
    ctx.fillRect(0, 0, 512, 512);
    const shades = ["#b2a18a", "#b8a790", "#ac9b84", "#bdad95", "#ae9e87"];
    for (let row = 0; row < 8; row++) {
      for (let col = -1; col < 5; col++) {
        ctx.fillStyle =
          shades[(((row * 7 + col * 3) % shades.length) + shades.length) % shades.length];
        ctx.fillRect(col * 128 + (row % 2) * 64 + 3, row * 64 + 3, 122, 58);
      }
    }
  });
  paving.wrapS = paving.wrapT = THREE.RepeatWrapping;
  paving.repeat.set(1 / 2.4, 1 / 2.4);
  const pavingMaterial = kit.toon("#ffffff").clone();
  pavingMaterial.map = paving;
  const pavingGeometry = new THREE.ShapeGeometry(footprint);
  const pavingPositions = pavingGeometry.getAttribute("position");
  for (let i = 0; i < pavingPositions.count; i++) {
    const x = pavingPositions.getX(i),
      z = -pavingPositions.getY(i);
    pavingPositions.setXYZ(i, x, roadHeight(x) + 0.004, z);
  }
  pavingGeometry.computeVertexNormals();
  const roadSurface = kit.mesh(pavingGeometry, pavingMaterial, [0, 0, 0]);
  roadSurface.name = "bookshop-road-surface";

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 21; col++) {
      box(
        "bookshop-retaining-stone",
        [-6.7 + col * 0.65 + (row % 2) * 0.16, 0.24 + row * 0.29, back + 0.009],
        [0.59, 0.245, 0.018],
        row % 2 ? "#9a8871" : colors.stone,
      );
    }
  }
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 4; col++) {
      box(
        "bookshop-high-retaining-stone",
        [-6.45 + col * 0.74 + (row % 2) * 0.08, 0.35 + row * 0.36, 3.41],
        [0.67, 0.3, 0.018],
        row % 2 ? colors.stone : "#93816c",
      );
    }
  }
  for (let x = -2.68; x < 6.5; x += 0.66) {
    for (let z = 1.38; z < 2.1; z += 0.42) {
      const tile = kit.mesh(new THREE.PlaneGeometry(0.62, 0.38), kit.toon("#c5b394"), [
        x,
        shopHeight + 0.002,
        z,
      ]);
      tile.rotation.x = -Math.PI / 2;
    }
  }

  const guardPoints: XYZ[] = [];
  const post = (x: number, z: number, surface: number, support: THREE.Mesh, rail: XYZ[]) => {
    const top: XYZ = [x, surface + 0.76, z];
    const mesh = kit.rod([x, surface, z], top, 0.028, colors.iron);
    mesh.name = "bookshop-guard-post";
    mesh.userData.support = support.uuid;
    rail.push(top);
  };
  lowSteps.forEach((step, i) => {
    if (i % 2 === 0)
      post((step.left + step.right) / 2, step.front - 0.065, step.height, step.mesh, guardPoints);
  });
  post(landing.right - 0.08, landing.front - 0.065, landing.height, landing.mesh, guardPoints);
  post(landing.left + 0.08, landing.front - 0.065, landing.height, landing.mesh, guardPoints);
  highSteps.forEach((step, i) => {
    if (i % 2 === 0)
      post((step.left + step.right) / 2, step.front - 0.065, step.height, step.mesh, guardPoints);
  });
  post(-3.85, 3.335, highHeight, highLanding, guardPoints);
  post(-5.15, 3.335, highHeight, highLanding, guardPoints);
  post(-6.5, 3.335, highHeight, highLanding, guardPoints);
  for (let i = 1; i < guardPoints.length; i++) {
    kit.rod(guardPoints[i - 1], guardPoints[i], 0.036, colors.iron).name = "bookshop-guard-rail";
  }
  const innerRail: XYZ[] = [];
  post(landingLeft - 0.1, back + 0.07, highSteps[0].height, highSteps[0].mesh, innerRail);
  highSteps.forEach((step, i) => {
    if (i > 0 && i % 3 === 2)
      post((step.left + step.right) / 2, back + 0.07, step.height, step.mesh, innerRail);
  });
  for (let i = 1; i < innerRail.length; i++) {
    kit.rod(innerRail[i - 1], innerRail[i], 0.032, colors.iron).name = "bookshop-guard-rail";
  }
  return [street, roadSurface];
}
