import { useCallback, useEffect, useState } from 'react'
import { getUnreadCount } from '../api/notifications'
import { useAuth } from '../context/AuthContext'

/** Polls the unread notification count for the signed-in user. */
export function useUnreadCount(refreshEveryMs = 30000) {
  const { isAuthenticated } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0)
      return
    }
    try {
      const count = await getUnreadCount()
      setUnreadCount(count)
    } catch {
      // Ignore background polling errors.
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
    const timer = setInterval(refresh, refreshEveryMs)
    return () => clearInterval(timer)
  }, [refresh, refreshEveryMs])

  return { unreadCount, refreshUnreadCount: refresh }
}