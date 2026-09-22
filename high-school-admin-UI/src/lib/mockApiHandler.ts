// src/lib/mockApiHandler.ts
//
// Placeholder that satisfies the interface apiClient.ts expects but never
// intercepts anything. Replace with real fixtures if/when mock mode is
// actually used.

export interface MockResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
}

export const mockApiHandler = {
  async handle(
    _path: string,
    _method: string,
    _body: unknown
  ): Promise<MockResponse | null> {
    // Returning null tells apiClient.ts "no mock registered for this path —
    // throw the original error." Returning a MockResponse short-circuits
    // the request with the data or error you provide.
    return null
  },
}