import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    title: 'Role-based workspaces',
    text: 'Customers, agents and admins each get a dashboard built around their job — submit, triage, assign and resolve without the noise.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M3 9h18M9 15h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Live status tracking',
    text: 'Follow every ticket from New to Open, In Progress, Resolved and Closed with clear priority levels and full history.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Notifications & audit trail',
    text: 'Stay in the loop with real-time notifications and a tamper-evident audit log of every change along the way.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 21h4" strokeLinecap="round" />
      </svg>
    ),
  },
]

const steps = [
  {
    step: '1',
    title: 'Submit a ticket',
    text: 'Describe what went wrong, pick a category and set a priority. It lands straight in the queue.',
  },
  {
    step: '2',
    title: 'Get assigned & updated',
    text: 'Agents triage your request, and you get notified on every status change.',
  },
  {
    step: '3',
    title: 'Resolve & track',
    text: 'Chat on the ticket, watch it move to Resolved/Closed, and keep the audit trail for reference.',
  },
]

export default function Home() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/tickets'} replace />
  }

  return (
    <div>
      <section className="overflow-hidden rounded-2xl bg-linear-to-br from-brand via-brand to-[#1e3a8a] px-8 py-16 text-white sm:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-block rounded-full bg-white/15 px-4 py-1 text-[13px] font-semibold tracking-wide">
            Internal IT help desk, minus the chaos
          </span>
          <h1 className="mt-0 mb-4 text-4xl font-bold leading-tight sm:text-5xl">
            One place to track every support request
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-[17px] leading-relaxed text-white/85">
            HelpDesk gives customers, agents and admins a clean workflow to report issues, assign
            work and resolve tickets — with notifications and a full audit trail built in.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="btn bg-white px-6 py-3 text-base text-brand hover:bg-[#eff6ff]"
            >
              Get started — it&apos;s free
            </Link>
            <Link
              to="/login"
              className="btn border border-white/40 bg-transparent px-6 py-3 text-base text-white hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="mt-14">
        <h2 className="mt-0 mb-2 text-center text-2xl font-bold">Why teams pick HelpDesk</h2>
        <p className="muted mb-8 text-center">Everything you need to keep support moving.</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="card">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef2ff] text-brand-dark">
                {feature.icon}
              </div>
              <h3 className="mt-0 mb-1.5 text-[17px] font-bold">{feature.title}</h3>
              <p className="mt-0 mb-0 text-sm leading-relaxed text-muted">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mt-14">
        <h2 className="mt-0 mb-8 text-center text-2xl font-bold">How it works</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {steps.map((item) => (
            <div key={item.step} className="card text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {item.step}
              </div>
              <h3 className="mt-0 mb-1.5 text-[16px] font-bold">{item.title}</h3>
              <p className="mt-0 mb-0 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-line bg-surface p-8 text-center shadow-soft">
        <h2 className="mt-0 mb-2 text-2xl font-bold">Ready to resolve faster?</h2>
        <p className="muted mb-6">Create a free customer account or log in to your workspace.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/register" className="btn btn-primary px-6 py-3 text-base">
            Create an account
          </Link>
          <Link to="/login" className="btn btn-outline px-6 py-3 text-base">
            Sign in
          </Link>
        </div>
      </section>

      <footer className="mt-14 border-t border-line py-6 text-center text-[13px] text-muted">
        HelpDesk · Built with .NET 8, React and MySQL
      </footer>
    </div>
  )
}