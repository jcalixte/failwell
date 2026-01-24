# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fail Well is a Progressive Web App (PWA) for tracking developer feedback loops during coding tasks. It helps compare planned steps/time vs actual execution, promoting iterative improvement.

## Commands

```bash
# Development
pnpm dev                    # Start Vite dev server

# Building
pnpm build                  # Full build (types + tests + bundle)
pnpm build-only             # Vite build only

# Testing
pnpm test                   # Full test suite (lint + types + unit)
pnpm test:unit              # Vitest unit tests only
pnpm test:ui                # Vitest with UI dashboard
pnpm test:types             # TypeScript type checking

# Code Quality
pnpm lint                   # ESLint with auto-fix
pnpm format                 # Prettier formatting

# Commits
pnpm commit                 # Commitizen conventional commit prompt
```

## Architecture

**Tech Stack:** Vue 3 + TypeScript + Vite + Pinia + Bulma CSS

**Module Structure:**

- `src/modules/` - Feature modules with self-contained components, stores, models, and services
  - `record/` - Task execution tracking (time, steps, break calculation)
  - `task/` - Task CRUD, step history, duplication
  - `step/` - Step-related components
- `src/views/` - Page-level components organized by feature
- `src/shared/` - Shared types and hooks
- `src/router/` - Vue Router configuration

**State Management:** Pinia stores with `pinia-plugin-persistedstate` for local persistence

**Key Routes:**

- `/` - Task list
- `/task/:id` - Task details
- `/task/:id/edit` - Edit steps
- `/task/:taskId/record` - Record task execution

## Testing

Uses Vitest with jsdom environment. Test files are colocated with source files using `.spec.ts` suffix.

Run single test file: `pnpm vitest run path/to/file.spec.ts`
