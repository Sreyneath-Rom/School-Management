# High School Management - Admin UI

The administrator frontend for the High School Management System. It provides school setup, user and role management, academic configuration, attendance, reports, communication, and dashboard views.

## Stack

- React 19 and TypeScript
- Vite
- Tailwind CSS
- React Router
- Context API and Redux Toolkit
- Fetch-based API client
- React Hook Form and Zod

## Requirements

- Node.js and npm
- The API running from `high-school-api`
- PostgreSQL configured for the API

## Run From The Repository Root

Install dependencies once:

```bash
npm install
```

Start the API in one terminal:

```bash
npm run dev:api
```

Start the admin UI in another terminal:

```bash
npm run dev:admin
```

The admin UI runs at `http://localhost:3000` and the API runs at `http://localhost:5000`.

Only one frontend can use port `3000` at a time unless its Vite port is changed in `vite.config.ts`.

## Run From This Directory

```bash
npm install
npm run dev
```

Other available commands:

```bash
npm run build
npm run lint
npm run preview
```

## API Configuration

The client uses `/api/v1` by default. Vite proxies `/api` requests to `http://localhost:5000` during development.

To use another API URL, create `.env` in this directory:

```env
VITE_API_URL=/api/v1
```

To change the development proxy target, set this before starting Vite:

```bash
VITE_API_PROXY_TARGET=http://localhost:5000 npm run dev:admin
```

The browser client sends bearer tokens stored in local storage and refreshes expired access tokens through `/api/v1/auth/refresh-token`.

## Mock API Mode

Real API requests are used by default. For local UI work without the backend, explicitly enable the Vite mock middleware:

```bash
VITE_USE_MOCK_API=true npm run dev:admin
```

Mock mode should not be enabled when testing the real API integration.

## Main Routes

- `/login` - shared login screen
- `/login/admin` - administrator login
- `/dashboard` - administrator dashboard
- `/setup/school` - school and system setup
- `/students` and `/teachers` - people management
- `/reports` - administrative reports

## Code Organization

- `src/routes` - authenticated and role-specific route registration
- `src/pages` - page-level screens
- `src/features` - reusable feature workflows
- `src/services` - API service functions
- `src/lib/apiClient.ts` - shared HTTP, token, refresh, and error handling
- `src/context` - authentication, school, and theme state
- `src/i18n` - built-in and stored translations

Use the shared `apiClient` or `apiUpload` from services instead of calling `fetch` directly in page components.
