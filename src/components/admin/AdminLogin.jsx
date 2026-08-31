import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Sun, Moon, Leaf } from 'lucide-react'
import { isAuthed, signIn, DEMO_CREDENTIALS } from './auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('adminTheme') || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('adminTheme', theme)
    } catch { /* ignore */ }
  }, [theme])

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
    <div
      className={`admin ${theme === 'dark' ? 'theme-dark' : ''} relative flex min-h-screen items-center justify-center px-5`}
      style={{ background: 'var(--a-bg)' }}
    >
      <button
        type="button"
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        className="a-iconbtn a-iconbtn--box border absolute right-4 top-4"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <div className="w-full max-w-[360px]">
        <div className="a-card" style={{ borderRadius: 'var(--a-radius-lg)', padding: '1.5rem' }}>
          <div className="mb-4 flex justify-center">
            <span
              className="grid h-11 w-11 place-items-center rounded-[12px]"
              style={{ background: 'var(--a-accent)', color: 'var(--a-accent-fg)' }}
            >
              <Leaf size={19} />
            </span>
          </div>
          <h1 className="text-center text-[1.15rem] font-semibold tracking-tight">Sign in</h1>
          <p className="a-sub mt-1 text-center">Use your admin account to continue.</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
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
              <label htmlFor="admin-password" className="a-label">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="a-input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="a-iconbtn absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="rounded-[6px] px-3 py-2 text-[0.82rem]"
                style={{ background: 'rgba(214,69,69,0.12)', color: 'var(--a-danger)' }}
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="a-btn a-btn-primary a-btn-block !mt-4"
              style={{ height: '2.5rem' }}
              disabled={loading}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[0.75rem] a-mute">
          Demo · {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
        </p>
      </div>
    </div>
  )
}
