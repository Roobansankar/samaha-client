import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Cta() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.email.value.trim()
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSent(true)
        toast.success("Thanks — you're on the list!")
      } else {
        const data = await res.json()
        toast.error(data.message || 'Something went wrong')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-paper" id="join" aria-label="Join the list">
      <div className="pt-[clamp(1rem,2vw,1.5rem)] pb-[clamp(2rem,4vw,3rem)] px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="rounded-[clamp(1.25rem,3vw,2rem)] border border-line bg-paper-2 px-[clamp(1.5rem,5vw,5rem)] py-[clamp(2.5rem,6vw,4.5rem)] text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
            Harvest notes
          </p>
          <h2 className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
              style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.4vw, 3rem)' }}>
            Be first to the next pressing
          </h2>
          <p className="mx-auto mt-4 max-w-[42ch] text-text-soft"
             style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.1rem)' }}>
            A short note when a new lot is bottled, plus the occasional recipe.
            No more than once a month.
          </p>

          {sent ? (
            <p className="mt-8 font-display text-lg italic text-olive-700">
              Thanks — you&rsquo;re on the list.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-[26rem] flex-col gap-3 sm:flex-row"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-pill border border-line bg-paper px-5 py-3 text-sm text-olive-900 placeholder:text-text-mute focus:border-gold-500"
              />
              <button type="submit" disabled={loading} className="btn btn-primary shrink-0">
                {loading ? 'Joining...' : <>Join <ArrowRight size={16} strokeWidth={2} /></>}
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-text-mute">
            Unsubscribe any time. We never share your address.
          </p>
        </div>
      </div>
    </section>
  )
}
