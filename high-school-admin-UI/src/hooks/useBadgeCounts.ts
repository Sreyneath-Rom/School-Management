// src/hooks/useBadgeCounts.ts
import { useEffect, useRef, useState } from 'react'
import { badgeService, type BadgeCounts } from '@/services/badgeService'

const EMPTY: BadgeCounts = { 'leave-requests': 0, messages: 0 }
const POLL_INTERVAL_MS = 120_000

export function useBadgeCounts(): BadgeCounts {
  const [counts, setCounts] = useState<BadgeCounts>(EMPTY)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const [leaveRequests, messages] = await Promise.all([
        badgeService.leaveRequestsPending(),
        badgeService.messagesUnread(),
      ])
      if (!cancelled && isMounted.current) {
        setCounts({ 'leave-requests': leaveRequests, messages })
      }
    }

    load()
    const id = window.setInterval(load, POLL_INTERVAL_MS)
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => {
      cancelled = true
      window.clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  return counts
}