# Ngx BOS Agent Guide

Ngx BOS is an Angular 22 CRM and business operating system SPA.

This file must work in delivered business apps after source-only folders are removed.

Do not rely on source-workspace-only folders existing after this template is copied into a business
repo.

## Hard Rules

- Treat the app as browser-only SPA software.
- Do not add SSR, prerender, static SEO, or landing-page-first assumptions unless explicitly asked.
- Keep business-specific routes, roles, schemas, dashboards, integrations, environment values, and
  workflow copy app-owned under `src/`.
- Put reusable BOS contracts and behavior in `@wawjs/ngx-bos` when code is moved to the package.
- Import reusable package APIs from `@wawjs/ngx-bos`, not from package-internal source paths.
- Keep Angular 22 standalone, default OnPush, signals, native control flow, and token-based styling
  conventions.
- Keep project-specific form components registered through `src/app/app.formcomponents.ts`.
- Use `LanguageService` / `TranslateService` from `@wawjs/ngx-translate` directly for language
  switching.

## Optional Package Guidance

If dependencies are installed, reusable package guidance may be available at:

```text
node_modules/@wawjs/ngx-bos/ai/
```

Also check the installed WAW package docs that match the APIs being changed:

```text
node_modules/@wawjs/ngx-ace/README.md
node_modules/@wawjs/ngx-core/README.md
node_modules/@wawjs/ngx-crud/README.md
node_modules/@wawjs/ngx-fabric/README.md
node_modules/@wawjs/ngx-form/README.md
node_modules/@wawjs/ngx-http/README.md
node_modules/@wawjs/ngx-map/README.md
node_modules/@wawjs/ngx-socket/README.md
node_modules/@wawjs/ngx-tinymce/README.md
node_modules/@wawjs/ngx-translate/README.md
node_modules/@wawjs/ngx-ui/README.md
```

This path is optional guidance only. The rules in this file remain valid on their own.
