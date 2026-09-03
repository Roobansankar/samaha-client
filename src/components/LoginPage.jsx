import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, MailCheck, ArrowRight, Loader2 } from 'lucide-react'
import { login as apiLogin, register as apiRegister, GOOGLE_LOGIN_URL } from '../lib/account'

const OAUTH_ERR = {
  google: 'Google sign-in didn’t complete. Please try again.',
  staff: 'That email belongs to a staff account — please use the admin sign-in.',
}

function GoogleG() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.06 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.2a5.3 5.3 0 0 1-2.3 3.48v2.88h3.72c2.18-2 3.44-4.96 3.44-8.37Z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1.03 7.6-2.78l-3.72-2.88c-1.03.7-2.36 1.1-3.88 1.1-2.98 0-5.5-2.01-6.4-4.72H1.76v2.97A11.99 11.99 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.6 14.72a7.2 7.2 0 0 1 0-4.44V7.31H1.76a12 12 0 0 0 0 10.38l3.84-2.97Z" />
      <path fill="#EA4335" d="M12 4.75c1.68 0 3.2.58 4.39 1.72l3.29-3.29C17.7 1.24 15.1 0 12 0 7.32 0 3.28 2.7 1.76 6.62L5.6 9.6C6.5 6.89 9.02 4.75 12 4.75Z" />
    </svg>
  )
}

const inputCls =
  'w-full rounded-xl border border-olive-900/10 bg-white py-4 pl-12 pr-4 text-[0.92rem] text-olive-900 outline-none transition placeholder:text-olive-700/40 focus:border-olive-700 focus:ring-4 focus:ring-olive-800/5'

const btnPrimary =
  'w-full rounded-xl bg-olive-900 py-4 text-[0.92rem] font-medium text-paper transition-all duration-300 hover:bg-olive-800 hover:shadow-lg hover:shadow-olive-900/20 disabled:opacity-60 disabled:hover:bg-olive-900 disabled:hover:shadow-none cursor-pointer'

const COPY = {
  login: { title: 'Welcome back', sub: 'Sign in to your Samaha account' },
  register: { title: 'Create account', sub: 'Join Samaha to track orders & check out faster' },
  forgot: { title: 'Reset password', sub: "Enter your email and we'll send a link to reset it" },
  sent: { title: 'Check your inbox', sub: null },
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(() => OAUTH_ERR[params.get('error')] || '')

  const isLogin = mode === 'login'
  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'
  const isSent = mode === 'sent'

  const go = (next) => {
    setMode(next)
    setShowPass(false)
    setShowConfirm(false)
    setError('')
  }

  const { title, sub } = COPY[mode]

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    setLoading(true)
    try {
      if (isLogin) {
        await apiLogin(fd.get('email'), fd.get('password'))
      } else {
        if (fd.get('password') !== fd.get('password_confirmation')) {
          throw new Error('The two passwords do not match.')
        }
        await apiRegister({
          name: fd.get('name'),
          email: fd.get('email'),
          password: fd.get('password'),
          password_confirmation: fd.get('password_confirmation'),
        })
      }
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80svh] items-center justify-center bg-[#f4f1eb] px-6 py-12">
      <div className="w-full max-w-[400px]">

        <div className="flex flex-col items-center text-center">
          <h1
            className="font-display font-medium text-olive-900"
            style={{ fontSize: 'clamp(1.6rem, 1.2rem + 1.4vw, 2rem)' }}
          >
            {title}
          </h1>
          <p className="mt-2 text-[0.9rem] text-olive-700/60">
            {isSent ? (
              <>We've sent a reset link to <span className="font-medium text-olive-900">{email || 'your email'}</span>.</>
            ) : sub}
          </p>
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </p>
        )}

        {/* ---- Sent ---- */}
        {isSent && (
          <div className="mt-10 space-y-4">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-olive-100 text-olive-800">
              <MailCheck size={24} strokeWidth={1.8} />
            </div>
            <button type="button" onClick={() => go('login')} className={btnPrimary}>
              Back to sign in
            </button>
            <p className="text-center text-sm text-olive-700/60">
              Didn't get it?{' '}
              <button type="button" onClick={() => go('forgot')} className="font-medium text-olive-900 hover:text-olive-800 cursor-pointer">
                Try again
              </button>
            </p>
          </div>
        )}

        {/* ---- Forgot ---- */}
        {isForgot && (
          <form className="mt-10 space-y-4" onSubmit={(e) => { e.preventDefault(); setMode('sent') }}>
            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-olive-700/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputCls}
              />
            </div>
            <button type="submit" className={btnPrimary}>Send reset link</button>
            <button
              type="button"
              onClick={() => go('login')}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-olive-700/60 transition-colors hover:text-olive-900 cursor-pointer"
            >
              <ArrowLeft size={15} /> Back to sign in
            </button>
          </form>
        )}

        {/* ---- Login / Register ---- */}
        {(isLogin || isRegister) && (
          <>
            <a
              href={GOOGLE_LOGIN_URL}
              className="mt-9 flex w-full items-center justify-center gap-3 rounded-xl border border-olive-900/15 bg-white py-4 text-[0.92rem] font-medium text-olive-900 transition-colors hover:border-olive-900/30 hover:bg-olive-100/50"
            >
              <GoogleG />
              Continue with Google
            </a>

            <div className="my-6 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-olive-700/40">
              <span className="h-px flex-1 bg-olive-900/10" />
              or
              <span className="h-px flex-1 bg-olive-900/10" />
            </div>

            <form className="space-y-4" onSubmit={handleAuth}>

              {isRegister && (
                <div className="relative">
                  <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-olive-700/40" />
                  <input name="name" type="text" required placeholder="Full name" autoComplete="name" className={inputCls} />
                </div>
              )}

              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-olive-700/40" />
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputCls}
                />
              </div>

              <div className="relative">
                <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-olive-700/40" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={isRegister ? 8 : undefined}
                  placeholder="Password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-olive-700/40 transition hover:text-olive-800 cursor-pointer"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {isRegister && (
                <div className="relative">
                  <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-olive-700/40" />
                  <input
                    name="password_confirmation"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    className={`${inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-olive-700/40 transition hover:text-olive-800 cursor-pointer"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end text-sm">
                  <button
                    type="button"
                    onClick={() => go('forgot')}
                    className="font-medium text-olive-700 transition-colors hover:text-olive-900 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" disabled={loading} className={`${btnPrimary} mt-3`}>
                <span className="flex items-center justify-center gap-2">
                  {loading
                    ? <Loader2 size={16} className="animate-spin" />
                    : <>{isLogin ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></>}
                </span>
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-olive-700/60">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => go(isLogin ? 'register' : 'login')}
                className="font-medium text-olive-900 transition-colors hover:text-olive-800 cursor-pointer"
              >
                {isLogin ? 'Create account' : 'Sign in'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
