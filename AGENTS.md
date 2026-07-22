# Repository Guidelines

## How to Use This Guide

- Start here for cross-project norms.
- Check `.agents/skills/` for detailed patterns on-demand.
- See also: AGENTS.md in `hooks/`, `store/`, and `components/` for specific conventions.

---

## Available Skills

| Skill                         | Description                            | Path                                                   |
| ----------------------------- | -------------------------------------- | ------------------------------------------------------ |
| `clean-code`                  | Clean Code principles (Bob Martin)     | `.agents/skills/clean-code/SKILL.md`                   |
| `frontend-design`             | Production-grade UI/UX design          | `.agents/skills/frontend-design/SKILL.md`              |
| `vercel-react-best-practices` | React/Next.js performance optimization | `.agents/skills/vercel-react-best-practices/SKILL.md`  |
| `git-commit`                  | Conventional commits                   | `.agents/skills/git-commit/SKILL.md`                   |
| `typescript-advanced-types`   | Advanced TypeScript patterns           | `.agents/skills/typescript-advanced-types/SKILL.md`    |
| `webapp-testing`              | Testing patterns                       | `.agents/skills/webapp-testing/SKILL.md`               |

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                           | Skill                         |
| -------------------------------- | ----------------------------- |
| Building UI components           | `frontend-design`             |
| Writing React/Next.js code       | `vercel-react-best-practices` |
| Using Tailwind CSS               | `frontend-design`             |
| Writing clean, maintainable code | `clean-code`                  |

---

## Project Overview

| Field       | Value                                                         |
| ----------- | ------------------------------------------------------------- |
| Name        | nozen                                                         |
| Description | Personal daily planner: Diary with mood tracking, Notes, Daily Tasks, and Zen mode |
| Type        | Next.js 16 App Router (single-page, no routing)              |
| Platform    | Web (PWA-ready)                                              |
| Language    | TypeScript 5.9.3 (strict)                                    |

### Tech Stack

| Category         | Technology         | Version   |
| ---------------- | ------------------ | --------- |
| Framework        | Next.js            | 16.0.10   |
| Runtime          | React              | 19.2.0    |
| Language         | TypeScript         | 5.9.3     |
| Styling          | Tailwind CSS       | 4.1.9     |
| UI Components    | shadcn/ui + Radix UI | —       |
| State Management | Zustand            | 5.0.11    |
| Animation        | Framer Motion      | 12.x      |
| Icons            | Lucide React       | 0.454.0   |
| Calendar         | react-day-picker   | 10.0.1    |
| Validation       | Zod                | 4.3.6     |
| Dates            | date-fns           | 4.4.0     |
| Toast            | Sonner             | 2.0.7     |
| Themes           | next-themes        | 0.4.6     |
| Linting/Format   | Biome              | 2.4.13    |
| Package Manager  | pnpm               | 11.15.1   |

---

## Development

```bash
# Setup
pnpm install

# Development server
pnpm run dev

# Build production
pnpm run build

# Lint (Biome)
pnpm run lint

# Format (Biome)
pnpm run format

# Validate all (lint + format + check)
pnpm run check

# Start production
pnpm run start
```

---

## Tooling

### Biome

- **Lint**: `pnpm run lint`
- **Format**: `pnpm run format`
- **Check**: `pnpm run check` (lint + format + write fixes)

### Pre-commit Hooks

Husky + lint-staged configured. Every commit runs `pnpm check` on staged `.ts`/`.tsx` files automatically.

### TypeScript

Strict mode enabled with additional checks:
- `noUncheckedIndexedAccess`
- `noImplicitReturns`
- `noFallthroughCasesInSwitch`

---

## Code Conventions

- Follow Clean Code principles
- Use TypeScript strict typing (`strict: true`)
- Prefer functional components with React 19 patterns
- Use `cn()` utility (from tailwind-merge + clsx) for conditional classes
- Follow existing component patterns in `app/` and `components/`
- Use Zustand for global state management
- Use Radix UI primitives for accessible components
- Use Sonner for toast notifications
- All UI strings are in Spanish

### ID Generation

Always use `crypto.randomUUID()` — never `Math.random()`. Import from `@/utils/id`:

```typescript
import { generateId } from "@/utils/id";
const id = generateId();
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ArrowLeft` | Previous day |
| `ArrowRight` | Next day |
| `T` | Jump to today |
| `Z` | Toggle Zen mode |

---

## Project Structure

