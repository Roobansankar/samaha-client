import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAccount } from '../lib/account'
import { submitReview } from '../lib/reviews'

function Stars({ value = 0, size = 15 }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          fill={i < Math.round(value) ? 'var(--color-gold-500)' : 'var(--color-olive-200)'}
        />
      ))}
    </span>
  )
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <span className="inline-flex" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="cursor-pointer p-0.5"
        >
          <Star
            size={24}
            strokeWidth={0}
            fill={(hover || value) >= n ? 'var(--color-gold-500)' : 'var(--color-olive-200)'}
          />
        </button>
      ))}
    </span>
  )
}

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

export default function ProductReviews({ slug, data, onChange }) {
  const user = useAccount()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const headingSize = 'clamp(1.35rem, 1.1rem + 1vw, 1.7rem)'

  if (!data) {
    return (
      <section className="mt-[clamp(2rem,5vw,3.5rem)] border-t border-line pt-[clamp(2rem,5vw,3.5rem)]">
        <Loader2 size={18} className="animate-spin text-olive-700/40" />
      </section>
    )
  }

  const { average, count, distribution = {}, reviews = [] } = data
  const mine = reviews.find((r) => r.mine)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!rating) return setError('Please pick a star rating.')
    if (body.trim().length < 4) return setError('Please write a little more.')
    setBusy(true)
    try {
      await submitReview(slug, { rating, title: title.trim() || null, body: body.trim() })
      toast.success('Thanks for your review!')
      setOpen(false)
      setRating(0); setTitle(''); setBody('')
      onChange?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="reviews" className="mt-[clamp(2rem,5vw,3.5rem)] border-t border-line pt-[clamp(2rem,5vw,3.5rem)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display font-medium text-olive-900" style={{ fontSize: headingSize }}>
          Customer reviews
        </h2>
        {user ? (
          !mine && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-pill border border-olive-800 px-5 py-2.5 text-sm font-semibold text-olive-900 transition-colors hover:bg-olive-900 hover:text-paper"
            >
              {open ? 'Cancel' : 'Write a review'}
            </button>
          )
        ) : (
          <Link to="/account" className="text-sm font-semibold text-olive-800 hover:underline">
            Sign in to write a review
          </Link>
        )}
      </div>

      {/* summary */}
      <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="text-center sm:text-left">
          <p className="font-display text-[2.6rem] font-medium leading-none text-olive-900">
            {count ? average.toFixed(1) : '—'}
          </p>
          <div className="mt-2 flex justify-center sm:justify-start">
            <Stars value={average} size={16} />
          </div>
          <p className="mt-1 text-xs text-text-mute">{count} {count === 1 ? 'review' : 'reviews'}</p>
        </div>

        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((s) => {
            const n = distribution[s] || 0
            const pct = count ? (n / count) * 100 : 0
            return (
              <div key={s} className="flex items-center gap-3 text-xs text-text-mute">
                <span className="w-3 text-right">{s}</span>
                <Star size={12} strokeWidth={0} fill="var(--color-gold-500)" />
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2">
                  <span className="block h-full rounded-full bg-gold-500" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-6">{n}</span>
              </div>
            )
          })}
        </div>
      </div>

      {mine && (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-olive-100 px-3 py-1.5 text-xs font-medium text-olive-800">
          <Check size={13} strokeWidth={3} /> You reviewed this — thank you.
        </p>
      )}

      {/* form */}
      {open && user && (
        <form onSubmit={submit} className="mt-6 rounded-xl border border-line bg-paper-inset p-5">
          <p className="text-sm font-semibold text-olive-900">Your rating</p>
          <div className="mt-1.5">
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            maxLength={120}
            className="mt-4 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-olive-900 outline-none focus:border-olive-500"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What did you think of this oil?"
            rows={4}
            maxLength={2000}
            className="mt-3 w-full resize-none rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-olive-900 outline-none focus:border-olive-500"
          />
          {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className="btn btn-primary mt-4">
            {busy ? <Loader2 size={15} className="animate-spin" /> : 'Submit review'}
          </button>
        </form>
      )}

      {/* list */}
      <div className="mt-8 space-y-6">
        {reviews.length === 0 && (
          <p className="text-sm text-text-mute">No reviews yet — be the first to review this oil.</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-line pb-6 last:border-0 last:pb-0">
            <div className="flex items-center gap-2">
              <Stars value={r.rating} size={13} />
              <span className="text-sm font-semibold text-olive-900">{r.name}</span>
              {r.mine && (
                <span className="rounded bg-olive-100 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-olive-800">
                  You
                </span>
              )}
            </div>
            {r.title && <p className="mt-1.5 text-sm font-semibold text-olive-900">{r.title}</p>}
            <p className="mt-1 text-sm leading-relaxed text-text-soft">{r.body}</p>
            <p className="mt-1.5 text-xs text-text-mute">{fmtDate(r.date)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
