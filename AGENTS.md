# Repository Guidelines

## How to Use This Guide

- Start here for cross-project norms.
- Check `.agents/skills/` for detailed patterns on-demand.
- See also: AGENTS.md in `hooks/`, `store/`, and `components/` for specific conventions.

---

## Available Skills

| Skill                         | Description                            | URL                                                                                                        |
| ----------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `clean-code`                  | Clean Code principles (Bob Martin)     | [.agents/skills/clean-code/SKILL.md](.agents/skills/clean-code/SKILL.md)                                   |
| `frontend-design`             | Production-grade UI/UX design          | [.agents/skills/frontend-design/SKILL.md](.agents/skills/frontend-design/SKILL.md)                         |
| `vercel-react-best-practices` | React/Next.js performance optimization | [.agents/skills/vercel-react-best-practices/SKILL.md](.agents/skills/vercel-react-best-practices/SKILL.md) |

### Auto-invoke Skills

When performing this actions, ALWAYS invoke the corresponding skill FIRST:

| Action                           | Skill                         |
| -------------------------------- | ----------------------------- |
| Building UI components           | `frontend-design`             |
| Writing React/Next.js code       | `vercel-react-best-practices` |
| Using Tailwind CSS               | `frontend-design`             |
| Writing clean, maintainable code | `clean-code`                  |

---

## Project Overview

| Field       | Value                                            |
| ----------- | ------------------------------------------------ |
| Name        | nozen                                            |
| Description | Personal daily planner: Diary with mood tracking, Notes, Daily Tasks, Zen mode, and Tauri desktop |
| Type        | Next.js 16 App Router                          |
| Platform   | Web (PWA-ready)                                |

### Tech Stack

| Category         | Technology         |
| ---------------- | ------------------ |
| Framework        | Next.js 16.0.10    |
| Runtime          | React 19.2.0       |
| Language         | TypeScript 5 (strict) |
| Styling          | Tailwind CSS 4.1.9 |
| UI Components    | shadcn/ui + Radix UI |
| State Management | Zustand 5.0.11     |
| Forms            | React Hook Form + Zod |
| Animation        | Framer Motion 12    |
| Icons            | Lucide React        |
| Linting/Format   | Biome              |
| Package Manager | bun                |

---

## Development

```bash
# Setup
bun install

# Development server
bun run dev

# Build production
bun run build

# Lint (Biome — usar pnpm por compatibilidad con Windows)
pnpm run lint

# Format (Biome)
pnpm run format

# Validate all (lint + format + check)
pnpm run check

# Start production
bun run start
```

---

## Tooling

### Biome

- **Lint**: `bun run lint`
- **Format**: `bun run format`
- **Check**: `bun run check` (lint + format + write fixes)

### Pre-commit Hooks

Husky + lint-staged configured. Every commit runs `bun run check` on staged files automatically.

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

### ID Generation

Always use `crypto.randomUUID()` — never `Math.random()`. Import from `@/utils/id`:

```typescript
import { generateId } from "@/utils/id";
const id = generateId();
```

---

## Project Structure

```
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/            # Generic UI (shadcn)
│   └── diary/         # Diary feature components
├── hooks/              # Custom hooks
├── store/              # Zustand stores
├── types/              # TypeScript types
├── services/           # Business logic
├── utils/             # Utilities
├── constants/         # Constants
└── public/           # Static assets
```
