# Admin UI source structure

This source tree is organized by responsibility so the app stays readable and easy to maintain.

## 1) App shell and routing
- `App.tsx` — root app entry point
- `main.tsx` — app bootstrap
- `routes/` — route definitions and protected route checks
- `layouts/` — shared shell layout, header, sidebar, page wrappers

## 2) Reusable UI
- `components/` — generic components used across multiple pages
  - `common/` — buttons, cards, modals, badges, loaders
  - `auth/` — auth-specific UI
  - `layout/` — layout helpers
  - `tables/` — table shells and data grid UI
  - `charts/` — chart wrappers and reusable visual widgets
  - `forms/` — form blocks and field components

Rule:
- Keep these components generic and domain-agnostic.
- They should not know about business rules or page-specific data.

## 3) Pages
- `pages/` — route-level screens
  - Example: `pages/Dashboard/`, `pages/Students/`, `pages/Setup/`

Rule:
- Pages compose features and layouts.
- They should stay focused on page flow, not contain every business detail.

## 4) Features
- `features/` — domain-specific feature modules
  - Example: `features/setup/translations/`, `features/students/`, `features/attendance/`

Rule:
- Feature folders contain the logic, UI, and local state for one business domain.
- This is the best place for complex forms, filters, tables, and domain behavior.

## 5) Data and API layers
- `data/` — mock or seed data used for demos and initial development
  - `studentProfiles.ts` — rich student profile fixtures and their shared type
  - `facultyRoster.ts` — teacher roster fixtures and teacher filter options
- `services/` — API communication layer
- `lib/` — lower-level utilities and shared API helpers
- `store/` — global state if used by the app

Rule:
- Data should not live inside page components.
- API requests should be centralized in services, not repeated across pages.
- Keep fixture records in `data/`, even when a page is the only current consumer.

## 6) Logic and hooks
- `hooks/` — reusable custom hooks
  - `useAuth.ts`, `usePagination.ts`, `useDebounce.ts`, `useForm.ts`, etc.
- `context/` — app-level providers such as auth, school, theme
- `utils/` — helpers for formatting, validation, constants, permissions

Rule:
- Put reusable logic in hooks or utils, not inside page components.

## 7) Clean separation pattern
Use this pattern for new work:

- `components/` → visual building blocks
- `features/` → one business feature with its own state and UI
- `pages/` → route composition and page layout
- `data/` → mock/demo data and fixtures
- `services/` → backend calls
- `hooks/` → reusable logic
- `utils/` → plain functions and small helpers

## 8) Naming conventions
- Use folders by domain, not by exact file type only.
- Prefer feature-based folders over large page files.
- Keep files small and focused.
- One component or one feature per file when possible, unless a very small helper is clearly shared.

## 9) Recommended structure for future growth
```txt
src/
  components/
    common/
    layout/
    forms/
  features/
    setup/
      translations/
    students/
    teachers/
  pages/
    Dashboard/
    Students/
    Setup/
  services/
  data/
  hooks/
  context/
  utils/
  routes/
  layouts/
```

This structure keeps the app understandable, modular, and scalable while staying close to the current layout already in place.
