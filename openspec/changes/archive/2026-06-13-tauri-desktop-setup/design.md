# Design: Tauri Desktop Setup (Phase 1)

## Technical Approach

Wrap the existing 100% client-side Next.js app in a Tauri v2 native shell with zero behavioral changes. A single `BUILD_FOR_TAURI` env var in `next.config.mjs` switches to static export mode; web builds are completely unaffected. No separate branch, no Tauri-specific pages, no plugins yet.

## Architecture Decisions

| Decision | Options | Chosen | Rationale |
|---|---|---|---|
| Env var vs separate branch | `BUILD_FOR_TAURI` env var, separate git branch, separate config file | **Env var** | Single source of truth. Zero merge conflicts as web evolves. Tauri path never executes for `next build`/`next dev` |
| Dev server approach | beforeDevCommand runs static export then serves; beforeDevCommand starts Next.js dev server | **Next.js dev server** | Full HMR during Tauri dev. Static export rebuild is too slow for iteration |
| CSP source | Next.js `headers()`, Tauri `security.csp` | **Tauri config** | `headers()` only works for server responses. Tauri serves via custom protocol, not HTTP. CSP in Tauri config applies to webview |
| Icon generation | Manual conversion per OS, `npx @tauri-apps/cli icon` | **`tauri icon` CLI** | Built-in to Tauri toolchain, generates all platform formats from single SVG source |
| Plugin inclusion | None, common plugins (fs, shell, notification) | **None** | Zero scope creep. Plugins are additive — drop in later without migration |

## Build Paths

```
  Web (npm run build)               Tauri (npm run tauri:build)
  ─────────────────                 ──────────────────────────
  next build                        BUILD_FOR_TAURI=true
       │                            next build (static export)
       │                                    │
       ▼                                    ▼
  .next/ (server+client)             out/ (flat static HTML)
       │                                    │
       ▼                                    ▼
  Vercel / Node.js                   cargo build (Rust binary)
                                          + bundled out/ assets
                                               │
                                               ▼
                                        src-tauri/target/release/
                                        (native binary)

  Web (npm run dev)                  Tauri (npm run tauri:dev)
  ─────────────────                 ─────────────────────────
  next dev                           Tauri CLI runs:
  localhost:3000                     beforeDevCommand → bun run dev:tauri
                                       → Next.js dev at localhost:3000
                                     opens native window → devUrl
```

## Data Flow

```
User Input ──→ React App (client-side)
                    │
                    ▼
              Zustand Store ──→ localStorage
                    │
                    ▼
              Re-render (same DOM in webview or browser)

  Tauri differences: NO server, NO API routes, NO headers()
  Everything runs in the webview via tauri:// protocol
```

## Component Breakdown

### next.config.mjs

```mjs
const isTauri = process.env.BUILD_FOR_TAURI === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  // Tauri-only: static export config
  ...(isTauri ? {
    output: "export",
    distDir: "out",
    trailingSlash: true,
  } : {}),
  // Web-only: server headers (skipped for Tauri)
  ...(!isTauri ? {
    async headers() { /* existing CSP + security headers */ },
  } : {}),
};
```

`images.unoptimized` is already set — static export requires it. No other existing config changes.

### src-tauri/ (7 files)

| File | Role |
|---|---|
| `tauri.conf.json` | Build config, window props, CSP, bundle icons |
| `Cargo.toml` | Rust deps: tauri v2, tauri-build |
| `build.rs` | `fn main() { tauri_build::build() }` |
| `src/main.rs` | Entry: `nozen_lib::run()` |
| `src/lib.rs` | Tauri Builder (no plugins, no commands yet) |
| `capabilities/default.json` | Minimal `core:default` permissions |
| `icons/*` | Generated from `public/icon.svg` |

## File Changes

