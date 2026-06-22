# Proposal: Tauri Desktop Setup (Phase 1)

## Intent

Enable nozen to run as a native desktop app alongside the existing web deployment. The app is already 100% client-side (no SSR, no API routes, localStorage persistence) — near-zero friction for Tauri v2 wrapping. Desktop is the foundation for future capabilities (file system access, system tray, offline-first with SQLite).

## Scope

### In Scope
- Tauri v2 project scaffolding (`src-tauri/`)
- `next.config.mjs` conditional config for Tauri static export
- npm scripts for Tauri dev/build
- `tsconfig.json` exclusion and `.gitignore` entries
- App icons generated from existing assets
- Proof: `bun run tauri dev` opens app in native window

### Out of Scope
- Tauri plugins (filesystem, shell, notifications)
- Native features (system tray, menu bar, deep links)
- Auto-updater, code signing, or CI for Tauri builds
- Performance tuning for the desktop shell
- Migration of localStorage to SQLite or native storage

## Capabilities

### New Capabilities
- `tauri-desktop`: Tauri v2 native desktop wrapper — window management, build configuration, dev workflow

### Modified Capabilities
- None — no existing spec-level behavior changes; additive only

## Approach

Single env-var flag (`BUILD_FOR_TAURI`) in `next.config.mjs` switches between web and static-export modes. Web build is untouched — the Tauri path never executes for `next build`/`next dev`. Zero risk to the existing app.

Key decisions:
- **No separate Tauri branch** — avoids painful merge conflicts as the web app evolves
- **No Tauri-specific Next.js pages** — same client-side app runs identically in both surfaces
- **Static export with assetPrefix** — Tauri serves from `file://` protocol, needs flat output

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `next.config.mjs` | Modified | BUILD_FOR_TAURI conditional for export mode + CSP |
| `package.json` | Modified | Add `@tauri-apps/cli` devDep + tauri scripts |
| `tsconfig.json` | Modified | Exclude `src-tauri/` |
| `.gitignore` | Modified | Add `/src-tauri/target/` |
| `src-tauri/` | New | Tauri v2 scaffold (config, Rust, icons, capabilities) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Static export breaks on Next.js version bumps | Low | Export API is stable; test after upgrades |
| `headers()` leaks to Tauri build | Low | Conditional skip via BUILD_FOR_TAURI guard |

## Rollback Plan

Delete `src-tauri/`, revert `next.config.mjs`, `package.json`, `tsconfig.json`, `.gitignore`. The web build is unaffected — Tauri is purely additive.

## Dependencies

- Rust toolchain (rustc, cargo) for Tauri CLI
- `@tauri-apps/cli` v2 (npm devDep)
- System libs: webkit2gtk + libgtk-3 (Linux) or platform equivalents

## Success Criteria

- [ ] `bun run tauri dev` opens a native window showing the app
- [ ] `bun run build` (web) unchanged and produces valid output
- [ ] Web deployment on Vercel continues to work identically
- [ ] TypeScript passes with `src-tauri/` excluded
- [ ] App icons render correctly in window title bar and taskbar
