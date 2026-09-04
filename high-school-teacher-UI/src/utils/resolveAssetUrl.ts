// src/utils/resolveAssetUrl.ts
//
// The API base URL points at `/api/v1` (or a full origin + `/api/v1` in
// production), but static files (uploaded logos, attachments, etc.) are
// served by the backend from its root — e.g. `/uploads/xyz.png`, not
// `/api/v1/uploads/xyz.png`. This strips the `/api/v1` suffix to get the
// backend's origin, then joins it with whatever relative path the API
// returned.

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v\d+\/?$/, '')

export function resolveAssetUrl(path?: string | null): string | null {
  if (!path) return null
  // Already an absolute URL (e.g. a data: URI or external host) — use as-is.
  if (/^(https?:|data:|blob:)/.test(path)) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_ORIGIN}${normalizedPath}`
}