# Mountain Onsen

A warm timber inn in an autumn garden, with a tatami lounge, tea table, bamboo fencing, a stone lantern, and a steaming outdoor bath. Maple leaves drift through the courtyard while fallen leaves remain in contact with the ground.

![Mountain Onsen preview](public/preview.png)

## Run

From the repository root, using Node.js 22.18 or newer:

```bash
npm ci
npm run dev --workspace=mountain-onsen
npm test --workspace=mountain-onsen
npm run build --workspace=mountain-onsen
npm run preview --workspace=mountain-onsen
```

The scene opens without a selector or toolbar. Mouse drag orbits, right-drag pans, and the wheel zooms. Touch supports single-finger orbit and two-finger pan/pinch. Focus the canvas for arrow keys, `+`/`-`, and `Home`.

Edit `src/model.ts` for the inn, bath, and garden, `src/config.ts` for lighting, and `src/ground-leaves.ts` for supported leaf placement. Tests check geometry, bounds, and leaf contact. Reduced motion keeps the ambient effects static.

The scene builds to its own `dist/` directory with relative asset paths and no backend or cross-scene runtime dependency.
