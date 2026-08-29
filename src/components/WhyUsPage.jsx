import { Link } from 'react-router-dom'
import { Clock, MapPin, Sparkles, Package, Leaf, Shield, Heart, ArrowRight } from 'lucide-react'

const PAD = 'px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]'

const REASONS = [
  { Icon: Clock, title: 'Pressed within hours', text: 'Harvest to cold press on the same day, so nothing turns on the way to the bottle.', color: 'bg-orange-50 text-orange-600' },
  { Icon: MapPin, title: 'Single origin, never blended', text: 'Every oil traces back to one farm and one crop. Nothing is mixed in to stretch it.', color: 'bg-blue-50 text-blue-600' },
  { Icon: Sparkles, title: 'Nothing added or stripped', text: 'Unrefined, unfiltered, unbleached. No solvents, no deodorising, no shortcuts.', color: 'bg-purple-50 text-purple-600' },
  { Icon: Package, title: 'Small, dated lots', text: 'Bottled by hand in short runs and stamped with the pressing date, so you know its age.', color: 'bg-green-50 text-green-600' },
]

const VALUES = [
  { Icon: Leaf, title: 'Sulphur-Free Copra', text: 'The only producer in Coimbatore making large quantities of sulphur-free copra for oil processing.' },
  { Icon: Shield, title: 'Direct from Farmers', text: 'We buy coconuts directly from farmers in the Velliangiri Hills and process them at our Sulur unit.' },
  { Icon: Heart, title: 'Family Legacy', text: 'Four decades of oil-making expertise passed down through generations.' },
  { Icon: Sparkles, title: 'Two Locations', text: 'Sulur for processing, Madampatti for raw material procurement — both in the heart of coconut country.' },
]

const STATS = [
  { number: '1985', label: 'Year Founded' },
  { number: '40+', label: 'Years of Trust' },
  { number: '3', label: 'Oil Varieties' },
  { number: '100%', label: 'Sulphur-Free' },
]

export default function WhyUsPage() {
  return (
    <div className="bg-paper">

      {/* Hero */}
      <section className={`${PAD} py-[clamp(2rem,4vw,3rem)] relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-olive-100/50 via-paper to-gold-100/30" />
        <div className="relative max-w-[48rem]">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-olive-900 text-paper text-xs font-semibold">
            <Leaf size={12} strokeWidth={2} />
            Since 1985
          </span>
          <h1 className="mt-5 font-display font-medium leading-[1.05] text-olive-900"
              style={{ fontSize: 'clamp(2rem, 1.3rem + 3.5vw, 3.8rem)' }}>
            Why choose{' '}
            <span className="italic text-gold-600">Samaha</span>
          </h1>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-text-soft"
             style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.1rem)' }}>
            Four things we won&rsquo;t compromise on. From the first pick at dawn to the
            last numbered bottle, every step is decided by flavour &mdash; never by margin.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className={`${PAD} py-[clamp(2rem,4vw,3rem)]`}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-paper-inset p-5 text-center">
              <p className="font-display font-medium text-olive-900" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 2rem)' }}>
                {s.number}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-text-mute">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reasons */}
      <section className={`${PAD} py-[clamp(2rem,4vw,3rem)]`}>
        <div className="max-w-[48rem]">
          <p className="eyebrow">Our promise</p>
          <h2 className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
              style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.4rem)' }}>
            Four things we won&rsquo;t compromise on
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2">
          {REASONS.map((r, i) => (
            <div key={r.title} className="flex gap-4 rounded-xl border border-line bg-paper-inset p-5 hover:border-olive-300 transition-colors duration-200">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${r.color}`}>
                <r.Icon size={22} strokeWidth={1.8} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xs text-gold-600">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-sans text-sm font-semibold text-olive-900">{r.title}</h3>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-text-soft">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className={`${PAD} py-[clamp(2rem,4vw,3rem)]`}>
        <div className="max-w-[48rem]">
          <p className="eyebrow">Our Values</p>
          <h2 className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
              style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.4rem)' }}>
            What we stand for
          </h2>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-xl border border-line bg-paper p-6 hover:shadow-sm transition-shadow duration-200">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-olive-100 text-olive-800">
                <v.Icon size={20} strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-sans text-base font-semibold text-olive-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`${PAD} py-[clamp(2rem,4vw,3rem)]`}>
        <div className="rounded-2xl bg-olive-900 p-[clamp(2rem,5vw,4rem)] text-center">
          <h2 className="font-display font-medium text-paper leading-[1.1]"
              style={{ fontSize: 'clamp(1.5rem, 1rem + 2vw, 2.2rem)' }}>
            Taste the difference
          </h2>
          <p className="mx-auto mt-3 max-w-[48ch] text-sm leading-relaxed" style={{ color: 'var(--color-on-olive-soft)' }}>
            Cold-pressed within hours of harvest. Bottled by hand in small, dated lots.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn btn-primary">
              Shop the oils <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link to="/about" className="btn inline-flex items-center justify-center gap-0.55em px-6 py-3 rounded-full border border-on-olive-mute text-on-olive text-sm font-semibold transition-all duration-200 hover:bg-paper hover:text-olive-900 hover:border-paper cursor-pointer">
              Our story
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
