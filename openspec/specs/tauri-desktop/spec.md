# Tauri Desktop Specification

## Purpose

Wrap the existing Next.js client-side app in a Tauri v2 native desktop window. The web build is untouched — Tauri is purely additive via a single env-var flag (`BUILD_FOR_TAURI`).

## Requirements

### Requirement: Conditional Build Config

When `BUILD_FOR_TAURI` is set, `next.config.mjs` MUST switch to static export mode (`output: "export"`) and skip the `headers()` function. When unset, the config MUST behave identically to the current web-only setup.

#### Scenario: Static export with env var set

- GIVEN `BUILD_FOR_TAURI=true` in the environment
- WHEN `next build` runs
- THEN the config MUST set `output: "export"` and `trailingSlash: true`
- AND the `headers()` function MUST return an empty array

#### Scenario: Web build without env var

- GIVEN `BUILD_FOR_TAURI` is unset or `false`
- WHEN `next build` runs
- THEN the output MUST be the standard Next.js server build (unchanged from current behavior)

### Requirement: Tauri Scaffold

The project MUST include a `src-tauri/` directory with a valid Tauri v2 Rust project, including `Cargo.toml`, `tauri.conf.json`, `src/lib.rs`, and `capabilities/default.json`.

#### Scenario: Scaffold compiles

- GIVEN a Rust toolchain (rustc, cargo) is installed
- WHEN `cargo build` runs inside `src-tauri/`
- THEN it MUST compile without errors

### Requirement: Dev and Build Scripts

`package.json` MUST include `tauri` scripts for dev and build workflows, using `@tauri-apps/cli` as a dev dependency.

#### Scenario: Tauri dev script

- GIVEN `@tauri-apps/cli` is installed and Rust toolchain is ready
- WHEN `bun run tauri:dev` executes
- THEN it MUST build the Next.js static export and open a native window

#### Scenario: Tauri build script

- GIVEN `@tauri-apps/cli` is installed
- WHEN `bun run tauri:build` executes
- THEN it MUST produce a release binary in `src-tauri/target/release/`

### Requirement: App Window

`tauri.conf.json` MUST configure the app window with `title: "nozen"`, minimum width of 800px, minimum height of 600px, and `resizable: true`.

#### Scenario: Default window properties

- GIVEN the Tauri app launches
- THEN the window MUST show "nozen" in the title bar
- AND the window MUST be resizable with 800x600 minimum dimensions

### Requirement: Content Security Policy

The Tauri build MUST use a CSP that permits `'self'` scripts and styles, inline styles for the app, and `data:` / `blob:` image sources. It MUST NOT use the web build's CSP (which includes `unsafe-eval`).

#### Scenario: CSP applied in Tauri webview

- GIVEN the app runs in the Tauri webview
- WHEN the page loads
- THEN the Content-Security-Policy header MUST allow the app's static assets to render
- AND `unsafe-eval` MUST NOT be present in the CSP

### Requirement: App Icons

The `src-tauri/icons/` directory MUST contain app icons in all formats required by Tauri v2 (`.icns`, `.ico`, `.png` at multiple resolutions), generated from the existing app assets.

#### Scenario: Icons render in window chrome

- GIVEN the Tauri app launches
- THEN the app icon MUST display in the window title bar, taskbar, and alt-tab switcher on the target platform

### Requirement: Source Exclusion

The `src-tauri/` directory MUST be excluded from TypeScript compilation and git tracking.

#### Scenario: TypeScript exclusion

- GIVEN `tsconfig.json` has `exclude`
- WHEN TypeScript checks the project
- THEN `src-tauri/` MUST NOT be included in type-checking

#### Scenario: Git exclusion

- GIVEN `.gitignore` has entries
- WHEN `git status` lists untracked files
- THEN `src-tauri/target/` MUST NOT appear
