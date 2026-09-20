import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { schoolService, type SchoolModel } from '@/services/schoolService'
import { ApiError } from '@/lib/apiClient'

interface SchoolContextValue {
  school: SchoolModel | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<SchoolModel | undefined>
}

export const SchoolContext = createContext<SchoolContextValue | null>(null)

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [school, setSchool] = useState<SchoolModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
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
        if (err instanceof ApiError && err.status === 404) {
          setSchool(null)
          setError(null)
        } else {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
        setLoading(false)
      }
      return undefined
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const value = useMemo(
    () => ({ school, loading, error, refetch }),
    [school, loading, error, refetch]
  )

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>
}