```
├── app/                     # Next.js App Router (single page + sandbox)
│   ├── page.tsx             # Main diary page
│   ├── layout.tsx           # Root layout (fonts, themes, analytics, PWA)
│   ├── globals.css          # Tailwind 4 CSS with theme variables
│   ├── error.tsx            # Route error boundary
│   ├── global-error.tsx     # Root error boundary
│   ├── loading.tsx          # Global loading spinner
│   ├── not-found.tsx        # 404 page
│   └── sandbox/page.tsx     # Dev error boundary testing
│
├── components/              # React components
│   ├── ui/                  # shadcn/ui base components (15 files)
│   │   ├── button.tsx       # Button with CVA variants
│   │   ├── calendar.tsx     # Calendar (react-day-picker)
│   │   ├── card.tsx         # Card container
│   │   ├── dialog.tsx       # Modal dialog
│   │   ├── alert-dialog.tsx # Confirmation dialog
│   │   ├── confirm-dialog.tsx # Reusable confirm dialog
│   │   ├── dropdown-menu.tsx # Dropdown menu
│   │   ├── select.tsx       # Select dropdown
│   │   ├── textarea.tsx     # Auto-resizing textarea
│   │   ├── label.tsx        # Form label
│   │   ├── separator.tsx    # Divider
│   │   ├── skeleton.tsx     # Loading skeleton
│   │   ├── spinner.tsx      # Loading spinner
│   │   ├── sonner.tsx       # Toast wrapper
│   │   └── field.tsx        # Field compound component
│   │
│   ├── diary/               # Diary feature components
│   │   ├── DateNavigation.tsx  # Top bar: day nav, zen toggle, sidebars
│   │   ├── WritingArea.tsx     # Main writing textarea + prompts + word count
│   │   ├── LeftSidebar.tsx    # Calendar, notes, export/import, backfill
│   │   ├── RightSidebar.tsx   # Mood, status, daily tasks
│   │   ├── MoodDialog.tsx     # Status change dialog (mejor/igual/peor)
│   │   └── StreakCalendar.tsx # Writing streak calendar
│   │
│   └── shared/              # Shared components
│       ├── error-content.tsx   # Error display (runtime/build/network)
│       ├── client-toaster.tsx  # Sonner toaster wrapper
│       ├── mode-toggle.tsx     # Dark/light theme toggle
│       └── theme-provider.tsx  # next-themes provider
│
├── store/                   # Zustand state management
│   ├── diary.ts             # Diary state: date, mood, notes, metadata
│   ├── note.ts              # Standalone notes (persist middleware)
│   ├── daily-tasks.ts       # Daily checklist tasks (persist middleware)
│   ├── standalone-tasks.ts  # Independent task list (persist middleware)
│   ├── ui.ts                # UI state: sidebars, theme, zen mode
│   └── user-preferences.ts  # User prefs: confirm delete, theme
│
├── services/                # Business logic
│   ├── storage.ts           # localStorage wrapper for diary data
│   ├── export.ts            # JSON/TXT export with date range filtering
│   ├── exportTxt.ts         # TXT format serializer
│   └── import.ts            # JSON import with validation
│
├── hooks/                   # Custom React hooks
│   └── use-media-query.ts   # SSR-safe media query listener
│
├── types/                   # TypeScript types
│   ├── diary.ts             # MoodType, StatusChange, DayMetadata
│   └── note.ts              # Note type
│
├── utils/                   # Utility functions
│   ├── cn.ts                # Tailwind class merge (clsx + tailwind-merge)
│   ├── date.ts              # Spanish date formatting, date keys
│   ├── id.ts                # UUID generation (crypto.randomUUID)
│   └── index.ts             # Barrel exports
│
├── constants/               # Constants
│   ├── prompts.ts           # 26 daily writing prompts (Spanish)
│   └── diary.ts             # Mood options with icons and colors
│
├── public/                  # Static assets (icons, manifest, placeholders)
├── .agents/skills/          # AI agent skill packages
└── openspec/                # SDD (Spec-Driven Development) config
```

---

## Stores Reference

| Store | Storage | Key | Description |
|-------|---------|-----|-------------|
| `diary` | localStorage (manual) | `diary-metadata`, `diary-notes` | Current date, mood, status checks, note content |
| `note` | Zustand persist | `diary-standalone-notes:v1` | Standalone notes with title + content |
| `daily-tasks` | Zustand persist | `daily-tasks:v1` | Checklist tasks keyed by date |
| `standalone-tasks` | Zustand persist | `standalone-tasks:v1` | Independent task list |
| `ui` | Zustand persist | `ui:v1` | Sidebars, zen mode, theme |
| `user-preferences` | Zustand persist | `user-preferences` | Confirm delete, theme preference |

---

## Services Reference

| Service | Functions | Description |
|---------|-----------|-------------|
| `storage` | `saveToStorage`, `loadFromStorage`, `saveMetadataToStorage`, `saveNotesToStorage`, `loadMetadataFromStorage`, `loadNotesFromStorage` | Low-level localStorage CRUD |
| `export` | `exportToJson`, `exportToTxtFile` | Export data with optional date range filtering |
| `exportTxt` | `exportToTxt` | Convert metadata + notes to custom TXT format |
| `import` | `importFromJson` | Parse and validate uploaded JSON files |

---

## Export Format

### JSON

Standard structured export with metadata, notes, standalone notes, tasks, version, and export date.

### TXT

Custom text format:

```
@v=1.0
@export=2026-07-22T20:00:00.000Z

# 2026-07-22
mood: bien
energy: -
tags: -

> Texto de la entrada del día...

~ 14:30 mejor | Me sentí productivo
~ 18:00 igual
```
