import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { schoolService, type SchoolModel } from '@/services/schoolService'

interface SchoolContextValue {
  school: SchoolModel | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<SchoolModel | undefined>
}

const SchoolContext = createContext<SchoolContextValue | null>(null)

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [school, setSchool] = useState<SchoolModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await schoolService.getSchool()
      if (isMountedRef.current) {
        setSchool(result)
        setLoading(false)
      }
      return result
    } catch (err) {
      const normalized = err instanceof Error ? err : new Error(String(err))
      if (isMountedRef.current) {
        setError(normalized)
        setLoading(false)
      }
      return undefined
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <SchoolContext.Provider value={{ school, loading, error, refetch }}>
      {children}
    </SchoolContext.Provider>
  )
}

/** Read the single shared school profile. Must be used within <SchoolProvider>. */
export function useSchool(): SchoolContextValue {
  const ctx = useContext(SchoolContext)
  if (!ctx) {
    throw new Error('useSchool must be used within a <SchoolProvider>')
  }
  return ctx
}