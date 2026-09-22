// src/lib/apiClient.ts
import { LOCAL_STORAGE_KEYS } from '@/utils/constants'
import { mockApiHandler } from '@/lib/mockApiHandler'

/**
 * Normalize the base URL. A trailing slash is stripped and, if the URL is
 * missing the `/api/v1` suffix, it's added. This prevents the common
 * misconfiguration where `VITE_API_URL=http://localhost:5000` silently
 * routes every request to `/auth/login` instead of `/api/v1/auth/login`.
 *
 * Falls back to the relative path `/api/v1`, which works when the frontend
 * is served from the same origin as the API (through nginx).
 */
function resolveBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim()
  if (!raw) return '/api/v1'

  const trimmed = raw.replace(/\/+$/, '')
  if (/\/api\/v\d+$/.test(trimmed)) return trimmed
  return `${trimmed}/api/v1`
}

const API_BASE_URL = resolveBaseUrl()
// Opt-IN, not opt-out: an unset env var (e.g. a prod deploy that forgot to
// set this) must never silently start mocking requests. Only the literal
// string 'true' turns mocking on.
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

// -----------------------------------------------------------------------------
// Error type
// -----------------------------------------------------------------------------

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown
  /**
   * Correlation ID echoed by the server on every response. When a user
   * reports "something broke", this is the string that finds the matching
   * server log line — without it, the report is untraceable.
   */
  readonly requestId: string | undefined
  /** Field-level validation errors, ready to feed a form. */
  readonly fieldErrors: Record<string, string[]> | undefined

  constructor(
    status: number,
    message: string,
    body?: unknown,
    requestId?: string,
    fieldErrors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
    this.requestId = requestId
    this.fieldErrors = fieldErrors
    // Cleaner stack trace — points at the throw site, not this constructor.
    if (typeof (Error as { captureStackTrace?: unknown }).captureStackTrace === 'function') {
      ;(Error as unknown as {
        captureStackTrace(target: object, ctor: Function): void
      }).captureStackTrace(this, ApiError)
    }
  }

  /** True when the error is a client-side validation problem (400/422). */
  get isValidation(): boolean {
    return this.status === 400 || this.status === 422
  }

  /** True when the caller needs to log in again. */
  get isAuth(): boolean {
    return this.status === 401
  }

  /** True when the caller is authenticated but not permitted. */
  get isForbidden(): boolean {
    return this.status === 403
  }
}

// -----------------------------------------------------------------------------
// Session lifecycle
// -----------------------------------------------------------------------------

let inFlightRefresh: Promise<string | null> | null = null
let sessionExpiryNotified = false

function clearStoredTokens() {
  window.localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
  window.localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
  if (!sessionExpiryNotified) {
    sessionExpiryNotified = true
    window.dispatchEvent(new Event('auth:session-expired'))
  }
}

/**
 * Called by the login flow after a successful login. Resets the "already
 * notified" flag so a subsequent session expiry fires the event again.
 *
 * Without this, the `auth:session-expired` event fires exactly once for the
 * lifetime of the tab. A user who logs in, gets expired, logs in again, and
 * gets expired again would never see the second redirect to login.
 */
export function resetSessionExpiry() {
  sessionExpiryNotified = false
}

// -----------------------------------------------------------------------------
// Refresh
// -----------------------------------------------------------------------------

/**
 * Attempts to rotate the refresh token and store the new pair. Returns the
 * new access token on success, or `null` on any failure.
 *
 * Failures covered:
 *   - No refresh token in storage (never logged in, or already cleared)
 *   - Network failure (fetch rejected — DNS, CORS, connection drop)
 *   - Non-2xx response (401 expired/revoked, 500, etc.)
 *   - Non-envelope or `success: false` body
 *
 * All four produce `null`, and every one clears the stored tokens. The
 * caller then treats the situation as "session expired" and redirects.
 * Returning a rejected promise instead would surface as a raw "Failed to
 * fetch" in the UI, indistinguishable from a real network outage.
 */
async function performRefresh(): Promise<string | null> {
  const refreshToken = window.localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
  if (!refreshToken) return null

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
  } catch {
    // Network error — do NOT clear tokens here. A temporary outage
    // (user's wifi dropped, dev server restarting) shouldn't log them out.
    // The next request will retry the refresh.
    return null
  }

  if (!res.ok) {
    // Server explicitly rejected the refresh token. This is authoritative —
    // the token is expired or revoked server-side. Clear and let the app
    // redirect to login.
    clearStoredTokens()
    return null
  }

  const body = (await res.json().catch(() => null)) as
    | { success: true; data: { accessToken: string; refreshToken: string } }
    | { success: false; message?: string }
    | null

  if (!body || body.success !== true) {
    clearStoredTokens()
    return null
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, body.data.accessToken)
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, body.data.refreshToken)
  sessionExpiryNotified = false
  return body.data.accessToken
}

/**
 * Serialized refresh — a second caller hitting a 401 while the first is
 * already refreshing waits on the same promise rather than firing a second
 * refresh. Without this, two concurrent 401s produce two refresh calls; the
 * second uses a now-revoked token (rotation revokes on use) and fails,
 * clearing the session even though the first refresh succeeded.
 */
function refreshAccessToken(): Promise<string | null> {
  if (!inFlightRefresh) {
    inFlightRefresh = performRefresh().finally(() => {
      inFlightRefresh = null
    })
  }
  return inFlightRefresh
}

// -----------------------------------------------------------------------------
// Response handling
// -----------------------------------------------------------------------------

interface Envelope<T> {
  success: boolean
  data?: T
  meta?: unknown
  message?: string
  errors?: Record<string, string[]>
  requestId?: string
}

