import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../api/client'

const initialForm = { name: '', email: '', password: '' }

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/tickets')
    } catch (err) {
      setError(apiErrorMessage(err, 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">New accounts are created as Customers.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label className="field-label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="input"
          value={form.name}
          onChange={handleChange}
          minLength={2}
          maxLength={100}
          required
        />

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
          minLength={8}
          required
          autoComplete="new-password"
        />
        <p className="field-hint">At least 8 characters.</p>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}