import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/format'

export default function Profile() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="narrow">
      <h1 className="page-title">Profile</h1>

      <div className="card profile-card">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <h2>{user.name}</h2>
        <p className="muted">{user.email}</p>

        <dl className="detail-fields">
          <div>
            <dt>Role</dt>
            <dd>
              <span className="badge badge-primary">{user.role}</span>
            </dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>{formatDate(user.createdAt)}</dd>
          </div>
          <div>
            <dt>Account status</dt>
            <dd>
              <span className={`badge ${user.isActive ? 'badge-resolved' : 'badge-closed'}`}>
                {user.isActive ? 'Active' : 'Deactivated'}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}