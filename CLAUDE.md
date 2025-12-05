# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tailux** is a premium React admin template from ThemeForest built with React 19, TypeScript, Tailwind CSS v4, and Vite. It's a comprehensive dashboard solution with 20+ pre-built dashboards, 10+ apps, 40+ pages, and 1000+ components.

**Key Features:**
- React 19 + TypeScript + Vite
- Tailwind CSS v4 utility-first framework
- Multi-layout architecture (main-layout, sideblock)
- Dark/Light/System theme modes with monochrome option
- Multi-language support (LTR/RTL) via i18next
- Ultra-responsive design
- JWT authentication ready
- 100+ custom hooks and utilities

**System Requirements:**
- Node.js 18 or higher
- npm or Yarn package manager

**Official Resources:**
- Documentation: https://tailux.piniastudio.com/docs
- Demo: https://tailux-landing.vercel.app/
- ThemeForest: https://themeforest.net/item/tailux-react-tailwind-admin-template/56397379

## Development Commands

```bash
# Install dependencies
npm install
# If peer dependency issues occur:
npm install --legacy-peer-deps

# Start development server (http://localhost:5173)
npm run dev

# Build for production (runs TypeScript check first, outputs to /dist)
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

## Project Structure

```
src/
├── @types/              # TypeScript type definitions
├── app/
│   ├── contexts/       # React contexts (auth, theme, locale, etc.)
│   ├── layouts/        # Layout components (MainLayout, Sideblock, etc.)
│   ├── pages/          # Page components organized by feature
│   │   ├── dashboards/ # 20+ dashboard variations
│   │   ├── apps/       # Kanban, Chat, Mail, Calendar, etc.
│   │   ├── Auth/       # Login, register, forgot password
│   │   ├── settings/   # Settings pages
│   │   └── errors/     # Error pages (404, 500, etc.)
│   └── router/         # Route configuration (protected, ghost, public)
├── assets/             # Images, icons, fonts
├── components/
│   ├── ui/            # Base UI components (Button, Card, Modal, etc.)
│   ├── shared/        # Shared components (forms, tables)
│   └── template/      # Template components (SplashScreen, Toaster)
├── configs/           # Configuration files (theme, auth, breakpoints)
├── constants/         # App constants (colors, navigation types)
├── hooks/             # 100+ custom React hooks
├── i18n/              # Internationalization configuration
├── styles/            # Global styles
├── utils/             # Utility functions and helpers
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

## Included Content

**Dashboards (20+):** Sales, CRM Analytics, Orders, Cryptocurrency, Banking, Personal, CMS Analytics, Influencer, Travel, Teacher, Education, Authors, Doctor, Employees, Workspaces, Meetings, Projects Board, Widgets

**Pre-built Apps (10+):** Kanban Board, To-Do List, Chat App, AI Chat, Mail/Email, Calendar, File Manager, Invoice, Notes

**Pages (40+):** Authentication (Login, Register, Password Reset), User Profiles, Settings, Blog, FAQ, Pricing, Error Pages, Help Center, Landing Pages, Coming Soon, Maintenance

**Data Tables (20+):** Orders, Projects, Subscriptions, Users, Products, Transactions - all with advanced filtering and customization

**Forms (10+):** Form Wizards (eKYC, Add Product, New Post), Validation, Elements, Layouts

## Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```bash
# API URL
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=My App
VITE_APP_VERSION=1.0.0
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Backend Integration

To integrate with your own API:

1. **Configure API URL** in `.env`:
   ```bash
   VITE_API_URL=http://localhost:3001/api
   ```

2. **Update axios instance** (src/utils/axios.ts):
   ```typescript
   import axios from "axios";

   const axiosInstance = axios.create({
     baseURL: import.meta.env.VITE_API_URL,
   });

   // Add request interceptor for auth tokens
   axiosInstance.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

3. **Use React Query** for data fetching (recommended):
   ```typescript
   import { useQuery } from '@tanstack/react-query';

   function useDashboard(appId: string) {
     return useQuery({
       queryKey: ['dashboard', appId],
       queryFn: () => axiosInstance.get(`/${appId}/metrics/dashboard`),
     });
   }
   ```

## Common Issues & Solutions

**Problem:** Build errors or type errors
- **Solution:** Ensure Node.js 18+ is installed. Run `npm run build` to see specific TypeScript errors.

**Problem:** Peer dependency warnings during install
- **Solution:** Use `npm install --legacy-peer-deps`

**Problem:** Dark mode not switching
- **Solution:** Check `darkMode: 'class'` is set in Tailwind config. Theme mode is managed by ThemeContext.

**Problem:** Slow performance in development
- **Solution:** Components already use lazy loading via React Router. Check for unnecessary re-renders in custom code.

**Problem:** Routing issues or 404 on refresh
- **Solution:** Ensure your server is configured for SPA routing (see Deployment section).

## Deployment

### Vercel (Recommended)
1. Push code to GitHub/GitLab
2. Import project in Vercel
3. Configure environment variables
4. Deploy (automatic on push)

### Netlify
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configure environment variables

### Custom Server
1. Build: `npm run build`
2. Copy `/dist` contents to server
3. Configure web server for SPA:

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Use Cases

Tailux is ideal for:
- Sales & Analytics Dashboards
- CRM Systems
- SaaS Admin Panels
- E-commerce Admin
- Project Management Tools
- Educational Platforms (LMS)
- Healthcare Dashboards
- Cryptocurrency Interfaces
- HR Management Systems
- Any admin/dashboard application requiring rich UI components
