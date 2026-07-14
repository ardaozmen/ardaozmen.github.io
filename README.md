# ardaozmen.github.io

A one-page digital manifesto. Live at [ardaozmen.github.io](https://ardaozmen.github.io).

Not a portfolio — a point of view. A single sentence set in large type over a
living procedural field: thousands of particles drifting along a slowly
evolving curl-noise vector field, gently deflected by the cursor's weak
gravitational pull. Almost silent. Dark only.

## Stack

- Next.js (App Router, static export) + TypeScript
- Tailwind CSS
- React Three Fiber / Three.js — custom GLSL shader (simplex + curl noise)
- Framer Motion
- Geist Sans

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Deployment

Pushes to `main` deploy automatically to GitHub Pages via
`.github/workflows/deploy.yml`. In the repository settings, set
**Pages → Source → GitHub Actions** once.

## Accessibility

Respects `prefers-reduced-motion`: the field freezes and cursor influence is
disabled. The canvas is `aria-hidden`; content is plain semantic HTML.
