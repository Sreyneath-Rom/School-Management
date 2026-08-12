// src/lib/apiClient.ts
//
// Minimal fetch wrapper for the API. It attaches the access token from
// localStorage, unwraps backend response envelopes, and refreshes the token
// automatically when the access token expires.

import { LOCAL_STORAGE_KEYS } from '@/utils/constants'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = window.localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
  if (!refreshToken) return null

  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!res.ok) return null

  const body = (await res.json().catch(() => null)) as any
  if (!body || typeof body !== 'object' || body.success !== true) return null

  const data = body.data as { accessToken: string; refreshToken: string }
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, data.accessToken)
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken)
  return data.accessToken
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

  return handleResponse<T>(res, path)
}

/**
 * For multipart/form-data uploads (files). Deliberately does NOT set a
 * Content-Type header — the browser must set it itself so it can include
 * the multipart boundary string. Setting 'multipart/form-data' manually
 * here would omit the boundary and the server would fail to parse the body.
 */
async function requestUpload<T>(path: string, formData: FormData, retry = true): Promise<T> {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)

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

  return handleResponse<T>(res, path)
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