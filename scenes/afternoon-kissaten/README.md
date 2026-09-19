# Afternoon Kissaten

A sunlit neighborhood coffee shop with green awnings, wooden furniture, upholstered seats, modeled pastries, cups, siphon coffee equipment, records, patio tables, plants, and a parked bicycle.

![Afternoon Kissaten preview](public/preview.png)

## Run

From the repository root, using Node.js 22.18 or newer:

```bash
npm ci
npm run dev --workspace=afternoon-kissaten
npm test --workspace=afternoon-kissaten
npm run build --workspace=afternoon-kissaten
npm run preview --workspace=afternoon-kissaten
```

The model is the entire page. Mouse drag orbits, right-drag pans, and the wheel zooms. Touch supports one-finger orbit and two-finger pan/pinch. Arrow keys, `+`/`-`, and `Home` work while the canvas is focused.

Edit `src/model.ts` for geometry, steam, and the gently swaying sign. Use `src/config.ts` for the warm afternoon lighting and camera. Reduced-motion mode holds ambient motion still.

Build output goes to this project's `dist/` directory. No backend, external asset service, or runtime reference to another scene is needed.
