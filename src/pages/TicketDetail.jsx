import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  addComment,
  assignTicket,
  getTicket,
  updateTicketPriority,
  updateTicketStatus,
} from '../api/tickets'

import { getAgents } from '../api/users'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import { apiErrorMessage } from '../api/client'
import { formatDateTime, fromNow } from '../utils/format'
import { useAuth } from '../context/AuthContext'

const STATUSES = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const PRIORITY_ORDER = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 }

const ALLOWED_TRANSITIONS = {
  OPEN: ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
  ASSIGNED: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'CLOSED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
}

export default function TicketDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [agents, setAgents] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState('')

  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getTicket(id)
      setTicket(data)
    } catch (err) {
      setError(apiErrorMessage(err, 'Ticket not found'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      getAgents().then(setAgents).catch(() => setAgents([]))
    }
  }, [user?.role])

  const canSeeAuditLogs = user?.role === 'ADMIN'

  const allowedNextStatuses = () => {
    if (!ticket) return []
    if (user.role === 'CUSTOMER') {
      return ticket.status === 'CLOSED' ? [] : ['CLOSED']
    }
    if (user.role === 'AGENT' && ticket.assignedTo?.id !== user.id) return []
    return ALLOWED_TRANSITIONS[ticket.status] || []
  }

  const canChangePriority = () => {
    if (!ticket) return false
    if (user.role === 'ADMIN') return true
    if (user.role === 'AGENT') return ticket.assignedTo?.id === user.id
    return false
  }

  const canAssign = () => user?.role === 'ADMIN'

  const canComment = () => {
    if (!ticket) return false
    if (user.role === 'ADMIN') return true
    if (user.role === 'AGENT') return ticket.assignedTo?.id === user.id
    return ticket.createdBy?.id === user.id
  }

  const handleStatusChange = async (event) => {
    const status = event.target.value
    if (!status) return
    setBusy(true)
    setActionError('')
    try {
      const updated = await updateTicketStatus(id, status)
      setTicket(updated)
    } catch (err) {
      setActionError(apiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const handlePriorityChange = async (event) => {
    const priority = event.target.value
    if (!priority) return
    setBusy(true)
    setActionError('')
    try {
      const updated = await updateTicketPriority(id, priority)
      setTicket(updated)
    } catch (err) {
      setActionError(apiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const handleAssign = async (event) => {
    const agentId = Number(event.target.value)
    if (!agentId) return
    setBusy(true)
    setActionError('')
    try {
      const updated = await assignTicket(id, agentId)
      setTicket(updated)
    } catch (err) {
      setActionError(apiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    setCommentError('')
    if (!comment.trim()) {
      setCommentError('Comment cannot be empty')
      return
    }
    setBusy(true)
    try {
      const created = await addComment(id, comment.trim())
      setTicket((prev) => ({
        ...prev,
        comments: [...prev.comments, created],
      }))
      setComment('')
    } catch (err) {
      setCommentError(apiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className="muted">Loading ticket…</div>
  if (error) {
    return (
      <div>
        <div className="alert alert-error">{error}</div>
        <Link to="/tickets" className="btn btn-outline">
          Back to tickets
        </Link>
      </div>
    )
  }
  if (!ticket) return null

  const hasOpenActions = canAssign() || allowedNextStatuses().length > 0 || canChangePriority()

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to="/tickets" className="muted back-link">
            ← Back to tickets
          </Link>
          <h1 className="page-title">
            #{ticket.id} · {ticket.title}
          </h1>
        </div>
        <div className="header-badges">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {actionError && <div className="alert alert-error">{actionError}</div>}

      <div className="detail-grid">
        <div>
          <div className="card detail-card">
            <h2 className="card-title">Description</h2>
            <p className="detail-description">{ticket.description}</p>

            <dl className="detail-fields">
              <div>
                <dt>Category</dt>
                <dd>{ticket.category.name}</dd>
              </div>
              <div>
                <dt>Created By</dt>
                <dd>{ticket.createdBy.name}</dd>
              </div>
              <div>
                <dt>Assigned Agent</dt>
                <dd>{ticket.assignedTo?.name || <span className="muted">Unassigned</span>}</dd>
              </div>
              <div>
                <dt>Created At</dt>
                <dd>{formatDateTime(ticket.createdAt)}</dd>
              </div>
              <div>
                <dt>Updated At</dt>
                <dd>{formatDateTime(ticket.updatedAt)}</dd>
              </div>
            </dl>

            {hasOpenActions && ticket.status !== 'CLOSED' && (
              <div className="action-row">
                {canAssign() && (
                  <select className="input action-select" defaultValue="" onChange={handleAssign} disabled={busy}>
                    <option value="" disabled>
                      {ticket.assignedTo ? 'Reassign to…' : 'Assign to agent…'}
                    </option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                )}

                {allowedNextStatuses().length > 0 && (
                  <select className="input action-select" defaultValue="" onChange={handleStatusChange} disabled={busy}>
                    <option value="" disabled>
                      {user.role === 'CUSTOMER' ? 'Close ticket…' : 'Change status…'}
                    </option>
                    {allowedNextStatuses().map((status) => (
                      <option key={status} value={status}>
                        → {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                )}

                {canChangePriority() && ticket.status !== 'CLOSED' && (
                  <select className="input action-select" defaultValue="" onChange={handlePriorityChange} disabled={busy}>
                    <option value="" disabled>
                      Change priority…
                    </option>
                    {PRIORITIES.filter((p) => p !== ticket.priority)
                      .sort((a, b) => PRIORITY_ORDER[a] - PRIORITY_ORDER[b])
                      .map((priority) => (
                        <option key={priority} value={priority}>
                          → {priority}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="card-title">Comments ({ticket.comments.length})</h2>

            {ticket.comments.length === 0 ? (
              <p className="muted">No comments yet.</p>
            ) : (
              <ul className="comment-list">
                {ticket.comments.map((c) => (
                  <li key={c.id} className="comment">
                    <div className="comment-header">
                      <strong>{c.userName}</strong>
                      <span className="muted">{fromNow(c.createdAt)}</span>
                    </div>
                    <p>{c.content}</p>
                  </li>
                ))}
              </ul>
            )}

            {canComment() && ticket.status !== 'CLOSED' ? (
              <form onSubmit={handleAddComment} className="comment-form">
                {commentError && <div className="alert alert-error">{commentError}</div>}
                <textarea
                  className="input"
                  rows="3"
                  placeholder="Write a comment…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={2000}
                />
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  Add comment
                </button>
              </form>
            ) : (
              <p className="muted">Comments are closed for this ticket.</p>
            )}
          </div>
        </div>

        {canSeeAuditLogs && ticket.auditLogs?.length > 0 && (
          <aside className="card">
            <h2 className="card-title">Audit Log</h2>
            <ul className="audit-list">
              {ticket.auditLogs.map((log) => (
                <li key={log.id} className="audit-item">
                  <div className="comment-header">
                    <strong>{log.action}</strong>
                    <span className="muted">{fromNow(log.createdAt)}</span>
                  </div>
                  <p className="muted">
                    {log.user?.name}
                    {log.oldValue && log.newValue && (
                      <span className="audit-values">
                        {' '}
                        · {log.oldValue} → {log.newValue}
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  )
}