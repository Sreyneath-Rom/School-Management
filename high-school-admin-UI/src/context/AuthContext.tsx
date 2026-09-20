import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from 'react'
import type { UserRole } from '@/utils/rolePermissions'
import { authService, type AuthResult } from '@/services/authService'
import { ApiError } from '@/lib/apiClient'
import { LOCAL_STORAGE_KEYS } from '@/utils/constants'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  name: string
  permissionKeys: string[]
  avatarUrl?: string | null
}

export interface AuthContextType {
  user: AuthUser | null
  role: UserRole | null
  isAuthenticated: boolean
  login: (result: AuthResult) => void
  logout: () => Promise<void>
}

export interface AuthInitializationContextType {
  isInitialized: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const AuthInitializationContext = createContext<
  AuthInitializationContextType | undefined
>(undefined)

function normalizeUser(raw: {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  permissionKeys?: string[]
  avatarUrl?: string | null
}): AuthUser {
  return {
    id: raw.id,
    email: raw.email,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: raw.role,
    name: `${raw.firstName} ${raw.lastName}`.trim(),
    permissionKeys: raw.permissionKeys ?? [],
    avatarUrl: raw.avatarUrl ?? null,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const restoreStarted = useRef(false)

  const clearSession = useCallback(() => {
    setUser(null)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
  }, [])

  useEffect(() => {
    const handleSessionExpired = () => clearSession()
    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () =>
      window.removeEventListener('auth:session-expired', handleSessionExpired)
  }, [clearSession])

  useEffect(() => {
    if (restoreStarted.current) return
    restoreStarted.current = true

    const restoreSession = async () => {
      try {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER)
        const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
        if (!storedUser || !storedToken) return

        let parsedUser: AuthUser
        try {
          parsedUser = JSON.parse(storedUser) as AuthUser
        } catch {
          clearSession()
          return
        }

        setUser(parsedUser)

        try {
          const fresh = await authService.me()
          const normalized = normalizeUser(fresh)
          setUser(normalized)
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(normalized))
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            clearSession()
          }
          // Any other failure: keep the locally stored user; the next
          // authenticated request will either succeed or fire
          // `auth:session-expired` from apiClient.
        }
      } finally {
        setIsInitialized(true)
      }
    }

    restoreSession()
  }, [clearSession])

  const setSession = useCallback((result: AuthResult) => {
    const normalized = normalizeUser(result.user)
    setUser(normalized)
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(normalized))
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, result.accessToken)
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken)
  }, [])

  const login = useCallback((result: AuthResult) => setSession(result), [setSession])

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
    clearSession()
    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch {
        // Local session already cleared; ignore server-side failure.
      }
    }
  }, [clearSession])

  const authValue = useMemo<AuthContextType>(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, login, logout]
  )

  const initValue = useMemo<AuthInitializationContextType>(
    () => ({ isInitialized }),
    [isInitialized]
  )

  return (
    <AuthInitializationContext.Provider value={initValue}>
      <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    </AuthInitializationContext.Provider>
  )
}

export function useAuthInitialization(): boolean {
  const ctx = useContext(AuthInitializationContext)
  if (!ctx) throw new Error('useAuthInitialization must be used within AuthProvider')
  return ctx.isInitialized
}