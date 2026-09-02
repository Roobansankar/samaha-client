import { Leaf, Droplet, Wind, Smile, Flame, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'

const BENEFITS = [
  { Icon: Leaf, title: 'Wholesome source of fat', text: 'One of the cleanest, most heat-stable fats to cook with.' },
  { Icon: Droplet, title: 'Rich, natural moisturiser', text: 'Leaves skin soft and buttery smooth, head to toe.' },
  { Icon: Wind, title: 'Hair softener & conditioner', text: 'Tames frizz, brittleness and a flaky scalp.' },
  { Icon: Smile, title: 'Oral health booster', text: 'Daily oil-pulling freshens breath, brightens teeth.' },
  { Icon: Flame, title: 'Metabolism & digestion', text: 'Keeps you fuller for longer, supports a healthy gut.' },
  { Icon: Sun, title: 'Soothes irritated skin', text: 'Calms dry patches, rashes and everyday roughness.' },
]

const LEFT = BENEFITS.slice(0, 3)
const RIGHT = BENEFITS.slice(3)

function Squiggle({ className }) {
  return (
    <svg viewBox="0 0 84 64" className={className} fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M78 8C54 3 22 9 16 30c-4 15 10 24 19 13" />
      <path d="M27 50l7-8 9 5" />
    </svg>
  )
}

function Benefit({ Icon, title, text, side }) {
  return (
    <li className={`flex items-start gap-4 ${side === 'left' ? 'sm:flex-row-reverse sm:text-right' : ''}`}>
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border text-gold-300"
            style={{ borderColor: 'rgba(230,189,113,0.4)' }}>
        <Icon size={24} strokeWidth={1.6} />
      </span>
      <div className="pt-1">
        <p className="font-sans font-semibold leading-snug text-on-olive">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-on-olive-mute">{text}</p>
      </div>
    </li>
  )
}

export default function Benefits() {
  return (
    <section className="bg-paper" id="benefits" aria-label="Coconut oil benefits">
      <div className="mx-auto w-full max-w-[1520px] px-[var(--spacing-gutter)] py-[clamp(2rem,4vw,3rem)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="rounded-[clamp(1.25rem,3vw,2rem)] bg-olive-900 px-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(2.5rem,6vw,4.5rem)] text-on-olive">

          {/* Header */}
          <div className="mx-auto max-w-[46rem] text-center">
            <h2 className="font-sans font-bold leading-[1.15] text-on-olive"
                style={{ fontSize: 'clamp(1.55rem, 1.1rem + 2vw, 2.6rem)' }}>
              Coconut Oil &mdash; inside-out goodness
            </h2>
            <p className="mt-3 font-display italic text-on-olive-soft"
               style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.25vw, 1.15rem)' }}>
              Your must-have household essential, with 15+ everyday uses.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Squiggle className="h-12 w-14 -translate-y-1 text-gold-300 max-[560px]:hidden" />
              <Link to="/shop/coconut-oil"
                    className="inline-flex items-center rounded-pill bg-paper px-6 py-2.5 text-sm font-semibold text-olive-900 transition-transform duration-200 hover:scale-[1.03]">
                Shop Now
              </Link>
            </div>
          </div>

          {/* Body — benefits radiate from the centred product */}
          <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid items-center gap-x-8 gap-y-10 lg:grid-cols-[1fr_minmax(0,20rem)_1fr]">

            <ul className="order-2 flex flex-col gap-9 lg:order-1">
              {LEFT.map((b) => <Benefit key={b.title} {...b} side="left" />)}
            </ul>

            <div className="relative order-1 mx-auto w-full max-w-[19rem] lg:order-2">
              <div
                className="absolute left-1/2 top-1/2 aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.07] blur-2xl"
                aria-hidden="true"
              />
              <img
                src="/coconut.webp"
                alt="Samaha organic virgin coconut oil with fresh coconut and palm leaves"
                loading="lazy"
                decoding="async"
                className="relative w-full object-contain drop-shadow-[0_24px_44px_rgba(0,0,0,0.4)]"
              />
            </div>

            <ul className="order-3 flex flex-col gap-9">
              {RIGHT.map((b) => <Benefit key={b.title} {...b} side="right" />)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
