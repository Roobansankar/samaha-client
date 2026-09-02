import { ArrowUpRight, Clock, MapPin, Leaf, Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'

const FACTS = [
  { Icon: Clock, label: 'Cold-pressed within hours of harvest' },
  { Icon: MapPin, label: 'Single estate — never blended to stretch a crop' },
  { Icon: Leaf, label: 'Unrefined, unfiltered, nothing added' },
]

export default function About() {
  return (
    <section className="bg-paper" id="groves">
      <div className="mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)] pb-[clamp(2.5rem,6vw,4.75rem)] pt-[clamp(0.5rem,1.5vw,1rem)]">
        <div className="grid gap-y-8 lg:grid-cols-[1.05fr_1fr] lg:gap-x-[clamp(2.5rem,6vw,4.5rem)] lg:gap-y-6 lg:items-center">

          {/* Heading — mobile: 1st · desktop: top of right column */}
          <div className="lg:col-start-2 lg:row-start-1">
            <p className="eyebrow">Our story</p>
            <h2
              className="mt-5 font-sans font-bold leading-[1.08] tracking-tight text-olive-900"
              style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.6vw, 3.1rem)' }}
            >
              Grown around the way you{' '}
              <span className="text-clay-500">cook, taste and share</span>
            </h2>
          </div>

          {/* Image + floating stat card — mobile: 2nd · desktop: left column */}
          <div className="relative mb-4 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:mb-0 lg:self-center">
            <div className="relative h-[clamp(340px,42vw,520px)] overflow-hidden rounded-[var(--radius-lg)] bg-paper-3 shadow-md">
              <img
                src="/habout.png"
                alt="Corked bottle of cold-pressed Samaha oil on a wooden board with a bowl of nuts and fresh greenery"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-olive-900/25 to-transparent" />
            </div>

            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-line bg-paper/95 px-4 py-3 shadow-lg backdrop-blur sm:-bottom-8 sm:left-8">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-olive-900 text-paper">
                <Sprout size={18} strokeWidth={1.8} />
              </span>
              <div>
                <p className="font-sans text-lg font-bold leading-none text-olive-900">40+ years</p>
                <p className="mt-1 text-xs text-text-mute">pressing oil the slow way</p>
              </div>
            </div>
          </div>

          {/* Body — mobile: 3rd · desktop: below the heading */}
          <div className="lg:col-start-2 lg:row-start-2">
            <p className="leading-[1.7] text-text-soft"
               style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.08rem)' }}>
              Samaha started with a single family grove, one stone press and a
              simple rule &mdash; bottle the oil exactly as it leaves the press.
              Cold-extracted within hours of picking, unfiltered, and filled by hand.
            </p>
            <p className="mt-4 leading-[1.7] text-text-soft"
               style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.08rem)' }}>
              No refining, no deodorising, no stretching one harvest with another.
              What reaches your kitchen is an honest record of one crop, one season,
              one place.
            </p>

            <ul className="mt-7 flex flex-col gap-3.5 border-t border-line pt-6">
              {FACTS.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-medium text-olive-900">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-olive-100 text-olive-800">
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <Link to="/about" className="btn btn-ghost group mt-8">
              Read our full story
              <ArrowUpRight
                size={15}
                strokeWidth={2}
                className="transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
              />
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
