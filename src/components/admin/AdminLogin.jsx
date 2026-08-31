import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf, Loader2, ArrowRight } from 'lucide-react'
import { isAuthed, signIn, DEMO_CREDENTIALS } from './auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthed()) return <Navigate to={redirectTo} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 650))

    if (signIn(email, password)) {
      navigate(redirectTo, { replace: true })
    } else {
      setError('Those credentials don’t match an admin account.')
      setLoading(false)
    }
  }

  return (
    <div className="admin grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{
          background:
            'radial-gradient(120% 120% at 0% 0%, #3a6332 0%, #2f5028 45%, #1f3a1c 100%)',
          color: '#eef3ea',
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/25">
            <Leaf size={17} />
          </span>
          <span className="text-[1.15rem] font-semibold tracking-tight">Samaha</span>
        </div>

        <div className="max-w-sm">
          <p className="text-[1.7rem] font-semibold leading-snug tracking-tight">
            The console behind every bottle.
          </p>
          <p className="mt-3 text-sm text-white/70">
            Orders, inventory, customers and store settings — all in one place.
          </p>
        </div>

        <p className="text-xs text-white/45">
          © {new Date().getFullYear()} Samaha. Internal use only.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-[var(--a-accent)]"
              style={{ background: 'var(--a-accent-soft)' }}
            >
              <Leaf size={17} />
            </span>
            <span className="text-[1.1rem] font-semibold tracking-tight">Samaha</span>
          </div>

          <h1 className="a-h1">Sign in</h1>
          <p className="a-sub mt-1">Enter your admin credentials to continue.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            <div className="a-field">
              <label htmlFor="admin-email" className="a-label">Email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@samaha.com"
                className="a-input"
                required
              />
            </div>

            <div className="a-field">
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="admin-password" className="a-label mb-0">Password</label>
                <button type="button" className="text-xs font-medium text-[var(--a-accent)] hover:underline">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="a-input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="a-iconbtn absolute right-1 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="rounded-[7px] px-3 py-2 text-sm"
                style={{ background: 'rgba(214,69,69,0.1)', color: 'var(--a-danger)' }}
                role="alert"
              >
                {error}
              </p>
            )}

            <label className="flex items-center gap-2 text-sm a-dim">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded accent-[var(--a-accent)]"
              />
              Keep me signed in
            </label>

            <button type="submit" className="a-btn a-btn-primary a-btn-block h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div
            className="mt-6 rounded-[8px] border border-dashed px-3.5 py-3 text-xs a-dim"
            style={{ borderColor: 'var(--a-border-strong)' }}
          >
            <span className="font-semibold text-[var(--a-text)]">Demo access</span>
            <br />
            {DEMO_CREDENTIALS.email} &nbsp;·&nbsp; {DEMO_CREDENTIALS.password}
          </div>
        </div>
      </div>
    </div>
  )
}
