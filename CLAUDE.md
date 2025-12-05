# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + TypeScript + Vite admin dashboard application using Tailwind CSS v4, React Router v7, and a multi-layout architecture with internationalization support.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (runs TypeScript check first)
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Context Providers (App-level State)

The application wraps all routes with five context providers in this specific order:

1. **AuthProvider** - Authentication state and JWT token management
2. **ThemeProvider** - Theme configuration (mode, colors, layout preference)
3. **LocaleProvider** - i18n language selection
4. **BreakpointProvider** - Responsive breakpoint detection
5. **SidebarProvider** - Sidebar state management

All contexts use the `createSafeContext` utility pattern (src/utils/createSafeContext.tsx) which ensures contexts are only used within their providers and throws helpful errors otherwise.

### Routing Architecture

Three-tier route system defined in src/app/router/:

- **Protected routes** (`protected.tsx`) - Require authentication via `AuthGuard` middleware
  - Use `DynamicLayout` for pages supporting multiple layout types (main-layout, sideblock)
  - Use `AppLayout` for pages that only support main-layout (e.g., settings)
- **Ghost routes** (`ghost.tsx`) - Only accessible when NOT authenticated (login, signup)
  - Guarded by `GhostGuard` middleware
- **Public routes** (`public.tsx`) - Accessible without authentication (error pages, etc.)

All routes use React Router v7's lazy loading pattern for code splitting.

### Layout System

The **DynamicLayout** component (src/app/layouts/DynamicLayout.tsx) dynamically loads layouts based on the `themeLayout` setting from ThemeContext:

- `main-layout` - Traditional sidebar navigation
- `sideblock` - Alternative sidebar layout variant

AppLayout forces main-layout regardless of theme settings (used for settings pages).

### Path Aliases

The `@` alias maps to the `src/` directory (configured in vite.config.ts):
```typescript
import { Component } from "@/components/ui/Component"
import { useAuthContext } from "@/app/contexts/auth/context"
```

### API Integration

- Axios instance configured in src/utils/axios.ts
- Base URL: `https://jwt-api-node.vercel.app` (test JWT API)
- Response interceptor handles errors globally
- JWT tokens managed by AuthProvider

### Internationalization

- Uses i18next with react-i18next
- Config: src/i18n/config.ts
- Default/fallback language: "en"
- Language detection: localStorage → browser navigator
- Supports multiple languages defined in src/i18n/langs

### Navigation Structure

Navigation uses a tree structure (NavigationTree type in src/@types/navigation.ts):
```typescript
{
  id: string;
  type: NavigationType;  // from constants/app.ts
  path?: string;
  title?: string;
  transKey?: string;     // i18n translation key
  icon?: string;
  childs?: NavigationTree[];
}
```

### Theme System

Theme configuration (src/configs/theme.ts) includes:
- Theme mode: light/dark/system
- Monochrome mode toggle
- Layout preference: main-layout or sideblock
- Card skin: bordered or shadow
- Color schemes: dark, light, primary (customizable)
- Notification settings: position, visibility, expansion state

Theme values stored in localStorage and applied via ThemeProvider.

## Key Utilities

- **createSafeContext** - Type-safe context creation with automatic error handling
- **JWT utilities** (src/utils/jwt.ts) - Token decoding and validation
- **React Table utilities** (src/utils/react-table/) - Table filtering and state management
- **DOM utilities** (src/utils/dom/) - Browser detection, device type, scrollbar width, etc.

## Custom Hooks

Located in src/hooks/:
- useLocalStorage - Synced localStorage state
- useMediaQuery - Responsive breakpoint detection
- useDebounceValue/useDebounceCallback - Debouncing utilities
- useUncontrolled - Controlled/uncontrolled component pattern
- useToggle - Boolean state management
- And many more utility hooks

## Component Patterns

- UI components in src/components/ui/ (Pagination, Accordion, Table, Spinner, etc.)
- Template components in src/components/template/ (SplashScreen, Toaster, Tooltip)
- Shared components in src/components/shared/ (forms, tables, utilities)
- Page components in src/app/pages/ organized by feature
- Layout components in src/app/layouts/ with nested structures

## Styling

- Tailwind CSS v4 with @tailwindcss/vite plugin
- Prettier configured with prettier-plugin-tailwindcss
- Custom functions: `clsx`, `cn`
- Custom attributes: `rootClass`, `classNames`
- Theme colors defined in src/constants/colors.ts

## Code Quality

- TypeScript strict mode enabled (tsconfig.app.json)
- ESLint with TypeScript, React Hooks, and React Refresh plugins
- `@typescript-eslint/no-explicit-any` disabled in eslint.config.js
- Prettier for code formatting with Tailwind class sorting
