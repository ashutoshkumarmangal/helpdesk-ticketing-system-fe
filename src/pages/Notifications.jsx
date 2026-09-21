import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNotifications, markNotificationRead } from '../api/notifications'
import { apiErrorMessage } from '../api/client'
import { fromNow } from '../utils/format'

export default function Notifications() {
  const [items, setItems] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getNotifications()
      setItems(data.items)
      setUnreadCount(data.unreadCount)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleRead = async (notification) => {
    if (notification.isRead) return
    try {
      await markNotificationRead(notification.id)
      setItems((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  if (loading) return <div className="muted">Loading notifications…</div>

  return (
    <div className="narrow">
      <h1 className="page-title">Notifications</h1>
      <p className="muted">
        {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      {items.length === 0 ? (
        <div className="card">
          <p className="muted">No notifications yet.</p>
        </div>
      ) : (
        <ul className="card notification-list">
          {items.map((notification) => (
            <li key={notification.id} className="notification-item">
              {notification.ticketId ? (
                <Link
                  to={`/tickets/${notification.ticketId}`}
                  className={`notification-body ${notification.isRead ? 'is-read' : ''}`}
                  onClick={() => handleRead(notification)}
                >
                  <p>{notification.message}</p>
                  <span className="muted">
                    {fromNow(notification.createdAt)} · ticket #{notification.ticketId}
                  </span>
                </Link>
              ) : (
                <div className="notification-body">
                  <p>{notification.message}</p>
                  <span className="muted">{fromNow(notification.createdAt)}</span>
                </div>
              )}
              {!notification.isRead && <span className="badge-count notification-dot" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}