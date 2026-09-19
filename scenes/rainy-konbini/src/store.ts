import * as THREE from "three";
import { Kit } from "./kit.ts";

export function buildStore(kit: Kit): void {
  const store = new THREE.Group();
  store.name = "雨宿り · AME MART";
  kit.root.add(store);

  const c = {
    ivory: "#fff1ce",
    cream: "#e9e1c9",
    tile: "#d6d5c1",
    celadon: "#82b9ad",
    darkGreen: "#365f57",
    coral: "#d98583",
    charcoal: "#39474c",
    metal: "#bac5be",
    wood: "#b99573",
  };
  const glow = kit.toon(c.ivory, 0.85);
  const glass = new THREE.MeshBasicMaterial({
    color: "#b7e5dc",
    transparent: true,
    opacity: 0.045,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const caseGlass = new THREE.MeshBasicMaterial({
    color: "#d7f7ed",
    transparent: true,
    opacity: 0.075,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const b = (
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    color: THREE.ColorRepresentation | THREE.Material,
    parent: THREE.Object3D = store,
    outline = false,
  ) => kit.box([x, y, z], [w, h, d], color, parent, outline);
  const group = (x: number, y: number, z: number, rotation = 0) => {
    const result = new THREE.Group();
    result.position.set(x, y, z);
    result.rotation.y = rotation;
    store.add(result);
    return result;
  };
  const pane = (
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    rotation = 0,
    parent: THREE.Object3D = store,
    material: THREE.Material = glass,
  ) => {
    const mesh = kit.mesh(new THREE.PlaneGeometry(w, h), material, [x, y, z], parent);
    mesh.rotation.y = rotation;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.renderOrder = 3;
    return mesh;
  };
  const label = (
    text: string,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    parent: THREE.Object3D = store,
    bg = c.ivory,
    fg = c.darkGreen,
    font = 76,
  ) => kit.sign(text, [x, y, z], w, h, bg, fg, parent, font);

  // The low plinth is flush with the sidewalk; every shop fixture stays behind the glazing.
  b(-0.5, 0.385, -1.675, 7.8, 0.13, 6.05, c.charcoal);
  b(-0.5, 0.435, -1.675, 7.64, 0.03, 5.89, "#eee6d1");
  for (let ix = 0; ix < 13; ix++) {
    for (let iz = 0; iz < 10; iz++) {
      const x = -4.09 + ix * 0.598;
      const z = -4.36 + iz * 0.59;
      b(x, 0.454, z, 0.587, 0.008, 0.579, (ix + iz) % 4 === 0 ? "#e1ddc9" : "#ece5d2");
    }
  }
  b(-4.3, 2.115, -1.675, 0.2, 3.37, 6.05, "#d2d0bc");
  b(-0.5, 2.115, -4.6, 7.8, 3.37, 0.2, "#e4ddc9");
  b(-4.185, 0.67, -1.73, 0.035, 0.43, 5.76, c.celadon);
  b(-0.5, 0.67, -4.485, 7.52, 0.43, 0.035, c.celadon);
  b(-0.5, 2.72, -4.478, 7.51, 0.08, 0.035, c.coral);
  b(-4.18, 2.72, -1.8, 0.035, 0.08, 5.4, c.coral);

  // Tiled knee walls leave a continuous view through both camera-facing elevations.
  for (let i = 0; i < 11; i++) {
    const x = -4.02 + i * 0.49;
    b(x, 0.625, 1.275, 0.477, 0.34, 0.15, i % 3 === 0 ? "#92b7ab" : "#abc4b6");
    b(x, 0.625, 1.347, 0.477, 0.012, 0.006, "#d2decc");
  }
  for (let i = 0; i < 12; i++) {
    const z = -4.42 + i * 0.49;
    b(3.325, 0.625, z, 0.15, 0.34, 0.477, i % 3 === 0 ? "#92b7ab" : "#abc4b6");
    b(3.397, 0.625, z, 0.006, 0.012, 0.477, "#d2decc");
  }
  b(-1.59, 0.825, 1.29, 5.49, 0.065, 0.12, c.darkGreen);
  b(3.3, 0.825, -1.675, 0.12, 0.065, 5.95, c.darkGreen);
  for (const x of [-4.29, -2.65, -0.98, 0.72, 1.19, 3.29]) {
    b(x, 2.095, 1.29, 0.065, 2.53, 0.095, c.cream);
    b(x + 0.019, 2.095, 1.344, 0.019, 2.53, 0.013, c.darkGreen);
  }
  for (const [x, w] of [
    [-3.47, 1.57],
    [-1.815, 1.6],
    [-0.13, 1.63],
    [0.955, 0.4],
  ]) {
    pane(x, 2.09, 1.3, w, 2.45);
  }
  for (const z of [-4.56, -3.04, -1.53, -0.03, 1.29]) {
    b(3.3, 2.095, z, 0.095, 2.53, 0.065, c.cream);
    b(3.355, 2.095, z, 0.012, 2.53, 0.02, c.darkGreen);
  }
  for (const [z, w] of [
    [-3.8, 1.45],
    [-2.285, 1.44],
    [-0.78, 1.43],
    [0.63, 1.25],
  ]) {
    pane(3.31, 2.09, z, w, 2.45, Math.PI / 2);
  }
  b(-0.5, 3.34, 1.28, 7.8, 0.12, 0.16, c.darkGreen);
  b(3.3, 3.34, -1.675, 0.16, 0.12, 6.05, c.darkGreen);

  // Twin automatic doors, offset tracks, small handles and safety decals.
  b(2.225, 0.474, 1.275, 2.1, 0.045, 0.17, c.metal);
  b(2.225, 3.16, 1.24, 2.11, 0.24, 0.19, c.cream, store, true);
  b(2.225, 3.19, 1.32, 0.23, 0.065, 0.045, c.charcoal);
  b(2.225, 3.185, 1.346, 0.045, 0.024, 0.008, kit.basic(c.coral));
  for (let i = 0; i < 2; i++) {
    const x = 1.715 + i * 1.02;
    pane(x, 1.77, 1.3 - i * 0.025, 0.99, 2.55);
    b(x, 0.54, 1.305, 1.015, 0.09, 0.075, c.metal);
    b(x, 2.99, 1.305, 1.015, 0.045, 0.065, c.metal);
    for (const edge of [-0.496, 0.496]) b(x + edge, 1.76, 1.305, 0.028, 2.5, 0.065, c.metal);
    b(x, 1.46, 1.336, 0.96, 0.073, 0.012, c.celadon);
    label(
      i === 0 ? "← 自動" : "ドア →",
      x,
      1.46,
      1.345,
      0.46,
      0.065,
      store,
      c.celadon,
      "#f7f2db",
      96,
    );
    b(x + (i === 0 ? 0.4 : -0.4), 1.21, 1.326, 0.027, 0.24, 0.045, c.darkGreen);
  }
  b(2.18, 0.473, 0.78, 1.72, 0.028, 0.7, c.darkGreen);
  for (let i = 0; i < 10; i++) b(2.18, 0.491, 0.485 + i * 0.062, 1.59, 0.009, 0.013, "#65877b");
  const welcome = label(
    "雨宿り  WELCOME",
    2.18,
    0.499,
    0.77,
    1.3,
    0.19,
    store,
    c.darkGreen,
    c.ivory,
  );
  welcome.rotation.x = -Math.PI / 2;

  // An opaque, complete roof and a thin luminous fascia rather than a cut-away shell.
  b(-0.5, 3.78, -1.675, 7.8, 0.3, 6.05, "#c9c5ae");
  b(-0.5, 3.595, -1.675, 7.55, 0.06, 5.8, "#e4dbc1");
  b(-0.5, 3.985, -1.675, 7.8, 0.11, 6.05, c.darkGreen);
  b(-0.5, 4.105, -1.675, 7.76, 0.09, 6.01, "#8d9d99");
  b(-0.5, 3.72, 1.3, 7.69, 0.5, 0.08, glow);
  b(3.35, 3.72, -1.66, 0.08, 0.5, 5.89, glow);
  b(-0.5, 3.97, 1.325, 7.78, 0.067, 0.047, c.celadon);
  b(-0.5, 3.463, 1.325, 7.78, 0.047, 0.047, c.coral);
  b(3.379, 3.97, -1.66, 0.035, 0.067, 5.91, c.celadon);
  b(3.379, 3.463, -1.66, 0.035, 0.047, 5.91, c.coral);
  // The roof slab reaches z=1.35 / x=3.4, beyond the lightbox faces.
  label("雨宿り  AME MART", -0.56, 3.738, 1.365, 5.8, 0.37, store, c.ivory, c.darkGreen, 80);
  label("24 H", 2.85, 3.745, 1.365, 0.56, 0.22, store, c.ivory, c.coral, 180);
  const sideSign = label(
    "雨宿り  AME MART  ·  24 H",
    3.415,
    3.74,
    -1.6,
    4.9,
    0.37,
    store,
    c.ivory,
    c.darkGreen,
    80,
  );
  sideSign.rotation.y = Math.PI / 2;
  // A small original umbrella mark at the left of the shop name.
  const umbrella = kit.paint(256, 256, (ctx) => {
    ctx.fillStyle = c.ivory;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = c.coral;
    ctx.beginPath();
    ctx.arc(128, 125, 87, Math.PI, 0);
    ctx.lineTo(41, 125);
    ctx.fill();
    ctx.strokeStyle = c.darkGreen;
    ctx.lineWidth = 13;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(128, 39);
    ctx.lineTo(128, 187);
    ctx.arc(108, 187, 20, 0, Math.PI);
    ctx.stroke();
  });
  kit.mesh(
    new THREE.PlaneGeometry(0.38, 0.38),
    new THREE.MeshBasicMaterial({ map: umbrella }),
    [-3.88, 3.74, 1.365],
    store,
  );
  b(-0.48, 3.285, 1.575, 7.65, 0.115, 0.75, c.celadon);
  b(-0.48, 3.202, 1.575, 7.57, 0.045, 0.69, "#e4e0c8");
  b(-0.48, 3.276, 1.935, 7.65, 0.15, 0.03, c.darkGreen);
  b(-0.48, 3.231, 1.947, 7.61, 0.025, 0.006, c.coral);
  for (const x of [-3.6, -1.2, 1.6]) {
    b(x, 3.168, 1.62, 0.98, 0.026, 0.17, glow);
    kit.rod([x, 3.27, 1.79], [x, 3.43, 1.34], 0.023, c.darkGreen, store);
  }

  // Roof seams, parapet caps, weathered service equipment and bent drain pipes.
  for (let i = 0; i < 18; i++) b(-4.13 + i * 0.43, 4.155, -1.7, 0.028, 0.028, 5.8, "#a9b6ad");
  b(-0.5, 4.19, -4.63, 7.8, 0.1, 0.13, c.darkGreen);
  b(-4.33, 4.19, -1.675, 0.13, 0.1, 6.05, c.darkGreen);
  b(3.33, 4.18, -1.675, 0.13, 0.08, 6.05, c.darkGreen);
  b(-0.5, 4.18, 1.28, 7.8, 0.08, 0.13, c.darkGreen);
  for (const x of [-2.85, -1.31]) {
    b(x, 4.24, -3.23, 1.28, 0.12, 1.19, c.charcoal);
    b(x, 4.55, -3.23, 1.14, 0.51, 1.05, "#d3d4c5", store, true);
    b(x, 4.83, -3.23, 1.2, 0.055, 1.11, "#a8b7ae");
    const rim = kit.torus([x, 4.867, -3.23], 0.37, 0.033, c.charcoal, store);
    rim.rotation.x = Math.PI / 2;
    kit.cylinder([x, 4.844, -3.23], 0.35, 0.015, c.charcoal, store, 32);
    kit.cylinder([x, 4.864, -3.23], 0.065, 0.025, c.metal, store);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      kit.rod(
        [x, 4.883, -3.23],
        [x + Math.cos(a) * 0.34, 4.883, -3.23 + Math.sin(a) * 0.34],
        0.008,
        "#a2b1a7",
        store,
      );
    }
    for (let i = 0; i < 7; i++) b(x, 4.38 + i * 0.057, -2.698, 0.85, 0.018, 0.013, "#657d77");
    kit.tube(
      [
        [x + 0.48, 4.4, -3.2],
        [x + 0.69, 4.33, -3.2],
        [x + 0.74, 4.23, -3.6],
        [x + 0.74, 4.23, -4.15],
      ],
      0.047,
      "#bbbfad",
      store,
    );
  }
  b(1.55, 4.215, -3.65, 1.03, 0.1, 0.91, "#526d66", store, true);
  b(1.55, 4.276, -3.65, 0.86, 0.025, 0.74, "#a6b5a8");
  kit.cylinder([2.48, 4.43, -4.03], 0.12, 0.53, c.metal, store);
  kit.cylinder([2.48, 4.71, -4.03], 0.21, 0.045, c.charcoal, store);
  kit.tube(
    [
      [-4.22, 3.91, -4.33],
      [-4.16, 3.54, -4.35],
      [-4.16, 0.69, -4.35],
      [-3.99, 0.59, -4.35],
    ],
    0.048,
    "#7f998e",
    store,
  );

  const colors = ["#bc7770", "#88aa7b", "#e0bf70", "#799db0", "#a19ab5", "#d59870"];
  const labelMaterials = colors.map((color, i) => {
    const texture = kit.paint(128, 128, (ctx) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = "#fff2d5";
      ctx.fillRect(8, 39, 112, 46);
      ctx.fillStyle = "#48655e";
      ctx.font = "bold 21px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(["茶", "MILK", "米", "SODA", "菓子", "珈琲"][i], 64, 68);
      ctx.fillStyle = "#fff2d5";
      ctx.fillRect(21, 97, 87, 5);
      ctx.fillRect(34, 109, 63, 4);
    });
    return new THREE.MeshBasicMaterial({ map: texture });
  });
  const priceTexture = kit.paint(512, 64, (ctx) => {
    ctx.fillStyle = "#faf0d6";
    ctx.fillRect(0, 0, 512, 64);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = "#d98583";
      ctx.fillRect(i * 102 + 7, 8, 18, 48);
      ctx.fillStyle = "#48635c";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText(["¥128", "¥160", "¥98", "¥218", "¥148"][i], i * 102 + 29, 44);
    }
  });
  const prices = new THREE.MeshBasicMaterial({ map: priceTexture, side: THREE.DoubleSide });
  const priceStrip = (
    x: number,
    y: number,
    z: number,
    w: number,
    parent: THREE.Object3D,
    rotation = 0,
  ) => {
    const mesh = kit.mesh(new THREE.PlaneGeometry(w, 0.048), prices, [x, y, z], parent);
    mesh.rotation.y = rotation;
  };
  const product = (
    x: number,
    y: number,
    z: number,
    type: number,
    tint: number,
    parent: THREE.Object3D,
    rotation = 0,
  ) => {
    const p = new THREE.Group();
    p.position.set(x, y, z);
    p.rotation.y = rotation;
    parent.add(p);
    const color = colors[tint % colors.length];
    if (type === 0) {
      kit.cylinder([0, 0.086, 0], 0.051, 0.165, color, p, 10);
      kit.cylinder([0, 0.178, 0], 0.05, 0.033, color, p, 10, 0.025);
      kit.cylinder([0, 0.208, 0], 0.025, 0.03, c.ivory, p, 10);
      kit.cylinder([0, 0.085, 0], 0.052, 0.085, "#f5e8c9", p, 10);
      kit.mesh(
        new THREE.PlaneGeometry(0.063, 0.074),
        labelMaterials[tint % 6],
        [0, 0.086, 0.053],
        p,
      );
    } else if (type === 1) {
      kit.cylinder([0, 0.079, 0], 0.051, 0.153, color, p, 12);
      kit.cylinder([0, 0.159, 0], 0.053, 0.009, c.metal, p, 12);
      b(0, 0.166, 0, 0.024, 0.005, 0.012, c.charcoal, p);
      kit.mesh(new THREE.PlaneGeometry(0.075, 0.11), labelMaterials[tint % 6], [0, 0.08, 0.052], p);
    } else if (type === 2) {
      const bag = kit.mesh(new THREE.SphereGeometry(1, 7, 5), kit.toon(color), [0, 0.105, 0], p);
      bag.scale.set(0.077, 0.1, 0.043);
      b(0, 0.203, 0, 0.132, 0.013, 0.025, c.ivory, p);
      b(0, 0.011, 0, 0.125, 0.015, 0.027, color, p);
      kit.mesh(
        new THREE.PlaneGeometry(0.105, 0.125),
        labelMaterials[tint % 6],
        [0, 0.106, 0.041],
        p,
      );
    } else {
      b(0, 0.103, 0, 0.105, 0.205, 0.085, color, p);
      b(0, 0.207, 0, 0.109, 0.009, 0.089, c.ivory, p);
      kit.mesh(
        new THREE.PlaneGeometry(0.094, 0.16),
        labelMaterials[tint % 6],
        [0, 0.107, 0.044],
        p,
      );
    }
  };

  // Low, double-sided gondolas: four fully populated decks each, with open cross-aisles.
  for (let aisle = 0; aisle < 3; aisle++) {
    const shelf = group(-2.85 + aisle * 1.65, 0, -2.22);
    b(0, 0.535, 0, 0.66, 0.145, 1.78, c.darkGreen, shelf);
    b(0, 1.075, 0, 0.038, 1.08, 1.7, "#d8d9c8", shelf);
    for (const z of [-0.825, 0.825]) {
      b(0, 1.095, z, 0.055, 1.12, 0.055, c.metal, shelf);
      for (let hole = 0; hole < 8; hole++)
        b(0.032, 0.74 + hole * 0.1, z, 0.004, 0.015, 0.022, c.charcoal, shelf);
    }
    for (let level = 0; level < 4; level++) {
      const y = 0.625 + level * 0.263;
      b(0, y, 0, 0.66, 0.035, 1.78, "#e7dfc6", shelf);
      for (const side of [-1, 1]) {
        b(side * 0.326, y + 0.005, 0, 0.022, 0.065, 1.78, level === 3 ? c.coral : c.celadon, shelf);
        priceStrip(side * 0.34, y + 0.006, 0, 1.69, shelf, (side * Math.PI) / 2);
        for (let j = 0; j < 9; j++) {
          product(
            side * 0.2,
            y + 0.022,
            -0.71 + j * 0.178,
            (aisle + level) % 4,
            (j + aisle + level) % 6,
            shelf,
            (side * Math.PI) / 2,
          );
        }
      }
    }
    b(0, 1.55, 0.878, 0.64, 0.13, 0.028, c.celadon, shelf);
    label(
      ["お菓子", "毎日のパン", "飲みもの"][aisle],
      0,
      1.55,
      0.896,
      0.56,
      0.105,
      shelf,
      c.celadon,
      c.ivory,
      130,
    );
    for (const z of [-1.11, 1.12])
      b(-2.85 + aisle * 1.65, 0.465, -2.22 + z, 0.64, 0.006, 0.045, "#a5bbaa");
  }

  // Bright back-wall refrigerators with visible shelves behind near-invisible doors.
  const fridge = group(-1.93, 0, -4.135);
  b(0, 1.55, 0, 4.3, 2.16, 0.69, c.charcoal, fridge, true);
  b(0, 1.58, 0.353, 4.07, 1.98, 0.025, "#d7e4d5", fridge);
  b(0, 2.61, 0.13, 4.33, 0.16, 0.48, c.celadon, fridge);
  label(
    "冷たい飲みもの  ·  FRESH & COOL",
    0,
    2.615,
    0.382,
    3.84,
    0.115,
    fridge,
    c.celadon,
    c.ivory,
    65,
  );
  for (let door = 0; door < 4; door++) {
    const x = -1.59 + door * 1.06;
    b(x - 0.5, 1.57, 0.65, 0.038, 1.96, 0.043, c.metal, fridge);
    b(x - 0.456, 1.57, 0.403, 0.02, 1.85, 0.035, glow, fridge);
    for (let level = 0; level < 5; level++) {
      const y = 0.7 + level * 0.352;
      b(x, y, 0.472, 0.98, 0.031, 0.25, c.ivory, fridge);
      priceStrip(x, y - 0.013, 0.615, 0.95, fridge);
      for (let j = 0; j < 7; j++)
        product(
          x - 0.39 + j * 0.131,
          y + 0.021,
          0.486,
          (level + door) % 3 === 0 ? 1 : 0,
          (j + door + level) % 6,
          fridge,
        );
    }
    pane(x, 1.59, 0.652, 0.98, 1.86, 0, fridge, caseGlass);
    b(x + 0.4, 1.5, 0.69, 0.026, 0.42, 0.039, c.charcoal, fridge);
    b(x, 0.625, 0.65, 1.02, 0.045, 0.04, c.metal, fridge);
    b(x, 2.565, 0.65, 1.02, 0.045, 0.04, c.metal, fridge);
  }
  for (let i = 0; i < 26; i++) b(-3.89 + i * 0.16, 0.54, -3.767, 0.07, 0.055, 0.012, "#7b9288");

  // Staff door, notices and a small clock live on the solid wall, not in the sightline.
  b(1.08, 1.58, -4.473, 1.12, 2.25, 0.06, c.darkGreen, store, true);
  b(1.08, 1.57, -4.43, 0.99, 2.11, 0.028, "#c9c7b4");
  b(1.08, 2.12, -4.405, 0.57, 0.47, 0.024, "#788d83");
  label("STAFF ONLY", 1.08, 1.88, -4.384, 0.69, 0.1, store, "#c9c7b4", c.darkGreen, 110);
  b(1.43, 1.42, -4.369, 0.025, 0.16, 0.025, c.charcoal);
  b(1.35, 1.47, -4.351, 0.15, 0.025, 0.035, c.metal);
  label("納品口", 1.08, 2.55, -4.39, 0.45, 0.15, store, "#c9c7b4", c.darkGreen, 160);
  const clock = kit.cylinder([1.08, 3.08, -4.39], 0.235, 0.06, c.darkGreen, store, 40);
  clock.rotation.x = Math.PI / 2;
  const clockFace = kit.cylinder([1.08, 3.08, -4.348], 0.207, 0.014, glow, store, 40);
  clockFace.rotation.x = Math.PI / 2;
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const tick = b(
      1.08 + Math.sin(angle) * 0.173,
      3.08 + Math.cos(angle) * 0.173,
      -4.334,
      0.014,
      0.028,
      0.006,
      c.darkGreen,
    );
    tick.rotation.z = -angle;
  }
  kit.rod([1.08, 3.08, -4.322], [0.971, 3.143, -4.322], 0.013, c.darkGreen, store);
  kit.rod([1.08, 3.08, -4.317], [1.212, 3.004, -4.317], 0.008, c.coral, store);
  b(2.6, 1.26, -4.34, 1.02, 1.58, 0.28, "#b9c6b7", store, true);
  for (let i = 0; i < 3; i++) {
    b(2.6, 0.75 + i * 0.48, -4.188, 0.92, 0.42, 0.024, "#d7d7c0");
    b(2.93, 0.75 + i * 0.48, -4.16, 0.045, 0.11, 0.034, c.darkGreen);
  }
  label("地域のお知らせ", 2.58, 2.73, -4.46, 0.98, 0.18, store, c.coral, c.ivory, 95);
  for (let i = 0; i < 3; i++) {
    label(
      ["雨の日の便り", "新米 おにぎり", "今夜も営業中"][i],
      2.22 + (i % 2) * 0.59,
      2.4 - Math.floor(i / 2) * 0.29,
      -4.44,
      0.48,
      0.22,
      store,
      i === 1 ? "#ead3a3" : c.ivory,
      c.darkGreen,
      80,
    );
  }

  // Bento and onigiri display faces across the aisle from the left wall.
  const deli = group(-3.945, 0, -2.13, Math.PI / 2);
  b(0, 0.62, 0, 2.13, 0.32, 0.44, c.celadon, deli, true);
  b(0, 1.1, -0.2, 2.13, 0.95, 0.045, "#dce0c8", deli);
  label("手づくり弁当  ・  おにぎり", 0, 1.68, -0.16, 2.1, 0.17, deli, c.coral, c.ivory, 58);
  const riceShape = new THREE.Shape();
  riceShape.moveTo(-0.072, 0);
  riceShape.quadraticCurveTo(-0.09, 0.02, -0.06, 0.07);
  riceShape.lineTo(-0.015, 0.145);
  riceShape.quadraticCurveTo(0, 0.164, 0.015, 0.145);
  riceShape.lineTo(0.06, 0.07);
  riceShape.quadraticCurveTo(0.09, 0.02, 0.072, 0);
  riceShape.closePath();
  const riceGeometry = new THREE.ExtrudeGeometry(riceShape, {
    depth: 0.055,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.009,
    bevelSegments: 1,
    steps: 1,
  });
  for (let level = 0; level < 3; level++) {
    const y = 0.79 + level * 0.27;
    b(0, y, 0.012, 2.11, 0.033, 0.43, c.ivory, deli);
    priceStrip(0, y, 0.242, 2.03, deli);
    for (let j = 0; j < 7; j++) {
      const x = -0.88 + j * 0.29;
      if (level === 2) {
        kit.mesh(riceGeometry, kit.toon("#f5eccd"), [x, y + 0.025, 0.095], deli);
        b(x, y + 0.069, 0.156, 0.051, 0.08, 0.012, "#40564b", deli);
        b(x, y + 0.126, 0.155, 0.026, 0.02, 0.012, c.coral, deli);
      } else {
        b(x, y + 0.041, 0.03, 0.245, 0.047, 0.26, "#414f49", deli);
        b(x - 0.05, y + 0.077, 0.03, 0.108, 0.035, 0.21, "#eee6c9", deli);
        for (let food = 0; food < 3; food++) {
          kit.cylinder(
            [x + 0.06, y + 0.078, -0.043 + food * 0.073],
            0.029,
            0.03,
            ["#bd8658", "#8baf76", "#d89670"][food],
            deli,
            7,
          );
        }
        b(x, y + 0.108, 0.03, 0.25, 0.008, 0.263, caseGlass, deli).castShadow = false;
      }
    }
  }

  // Low checkout, coffee and hot-food equipment stay below the top shelf line.
  const checkout = group(-2.72, 0, 0.29);
  b(0, 0.78, 0, 2.85, 0.66, 0.73, c.celadon, checkout, true);
  b(0, 0.51, 0, 2.87, 0.11, 0.75, c.darkGreen, checkout);
  b(0, 1.137, 0, 2.98, 0.085, 0.82, "#e8d5b0", checkout, true);
  b(0, 0.81, 0.379, 2.69, 0.4, 0.02, "#a6c6b6", checkout);
  b(0, 0.565, 0.397, 2.74, 0.035, 0.035, c.coral, checkout);
  label(
    "雨宿り  ·  ほっと、ひと息。",
    -0.09,
    0.85,
    0.397,
    2.16,
    0.24,
    checkout,
    "#a6c6b6",
    c.darkGreen,
    73,
  );
  b(1.05, 1.2, -0.1, 0.43, 0.065, 0.37, c.charcoal, checkout);
  b(1.05, 1.32, -0.16, 0.058, 0.2, 0.052, c.charcoal, checkout);
  const screen = b(1.05, 1.44, -0.12, 0.4, 0.25, 0.045, c.charcoal, checkout, true);
  screen.rotation.x = -0.16;
  const screenFace = label(
    "AME  ¥ 680",
    1.05,
    1.447,
    -0.091,
    0.343,
    0.17,
    checkout,
    "#98c6b3",
    "#315b50",
    100,
  );
  screenFace.rotation.x = -0.16;
  b(0.82, 1.206, 0.25, 0.18, 0.045, 0.18, "#d2d6c5", checkout);
  b(0.82, 1.236, 0.25, 0.13, 0.015, 0.08, c.charcoal, checkout);
  b(1.23, 1.21, 0.21, 0.18, 0.058, 0.21, c.coral, checkout);
  b(1.23, 1.242, 0.21, 0.136, 0.006, 0.158, "#e8c4ab", checkout);

  b(-1.02, 1.405, -0.02, 0.42, 0.45, 0.36, c.charcoal, checkout, true);
  b(-1.02, 1.55, 0.168, 0.31, 0.11, 0.016, c.celadon, checkout);
  label("COFFEE", -1.02, 1.55, 0.181, 0.285, 0.07, checkout, c.celadon, c.ivory, 170);
  b(-1.02, 1.26, 0.2, 0.39, 0.033, 0.23, c.metal, checkout);
  b(-1.02, 1.393, 0.183, 0.041, 0.08, 0.045, c.metal, checkout);
  kit.cylinder([-1.02, 1.325, 0.22], 0.049, 0.094, c.ivory, checkout, 12, 0.06);
  for (let i = 0; i < 5; i++)
    kit.cylinder([-0.69, 1.218 + i * 0.027, 0.15], 0.05, 0.067, "#efe1bc", checkout, 12, 0.059);

  // Oden's divided simmering pan and a glazed fried-food warmer.
  b(-0.31, 1.215, 0.08, 0.51, 0.075, 0.43, c.metal, checkout, true);
  b(-0.31, 1.258, 0.08, 0.46, 0.015, 0.36, "#b98e56", checkout);
  b(-0.31, 1.275, 0.08, 0.014, 0.031, 0.38, c.metal, checkout);
  b(-0.31, 1.275, 0.08, 0.47, 0.031, 0.014, c.metal, checkout);
  for (let i = 0; i < 6; i++) {
    kit.cylinder(
      [-0.465 + (i % 3) * 0.154, 1.289, -0.005 + Math.floor(i / 3) * 0.17],
      0.047,
      0.025,
      i % 2 ? "#e8d7a5" : "#cbad7f",
      checkout,
      8,
    );
  }
  pane(-0.31, 1.39, 0.296, 0.53, 0.26, 0, checkout, caseGlass);
  b(-0.31, 1.535, 0.085, 0.56, 0.033, 0.46, c.cream, checkout);
  for (const x of [-0.57, -0.05]) b(x, 1.39, 0.284, 0.019, 0.28, 0.019, c.metal, checkout);
  label("おでん", -0.31, 1.522, 0.321, 0.34, 0.08, checkout, c.cream, c.coral, 220);
  b(0.34, 1.22, 0.055, 0.48, 0.075, 0.44, c.coral, checkout);
  for (let level = 0; level < 2; level++) {
    b(0.34, 1.28 + level * 0.155, 0.055, 0.44, 0.023, 0.38, c.metal, checkout);
    for (let j = 0; j < 3; j++) {
      const bun = kit.mesh(
        new THREE.SphereGeometry(0.056, 8, 6),
        kit.toon("#dbaa67"),
        [0.2 + j * 0.14, 1.321 + level * 0.155, 0.105],
        checkout,
      );
      bun.scale.set(1, 0.63, 1.4);
    }
  }
  pane(0.34, 1.405, 0.294, 0.46, 0.33, 0, checkout, caseGlass);
  for (const x of [0.108, 0.572]) b(x, 1.414, 0.274, 0.022, 0.35, 0.022, c.cream, checkout);
  b(0.34, 1.6, 0.06, 0.51, 0.06, 0.45, glow, checkout);
  label("あつあつ", 0.34, 1.6, 0.293, 0.4, 0.055, checkout, c.ivory, c.coral, 150);

  // Island ice-cream freezer leaves a generous clear strip beside the right windows.
  const freezer = group(2.3, 0, -2.33);
  b(0, 0.83, 0, 1.03, 0.73, 1.5, c.cream, freezer, true);
  b(0, 0.54, 0, 1.05, 0.12, 1.52, c.darkGreen, freezer);
  b(0, 1.2, 0, 1.08, 0.09, 1.56, c.celadon, freezer);
  b(0, 1.205, 0, 0.9, 0.09, 1.37, "#526f67", freezer);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      b(
        -0.31 + col * 0.205,
        1.27,
        -0.55 + row * 0.27,
        0.16,
        0.06,
        0.21,
        colors[(row + col) % 6],
        freezer,
      );
      b(-0.31 + col * 0.205, 1.304, -0.55 + row * 0.27, 0.1, 0.006, 0.11, "#f4e8cd", freezer);
    }
  }
  const lid = pane(0, 1.34, 0, 0.91, 1.4, 0, freezer, caseGlass);
  lid.rotation.x = -Math.PI / 2;
  b(0, 1.348, 0, 0.035, 0.035, 1.43, c.metal, freezer);
  b(-0.1, 1.374, 0.45, 0.034, 0.028, 0.25, c.charcoal, freezer);
  b(0.1, 1.374, -0.45, 0.034, 0.028, 0.25, c.charcoal, freezer);
  label("ひんやり  ICE CREAM", 0, 0.89, 0.762, 0.88, 0.23, freezer, c.cream, c.coral, 85);
  const freezerSide = label("アイス", 0.529, 0.91, 0, 1.16, 0.28, freezer, c.cream, c.coral, 140);
  freezerSide.rotation.y = Math.PI / 2;
  for (let i = 0; i < 9; i++)
    b(0.532, 0.64, -0.56 + i * 0.13, 0.012, 0.09, 0.042, "#93a79b", freezer);

  const magazines = group(2.6, 0, -0.63, -0.28);
  b(0, 0.51, 0, 0.73, 0.1, 0.39, c.darkGreen, magazines);
  b(0, 0.94, -0.135, 0.68, 0.82, 0.045, c.wood, magazines);
  for (let tier = 0; tier < 3; tier++) {
    const y = 0.61 + tier * 0.23;
    b(0, y, 0.015, 0.73, 0.04, 0.35, c.cream, magazines);
    for (let j = 0; j < 3; j++) {
      const cover = b(
        -0.225 + j * 0.225,
        y + 0.145,
        0.034,
        0.194,
        0.25,
        0.033,
        colors[(tier + j) % 6],
        magazines,
      );
      cover.rotation.x = -0.2;
      const page = kit.mesh(
        new THREE.PlaneGeometry(0.17, 0.215),
        labelMaterials[(tier + j) % 6],
        [-0.225 + j * 0.225, y + 0.148, 0.07],
        magazines,
      );
      page.rotation.x = -0.2;
    }
    kit.rod([-0.35, y + 0.065, 0.17], [0.35, y + 0.065, 0.17], 0.014, c.celadon, magazines);
  }
  label("本 と 暮らし", 0, 1.42, -0.108, 0.7, 0.15, magazines, c.celadon, c.ivory, 130);

  // Restrained hanging wayfinding and warm linear fixtures, never extra point-light arrays.
  for (let i = 0; i < 3; i++) {
    const x = -2.85 + i * 1.65;
    for (const dx of [-0.36, 0.36])
      kit.rod([x + dx, 3.56, -2.35], [x + dx, 2.91, -2.35], 0.009, c.charcoal, store);
    b(x, 2.8, -2.35, 1.07, 0.22, 0.035, c.celadon);
    label(
      ["01  お菓子", "02  食品", "03  飲料"][i],
      x,
      2.8,
      -2.326,
      0.99,
      0.16,
      store,
      c.celadon,
      c.ivory,
      110,
    );
    b(x, 3.48, -1.72, 0.24, 0.085, 2.95, "#a9b9ac");
    b(x, 3.431, -1.72, 0.19, 0.015, 2.84, glow);
  }
  b(2.32, 3.48, -1.83, 0.24, 0.085, 3.12, "#a9b9ac");
  b(2.32, 3.431, -1.83, 0.19, 0.015, 3.02, glow);
  label("お会計  /  CHECKOUT", -2.33, 2.52, -0.23, 1.57, 0.21, store, c.ivory, c.darkGreen, 79);
  for (const x of [-2.92, -1.74])
    kit.rod([x, 3.55, -0.23], [x, 2.635, -0.23], 0.01, c.charcoal, store);
  label("淹れたて ¥120", -3.54, 2.03, 1.318, 0.79, 0.42, store, c.ivory, c.coral, 130);
  label("雨の日も、あたたかく。", -3.54, 1.715, 1.319, 0.79, 0.16, store, c.celadon, c.ivory, 86);
  const rightPoster = label(
    "季節のおすすめ",
    3.319,
    1.85,
    -3.55,
    0.68,
    0.29,
    store,
    c.ivory,
    c.coral,
    110,
  );
  rightPoster.rotation.y = Math.PI / 2;
  // Long pale runners articulate circulation without competing with product colors.
  for (const x of [-1.99, -0.34, 1.34]) {
    for (let i = 0; i < 4; i++) b(x, 0.464, -2.85 + i * 0.52, 0.035, 0.004, 0.27, "#b5c4af");
  }
  b(0.6, 0.464, 0.47, 0.72, 0.004, 0.047, c.coral);
  label("24時間  OPEN", 0.13, 2.91, 1.316, 0.83, 0.12, store, c.celadon, c.ivory, 140);
  kit.point([-1.8, 2.92, -1.42], "#ffe7b6", 14, 7.2);
  kit.point([2.13, 2.7, 0.1], "#fff0c6", 10, 6.0);
}
