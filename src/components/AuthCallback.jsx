import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { completeOAuth } from '../lib/account'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const token = params.get('token')

    // strip the token from the address bar straight away
    window.history.replaceState(null, '', '/auth/callback')

    if (!token) {
      navigate('/account?error=google', { replace: true })
      return
    }

    completeOAuth(token)
      .then(() => navigate('/profile', { replace: true }))
      .catch(() => setError('Could not finish signing you in. Please try again.'))
  }, [navigate])

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-3 bg-[#f4f1eb] px-6 text-center">
      {error ? (
        <>
          <p className="text-sm text-red-700">{error}</p>
          <Link to="/account" className="text-sm font-semibold text-olive-900 underline underline-offset-2">
            Back to sign in
          </Link>
        </>
      ) : (
        <>
          <Loader2 size={22} className="animate-spin text-olive-700/50" />
          <p className="text-sm text-olive-700/60">Signing you in&hellip;</p>
        </>
      )}
    </div>
  )
}