| File | Action | Description |
|---|---|---|
| `next.config.mjs` | Modify | Conditional `output: "export"` / skip headers via `BUILD_FOR_TAURI` |
| `package.json` | Modify | Add `@tauri-apps/cli` devDep + 5 scripts |
| `tsconfig.json` | Modify | Exclude `src-tauri/` from TS |
| `.gitignore` | Modify | Add `/src-tauri/target/` |
| `src-tauri/tauri.conf.json` | Create | Full Tauri v2 config (see below) |
| `src-tauri/Cargo.toml` | Create | Rust deps |
| `src-tauri/build.rs` | Create | Tauri build script |
| `src-tauri/src/main.rs` | Create | Rust entry point |
| `src-tauri/src/lib.rs` | Create | Tauri app builder |
| `src-tauri/capabilities/default.json` | Create | Tauri v2 permissions |
| `src-tauri/icons/*` | Create | Generated icon set |

## Reference Configurations

### tauri.conf.json

```json
{
  "$schema": "https://raw.githubusercontent.com/nicknisi/tauri/main/tooling/cli/schema.json",
  "productName": "Nozen",
  "version": "0.1.0",
  "identifier": "com.nozen.app",
  "build": {
    "beforeDevCommand": "bun run dev:tauri",
    "devUrl": "http://localhost:3000",
    "beforeBuildCommand": "bun run build:tauri",
    "frontendDist": "../out"
  },
  "app": {
    "windows": [{
      "title": "Nozen",
      "width": 1200,
      "height": 800,
      "minWidth": 800,
      "minHeight": 600,
      "center": true,
      "resizable": true
    }],
    "security": {
      "csp": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: asset:; font-src 'self' data:; connect-src 'self' tauri: http://localhost:*; frame-ancestors 'self';"
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

### Cargo.toml

```toml
[package]
name = "nozen"
version = "0.1.0"
edition = "2021"

[lib]
name = "nozen_lib"
crate-type = ["lib", "cdylib", "staticlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### src/lib.rs

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### src/main.rs

```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    nozen_lib::run();
}
```

### capabilities/default.json

```json
{
  "identifier": "default",
  "description": "Minimal webview permissions",
  "windows": ["main"],
  "permissions": ["core:default"]
}
```

### package.json additions

```json
{
  "devDependencies": {
    "@tauri-apps/cli": "^2"
  },
  "scripts": {
    "dev:tauri": "BUILD_FOR_TAURI=true next dev",
    "build:tauri": "BUILD_FOR_TAURI=true next build",
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

## Icons

Generate from `public/icon.svg`:

```bash
npx @tauri-apps/cli icon public/icon.svg
```

This produces all required platform formats in `src-tauri/icons/`. The SVG includes `prefers-color-scheme` media queries — the `light` variant (black bg, white fg) will be used for icon rendering since Tauri icon generation ignores CSS media queries and uses the SVG as-is. If the icon appears wrong (white on transparent), replace with a pure white-on-black 1024x1024 PNG for generation.

## Exclusions

**tsconfig.json** — add `"src-tauri"` to `exclude` array:
```json
"exclude": ["node_modules", "src-tauri"]
```

**.gitignore** — add:
```
# Tauri
/src-tauri/target/
```

## Implementation Order

1. **Exclusions first** — `tsconfig.json` + `.gitignore` (no impact on build)
2. **next.config.mjs** — Add `isTauri` guard (zero risk, Tauri path never hits web builds)
3. **package.json** — Add dep and scripts, run `bun install`
4. **`bun run tauri init`** — Scaffold src-tauri, then overwrite with our configs
5. **Icons** — `npx @tauri-apps/cli icon public/icon.svg`
6. **Verify** — `bun run tauri:dev` opens native window with the app
7. **Verify** — `bun run build` (web) produces `.next/` unchanged

## Open Questions

- [ ] The `public/icon.svg` uses `prefers-color-scheme` CSS media queries — Tauri ignores these when generating static PNGs. May need a dedicated 1024x1024 PNG source with a fixed color scheme for the icon generation.
