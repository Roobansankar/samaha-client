import { Clock, MapPin, Sparkles, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

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
      <div className="px-[var(--spacing-gutter)] py-[clamp(2.5rem,6vw,5rem)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper lg:grid-cols-[minmax(250px,0.8fr)_minmax(0,1.2fr)]">

          <div className="flex flex-col justify-center bg-olive-900 px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2rem,5vw,4rem)]">
            <p className="eyebrow text-gold-300">Why Samaha?</p>
            <h2 className="mt-4 max-w-[10ch] font-display font-medium leading-[1.02] text-on-olive"
                style={{ fontSize: 'clamp(2.35rem, 1.7rem + 2.4vw, 3.8rem)' }}>
              The Samaha difference
            </h2>
            <p className="mt-5 max-w-[34ch] leading-[1.65] text-on-olive-soft"
               style={{ fontSize: 'clamp(0.88rem, 0.82rem + 0.15vw, 0.98rem)' }}>
              Honest oil starts with how it is made. From the first press to the final bottle,
              we keep the process simple, careful, and traceable.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-gold-300">
              <Link to="/about" className="transition-colors hover:text-paper">Our story <span aria-hidden="true">›</span></Link>
              <Link to="/shop" className="transition-colors hover:text-paper">Shop our oils <span aria-hidden="true">›</span></Link>
            </div>
          </div>

          <div className="grid bg-paper px-[clamp(1.25rem,3vw,2.25rem)] py-2 sm:grid-cols-2">
            {REASONS.map((r, i) => (
              <div
                key={r.title}
                className={`group flex gap-4 border-line py-6 ${i > 0 ? 'border-t' : ''} sm:px-5 ${i === 1 ? 'sm:border-t-0 sm:border-l' : ''} ${i === 3 ? 'sm:border-l' : ''}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-gold-200 text-olive-950 transition-colors duration-300 group-hover:bg-gold-400">
                  <r.Icon size={20} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display font-medium text-olive-950" style={{ fontSize: '1.02rem' }}>
                    {r.title}
                  </h3>
                  <p className="mt-2 max-w-[25ch] leading-[1.55] text-text-soft" style={{ fontSize: '0.82rem' }}>
                    {r.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
