import { Star } from 'lucide-react'

const TINTS = ['var(--color-olive-200)', 'var(--color-gold-200)', 'var(--color-olive-300)']

const REVIEWS = [
  {
    quote:
      'The grassy, peppery finish made me slow down at breakfast. It has quietly ruined every supermarket oil for me.',
    name: 'Aarti Menon',
    meta: 'Verified buyer · Coimbatore',
  },
  {
    quote:
      'You can taste it was pressed days ago, not months. The coconut oil especially — clean, sweet, nothing stale.',
    name: 'Karthik Rao',
    meta: 'Home cook · Madurai',
  },
  {
    quote:
      'Bought a bottle as a gift and immediately ordered a second for myself. The dated lot number is a lovely touch.',
    name: 'Priya Shah',
    meta: 'Verified buyer · Chennai',
  },
  {
    quote:
      'Switched the whole kitchen over. The groundnut oil for frying is a completely different world.',
    name: 'Ravi Kapoor',
    meta: 'Verified buyer · Bengaluru',
  },
  {
    quote:
      'My grandmother said it smells like the mill she grew up next to. Highest praise you can get in our house.',
    name: 'Meena Thomas',
    meta: 'Home cook · Salem',
  },
  {
    quote:
      'Sesame oil that actually tastes of sesame. I use half of what I used to and the flavour is still bigger.',
    name: 'Farhan Ali',
    meta: 'Verified buyer · Kochi',
  },
  {
    quote:
      'Quick delivery, sturdy packaging, and the oil is genuinely fresh. Three orders in and no complaints.',
    name: 'Deepa Nair',
    meta: 'Verified buyer · Hyderabad',
  },
  {
    quote:
      'The pressing date printed on the label won me over. A small thing that buys a lot of trust.',
    name: 'Sanjay Verma',
    meta: 'Home cook · Pune',
  },
].map((r, i) => ({ ...r, tint: TINTS[i % TINTS.length] }))

function Stars({ size = 16, className = '' }) {
  return (
    <span className={`flex gap-0.5 text-gold-500 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  )
}

function Card({ quote, name, meta, tint, hidden }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="relative w-[286px] shrink-0 px-3 pb-6 pt-10 sm:w-[350px]"
    >
      {/* organic shapes behind the card */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className="absolute -right-1 top-3 h-40 w-40 rotate-[16deg]"
          style={{ background: tint, borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%', opacity: 0.75 }}
        />
        <span
          className="absolute -left-4 bottom-1 h-36 w-36 -rotate-[14deg]"
          style={{ background: tint, borderRadius: '63% 37% 38% 62% / 58% 55% 45% 42%', opacity: 0.5 }}
        />
      </span>

      {/* card */}
      <div className="relative rounded-[1.5rem] bg-white px-6 pb-8 pt-12 shadow-[0_26px_50px_-20px_rgba(37,41,20,0.3)]">
        <p className="font-display text-[1.35rem] font-medium leading-tight text-olive-900">{name}</p>
        <p className="mt-0.5 font-display text-sm italic text-text-mute">{meta}</p>
        <p className="mt-4 text-[0.88rem] leading-relaxed text-text-soft">{quote}</p>

        {/* star badge, bottom-centre */}
        <span className="absolute -bottom-4 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-gold-400 text-olive-950 ring-4 ring-white">
          <Star size={15} fill="currentColor" strokeWidth={0} />
        </span>
      </div>

      {/* rating badge overlapping the top */}
      <span className="absolute left-1/2 top-0 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-olive-800 ring-4 ring-white">
        <Stars size={9} className="w-[2.6rem] flex-wrap justify-center gap-[1px] text-gold-300" />
      </span>
    </div>
  )
}

export default function Reviews() {
  const loop = [...REVIEWS, ...REVIEWS]

  return (
    <section className="overflow-hidden bg-paper" id="reviews" aria-label="Customer reviews">
      <div className="px-[var(--spacing-gutter)] pb-[clamp(2rem,4vw,3rem)] pt-[clamp(2.5rem,5vw,4rem)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="mx-auto max-w-[40rem] text-center">
          <p className="eyebrow">Customer reviews</p>
          <h2 className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
              style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.4vw, 3rem)' }}>
            What people are saying
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-text-soft">
            <Stars size={16} />
            <span>4.9 average from 380+ verified buyers</span>
          </div>
        </div>
      </div>

      <div className="reviews-viewport pb-[clamp(3.5rem,7vw,5rem)]">
        <div className="reviews-track">
          {loop.map((r, i) => (
            <Card key={i} {...r} hidden={i >= REVIEWS.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
