# Nozen

Personal daily planner: diary with mood tracking, notes, daily tasks, zen mode, and desktop app.

## Features

### Diary
- Free writing per day with **26 rotating Spanish prompts**
- **Mood tracking** with emoji-based options (excelente, bien, neutral, mal, terrible)
- **Status checks** throughout the day (mejor, igual, peor) with optional notes
- **Writing streak calendar** — visual history of days with entries
- Navigate days with **arrow keys** or calendar click

### Notes
- Standalone notes with title and content
- Full text search
- Create, edit, delete

### Daily Tasks
- Checklist per day, auto-keyed by date
- Add, toggle, delete tasks

### Zen Mode
- Distraction-free writing experience
- Serif font toggle
- Collapsible streak calendar
- Daily prompts when textarea is empty

### Export
- **Per-day export** — download a single day as JSON or TXT
- **Date range export** — select start/end dates and export that range
- **Full export** — download all data as JSON or TXT
- **Import** — restore from JSON backup

### Backfill
- **Add past days** — pick any date and write entries for days you wrote on paper

### Themes
- Dark / light / system mode
- Persistent across sessions

### Desktop
- Tauri v2 wrapper for native desktop experience
- Same codebase as web version

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16.0.10 |
| Runtime | React | 19.2.0 |
| Language | TypeScript | 5.9.3 (strict) |
| Styling | Tailwind CSS | 4.1.9 |
| UI | shadcn/ui + Radix UI | — |
| State | Zustand | 5.0.11 |
| Animation | Framer Motion | 12.x |
| Icons | Lucide React | 0.454.0 |
| Calendar | react-day-picker | 10.0.1 |
| Validation | Zod | 4.3.6 |
| Dates | date-fns | 4.4.0 |
| Toast | Sonner | 2.0.7 |
| Themes | next-themes | 0.4.6 |
| Linting | Biome | 2.4.13 |
| Desktop | Tauri v2 (Rust) | — |
| Package Manager | pnpm | 11.15.1 |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start dev server |
| `pnpm run build` | Build for production |
| `pnpm run start` | Start production server |
| `pnpm run lint` | Lint with Biome |
| `pnpm run format` | Format with Biome |
| `pnpm run check` | Lint + format + write fixes |
| `pnpm run tauri:dev` | Start Tauri desktop in dev mode |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ArrowLeft` | Previous day |
| `ArrowRight` | Next day |
| `T` | Jump to today |
| `Z` | Toggle Zen mode |

## Project Structure

```
├── app/                  # Next.js App Router (single page + sandbox)
│   ├── page.tsx          # Main diary page
│   ├── layout.tsx        # Root layout (fonts, themes, PWA)
│   └── sandbox/page.tsx  # Dev error boundary testing
│
├── components/
│   ├── ui/               # shadcn/ui base (15 components)
│   ├── diary/            # Diary feature (6 components)
│   └── shared/           # Shared: error display, toaster, theme toggle
│
├── store/                # Zustand stores (6 stores)
│   ├── diary.ts          # Date, mood, status checks, note content
│   ├── note.ts           # Standalone notes (persisted)
│   ├── daily-tasks.ts    # Daily checklists (persisted)
│   ├── standalone-tasks.ts # Independent task list (persisted)
│   ├── ui.ts             # Sidebars, zen mode, theme
│   └── user-preferences.ts # Delete confirmation, theme
│
├── services/             # Business logic
│   ├── storage.ts        # localStorage wrapper
│   ├── export.ts         # JSON/TXT export (date range support)
│   ├── exportTxt.ts      # TXT format serializer
│   └── import.ts         # JSON import with validation
│
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
├── utils/                # Utilities (cn, date, id)
├── constants/            # Prompts (26), mood options
├── src-tauri/            # Tauri v2 desktop wrapper
└── public/               # Static assets, icons, PWA manifest
```

## Data Persistence

All data is stored in the browser's `localStorage`:

| Key | Store | Content |
|-----|-------|---------|
| `diary-metadata` | diary | Mood, status checks, energy, tags per day |
| `diary-notes` | diary | Writing content per day |
| `diary-standalone-notes:v1` | note | Standalone notes |
| `daily-tasks:v1` | daily-tasks | Daily checklists |
| `standalone-tasks:v1` | standalone-tasks | Independent task list |
| `ui:v1` | ui | Sidebar state, zen mode |
| `user-preferences` | user-preferences | Theme, delete confirmation |

## Export Formats

### JSON

Structured export with all data (metadata, notes, standalone notes, tasks, version, export date).

### TXT

Human-readable format:

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

## License

Private — personal project.
