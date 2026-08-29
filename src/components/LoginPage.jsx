import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Leaf, ArrowLeft, MailCheck } from 'lucide-react'

const inputCls =
  'w-full rounded-pill border border-line bg-paper-inset py-3.5 text-sm text-olive-900 outline-none transition placeholder:text-text-mute/70 focus:border-olive-500 focus:bg-paper focus:ring-4 focus:ring-olive-600/10'

const COPY = {
  login: { title: 'Welcome back', sub: 'Sign in to your Samaha account' },
  register: { title: 'Create account', sub: 'Join Samaha to track orders & checkout faster' },
  forgot: { title: 'Reset password', sub: 'Enter your email and we’ll send you a link to reset it' },
  sent: { title: 'Check your inbox', sub: null },
}

export default function LoginPage() {
  const [mode, setMode] = useState('login') // login | register | forgot | sent
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [email, setEmail] = useState('')

  const isLogin = mode === 'login'
  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'
  const isSent = mode === 'sent'

  const go = (next) => {
    setMode(next)
    setShowPass(false)
    setShowConfirm(false)
  }

  const { title, sub } = COPY[mode]

  return (
    <div
      className="flex min-h-[56vh] items-center justify-center px-[var(--spacing-gutter)] pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(1.75rem,4vw,2.75rem)]"
      style={{
        background:
          'radial-gradient(130% 80% at 50% -10%, var(--color-paper-inset), var(--color-paper) 62%)',
      }}
    >
      <div className="w-full max-w-[420px] rounded-[28px] bg-white p-[clamp(1.75rem,5vw,2.75rem)] shadow-[0_24px_70px_-24px_rgba(37,41,20,0.28)]">

        {/* logo + heading */}
        <div className="flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-olive-300 text-olive-700">
            {isSent ? <MailCheck size={19} strokeWidth={2} /> : <Leaf size={19} strokeWidth={2} />}
          </span>
          <h1
            className="mt-5 font-display font-medium text-olive-900"
            style={{ fontSize: 'clamp(1.55rem, 1.2rem + 1.4vw, 1.95rem)' }}
          >
            {title}
          </h1>
          <p className="mt-1.5 max-w-[34ch] text-sm text-text-soft">
            {isSent ? (
              <>We’ve sent a reset link to <span className="font-medium text-olive-900">{email || 'your email'}</span>.</>
            ) : sub}
          </p>
        </div>

        {/* ---- Sent confirmation ---- */}
        {isSent && (
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => go('login')}
              className="w-full rounded-pill bg-olive-950 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-olive-900 cursor-pointer"
            >
              Back to sign in
            </button>
            <p className="text-center text-sm text-text-soft">
              Didn’t get it?{' '}
              <button type="button" onClick={() => go('forgot')} className="font-semibold text-olive-900 hover:text-olive-950 cursor-pointer">
                Try again
              </button>
            </p>
          </div>
        )}

        {/* ---- Forgot password ---- */}
        {isForgot && (
          <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setMode('sent') }}>
            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-mute" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={`${inputCls} pl-12 pr-5`}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-pill bg-olive-950 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-olive-900 cursor-pointer"
            >
              Send reset link
            </button>
            <button
              type="button"
              onClick={() => go('login')}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-olive-700 transition-colors hover:text-olive-900 cursor-pointer"
            >
              <ArrowLeft size={15} /> Back to sign in
            </button>
          </form>
        )}

        {/* ---- Login / Register ---- */}
        {(isLogin || isRegister) && (
          <>
            <form className="mt-8 space-y-3.5" onSubmit={(e) => e.preventDefault()}>

              {isRegister && (
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="relative">
                    <User size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-mute" />
                    <input type="text" placeholder="First name" autoComplete="given-name" className={`${inputCls} pl-12 pr-5`} />
                  </div>
                  <div className="relative">
                    <User size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-mute" />
                    <input type="text" placeholder="Last name" autoComplete="family-name" className={`${inputCls} pl-12 pr-5`} />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-mute" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`${inputCls} pl-12 pr-5`}
                />
              </div>

              <div className="relative">
                <Lock size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-mute" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className={`${inputCls} pl-12 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-mute transition hover:text-olive-800 cursor-pointer"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {isRegister && (
                <div className="relative">
                  <Lock size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-mute" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    className={`${inputCls} pl-12 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-mute transition hover:text-olive-800 cursor-pointer"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between pt-1 text-sm">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-line accent-olive-800 cursor-pointer" />
                    <span className="text-text-soft">Remember me</span>
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

              <button
                type="submit"
                className="mt-2 w-full rounded-pill bg-olive-950 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-olive-900 cursor-pointer"
              >
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-soft">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => go(isLogin ? 'register' : 'login')}
                className="font-semibold text-olive-900 transition-colors hover:text-olive-950 cursor-pointer"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </>
        )}

        <p className="mt-4 text-center text-xs text-text-mute">
          <Link to="/" className="transition-colors hover:text-olive-800">&larr; Back to store</Link>
        </p>
      </div>
    </div>
  )
}
