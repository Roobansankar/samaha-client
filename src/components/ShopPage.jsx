import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, ShieldCheck, Truck, Star } from 'lucide-react'
import { PRODUCTS, fromPrice } from '../data/products'

const FILTERS = ['All', 'Coconut', 'Groundnut', 'Peanut']

const PERKS = [
  { Icon: Leaf, title: 'Cold-pressed & unrefined', text: 'Extracted below 27°C so nothing good is lost.' },
  { Icon: ShieldCheck, title: 'Nothing added', text: 'No preservatives, no sulphur, no shortcuts.' },
  { Icon: Truck, title: 'Free shipping over ₹5000', text: 'Dispatched within two working days.' },
]

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered =
    activeFilter === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.tag === activeFilter)

  return (
    <div className="bg-paper-inset" id="shop-page">

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Golden cold-pressed oil poured into a glass bowl beside coconut and peanuts"
          width={1920}
          height={912}
          className="h-[clamp(400px,46vw,480px)] w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(26,46,20,0.82) 0%, rgba(26,46,20,0.55) 45%, rgba(26,46,20,0.25) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex items-center">
          <div className="container-site">
            <p className="eyebrow" style={{ color: 'var(--color-gold-300)' }}>
              The Shop
            </p>
            <h1
              className="mt-3 max-w-[16ch] font-display font-medium leading-[1.04] text-on-olive"
              style={{ fontSize: 'clamp(2.4rem, 1.5rem + 4.5vw, 4.25rem)' }}
            >
              Three oils, pressed the slow way
            </h1>
            <p
              className="mt-4 max-w-[46ch] leading-relaxed text-on-olive-soft"
              style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.25vw, 1.15rem)' }}
            >
              Single-estate coconuts and groundnuts, cold-pressed and bottled by
              hand in small, dated lots.
            </p>
            <div className="mt-6 hidden flex-wrap items-center gap-x-5 gap-y-2 text-on-olive-mute sm:flex"
                 style={{ fontSize: '0.8rem', letterSpacing: '0.08em' }}>
              <span className="uppercase">3 varieties</span>
              <span aria-hidden="true">·</span>
              <span className="uppercase">½, 1, 5 &amp; 16 L tins</span>
              <span aria-hidden="true">·</span>
              <span className="uppercase">Chekku cold-pressed</span>
            </div>
          </div>
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
                All oils
              </h2>
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

          {/* product grid */}
          <div className="mt-[clamp(2rem,5vw,3rem)] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filtered.map((p) => (
              <article
                key={p.slug}
                id={p.slug}
                className="group flex scroll-mt-28 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper transition-shadow duration-200 hover:shadow-md"
              >
                <Link to={`/shop/${p.slug}`} className="block" aria-label={p.name}>
                  <div
                    className="relative grid place-items-center overflow-hidden"
                    style={{ background: p.tint, aspectRatio: '1 / 1' }}
                  >
                    {p.badge && (
                      <span className="absolute left-3 top-3 rounded-pill bg-olive-900 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-paper">
                        {p.badge}
                      </span>
                    )}
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                      className="h-[80%] w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-1.5 text-gold-500">
                    <Star size={13} fill="currentColor" strokeWidth={0} />
                    <span className="text-xs font-semibold text-olive-900">{p.rating.toFixed(1)}</span>
                    <span className="text-xs text-text-mute">({p.reviews})</span>
                  </div>

                  <h3 className="mt-1.5 font-display text-xl font-medium text-olive-900">
                    <Link to={`/shop/${p.slug}`} className="hover:text-olive-700">{p.name}</Link>
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-mute">
                    {p.tagline}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-sans text-lg font-semibold text-olive-900">
                      from ₹{fromPrice(p)}
                    </span>
                    <Link
                      to={`/shop/${p.slug}`}
                      className="rounded-pill bg-olive-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-paper transition-colors duration-200 hover:bg-olive-800"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

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
