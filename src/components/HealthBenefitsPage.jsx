import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Flame, Zap, Sparkles, Droplet, Smile } from 'lucide-react'

const SECTION = 'mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)]'
const HEADING = 'font-display font-medium leading-[1.1] text-olive-900'

const BENEFITS = [
  { Icon: Flame, kicker: 'High heat', title: 'Stable in a hot pan', text: 'Smoke points of 210–230°C hold where refined blends start to break down.', span: 'sm:col-span-3', tint: 'bg-gold-200' },
  { Icon: Zap, kicker: 'Energy', title: 'Fast, clean fuel', text: 'Medium-chain fats absorb quickly and burn for energy, not storage.', span: 'sm:col-span-3', tint: 'bg-olive-100' },
  { Icon: Sparkles, kicker: 'Skin', title: 'Sinks in, seals in', text: 'Light enough to absorb, rich enough to lock in moisture.', span: 'sm:col-span-2', tint: 'bg-paper' },
  { Icon: Droplet, kicker: 'Hair', title: 'Less breakage', text: 'A pre-wash oiling coats the strand and cuts protein loss.', span: 'sm:col-span-2', tint: 'bg-paper-2' },
  { Icon: Smile, kicker: 'Mouth', title: 'The oil-pull ritual', text: 'A spoonful swished each morning — an old habit worth keeping.', span: 'sm:col-span-2', tint: 'bg-gold-200' },
]

const OILS = [
  { name: 'Coconut Oil', slug: 'coconut-oil', fat: 'Medium-chain triglycerides', smoke: '~177°C', use: 'Baking, sautéing, skin & hair' },
  { name: 'Groundnut Oil', slug: 'groundnut-oil', fat: 'Monounsaturated fat', smoke: '~230°C', use: 'Deep frying, tempering' },
  { name: 'Sesame Oil', slug: 'sesame-oil', fat: 'Poly & monounsaturated', smoke: '~210°C', use: 'Finishing, marinades, stir-fry' },
]

const ROWS = [
  ['Key fat', 'fat'],
  ['Smoke point', 'smoke'],
  ['Best for', 'use'],
]

