import { Heart, Flame, Zap, Sparkles, Droplet, Smile } from 'lucide-react'

const SECTION =
  'mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)]'

const HEADING =
  'font-display font-medium leading-[1.1] text-olive-900'

const BENEFITS = [
  {
    Icon: Flame,
    kicker: 'High heat',
    title: 'Stable in a hot pan',
    text: 'Smoke points of 210–230°C hold where refined blends start to break down.',
    span: 'sm:col-span-3',
    tint: 'bg-gold-200',
  },
  {
    Icon: Zap,
    kicker: 'Energy',
    title: 'Fast, clean fuel',
    text: 'Medium-chain fats absorb quickly and burn for energy, not storage.',
    span: 'sm:col-span-3',
    tint: 'bg-olive-100',
  },
  {
    Icon: Sparkles,
    kicker: 'Skin',
    title: 'Sinks in, seals in',
    text: 'Light enough to absorb, rich enough to lock in moisture.',
    span: 'sm:col-span-2',
    tint: 'bg-paper',
  },
  {
    Icon: Droplet,
    kicker: 'Hair',
    title: 'Less breakage',
    text: 'A pre-wash oiling coats the strand and cuts protein loss.',
    span: 'sm:col-span-2',
    tint: 'bg-paper-2',
  },
  {
    Icon: Smile,
    kicker: 'Mouth',
    title: 'The oil-pull ritual',
    text: 'A spoonful swished each morning — an old habit worth keeping.',
    span: 'sm:col-span-2',
    tint: 'bg-gold-200',
  },
]

export default function WhyItMatters() {
  return (
    <section className="bg-paper-inset">
      <div className={`${SECTION} py-[clamp(3rem,7vw,5.5rem)]`}>
        <p className="eyebrow">Why it matters</p>

        <h2
          className={`mt-3 ${HEADING}`}
          style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.5rem)' }}
        >
          What unrefined oil does for you
        </h2>

        <div className="mt-9 grid gap-4 sm:grid-cols-6">
          <article className="about-card flex flex-col justify-between gap-8 rounded-[var(--radius-lg)] bg-olive-900 p-[clamp(1.5rem,3vw,2.25rem)] text-on-olive sm:col-span-3 sm:row-span-2">
            <Heart
              size={24}
              strokeWidth={1.8}
              className="text-gold-300"
            />

            <div>
              <p className="eyebrow text-gold-300">
                The whole point
              </p>

              <h3
                className="mt-3 font-display font-medium leading-[1.16] text-on-olive"
                style={{
                  fontSize: 'clamp(1.4rem, 1.1rem + 1.6vw, 2rem)',
                }}
              >
                Unrefined keeps more of the good stuff
              </h3>

              <p className="mt-3 text-sm leading-[1.7] text-on-olive-soft">
                No bleaching, no deodorising, no scorching heat —
                so the antioxidants, aromatics and unsaturated fats
                mostly survive the trip to the bottle.
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
                  style={{
                    background: 'rgba(42,49,26,0.08)',
                  }}
                >
                  <b.Icon size={17} strokeWidth={1.8} />
                </span>

                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-clay-600">
                  {b.kicker}
                </span>
              </div>

              <h3 className="mt-3.5 font-display text-[1.05rem] font-medium text-olive-950">
                {b.title}
              </h3>

              <p className="mt-1.5 text-sm leading-[1.6] text-text-soft">
                {b.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
