import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react'
import { OIL_VARIANTS } from '../data/products'
import VariantCard from './VariantCard'

const FILTERS = ['All', 'Coconut', 'Groundnut', 'Sesame']

const PERKS = [
  { Icon: Leaf, title: 'Cold-pressed & unrefined', text: 'Extracted below 27°C so nothing good is lost.' },
  { Icon: ShieldCheck, title: 'Nothing added', text: 'No preservatives, no sulphur, no shortcuts.' },
  { Icon: Truck, title: 'Free shipping over ₹5000', text: 'Dispatched within two working days.' },
]

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const oils = OIL_VARIANTS.filter((o) => activeFilter === 'All' || o.tag === activeFilter)
  const skuCount = oils.reduce((n, o) => n + o.variants.length, 0)

  return (
    <div className="bg-paper-inset" id="shop-page">

      {/* ---------- Hero ---------- */}
      <section className="relative flex min-h-[clamp(420px,62vh,660px)] items-center overflow-hidden bg-olive-950 text-on-olive">
        <img
          src="/banner.webp"
          alt="Golden cold-pressed oil poured into a glass bowl beside coconut and groundnuts"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="img-shimmer absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-olive-950/90 via-olive-950/60 to-olive-950/20"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)] py-[clamp(3rem,8vw,5rem)]">
          <p className="eyebrow text-gold-300">The shop</p>
          <h1
            className="mt-4 max-w-[20ch] font-display font-medium leading-[1.03] text-on-olive"
            style={{ fontSize: 'clamp(2.3rem, 1.5rem + 4vw, 4.6rem)' }}
          >
            Three oils, pressed the slow way
          </h1>
          <p
            className="mt-6 max-w-[46ch] leading-[1.7] text-on-olive-soft"
            style={{ fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.15rem)' }}
          >
            Single-estate coconuts and groundnuts, cold-pressed and bottled by
            hand in small, dated lots.
          </p>
        </div>
      </section>

      {/* ---------- Catalogue ---------- */}
      <section className="px-[var(--spacing-gutter)] py-[clamp(3rem,7vw,5rem)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="mx-auto max-w-[1200px]">

          {/* header + filters */}
          <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Catalogue</p>
              <h2 className="mt-2 font-display font-medium leading-[1.1] text-olive-900"
                  style={{ fontSize: 'clamp(1.7rem, 1.2rem + 2vw, 2.5rem)' }}>
                Every size, every oil
              </h2>
              <p className="mt-1.5 text-sm text-text-mute">{skuCount} products</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`rounded-pill px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-200 cursor-pointer ${
                    activeFilter === f
                      ? 'bg-olive-900 text-paper'
                      : 'border border-line bg-paper text-text-mute hover:border-olive-300 hover:text-olive-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* catalogue — every size as its own product */}
          {oils.map((oil) => (
            <div key={oil.slug} id={oil.slug} className="mt-[clamp(2.25rem,5vw,3.25rem)] scroll-mt-28">
              <h3 className="font-display font-medium text-olive-900"
                  style={{ fontSize: 'clamp(1.3rem, 1.05rem + 1vw, 1.7rem)' }}>
                {oil.name}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-text-mute">{oil.blurb}</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {oil.variants.map((v) => (
                  <VariantCard key={v.id} v={v} tint={oil.tint} blurb={oil.blurb} />
                ))}
              </div>
            </div>
          ))}

          {/* reassurance strip */}
          <div className="mt-[clamp(3rem,7vw,4.5rem)] grid gap-5 rounded-[var(--radius-lg)] border border-line bg-paper-2 p-6 sm:grid-cols-3 sm:p-8">
            {PERKS.map(({ Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-olive-900 text-paper">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-olive-900">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-mute">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/" className="btn btn-ghost">
              Back to home <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
