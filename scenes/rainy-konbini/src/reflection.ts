import * as THREE from "three";

export function createReflection(resolution: number) {
  const target = new THREE.WebGLRenderTarget(resolution, resolution, {
    type: THREE.HalfFloatType,
    depthBuffer: true,
  });
  const mirror = new THREE.OrthographicCamera();
  const textureMatrix = new THREE.Matrix4();
  const direction = new THREE.Vector3();
  const eye = new THREE.Vector3();
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      tDiffuse: { value: target.texture },
      textureMatrix: { value: textureMatrix },
    },
    vertexShader: `
      uniform mat4 textureMatrix;
      varying vec4 reflectionUv;
      varying vec2 surfaceUv;
      void main() {
        surfaceUv = uv;
        reflectionUv = textureMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      varying vec4 reflectionUv;
      varying vec2 surfaceUv;
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      void main() {
        vec4 uv = reflectionUv;
        uv.x += sin(surfaceUv.y * 1800.0) * 0.0015 * uv.w;
        vec3 reflected = texture2DProj(tDiffuse, uv).rgb;
        float luminance = dot(reflected, vec3(0.2126, 0.7152, 0.0722));
        float grain = hash(floor(surfaceUv * 1400.0));
        gl_FragColor = vec4(reflected * vec3(0.78, 0.85, 0.91),
          (0.2 + grain * 0.17) * smoothstep(0.025, 0.3, luminance));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(14.96, 14.96), material);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.154;
  water.renderOrder = 1;
  const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.16);

  // Orthographic mirrors need an orthographic camera; perspective oblique clipping distorts the base.
  water.onBeforeRender = (renderer, scene, camera) => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    mirror.copy(camera);
    camera.getWorldPosition(eye);
    camera.getWorldDirection(direction);
    mirror.position.set(eye.x, 2 * water.position.y - eye.y, eye.z);
    direction.y *= -1;
    mirror.up.set(0, -1, 0);
    mirror.lookAt(mirror.position.clone().add(direction));
    mirror.updateMatrixWorld();
    textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    textureMatrix
      .multiply(mirror.projectionMatrix)
      .multiply(mirror.matrixWorldInverse)
      .multiply(water.matrixWorld);
    const previousTarget = renderer.getRenderTarget();
    const previousClips = renderer.clippingPlanes;
    const previousShadowUpdate = renderer.shadowMap.autoUpdate;
    const previousXr = renderer.xr.enabled;
    water.visible = false;
    renderer.xr.enabled = false;
    renderer.shadowMap.autoUpdate = false;
    renderer.clippingPlanes = [clip];
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, mirror);
    renderer.setRenderTarget(previousTarget);
    renderer.clippingPlanes = previousClips;
    renderer.shadowMap.autoUpdate = previousShadowUpdate;
    renderer.xr.enabled = previousXr;
    water.visible = true;
  };
  return {
    mesh: water,
    dispose() {
      target.dispose();
      water.geometry.dispose();
      material.dispose();
    },
  };
}
