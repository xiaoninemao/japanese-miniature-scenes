import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type Color = THREE.ColorRepresentation;
export type XYZ = [number, number, number];

export class Kit {
  readonly root = new THREE.Group();
  readonly textures = new Set<THREE.Texture>();
  private materials = new Map<string, THREE.Material>();
  private cube = new THREE.BoxGeometry(1, 1, 1);
  private geometries = new Set<THREE.BufferGeometry>();
  private ownedMaterials = new Set<THREE.Material>();
  private gradient: THREE.DataTexture;
  private outlines = new THREE.LineBasicMaterial({
    color: "#182435",
    transparent: true,
    opacity: 0.28,
  });

  constructor() {
    this.gradient = new THREE.DataTexture(
      new Uint8Array([95, 155, 209, 255]),
      4,
      1,
      THREE.RedFormat,
    );
    this.gradient.minFilter = THREE.NearestFilter;
    this.gradient.magFilter = THREE.NearestFilter;
    this.gradient.needsUpdate = true;
    this.textures.add(this.gradient);
  }

  toon(color: Color, glow = 0): THREE.MeshToonMaterial {
    const key = `${color}:${glow}`;
    let material = this.materials.get(key);
    if (!material) {
      material = new THREE.MeshToonMaterial({
        color,
        gradientMap: this.gradient,
        emissive: color,
        emissiveIntensity: glow,
      });
      this.materials.set(key, material);
    }
    return material as THREE.MeshToonMaterial;
  }

  basic(color: Color): THREE.MeshBasicMaterial {
    const key = `basic:${color}`;
    let material = this.materials.get(key);
    if (!material) {
      material = new THREE.MeshBasicMaterial({ color });
      this.materials.set(key, material);
    }
    return material as THREE.MeshBasicMaterial;
  }

  mesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: XYZ,
    parent: THREE.Object3D = this.root,
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    this.geometries.add(geometry);
    this.ownedMaterials.add(material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  box(
    position: XYZ,
    size: XYZ,
    color: Color | THREE.Material,
    parent: THREE.Object3D = this.root,
    outline = false,
  ): THREE.Mesh {
    const mesh = this.mesh(
      this.cube,
      typeof color === "object" && color instanceof THREE.Material
        ? color
        : this.toon(color as Color),
      position,
      parent,
    );
    mesh.scale.set(...size);
    if (outline) {
      const lines = new THREE.LineSegments(new THREE.EdgesGeometry(this.cube), this.outlines);
      mesh.add(lines);
    }
    return mesh;
  }

  cylinder(
    position: XYZ,
    radius: number,
    height: number,
    color: Color | THREE.Material,
    parent: THREE.Object3D = this.root,
    segments = 16,
    topRadius = radius,
  ): THREE.Mesh {
    return this.mesh(
      new THREE.CylinderGeometry(topRadius, radius, height, segments),
      color instanceof THREE.Material ? color : this.toon(color),
      position,
      parent,
    );
  }

  rod(
    a: XYZ,
    b: XYZ,
    radius: number,
    color: Color,
    parent: THREE.Object3D = this.root,
  ): THREE.Mesh {
    const from = new THREE.Vector3(...a);
    const to = new THREE.Vector3(...b);
    const delta = to.clone().sub(from);
    const mesh = this.cylinder(
      from.add(to).multiplyScalar(0.5).toArray() as XYZ,
      radius,
      delta.length(),
      color,
      parent,
      8,
    );
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    return mesh;
  }

  tube(
    points: XYZ[],
    radius: number,
    color: Color,
    parent: THREE.Object3D = this.root,
  ): THREE.Mesh {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return this.mesh(
      new THREE.TubeGeometry(curve, 32, radius, 6, false),
      this.toon(color),
      [0, 0, 0],
      parent,
    );
  }

  torus(
    position: XYZ,
    radius: number,
    thickness: number,
    color: Color,
    parent: THREE.Object3D = this.root,
  ): THREE.Mesh {
    return this.mesh(
      new THREE.TorusGeometry(radius, thickness, 6, 32),
      this.toon(color),
      position,
      parent,
    );
  }

  paint(
    width: number,
    height: number,
    draw: (ctx: CanvasRenderingContext2D) => void,
  ): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D is unavailable for the miniature's signs.");
    draw(ctx);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    this.textures.add(texture);
    return texture;
  }

  sign(
    text: string,
    position: XYZ,
    width: number,
    height: number,
    background = "#fff1ce",
    foreground = "#254840",
    parent: THREE.Object3D = this.root,
    fontSize = 70,
  ): THREE.Mesh {
    const texture = this.paint(1024, Math.max(128, Math.round((1024 * height) / width)), (ctx) => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = foreground;
      ctx.font = `700 ${fontSize}px "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width * 0.94);
    });
    return this.mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
      position,
      parent,
    );
  }

  point(position: XYZ, color: Color, intensity: number, distance: number): THREE.PointLight {
    const light = new THREE.PointLight(color, intensity, distance, 2);
    light.position.set(...position);
    this.root.add(light);
    return light;
  }

  // Animated groups, instancing and incompatible vertex layouts must retain their own draw calls.
  batch(): void {
    this.root.updateMatrixWorld(true);
    const groups = new Map<string, { material: THREE.Material; meshes: THREE.Mesh[] }>();
    this.root.traverse((object) => {
      if (
        !(object instanceof THREE.Mesh) ||
        object instanceof THREE.InstancedMesh ||
        Array.isArray(object.material) ||
        object.material.transparent ||
        object.children.length ||
        object.userData.dynamic ||
        (() => {
          let parent = object.parent;
          while (parent && parent !== this.root) {
            if (parent.userData.dynamic) return true;
            parent = parent.parent;
          }
          return false;
        })()
      )
        return;
      const geometry: THREE.BufferGeometry = object.geometry;
      const layout = Object.entries(geometry.attributes)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, attribute]) => `${name}:${attribute.itemSize}:${attribute.normalized}`)
        .join(",");
      const key = `${object.material.uuid}:${layout}`;
      const group: { material: THREE.Material; meshes: THREE.Mesh[] } = groups.get(key) ?? {
        material: object.material,
        meshes: [],
      };
      group.meshes.push(object);
      groups.set(key, group);
    });
    for (const { material, meshes } of groups.values()) {
      if (meshes.length < 4) continue;
      const geometries = meshes.map((mesh) => {
        const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
        if (geometry.index) {
          const result = geometry.toNonIndexed();
          geometry.dispose();
          return result;
        }
        return geometry;
      });
      const merged = mergeGeometries(geometries, false);
      geometries.forEach((geometry) => geometry.dispose());
      if (!merged) throw new Error("Unable to batch the miniature's static geometry.");
      for (const mesh of meshes) mesh.removeFromParent();
      this.mesh(merged, material, [0, 0, 0]);
    }
  }

  dispose(): void {
    const geometries = new Set<THREE.BufferGeometry>([this.cube, ...this.geometries]);
    const materials = new Set<THREE.Material>([
      this.outlines,
      ...this.materials.values(),
      ...this.ownedMaterials,
    ]);
    this.root.traverse((object) => {
      if (
        object instanceof THREE.Mesh ||
        object instanceof THREE.LineSegments ||
        object instanceof THREE.Points
      ) {
        geometries.add(object.geometry);
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) =>
          materials.add(m),
        );
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    this.textures.forEach((texture) => texture.dispose());
  }
}
