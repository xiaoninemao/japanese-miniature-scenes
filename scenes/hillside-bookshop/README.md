# Hillside Bookshop

A two-story bookshop above a terraced stone street at sunset. Look through the windows for stocked shelves and the upstairs reading room, then explore the outdoor crates, dense autumn maple, and naturally scattered ground leaves.

![Hillside Bookshop preview](public/preview.png)

## Run

From the repository root, using Node.js 22.18 or newer:

```bash
npm ci
npm run dev --workspace=hillside-bookshop
npm test --workspace=hillside-bookshop
npm run build --workspace=hillside-bookshop
npm run preview --workspace=hillside-bookshop
```

The app opens directly into this model, without a menu. Mouse drag orbits, right-drag pans, and the wheel zooms. Touch supports single-finger orbit and two-finger pan/pinch. Keyboard arrows, `+`/`-`, and `Home` work when the canvas is focused.

Edit `src/model.ts` for the shop and tree, `src/config.ts` for the sunset lighting, and `src/ground-leaves.ts` for seeded leaf placement. Ground leaves align to their supporting surface; tests cover flat ground, slopes, and step-edge rejection.

`src/terrain.ts` builds the sloping stone street, two stair flights, the level shop approach, and the upper terrace from connected boundaries. Terrain tests check the joins, step heights, road clearance, and handrail supports.

The production output is this project's `dist/` folder. All runtime files and assets belong to this scene. Reduced-motion preferences are respected.
