import { Clock, MapPin, Sparkles, Package, ArrowRight } from 'lucide-react'

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
    <section className="bg-paper" id="why" aria-label="Why choose Samaha">
      <div className="container-site py-[clamp(3.5rem,9vw,7rem)]">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[0.82fr_1.18fr]">

          {/* Left — sticky statement */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Why Samaha</p>
            <h2 className="mt-3 font-display font-medium leading-[1.08] text-olive-900"
                style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.4vw, 3rem)' }}>
              Four things we won&rsquo;t compromise on
            </h2>
            <p className="mt-5 max-w-[38ch] leading-relaxed text-text-soft"
               style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.05rem)' }}>
              From the first pick at dawn to the last numbered bottle, every step is
              decided by flavour &mdash; never by margin.
            </p>
            <a href="#shop" className="btn btn-primary mt-8">
              Shop the harvest <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>

          {/* Right — connected rail */}
          <ol>
            {REASONS.map((r, i) => (
              <li key={r.title} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-6">
                <div className="flex flex-col items-center">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-olive-900 text-paper">
                    <r.Icon size={19} strokeWidth={1.8} />
                  </span>
                  {i < REASONS.length - 1 && (
                    <span className="mt-2 w-px flex-1 bg-line-2" aria-hidden="true" />
                  )}
                </div>

                <div className="pt-1">
                  <p className="font-display text-xs tracking-[0.25em] text-gold-600">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1 font-display font-medium text-olive-900" style={{ fontSize: '1.3rem' }}>
                    {r.title}
                  </h3>
                  <p className="mt-2 max-w-[52ch] leading-relaxed text-text-soft">
                    {r.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
