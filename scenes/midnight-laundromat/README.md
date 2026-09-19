# Midnight Laundromat

A blue-lit coin laundry on a rainy night. Six circular machines, animated laundry, folding tables, baskets, detergent supplies, waiting chairs, a notice board, and a vending machine fill the glass-fronted pavilion.

![Midnight Laundromat preview](public/preview.png)

## Run

From the repository root, using Node.js 22.18 or newer:

```bash
npm ci
npm run dev --workspace=midnight-laundromat
npm test --workspace=midnight-laundromat
npm run build --workspace=midnight-laundromat
npm run preview --workspace=midnight-laundromat
```

Opening the page displays the model directly. Mouse drag orbits, right-drag pans, and the wheel zooms. Touch supports one-finger orbit and two-finger pan/pinch. Focus the canvas to use arrow keys, `+`/`-`, or `Home`.

Edit `src/model.ts` for the building, machines, and weather. Animated drum groups are marked dynamic so static batching preserves their motion. `src/config.ts` controls lighting and camera framing. Reduced-motion mode stops the rain and drum rotation.

This project's `dist/` is a complete static app, with no backend, account system, or dependency on another scene.
