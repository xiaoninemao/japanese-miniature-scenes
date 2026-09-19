import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { Kit } from "./kit.ts";
import type { SceneAnimation, SceneBuilder, SceneConfig } from "./types.ts";

export function createScene(
  host: HTMLElement,
  entry: SceneConfig,
  build: SceneBuilder,
  onError: (error: Error) => void,
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(entry.background);
  const kit = new Kit();
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    `${entry.title}三维模型。拖动旋转，右键拖动平移，滚轮缩放。触屏单指旋转，双指平移和缩放。方向键旋转，加减键缩放，Home 恢复视角。`,
  );
  host.appendChild(canvas);
  const camera = new THREE.OrthographicCamera(-12, 12, 9, -9, 0.1, 150);
  camera.position.set(...entry.camera);
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(...entry.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.085;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.75;
  controls.panSpeed = 0.7;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = Math.PI / 2 - 0.045;
  controls.minZoom = 0.6;
  controls.maxZoom = 4.5;
  controls.screenSpacePanning = true;
  controls.update();
  controls.saveState();
  scene.add(new THREE.HemisphereLight(entry.light, "#77848a", entry.ambient));
  const sun = new THREE.DirectionalLight(entry.light, entry.intensity);
  sun.position.set(-7, 15, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 });
  sun.shadow.normalBias = 0.03;
  sun.shadow.bias = -0.0001;
  sun.shadow.radius = 3;
  scene.add(sun);
  const rim = new THREE.DirectionalLight("#b1cad5", entry.ambient * 0.65);
  rim.position.set(3, 7, -9);
  scene.add(rim);

  let animation: SceneAnimation | void;
  let composer: EffectComposer | undefined;
  let bloom: UnrealBloomPass | undefined;
  let output: OutputPass | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let frame = 0;
  let disposed = false;
  let elapsed = 0;
  let previous = performance.now();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motion.matches;
  const setMotion = () => {
    reducedMotion = motion.matches;
    controls.enableDamping = !reducedMotion;
  };
  setMotion();
  motion.addEventListener("change", setMotion);
  const keydown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "_", "Home"].includes(
        event.key,
      )
    )
      return;
    event.preventDefault();
    if (event.key === "Home") {
      controls.reset();
      return;
    }
    if (["+", "=", "-", "_"].includes(event.key)) {
      camera.zoom = THREE.MathUtils.clamp(
        camera.zoom * (["+", "="].includes(event.key) ? 1.12 : 1 / 1.12),
        controls.minZoom,
        controls.maxZoom,
      );
      camera.updateProjectionMatrix();
    } else {
      const spherical = new THREE.Spherical().setFromVector3(
        camera.position.clone().sub(controls.target),
      );
      spherical.theta += event.key === "ArrowLeft" ? 0.12 : event.key === "ArrowRight" ? -0.12 : 0;
      spherical.phi = THREE.MathUtils.clamp(
        spherical.phi + (event.key === "ArrowUp" ? -0.09 : event.key === "ArrowDown" ? 0.09 : 0),
        controls.minPolarAngle,
        controls.maxPolarAngle,
      );
      camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(controls.target));
    }
    controls.update();
  };
  const fail = (error: unknown) => {
    cancelAnimationFrame(frame);
    onError(error instanceof Error ? error : new Error(String(error)));
  };
  const lost = (event: Event) => {
    event.preventDefault();
    fail(new Error("图形上下文已中断，请刷新页面重新载入。"));
  };
  canvas.addEventListener("keydown", keydown);
  canvas.addEventListener("webglcontextlost", lost);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    motion.removeEventListener("change", setMotion);
    canvas.removeEventListener("keydown", keydown);
    canvas.removeEventListener("webglcontextlost", lost);
    controls.dispose();
    animation?.dispose?.();
    bloom?.dispose();
    output?.dispose();
    composer?.dispose();
    sun.shadow.map?.dispose();
    kit.dispose();
    renderer.dispose();
    canvas.remove();
    delete host.dataset.sceneReady;
  };
  try {
    animation = build(kit);
    kit.batch();
    scene.add(kit.root);
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), entry.ambient < 1 ? 0.17 : 0.09, 0.4, 1.4);
    composer.addPass(bloom);
    output = new OutputPass();
    composer.addPass(output);
    const pixelsPerUnit = () =>
      (host.clientHeight * renderer.getPixelRatio() * camera.zoom) / (camera.top - camera.bottom);
    const resize = () => {
      if (disposed || !host.clientWidth || !host.clientHeight) return;
      const width = host.clientWidth,
        height = host.clientHeight,
        aspect = width / height;
      const span = Math.max(entry.verticalSpan, 22.4 / aspect);
      camera.left = (-span * aspect) / 2;
      camera.right = (span * aspect) / 2;
      camera.top = span / 2;
      camera.bottom = -span / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer?.setSize(width, height);
      animation?.update?.(0, elapsed, reducedMotion, pixelsPerUnit());
      composer?.render();
    };
    resizeObserver = new ResizeObserver(() => {
      try {
        resize();
      } catch (error) {
        fail(error);
      }
    });
    resizeObserver.observe(host);
    resize();
    const render = (now: number) => {
      if (disposed) return;
      try {
        const delta = Math.min((now - previous) / 1000, 0.045);
        previous = now;
        elapsed += delta;
        controls.update();
        animation?.update?.(delta, elapsed, reducedMotion, pixelsPerUnit());
        composer?.render();
        frame = requestAnimationFrame(render);
      } catch (error) {
        fail(error);
      }
    };
    render(performance.now());
    host.dataset.sceneReady = "true";
    return dispose;
  } catch (error) {
    dispose();
    throw error;
  }
}