export default function HealthBenefitsPage() {
  return (
    <div className="bg-paper">

      {/* ---------- Hero ---------- */}
      <section className="relative flex min-h-[clamp(420px,62vh,660px)] items-center overflow-hidden bg-olive-950 text-on-olive">
        <img
          src="/banner.webp"
          alt="Golden cold-pressed oil poured into a glass bowl"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="img-shimmer absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-olive-950/90 via-olive-950/60 to-olive-950/20"
          aria-hidden="true"
        />
        <div className={`relative w-full ${SECTION} py-[clamp(3rem,8vw,5rem)]`}>
          <p className="eyebrow text-gold-300">Health benefits</p>
          <h1
            className="mt-4 max-w-[16ch] font-display font-medium leading-[1.03] text-on-olive"
            style={{ fontSize: 'clamp(2.3rem, 1.5rem + 4vw, 4.6rem)' }}
          >
            The goodness in every bottle
          </h1>
          <p
            className="mt-6 max-w-[48ch] leading-[1.7] text-on-olive-soft"
            style={{ fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.15rem)' }}
          >
            Nothing here is a cure. But pressed cold and left alone, our oils keep
            far more of what makes them worth eating.
          </p>
          <div className="mt-8">
            <Link to="/shop" className="btn btn-primary">
              Shop the oils <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Benefits — bento ---------- */}
      <section className="bg-paper-inset">
        <div className={`${SECTION} py-[clamp(3rem,7vw,5.5rem)]`}>
          <p className="eyebrow">Why it matters</p>
          <h2 className={`mt-3 ${HEADING}`} style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.5rem)' }}>
            What unrefined oil does for you
          </h2>

          <div className="mt-9 grid gap-4 sm:grid-cols-6">
            {/* feature tile */}
            <article className="about-card flex flex-col justify-between gap-8 rounded-[var(--radius-lg)] bg-olive-900 p-[clamp(1.5rem,3vw,2.25rem)] text-on-olive sm:col-span-3 sm:row-span-2">
              <Heart size={24} strokeWidth={1.8} className="text-gold-300" />
              <div>
                <p className="eyebrow text-gold-300">The whole point</p>
                <h3
                  className="mt-3 font-display font-medium leading-[1.16] text-on-olive"
                  style={{ fontSize: 'clamp(1.4rem, 1.1rem + 1.6vw, 2rem)' }}
                >
                  Unrefined keeps more of the good stuff
                </h3>
                <p className="mt-3 text-sm leading-[1.7] text-on-olive-soft">
                  No bleaching, no deodorising, no scorching heat — so the antioxidants,
                  aromatics and unsaturated fats mostly survive the trip to the bottle.
                </p>
              </div>
            </article>

            {BENEFITS.map((b) => (
              <article
                key={b.title}
                className={`about-card rounded-[var(--radius-lg)] p-[clamp(1.25rem,2.6vw,1.75rem)] ${b.tint} ${b.span}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full text-olive-800"
                    style={{ background: 'rgba(42,49,26,0.08)' }}
                  >
                    <b.Icon size={17} strokeWidth={1.8} />
                  </span>
                  <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-clay-600">
                    {b.kicker}
                  </span>
                </div>
                <h3 className="mt-3.5 font-display text-[1.05rem] font-medium text-olive-950">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-[1.6] text-text-soft">{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Statement ---------- */}
      <section className="bg-olive-900 text-on-olive">
        <div className={`${SECTION} py-[clamp(3.5rem,9vw,6.5rem)]`}>
          <p
            className="mx-auto max-w-[26ch] text-center font-display font-medium leading-[1.2] text-on-olive"
            style={{ fontSize: 'clamp(1.5rem, 1.1rem + 2.4vw, 2.9rem)' }}
          >
            We don&rsquo;t add anything. We just try hard not to take anything away.
          </p>
        </div>
      </section>

      {/* ---------- By the oil — comparison ---------- */}
      <section className="bg-paper">
        <div className={`${SECTION} py-[clamp(3rem,7vw,5.5rem)]`}>
          <p className="eyebrow">By the oil</p>
          <h2 className={`mt-3 ${HEADING}`} style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.5rem)' }}>
            Each oil, and what it&rsquo;s good for
          </h2>

          <div className="mt-9 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-line">
                  <th className="w-[1%] py-4 pr-6" />
                  {OILS.map((o) => (
                    <th key={o.slug} className="px-5 py-4 align-bottom">
                      <Link
                        to={`/shop/${o.slug}`}
                        className="font-display text-lg font-medium text-olive-950 transition-colors hover:text-olive-700"
                      >
                        {o.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ROWS.map(([label, key]) => (
                  <tr key={key}>
                    <th
                      scope="row"
                      className="whitespace-nowrap py-4 pr-6 align-top text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-text-mute"
                    >
                      {label}
                    </th>
                    {OILS.map((o) => (
                      <td key={o.slug} className="px-5 py-4 align-top text-sm font-medium text-olive-900">
                        {o[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {OILS.map((o) => (
              <Link
                key={o.slug}
                to={`/shop/${o.slug}`}
                className="inline-flex items-center gap-1.5 rounded-pill border border-line px-4 py-2 text-sm font-semibold text-olive-800 transition-colors hover:border-olive-400 hover:bg-olive-100"
              >
                {o.name}
                <ArrowRight size={13} strokeWidth={2.4} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-paper-inset">
        <div className={`${SECTION} py-[clamp(3rem,7vw,5rem)]`}>
          <div className="rounded-[var(--radius-lg)] bg-olive-900 px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4rem)] text-center text-on-olive">
            <h2
              className="mx-auto max-w-[20ch] font-display font-medium leading-[1.12] text-on-olive"
              style={{ fontSize: 'clamp(1.6rem, 1.2rem + 2vw, 2.6rem)' }}
            >
              Start with one bottle
            </h2>
            <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-[1.7] text-on-olive-soft">
              These are foods, not medicine — use them as part of a varied diet.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link to="/shop" className="btn btn-primary">
                Shop the oils <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link to="/about" className="text-sm font-semibold text-gold-300 transition-colors hover:text-paper">
                Our story <span aria-hidden="true">›</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
