# Store Conventions (Zustand)

## General Guidelines

- Each store has its own file in `lib/store/`
- Use `subscribeWithSelector` middleware for persistence logic
- Never handle persistence from components with `useEffect` — do it in the store

## ID Generation

Always use `crypto.randomUUID()` — never `Math.random()`. Import from `@/utils/id`:

```typescript
import { generateId } from "@/utils/id";
const id = generateId();
```

## Accessing State Outside React

Accessing state outside React components using `useStore.getState()` is a valid and intentional pattern:

```typescript
// Valid - direct state access without subscription
const handleAction = () => {
  const state = useStore.getState();
  // use state values
};
```

## Existing Stores

| Store | Description |
|-------|-------------|
| `diary.ts` | Manages diary state: current date, mood, status checks, daily writing |
| `ui.ts` | Manages UI state: dialogs, sidebars, theme |
| `note.ts` | Manages standalone notes |
| `daily-tasks.ts` | Manages daily checklist tasks (per-date) |
| `standalone-tasks.ts` | Manages standalone tasks (independent list) |

## Store Structure

Each store should follow this pattern:

1. Import dependencies (`create`, middleware)
2. Define TypeScript interface for state
3. Create store with `create<StoreState>()(persist(...))`
4. Export typed hook `useStoreName`