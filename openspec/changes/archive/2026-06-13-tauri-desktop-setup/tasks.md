# Tasks: Tauri Desktop Setup (Phase 1)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~105 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Exclusions & Config

- [x] 1.1 **`tsconfig.json`** — Add `"src-tauri"` to `exclude` array
- [x] 1.2 **`.gitignore`** — Add `/src-tauri/target/` entry with `# Tauri` comment
- [x] 1.3 **`next.config.mjs`** — Add `const isTauri = process.env.BUILD_FOR_TAURI === "true"` guard; conditional `output: "export"` + `trailingSlash: true` when true; skip `headers()` when true

## Phase 2: Package & CLI Setup

- [x] 2.1 **`package.json`** — Add `"@tauri-apps/cli": "^2"` to devDependencies; add 5 scripts: `dev:tauri`, `build:tauri`, `tauri`, `tauri:dev`, `tauri:build`
- [x] 2.2 **Install dep** — Run `npm install` to install `@tauri-apps/cli` (bun not available on this system)

## Phase 3: Tauri Scaffold

- [x] 3.1 **Init scaffold** — Created `src-tauri/` directory structure manually (`tauri init` requires TTY)
- [x] 3.2 **`src-tauri/Cargo.toml`** — Write Rust deps: `tauri` v2, `tauri-build` v2, `serde`, `serde_json`; define `nozen_lib` lib with `lib`, `cdylib`, `staticlib` crate types
- [x] 3.3 **`src-tauri/build.rs`** — Write `fn main() { tauri_build::build() }`
- [x] 3.4 **`src-tauri/src/lib.rs`** — Write Tauri builder: `tauri::Builder::default().run(tauri::generate_context!())`
- [x] 3.5 **`src-tauri/src/main.rs`** — Write entry: `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]` + `fn main() { nozen_lib::run() }`
- [x] 3.6 **`src-tauri/tauri.conf.json`** — Write full config: window title `"nozen"`, 1200x800 default, 800x600 min, centered, resizable; `beforeDevCommand` → `bun run dev:tauri`; `beforeBuildCommand` → `bun run build:tauri`; `frontendDist` → `"../out"`; bundle targets all; icon list; CSP per **spec** (no `unsafe-eval` — discrepancy from design resolved in favor of spec)
- [x] 3.7 **`src-tauri/capabilities/default.json`** — Write minimal permissions: `core:default` only, window `["main"]`

## Phase 4: Icons

- [x] 4.1 **Generate icons** — Run `npx @tauri-apps/cli icon public/icon.svg` to produce all platform formats in `src-tauri/icons/`
- [x] 4.2 **Verify icons** — Inspect `src-tauri/icons/` has `.icns`, `.ico`, PNGs at required resolutions

## Phase 5: Verification

- [x] 5.1 **TS compile check** — Run `npm run check` — passed without errors; `src-tauri/` excluded from TS
- [x] 5.2 **Web build unchanged** — Run `npm run build` — produces `.next/` output (not `out/`), identical to current behavior
- [ ] 5.3 **Tauri Rust compile** — Run `cargo build` in `src-tauri/` — **BLOCKED**: requires `webkit2gtk-4.1` system library (install via `pacman -S webkit2gtk-4.1`)
- [ ] 5.4 **Tauri dev smoke test** — Run `npm run tauri:dev` — **BLOCKED**: depends on 5.3 succeeding first
- [x] 5.5 **Git exclusion** — Run `git status` — `src-tauri/target/` is properly gitignored

## Implementation Order

Exclusions first (no impact), then Next.js config, then package.json + install, then Tauri scaffold (init then overwrite), then icons, then verify from fastest to slowest checks. The Tauri dev smoke test (5.4) is the definitive proof — run it last, only after all other checks pass.
