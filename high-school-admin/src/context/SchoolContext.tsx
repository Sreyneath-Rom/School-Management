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
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await schoolService.getSchool()
      if (isMounted.current) {
        setSchool(result)
        setLoading(false)
      }
      return result
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error(String(err)))
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

export function useSchool(): SchoolContextValue {
  const ctx = useContext(SchoolContext)
  if (!ctx) throw new Error('useSchool must be used within <SchoolProvider>')
  return ctx
}