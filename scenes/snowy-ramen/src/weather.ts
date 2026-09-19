import * as THREE from "three";
import { Kit } from "./kit.ts";

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function createWeather(kit: Kit) {
  const random = seededRandom(1802);
  const count = 720;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (random() - 0.5) * 14.6;
    positions[i * 3 + 1] = random() * 8.5;
    positions[i * 3 + 2] = (random() - 0.5) * 14.6;
    speeds[i] = 0.48 + random() * 0.65;
  }
  const flake = kit.paint(64, 64, (ctx) => {
    const gradient = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.55, "rgba(255,255,255,.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  });
  const geometry = new THREE.BufferGeometry();
  const attribute = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", attribute);
  const material = new THREE.PointsMaterial({
    color: "#e0eaff",
    size: 3.0,
    sizeAttenuation: false,
    map: flake,
    transparent: true,
    opacity: 0.68,
    depthWrite: false,
  });
  const snowfall = new THREE.Points(geometry, material);
  snowfall.frustumCulled = false;
  kit.root.add(snowfall);

  const steamPositions = new Float32Array(34 * 3);
  const alpha = new Float32Array(34);
  const sizes = new Float32Array(34);
  const steamGeometry = new THREE.BufferGeometry();
  steamGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(steamPositions, 3).setUsage(THREE.DynamicDrawUsage),
  );
  steamGeometry.setAttribute(
    "aOpacity",
    new THREE.BufferAttribute(alpha, 1).setUsage(THREE.DynamicDrawUsage),
  );
  steamGeometry.setAttribute(
    "aSize",
    new THREE.BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage),
  );
  const steamMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { pixelsPerUnit: { value: 70 } },
    vertexShader: `
      attribute float aOpacity;
      attribute float aSize;
      uniform float pixelsPerUnit;
      varying float opacity;
      void main() {
        opacity = aOpacity;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * pixelsPerUnit;
      }
    `,
    fragmentShader: `
      varying float opacity;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float shape = max(0.0, 1.0 - dot(p,p));
        gl_FragColor = vec4(0.97, 0.91, 0.79, shape * shape * opacity);
      }
    `,
  });
  const steam = new THREE.Points(steamGeometry, steamMaterial);
  steam.frustumCulled = false;
  kit.root.add(steam);

  function update(delta: number, time: number, reduced: boolean, pixelsPerUnit = 70) {
    snowfall.visible = !reduced;
    material.size = THREE.MathUtils.clamp(pixelsPerUnit * 0.04, 0.85, 3);
    steamMaterial.uniforms.pixelsPerUnit.value = pixelsPerUnit;
    if (!reduced) {
      for (let i = 0; i < count; i++) {
        const p = i * 3;
        positions[p] += (Math.sin(time * 0.45 + i * 2.4) * 0.17 + 0.055) * delta;
        positions[p + 2] += Math.cos(time * 0.35 + i) * delta * 0.1;
        positions[p + 1] -= speeds[i] * delta;
        const roof =
          positions[p] > -4.45 &&
          positions[p] < 3.7 &&
          positions[p + 2] > -4.85 &&
          positions[p + 2] < 2;
        const ground = roof ? 5.1 - Math.abs(positions[p + 2] + 1.4) * 0.31 : 0.35;
        if (positions[p + 1] < ground || Math.abs(positions[p]) > 7.35) {
          positions[p] = (random() - 0.5) * 14.6;
          positions[p + 2] = (random() - 0.5) * 14.6;
          positions[p + 1] = 8.0 + random();
        }
      }
      attribute.needsUpdate = true;
    }
    const t = reduced ? 1.4 : time;
    for (let i = 0; i < 34; i++) {
      const phase = (t * (i < 24 ? 0.19 : 0.14) + i * 0.618) % 1;
      const chimney = i >= 24;
      const x = chimney ? -2.75 : i % 2 ? 0.1 : -1.4;
      const z = chimney ? -3.4 : -2.35;
      const y = chimney ? 5.8 : 1.74;
      steamPositions[i * 3] = x + Math.sin(phase * 5 + i) * phase * (chimney ? 0.4 : 0.14);
      steamPositions[i * 3 + 1] = y + phase * (chimney ? 1.7 : 1.05);
      steamPositions[i * 3 + 2] = z + Math.cos(phase * 4 + i) * phase * 0.1;
      sizes[i] = (chimney ? 0.35 : 0.15) + phase * (chimney ? 0.72 : 0.45);
      alpha[i] = Math.sin(phase * Math.PI) * (chimney ? 0.09 : 0.12);
    }
    steamGeometry.attributes.position.needsUpdate = true;
    steamGeometry.attributes.aOpacity.needsUpdate = true;
    steamGeometry.attributes.aSize.needsUpdate = true;
  }
  return {
    update,
    dispose() {
      geometry.dispose();
      material.dispose();
      steamGeometry.dispose();
      steamMaterial.dispose();
    },
  };
}

export function addWetDetails(kit: Kit) {
  const texture = kit.paint(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 1, 64, 64, 62);
    g.addColorStop(0, "rgba(255,198,115,.7)");
    g.addColorStop(0.4, "rgba(255,202,139,.28)");
    g.addColorStop(1, "rgba(255,207,149,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
  for (const [x, z, width, depth] of [
    [-0.3, 2.6, 7.6, 3.0],
    [4.55, 3.08, 3.4, 3.4],
    [-3.4, 1.95, 2, 2],
  ]) {
    const glow = kit.mesh(
      new THREE.PlaneGeometry(width, depth),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      [x, 0.412, z],
    );
    glow.rotation.x = -Math.PI / 2;
    glow.castShadow = false;
  }
}
