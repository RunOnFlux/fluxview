# Flux View

Monitor Flux node status, apps, and game servers from a single web UI.

## Requirements

- Node.js 22+ (20.19+ also works; required by Vite)

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Docker

```bash
docker build -t flux-view .
docker run --rm -p 8080:80 flux-view
```

## Scripts

| Command                | Description                 |
| ---------------------- | --------------------------- |
| `npm run dev`          | Start Vite dev server       |
| `npm run build`        | Production build to `dist/` |
| `npm run preview`      | Preview production build    |
| `npm run lint:check`   | Run ESLint                  |
| `npm run format:check` | Check Prettier formatting   |
