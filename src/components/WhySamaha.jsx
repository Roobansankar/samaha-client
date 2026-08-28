import { Clock, MapPin, Sparkles, Package } from 'lucide-react'

const REASONS = [
  {
    Icon: Clock,
    title: 'Pressed within hours',
    text: 'Harvest to cold press on the same day, so nothing turns on the way to the bottle.',
  },
  {
    Icon: MapPin,
    title: 'Single origin, never blended',
    text: 'Every oil traces back to one farm and one crop. Nothing is mixed in to stretch it.',
  },
  {
    Icon: Sparkles,
    title: 'Nothing added or stripped',
    text: 'Unrefined, unfiltered, unbleached. No solvents, no deodorising, no shortcuts.',
  },
  {
    Icon: Package,
    title: 'Small, dated lots',
    text: 'Bottled by hand in short runs and stamped with the pressing date, so you know its age.',
  },
]

export default function WhySamaha() {
  return (
    <section className="bg-paper-inset" id="why" aria-label="Why choose Samaha">
      <div className="py-[clamp(2rem,4vw,3rem)] px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">

        {/* Header */}
        <div className="max-w-[42rem]">
          <p className="eyebrow">Why Samaha</p>
          <h2 className="mt-3 font-display font-medium leading-[1.08] text-olive-900"
              style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.4vw, 3rem)' }}>
            Four things we won&rsquo;t compromise on
          </h2>
        </div>

        {/* Cards - horizontal scroll on mobile, grid on desktop */}
        <div className="mt-12 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="group min-w-[260px] sm:min-w-[280px] md:min-w-0 snap-start p-6 rounded-2xl bg-paper border border-line transition-all duration-300 hover:shadow-md hover:border-olive-300"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-olive-100 text-olive-800 group-hover:bg-olive-900 group-hover:text-paper transition-colors duration-300">
                <r.Icon size={20} strokeWidth={1.8} />
              </span>
              <p className="mt-4 font-display text-xs tracking-[0.25em] text-gold-600">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 font-display font-medium text-olive-900" style={{ fontSize: '1.15rem' }}>
                {r.title}
              </h3>
              <p className="mt-3 leading-relaxed text-text-soft" style={{ fontSize: '0.95rem' }}>
                {r.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
