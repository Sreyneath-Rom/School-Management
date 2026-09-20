// src/hooks/useNotifications.ts
import { useCallback, useEffect, useRef, useState } from 'react'
import { notificationService } from '@/services/notificationService'
import type { Notification } from '@/types/notification'

const POLL_INTERVAL_MS = 60_000

function isUnread(n: Notification): boolean {
  return !n.readAt
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const refetch = useCallback(async () => {
    try {
      const list = await notificationService.list()
      if (isMounted.current) setNotifications(list)
    } catch {
      if (isMounted.current) setNotifications([])
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
    const id = window.setInterval(refetch, POLL_INTERVAL_MS)
    const onFocus = () => refetch()
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [refetch])

  const markRead = useCallback(
    async (id: string) => {
      const now = new Date().toISOString()
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: now } : n))
      )
      try {
        await notificationService.setRead(id, true)
      } catch {
        refetch()
      }
    },
    [refetch]
  )

  const markAllRead = useCallback(async () => {
    const now = new Date().toISOString()
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt ?? now }))
    )
    try {
      await notificationService.markAllRead()
    } catch {
      refetch()
    }
  }, [refetch])

  const unreadCount = notifications.filter(isUnread).length

  return {
    notifications,
    loading,
    unreadCount,
    isUnread,
    markRead,
    markAllRead,
    refetch,
  }
}