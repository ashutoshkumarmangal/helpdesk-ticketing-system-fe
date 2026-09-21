import { useEffect, useState } from 'react'
import { getDashboardSummary } from '../api/dashboard'
import StatCard from '../components/StatCard'
import ChartBar from '../components/ChartBar'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../api/client'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await getDashboardSummary()
        if (!cancelled) {
          setSummary(data)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(apiErrorMessage(err))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <div className="muted">Loading dashboard…</div>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!summary) return null

  const toChartItems = (list) => list.map((item) => ({ label: item.status || item.priority || item.category, count: item.count }))

  return (
    <div>
      <div className="dashboard-hero">
        <div>
          <h1 className="page-title">Welcome back, {user?.name}</h1>
          <p className="muted">An overview of your helpdesk activity and current workload.</p>
        </div>
        <span className="dashboard-date">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Tickets" value={summary.totalTickets} />
        <StatCard label="Open" value={summary.openTickets} tone="open" />
        <StatCard label="Assigned" value={summary.assignedTickets} tone="assigned" />
        <StatCard label="In Progress" value={summary.inProgressTickets} tone="progress" />
        <StatCard label="Resolved" value={summary.resolvedTickets} tone="resolved" />
        <StatCard label="Closed" value={summary.closedTickets} tone="closed" />
        <StatCard label="High Priority" value={summary.highPriorityTickets} tone="high" />
      </div>

      <div className="chart-grid">
        <div className="card">
          <h2 className="card-title">Tickets by Status</h2>
          <ChartBar items={toChartItems(summary.ticketsByStatus)} />
        </div>
        <div className="card">
          <h2 className="card-title">Tickets by Priority</h2>
          <ChartBar items={toChartItems(summary.ticketsByPriority)} />
        </div>
        <div className="card">
          <h2 className="card-title">Tickets by Category</h2>
          <ChartBar items={toChartItems(summary.ticketsByCategory)} />
        </div>
      </div>
    </div>
  )
}