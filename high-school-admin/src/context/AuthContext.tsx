import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import type { UserRole } from "@/utils/rolePermissions";
import { authService, type AuthResult } from "@/services/authService";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  name: string;
  permissions?: string[];
}

export interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (result: AuthResult) => void;
  logout: () => Promise<void>;
}

export interface AuthInitializationContextType {
  isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
export const AuthInitializationContext = createContext<
  AuthInitializationContextType | undefined
>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper to ensure setUser completes before other state updates
  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
  };

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  }, []);

  // AuthContext.tsx
  useEffect(() => {
    const handleSessionExpired = () => clearSession();
    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [clearSession]);
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

        if (!storedUser || !storedToken) {
          setIsInitialized(true);
          return;
        }

        try {
          const parsedUser = JSON.parse(storedUser) as AuthUser;
          // Restore user immediately from localStorage
          setUser(parsedUser);

          // Validate token in background (don't block UI, don't log out if it fails)
          try {
            const freshUser = await authService.me();
            console.log("Session validation successful:", freshUser);
            setUser({
              ...freshUser,
              name: `${freshUser.firstName} ${freshUser.lastName}`,
            });
          } catch (error) {
            // Keep the user logged in even if validation fails
            console.log(
              "Session validation request failed, but keeping user session:",
              error,
            );
          }
        } catch (error) {
          // Only clear if we can't even parse the stored user
          console.log("Failed to parse stored user:", error);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
        }
      } finally {
        // Mark initialization complete AFTER user restoration attempt
        setIsInitialized(true);
      }
    };

    restoreSession();
  }, []);

  const setSession = (result: AuthResult) => {
    const normalizedUser = {
      ...result.user,
      name: `${result.user.firstName} ${result.user.lastName}`,
    };

    setUser(normalizedUser);
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.USER,
      JSON.stringify(normalizedUser),
    );
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, result.accessToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
  };

  const login = (result: AuthResult) => {
    setSession(result);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    clearSession();

    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // Ignore logout failures; local session was already cleared.
      }
    }
  };

  const authValue: AuthContextType = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    login,
    logout,
  };

  const initValue: AuthInitializationContextType = {
    isInitialized,
  };

  return (
    <AuthInitializationContext.Provider value={initValue}>
      <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    </AuthInitializationContext.Provider>
  );
}

export function useAuthInitialization(): boolean {
  const context = useContext(AuthInitializationContext);
  if (!context) {
    throw new Error("useAuthInitialization must be used within AuthProvider");
  }
  return context.isInitialized;
}
