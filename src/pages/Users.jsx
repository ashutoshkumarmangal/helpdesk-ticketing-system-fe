import { useEffect, useState } from 'react'
import { getUsers, updateUserRole, updateUserStatus } from '../api/users'
import { apiErrorMessage } from '../api/client'
import { formatDate } from '../utils/format'
import { useAuth } from '../context/AuthContext'

const ROLES = ['ADMIN', 'AGENT', 'CUSTOMER']

export default function Users() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setUsers(await getUsers())
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleRoleChange = async (id, event) => {
    const role = event.target.value
    try {
      const updated = await updateUserRole(id, role)
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  const toggleStatus = async (user) => {
    try {
      const updated = await updateUserStatus(user.id, !user.isActive)
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)))
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  if (loading) return <div className="muted">Loading users…</div>

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <p className="muted">Manage roles and account status.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.name} {user.id === currentUser.id && <span className="muted">(you)</span>}
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    className="input filter-select"
                    value={user.role}
                    disabled={user.id === currentUser.id}
                    onChange={(e) => handleRoleChange(user.id, e)}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className={`badge ${user.isActive ? 'badge-resolved' : 'badge-closed'}`}>
                    {user.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={user.id === currentUser.id}
                    onClick={() => toggleStatus(user)}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}