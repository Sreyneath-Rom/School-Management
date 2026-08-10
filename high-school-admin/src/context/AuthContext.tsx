import React, { createContext, useState, useEffect } from 'react'
import type { UserRole } from '@/utils/rolePermissions'
import { authService, type AuthResult } from '@/services/authService'
import { LOCAL_STORAGE_KEYS } from '@/utils/constants'

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  name: string
}

export interface AuthContextType {
  user: AuthUser | null
  role: UserRole | null
  isAuthenticated: boolean
  login: (result: AuthResult) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER)
      const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)

      if (!storedUser || !storedToken) {
        setIsInitializing(false)
        return
      }

      try {
        const freshUser = await authService.me()
        const normalizedUser = {
          ...freshUser,
          name: `${freshUser.firstName} ${freshUser.lastName}`,
        }
        setUser(normalizedUser)
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(normalizedUser))
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
      } finally {
        setIsInitializing(false)
      }
    }

    restoreSession()
  }, [])

  const setSession = (result: AuthResult) => {
    const normalizedUser = {
      ...result.user,
      name: `${result.user.firstName} ${result.user.lastName}`,
    }

    setUser(normalizedUser)
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(normalizedUser))
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, result.accessToken)
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken)
  }

  const clearSession = () => {
    setUser(null)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
  }

  const login = (result: AuthResult) => {
    setSession(result)
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
    clearSession()

    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch {
        // Ignore logout failures; local session was already cleared.
      }
    }
  }

  const value: AuthContextType = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    login,
    logout,
  }

  if (isInitializing) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
