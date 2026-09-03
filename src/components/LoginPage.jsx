import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, MailCheck, ArrowRight, Loader2 } from 'lucide-react'
import { login as apiLogin, register as apiRegister } from '../lib/account'

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
  const [mode, setMode] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
          name: `${fd.get('first_name') || ''} ${fd.get('last_name') || ''}`.trim(),
          email: fd.get('email'),
          phone: fd.get('phone') || undefined,
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
            <form className="mt-10 space-y-4" onSubmit={handleAuth}>

              {isRegister && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-olive-700/40" />
                    <input name="first_name" type="text" required placeholder="First name" autoComplete="given-name" className={inputCls} />
                  </div>
                  <div className="relative">
                    <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-olive-700/40" />
                    <input name="last_name" type="text" placeholder="Last name" autoComplete="family-name" className={inputCls} />
                  </div>
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

              {isRegister && (
                <div className="relative">
                  <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-olive-700/40" />
                  <input name="phone" type="tel" placeholder="Phone (optional)" autoComplete="tel" className={inputCls} />
                </div>
              )}

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
                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-olive-700/70">
                    <input type="checkbox" name="remember" className="h-4 w-4 accent-olive-800 cursor-pointer" />
                    Remember me
                  </label>
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