/**
 * Extracts the payload from an enveloped response, or throws a structured
 * ApiError. Two shapes are tolerated:
 *
 *   1. `{ success: true, data: T }` — the server's standard envelope.
 *   2. A bare payload — for 204s, and for any endpoint that ever returns
 *      unwrapped JSON (defensive; the current API always envelopes).
 */
async function handleResponse<T>(res: Response, path: string): Promise<T> {
  if (res.status === 204) return undefined as T

  let body: Envelope<T> | unknown = null
  try {
    body = await res.json()
  } catch {
    // Non-JSON body (some proxies return HTML error pages, or the response
    // was genuinely empty). Fall through to the checks below.
  }

  const enveloped =
    body !== null && typeof body === 'object' && 'success' in (body as object)
      ? (body as Envelope<T>)
      : null

  if (!res.ok || (enveloped && !enveloped.success)) {
    const requestId =
      enveloped?.requestId ?? res.headers.get('x-request-id') ?? undefined

    throw new ApiError(
      res.status,
      enveloped?.message ?? `Request to ${path} failed with ${res.status}`,
      body,
      requestId,
      enveloped?.errors
    )
  }

  return enveloped ? (enveloped.data as T) : (body as T)
}

// -----------------------------------------------------------------------------
// Request core
// -----------------------------------------------------------------------------

function buildHeaders(
  token: string | null,
  hasBody: boolean,
  overrides?: HeadersInit
): HeadersInit {
  return {
    // Content-Type only on requests that actually carry a JSON body. GETs
    // and DELETEs without a body shouldn't declare one — some proxies
    // interpret a Content-Type on an empty request as "expect a body" and
    // reject it.
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...overrides,
  }
}

/** Routes that should never trigger the auto-refresh-and-retry flow. */
const NON_REFRESHABLE_PATHS = new Set([
  '/auth/login',
  '/auth/refresh-token',
  '/auth/logout',
  '/auth/logout-all',
])

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: buildHeaders(token, options.body != null, options.headers),
    })

    // Auto-refresh on 401 once, then retry. Auth-flow endpoints are excluded
    // so a failed login doesn't accidentally trigger a refresh loop.
    if (res.status === 401 && retry && !NON_REFRESHABLE_PATHS.has(path)) {
      const refreshedToken = await refreshAccessToken()
      if (refreshedToken) return request<T>(path, options, false)
      // Refresh failed — tokens already cleared by performRefresh.
    }

    return await handleResponse<T>(res, path)
  } catch (err) {
    if (!USE_MOCK_API) throw err

    // 4xx (other than 404, which we treat as "no such mock/real route,
    // try mocking it") are real client errors from a live server and must
    // never be swallowed. 5xx must not be swallowed either — a genuine
    // server outage should surface as a server error, not get silently
    // replaced by mock data.
    if (err instanceof ApiError && err.status !== 404) {
      throw err
    }

    const method = options.method || 'GET'
    let parsedBody: any
    try {
      parsedBody = options.body ? JSON.parse(options.body as string) : undefined
    } catch {
      parsedBody = options.body
    }

    const mockRes = await mockApiHandler.handle(path, method, parsedBody)
    if (mockRes) {
      if (!mockRes.success) {
        throw new ApiError(400, mockRes.message || 'API request failed', mockRes)
      }
      return mockRes.data as T
    }

    throw err
  }
}

async function requestUpload<T>(
  path: string,
  formData: FormData,
  retry = true
): Promise<T> {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)

  try {
    // No Content-Type here — the browser sets it with the multipart boundary.
    // Setting it manually omits the boundary and the server rejects the body.
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })

    if (res.status === 401 && retry) {
      const refreshedToken = await refreshAccessToken()
      if (refreshedToken) return requestUpload<T>(path, formData, false)
    }

    return await handleResponse<T>(res, path)
  } catch (err) {
    if (!USE_MOCK_API) throw err

    // Same rule as request(): only fall through to the mock handler for
    // "route doesn't exist" (404) or true network failures. A real 4xx
    // validation error (file too large, bad type, etc.) or 5xx from a
    // live server must be surfaced, not masked.
    if (err instanceof ApiError && err.status !== 404) {
      throw err
    }

    const mockRes = await mockApiHandler.handle(path, 'POST', formData)
    if (mockRes) {
      if (!mockRes.success) {
        throw new ApiError(400, mockRes.message || 'API upload failed', mockRes)
      }
      return mockRes.data as T
    }

    throw err
  }
}

// -----------------------------------------------------------------------------
// Public client
// -----------------------------------------------------------------------------

export interface RequestOptions {
  /** Pass an AbortSignal to cancel the request (e.g. on unmount). */
  signal?: AbortSignal
  /** Extra headers merged into the defaults. */
  headers?: HeadersInit
}

export const apiClient = {
  get: <T>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'GET', ...opts }),

  post: <T>(path: string, body?: unknown, opts: RequestOptions = {}) =>
    request<T>(path, {
      method: 'POST',
      body: body != null ? JSON.stringify(body) : undefined,
      ...opts,
    }),

  put: <T>(path: string, body?: unknown, opts: RequestOptions = {}) =>
    request<T>(path, {
      method: 'PUT',
      body: body != null ? JSON.stringify(body) : undefined,
      ...opts,
    }),

  patch: <T>(path: string, body?: unknown, opts: RequestOptions = {}) =>
    request<T>(path, {
      method: 'PATCH',
      body: body != null ? JSON.stringify(body) : undefined,
      ...opts,
    }),

  delete: <T>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'DELETE', ...opts }),
}

/**
 * Multipart upload — for `/school/logo` and any future file-upload
 * endpoint. Returns the unwrapped payload (typically `{ logoUrl, ... }`).
 */
export const apiUpload = <T>(path: string, formData: FormData) =>
  requestUpload<T>(path, formData)