import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUnreadCount } from '../hooks/useNotifications'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: ['ADMIN'] },
  { to: '/tickets', label: 'Tickets', roles: ['ADMIN', 'AGENT', 'CUSTOMER'] },
  { to: '/users', label: 'Users', roles: ['ADMIN'] },
  { to: '/notifications', label: 'Notifications', roles: ['ADMIN', 'AGENT', 'CUSTOMER'] },
  { to: '/profile', label: 'Profile', roles: ['ADMIN', 'AGENT', 'CUSTOMER'] },
]

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { unreadCount } = useUnreadCount()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <NavLink to="/dashboard" className="navbar-brand">
          HelpDesk
        </NavLink>

        <nav className="navbar-links">
          {navItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) =>
              item.to === '/notifications' ? (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                  {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
                </NavLink>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ),
            )}
        </nav>

        <div className="navbar-user">
          <span className="user-chip">
            {user?.name} <span className="user-role">{user?.role}</span>
          </span>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}