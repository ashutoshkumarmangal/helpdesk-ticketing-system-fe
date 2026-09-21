import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../api/categories'
import { createTicket } from '../api/tickets'
import { apiErrorMessage } from '../api/client'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

const initialForm = { title: '', description: '', priority: 'MEDIUM', categoryId: '' }

export default function CreateTicket() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError(apiErrorMessage(undefined, 'Could not load categories')))
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.categoryId) {
      setError('Please choose a category')
      return
    }
    setLoading(true)
    try {
      const ticket = await createTicket({
        ...form,
        categoryId: Number(form.categoryId),
      })
      navigate(`/tickets/${ticket.id}`)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="narrow">
      <h1 className="page-title">New Ticket</h1>
      <p className="muted">Describe the issue and we will get it routed to the right team.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="card form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="input"
          value={form.title}
          onChange={handleChange}
          minLength={5}
          maxLength={200}
          required
          placeholder="Short summary of the issue"
        />

        <label className="field-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="input"
          rows="6"
          value={form.description}
          onChange={handleChange}
          minLength={10}
          maxLength={4000}
          required
          placeholder="Describe the issue in detail"
        />

        <div className="form-row">
          <div>
            <label className="field-label" htmlFor="categoryId">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="input"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select a category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="input"
              value={form.priority}
              onChange={handleChange}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/tickets')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  )
}