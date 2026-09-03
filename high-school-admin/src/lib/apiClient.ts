// src/lib/apiClient.ts
//
// Minimal fetch wrapper for the API. It attaches the access token from
// localStorage, unwraps backend response envelopes, and refreshes the token
// automatically when the access token expires.

import { LOCAL_STORAGE_KEYS } from '@/utils/constants'
import { mockApiHandler } from '@/lib/mockApiHandler'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'
const USE_MOCK_API = import.meta.env.VITE_ENABLE_MOCK_API === 'true'

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

// Multiple requests can 401 at the same moment (e.g. several components
// fetching on mount with an expired access token). Without de-duplication,
// each one independently calls the refresh endpoint with the SAME refresh
// token. If the backend rotates/invalidates refresh tokens on use, only the
// first of these calls succeeds — every other concurrent call sends an
// already-used refresh token and gets 401'd itself, even though the "real"
// refresh succeeded. Sharing one in-flight promise fixes that: every 401
// that happens while a refresh is already underway just awaits that same
// promise instead of firing its own request.
let inFlightRefresh: Promise<string | null> | null = null

function clearStoredTokens() {
  window.localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
  window.localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
  // Let AuthContext (or anything else listening) know the session is
  // truly dead, so it can log the user out instead of "keeping the
  // session" with tokens that will never work again.
  window.dispatchEvent(new Event('auth:session-expired'))
}

async function performRefresh(): Promise<string | null> {
  const refreshToken = window.localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
  if (!refreshToken) return null

  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!res.ok) {
    clearStoredTokens()
    return null
  }

  const body = (await res.json().catch(() => null)) as any
  if (!body || typeof body !== 'object' || body.success !== true) {
    clearStoredTokens()
    return null
  }

  const data = body.data as { accessToken: string; refreshToken: string }
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, data.accessToken)
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken)
  return data.accessToken
}

function refreshAccessToken(): Promise<string | null> {
  if (!inFlightRefresh) {
    inFlightRefresh = performRefresh().finally(() => {
      inFlightRefresh = null
    })
  }
  return inFlightRefresh
}

async function handleResponse<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) {
    let body: unknown
    try {
      body = await res.json()
    } catch {
      body = undefined
    }
    throw new ApiError(res.status, `Request to ${path} failed with ${res.status}`, body)
  }

  if (res.status === 204) {
    return undefined as T
  }

  const body = await res.json().catch(() => null)
  if (body && typeof body === 'object' && 'success' in body) {
    if (!body.success) {
      throw new ApiError(res.status, 'API returned an error', body)
    }
    return body.data as T
  }

  return body as T
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })

    if (res.status === 401 && retry) {
      const refreshedToken = await refreshAccessToken()
      if (refreshedToken) {
        return request<T>(path, options, false)
      }
    }

    return await handleResponse<T>(res, path)
  } catch (err) {
    if (!USE_MOCK_API || err instanceof ApiError) throw err

    // Mock responses are opt-in and only apply to unavailable remote endpoints.
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

/**
 * For multipart/form-data uploads (files). Deliberately does NOT set a
 * Content-Type header — the browser must set it itself so it can include
 * the multipart boundary string. Setting 'multipart/form-data' manually
 * here would omit the boundary and the server would fail to parse the body.
 */
async function requestUpload<T>(path: string, formData: FormData, retry = true): Promise<T> {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })

    if (res.status === 401 && retry) {
      const refreshedToken = await refreshAccessToken()
      if (refreshedToken) {
        return requestUpload<T>(path, formData, false)
      }
    }

    return await handleResponse<T>(res, path)
  } catch (err) {
    if (!USE_MOCK_API || err instanceof ApiError) throw err

    const mockRes = await mockApiHandler.handle(path, 'POST', formData)
    if (mockRes) {
      if (!mockRes.success) {
        throw new ApiError(400, mockRes.message || 'Upload failed', mockRes)
      }
      return mockRes.data as T
    }
    throw err
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export const apiUpload = <T>(path: string, formData: FormData) => requestUpload<T>(path, formData)