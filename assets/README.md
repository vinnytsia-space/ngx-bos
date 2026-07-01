# Ngx BOS (Angular 22)

Source workspace for the Ngx BOS CRM / business operating system. It contains two things:

- an **app template** under `src/` — a browser-only SPA built with standalone components, signals-first state, native control flow, and the WAW platform services (`@wawjs/*`)
- the **`@wawjs/ngx-bos` package** under `projects/ngx-bos/` — reusable BOS contracts, services, guards, selectors, pages, and routes extracted from the app

Business apps own routes, roles, schemas, dashboards, integrations, environment values, and workflow copy under `src/`. Reusable behavior lives in `@wawjs/ngx-bos`. See [AGENTS.md](AGENTS.md) and [documentation/](documentation/) for the source/package split.

## Prerequisites

- Node `^22.22.3`, `^24.15.0`, or `>=26.0.0` with npm 8+ (Angular CLI 22 is provided locally via devDependencies)

## Getting Started

```sh
npm install   # install dependencies
npm start     # serve on http://localhost:4200 with proxy.conf.json
```

Environments live in `src/environments/`:

- `environment.ts` for local development (extends `environment.prod.ts`)
- `environment.prod.ts` for production builds (API URL, meta tags, languages, defaults)

## Scripts

- `npm start` — dev server with proxying to the configured API URL (`proxy.conf.json`)
- `npm run build` — production app build to `dist/`
- `npm run build:ngx-bos` — build the `@wawjs/ngx-bos` package with ng-packagr

## Project Structure (key paths)

- `src/app/app.config.ts` — root providers (zoneless change detection, `ngxBosProvide`, WAW services, TinyMCE, router)
- `src/app/app.routes.ts` — route map for guest, user, and admin areas
- `src/app/app.formcomponents.ts` — project-specific dynamic form components
- `src/app/layouts/` — layout shells for guest/user routes
- `src/app/pages/` — routed pages per role (e.g. `guest/sign`, `user/profile`)
- `src/environments/` — API / meta / language configuration
- `src/i18n/` — interface translations (served at `/i18n`)
- `projects/ngx-bos/` — the reusable `@wawjs/ngx-bos` package (users/auth, file upload, form adapters, guards, selectors, pages, and routes). See [projects/ngx-bos/README.md](projects/ngx-bos/README.md).

## Development Notes

- Components are standalone and signals-first; favor `computed` / `signal` / `effect`. Angular 22 uses OnPush by default, so do not set `changeDetection` explicitly.
- WAW services power guards, CRUD helpers, store/http access, and meta tags. Update `environment.meta` when changing branding.
- Dynamic form templates must be registered through `src/app/app.formcomponents.ts` so schemas can reference them by name.
- Reusable package APIs are imported from `@wawjs/ngx-bos`, never from package-internal source paths.

## Component Structure

Keep component classes consistent in this order:

1. Injections (via `inject()`)
2. Inputs / outputs / view queries
3. Variables (readonly/public first, then private)
4. Constructor (only when needed)
5. Lifecycle hooks (`ngOnInit`, `ngOnDestroy`, etc.)
6. Functions (public, then private)

Private variables and functions start with an underscore (`_`).

## Contributing

1. Create a feature branch.
2. Keep changes aligned with the standalone + signals pattern.
3. Open a pull request for review.
