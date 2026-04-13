# vega-library

Shared Vega specs for BI teams, with a GitHub Pages gallery generated from the repository's `specs/` folders.

## Spec structure

Each visual lives in its own folder under `specs/`:

```text
specs/
  resource-slot-gantt/
    meta.json
    spec.json
    sample-data.json
```

`meta.json` is used for discovery and filtering in the site.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build first validates and compiles a generated catalog from `specs/`, then builds the static site into `dist/`.
