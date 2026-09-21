import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCategories } from '../api/categories'
import { getTickets } from '../api/tickets'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import Pagination from '../components/Pagination'
import { apiErrorMessage } from '../api/client'
import { formatDate } from '../utils/format'
import { useAuth } from '../context/AuthContext'

const STATUSES = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export default function TicketList() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const page = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize')) || 10
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const priority = searchParams.get('priority') || ''
  const categoryId = searchParams.get('categoryId') || ''

  const [searchDraft, setSearchDraft] = useState(search)

  useEffect(() => {
    if (searchDraft === search) return

    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      const value = searchDraft.trim()
      if (value) next.set('search', value)
      else next.delete('search')
      next.set('page', '1')
      setSearchParams(next)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchDraft, search, searchParams, setSearchParams])

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, pageSize }
      if (search) params.search = search
      if (status) params.status = status
      if (priority) params.priority = priority
      if (categoryId) params.categoryId = Number(categoryId)

      const result = await getTickets(params)
      setData(result)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search, status, priority, categoryId])

  useEffect(() => {
    load()
  }, [load])

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    // Changing filters should reset pagination, but changing the page itself shouldn't.
    if (key !== 'page') next.set('page', '1')
    setSearchParams(next)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tickets</h1>
          <p className="muted">
            {user.role === 'CUSTOMER'
              ? 'Your tickets'
              : user.role === 'AGENT'
                ? 'Tickets assigned to you'
                : 'All tickets'}
          </p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary">
          New Ticket
        </Link>
      </div>

      <div className="card filters">
        <input
          className="input filter-search"
          placeholder="Search title, description, ID, or name…"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
        />

        <select
          className="input filter-select"
          value={status}
          onChange={(e) => setFilter('status', e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>

        <select
          className="input filter-select"
          value={priority}
          onChange={(e) => setFilter('priority', e.target.value)}
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          className="input filter-select"
          value={categoryId}
          onChange={(e) => setFilter('categoryId', e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="input filter-select"
          value={pageSize}
          onChange={(e) => setFilter('pageSize', e.target.value)}
          aria-label="Rows per page"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="muted">Loading tickets…</div>
      ) : (
        <div className="card table-card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Assigned Agent</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                data.items.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <Link to={`/tickets/${ticket.id}`} className="ticket-link">
                        #{ticket.id}
                      </Link>
                    </td>
                    <td className="table-title">
                      <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                    </td>
                    <td>
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td>
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td>{ticket.categoryName}</td>
                    <td>{ticket.assignedToName || <span className="muted">—</span>}</td>
                    <td>{formatDate(ticket.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            totalItems={data.totalItems}
            totalPages={data.totalPages}
            onPageChange={(next) => setFilter('page', String(next))}
          />
        </div>
      )}
    </div>
  )
}