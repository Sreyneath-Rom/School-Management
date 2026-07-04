import React, { createContext, useContext, useState } from 'react'

type AuthContextType = { user: any; setUser: React.Dispatch<React.SetStateAction<any>> } | null

const AuthContext = createContext<AuthContextType>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
