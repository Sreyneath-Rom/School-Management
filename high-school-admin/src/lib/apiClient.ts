// src/lib/apiClient.ts
//
// Minimal fetch wrapper. If the project already has an API client
// (axios instance, etc.), delete this file and point roleService.ts
// at that instead — this exists only so roleService.ts has something
// concrete to call.

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

function getAuthToken(): string | null {
  // Wire this to wherever the access token actually lives
  // (auth context, cookie, etc.) — localStorage shown only as a placeholder.
  return window.localStorage.getItem('accessToken')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

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

  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}