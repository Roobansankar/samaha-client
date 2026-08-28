import { Star } from 'lucide-react'

const REVIEWS = [
  {
    quote:
      'The grassy, peppery finish made me slow down at breakfast. It has quietly ruined every supermarket oil for me.',
    name: 'Aarti M.',
    meta: 'Verified buyer · Coimbatore',
  },
  {
    quote:
      'You can taste that it was pressed days ago, not months. The coconut oil especially — clean, sweet, nothing stale about it.',
    name: 'Karthik R.',
    meta: 'Home cook · Madurai',
  },
  {
    quote:
      'Bought a bottle as a gift and immediately ordered a second for myself. The dated lot number is a lovely touch.',
    name: 'Priya S.',
    meta: 'Verified buyer · Chennai',
  },
]

function Stars({ size = 15 }) {
  return (
    <span className="flex gap-0.5 text-gold-500" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  )
}

export default function Reviews() {
  return (
    <section className="bg-paper" id="reviews" aria-label="Customer reviews">
      <div className="py-[clamp(2rem,4vw,3rem)] px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">

        <div className="mx-auto max-w-[40rem] text-center">
          <p className="eyebrow">Kind words</p>
          <h2 className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
              style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.4vw, 3rem)' }}>
            Loved at kitchen tables
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-text-soft">
            <Stars size={16} />
            <span>4.9 average from 380+ verified buyers</span>
          </div>
        </div>

        <ul className="mt-[clamp(2.5rem,6vw,4rem)] grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.name} className="flex flex-col rounded-2xl border border-line bg-paper-inset p-7">
              <Stars />
              <blockquote className="mt-4 flex-1 font-display text-lg italic leading-relaxed text-olive-900">
                {r.quote}
              </blockquote>
              <div className="mt-6 border-t border-line pt-4">
                <p className="font-sans font-semibold text-olive-900">{r.name}</p>
                <p className="mt-0.5 text-sm text-text-mute">{r.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
