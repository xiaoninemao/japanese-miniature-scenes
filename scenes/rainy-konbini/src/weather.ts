import * as THREE from "three";
import { Kit, type XYZ } from "./kit.ts";

function random(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function createWeather(kit: Kit) {
  const rand = random(73);
  const count = 1050;
  const positions = new Float32Array(count * 6);
  const speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 6] = (rand() - 0.5) * 14.7;
    positions[i * 6 + 1] = rand() * 9;
    positions[i * 6 + 2] = (rand() - 0.5) * 14.7;
    speed[i] = 5.5 + rand() * 3;
  }
  const geometry = new THREE.BufferGeometry();
  const attribute = new THREE.BufferAttribute(positions, 3);
  attribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", attribute);
  const material = new THREE.LineBasicMaterial({
    color: "#bcd6e2",
    transparent: true,
    opacity: 0.13,
    depthWrite: false,
  });
  const rain = new THREE.LineSegments(geometry, material);
  rain.frustumCulled = false;
  rain.renderOrder = 5;
  kit.root.add(rain);

  const rippleMaterial = new THREE.MeshBasicMaterial({
    color: "#bed8da",
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const ripples = new THREE.InstancedMesh(new THREE.RingGeometry(0.96, 1, 32), rippleMaterial, 65);
  ripples.userData.dynamic = true;
  ripples.frustumCulled = false;
  kit.root.add(ripples);
  const ripplePositions: XYZ[] = [];
  for (let i = 0; i < 65; i++) {
    const x = (rand() - 0.5) * 14.5;
    let z = (rand() - 0.5) * 14.5;
    if (x > -6.2 && x < 4.3 && z > -6 && z < 3.5) z = 3.8 + rand() * 3.4;
    ripplePositions.push([x, 0.197, z]);
  }
  const dummy = new THREE.Object3D();
  dummy.rotation.x = -Math.PI / 2;

  function update(delta: number, time: number, reduced: boolean) {
    rain.visible = !reduced;
    ripples.visible = !reduced;
    if (reduced) return;
    for (let i = 0; i < count; i++) {
      const p = i * 6;
      positions[p + 1] -= speed[i] * delta;
      positions[p] -= delta * 0.5;
      const isRoof =
        positions[p] > -4.65 &&
        positions[p] < 3.65 &&
        positions[p + 2] > -4.95 &&
        positions[p + 2] < 1.8;
      if (positions[p + 1] < (isRoof ? 4.2 : 0.3)) {
        positions[p + 1] = 8 + rand();
        positions[p] = (rand() - 0.5) * 14.7;
      }
      positions[p + 3] = positions[p] + 0.025;
      positions[p + 4] = positions[p + 1] + 0.18 + speed[i] * 0.025;
      positions[p + 5] = positions[p + 2];
    }
    attribute.needsUpdate = true;
    for (let i = 0; i < 65; i++) {
      const phase = (time * 0.67 + i * 0.618) % 1;
      dummy.position.set(...ripplePositions[i]);
      dummy.scale.setScalar(phase * 0.2 + 0.012);
      dummy.updateMatrix();
      ripples.setMatrixAt(i, dummy.matrix);
      ripples.setColorAt(i, new THREE.Color("#bddcdd").multiplyScalar((1 - phase) * 0.85));
    }
    ripples.instanceMatrix.needsUpdate = true;
    if (ripples.instanceColor) ripples.instanceColor.needsUpdate = true;
  }
  return { update };
}

export function addWetDetails(kit: Kit) {
  const rand = random(914);
  const puddleMaterial = new THREE.MeshPhysicalMaterial({
    color: "#536c79",
    roughness: 0.09,
    metalness: 0.48,
    transparent: true,
    opacity: 0.31,
    depthWrite: false,
    clearcoat: 1,
  });
  for (let i = 0; i < 28; i++) {
    const x = (rand() - 0.5) * 14.3;
    const z = 3.93 + rand() * 3.1;
    const shape = new THREE.Shape();
    for (let j = 0; j <= 24; j++) {
      const angle = (j / 24) * Math.PI * 2;
      const r = 0.75 + Math.sin(j * 1.7 + i) * 0.14 + rand() * 0.12;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (!j) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
    const mesh = kit.mesh(new THREE.ShapeGeometry(shape), puddleMaterial, [x, 0.176, z]);
    mesh.rotation.x = -Math.PI / 2;
    mesh.scale.set(0.3 + rand() * 0.65, 0.1 + rand() * 0.22, 1);
    mesh.castShadow = false;
  }
  const texture = kit.paint(512, 512, (ctx) => {
    ctx.clearRect(0, 0, 512, 512);
    const glow = ctx.createRadialGradient(256, 256, 4, 256, 256, 240);
    glow.addColorStop(0, "rgba(255,227,167,0.65)");
    glow.addColorStop(0.3, "rgba(235,212,169,0.22)");
    glow.addColorStop(1, "rgba(225,221,182,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 512, 512);
  });
  const pools: [XYZ, number, number][] = [
    [[0, 0.181, 2.9], 7.8, 4.6],
    [[4.8, 0.181, 2.95], 3.2, 3.2],
    [[-5.4, 0.36, 1.6], 1.7, 1.5],
  ];
  for (const [p, width, height] of pools) {
    const glow = kit.mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      p,
    );
    glow.rotation.x = -Math.PI / 2;
    glow.castShadow = false;
  }
}
