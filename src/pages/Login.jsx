import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../api/client'

const initialForm = { email: '', password: '' }

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const profile = await login(form)
      navigate(location.state?.from || (profile.role === 'ADMIN' ? '/dashboard' : '/tickets'))
    } catch (err) {
      setError(apiErrorMessage(err, 'Invalid email or password'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Sign in to HelpDesk</h1>
        <p className="auth-subtitle">Access your tickets and stay on top of things.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label className="field-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="auth-switch">
          No account yet? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}