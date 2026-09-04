import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, ArrowRight, Grid2x2, Square } from 'lucide-react'
import { getProduct, OIL_VARIANTS } from '../data/products'
import { useVisibleProducts } from '../lib/catalog'
import VariantCard from './VariantCard'
import NotFound from './NotFound'

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const HERO = {
  'coconut-oil': '/slide1.webp',
  'groundnut-oil': '/slide2.webp',
  'sesame-oil': '/slide3.png',
}

const SORTS = [
  { id: 'size', label: 'Size: small to large' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
]

export default function CategoryPage() {
  const { slug } = useParams()
  const oil = getProduct(slug)
  const group = OIL_VARIANTS.find((o) => o.slug === slug)

  const [picked, setPicked] = useState(() => new Set())
  const [sort, setSort] = useState('size')
  const [phase, setPhase] = useState('idle')
  const timerRef = useRef(null)
  const [cols, setCols] = useState(() => {
    try { return localStorage.getItem('shopCols') === '2' ? 2 : 1 } catch { return 1 }
  })
  const chooseCols = (n) => {
    setCols(n)
    try { localStorage.setItem('shopCols', String(n)) } catch { /* ignore */ }
  }
  const animateUpdate = useCallback((updater) => {
    if (REDUCED_MOTION) { updater(); return }
    setPhase('exiting')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      updater()
      setPhase('entering')
      timerRef.current = setTimeout(() => setPhase('idle'), 320)
    }, 160)
  }, [])
  const toggleSize = (s) =>
    animateUpdate(() =>
      setPicked((prev) => {
        const n = new Set(prev)
        n.has(s) ? n.delete(s) : n.add(s)
        return n
      }),
    )
  const clearSizes = () =>
    animateUpdate(() => setPicked(new Set()))
  const isVisible = useVisibleProducts()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!oil || !group) return <NotFound />

  const live = group.variants.filter((v) => isVisible(v.slug))
  const shown = [...live]
    .filter((v) => picked.size === 0 || picked.has(v.sizeLong))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return 0
    })

  if (live.length === 0) return <NotFound />

  return (
    <div className="bg-paper-inset">
      {/* ---------- hero ---------- */}
      <section className="relative flex min-h-[clamp(340px,48vh,500px)] items-center overflow-hidden bg-olive-950 text-on-olive">
        <img
          src={HERO[slug] || '/banner.webp'}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="img-shimmer absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-olive-950/92 via-olive-950/68 to-olive-950/30"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)] py-[clamp(3rem,8vw,5rem)]">
          <nav className="flex items-center gap-2 text-xs text-on-olive-mute">
            <Link to="/" className="transition-colors hover:text-on-olive-soft">Home</Link>
            <ChevronRight size={13} />
            <Link to="/shop" className="transition-colors hover:text-on-olive-soft">Shop</Link>
            <ChevronRight size={13} />
            <span className="text-on-olive-soft">{oil.name}</span>
          </nav>
          <p className="eyebrow mt-4 text-gold-300">{group.blurb}</p>
          <h1
            className="mt-3 font-display font-medium leading-[1.03] text-on-olive"
            style={{ fontSize: 'clamp(2.2rem, 1.5rem + 3.4vw, 4rem)' }}
          >
            {oil.name}
          </h1>
          <p
            className="mt-5 max-w-[46ch] leading-[1.7] text-on-olive-soft"
            style={{ fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.12rem)' }}
          >
            {oil.tagline}
          </p>
        </div>
      </section>

      {/* ---------- sizes ---------- */}
      <section className="px-[var(--spacing-gutter)] py-[clamp(3rem,7vw,5rem)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="eyebrow">Choose your size</p>
              <h2
                className="mt-2 font-display font-medium leading-[1.1] text-olive-900"
                style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.4vw, 2rem)' }}
              >
                {live.length} pack {live.length === 1 ? 'size' : 'sizes'}
              </h2>
            </div>
            <Link to="/shop" className="hidden shrink-0 text-sm font-semibold text-olive-800 hover:underline sm:inline">
              All oils →
            </Link>
          </div>

          {/* controls */}
          <div className="mt-6 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {live.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => toggleSize(v.sizeLong)}
                  className={`rounded-pill px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    picked.has(v.sizeLong)
                      ? 'bg-olive-900 text-paper'
                      : 'border border-line bg-paper text-text-mute hover:border-olive-300 hover:text-olive-800'
                  }`}
                >
                  {v.sizeLong}
                </button>
              ))}
              {picked.size > 0 && (
                <button
                  type="button"
                  onClick={clearSizes}
                  className="ml-1 text-xs font-medium text-clay-600 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-olive-900 outline-none focus:border-olive-400"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>

              <div className="flex shrink-0 overflow-hidden rounded-lg border border-line bg-paper sm:hidden">
                <button
                  type="button"
                  onClick={() => chooseCols(1)}
                  aria-label="One per row"
                  aria-pressed={cols === 1}
                  className={`grid h-9 w-10 place-items-center transition-colors ${cols === 1 ? 'bg-olive-900 text-paper' : 'text-olive-700'}`}
                >
                  <Square size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => chooseCols(2)}
                  aria-label="Two per row"
                  aria-pressed={cols === 2}
                  className={`grid h-9 w-10 place-items-center transition-colors ${cols === 2 ? 'bg-olive-900 text-paper' : 'text-olive-700'}`}
                >
                  <Grid2x2 size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className={`mt-6 grid gap-3 sm:gap-5 ${cols === 1 ? 'grid-cols-1' : 'grid-cols-2'} sm:grid-cols-2 lg:grid-cols-4 ${
            phase === 'exiting' ? 'cards-exit' : phase === 'entering' ? 'cards-enter' : ''
          }`}>
            {shown.map((v, i) => (
              <div
                key={v.id}
                className={phase === 'entering' ? 'card-enter' : ''}
                style={phase === 'entering' ? { animationDelay: `${i * 40}ms` } : undefined}
              >
                <VariantCard v={v} tint={group.tint} blurb={group.blurb} />
              </div>
            ))}
          </div>

          {/* about + specs */}
          <div className="mt-[clamp(3rem,6vw,4.5rem)] grid gap-[clamp(2rem,5vw,4rem)] border-t border-line pt-[clamp(2.5rem,5vw,3.5rem)] lg:grid-cols-[1.25fr_1fr]">
            <div>
              <h2
                className="font-display font-medium text-olive-900"
                style={{ fontSize: 'clamp(1.4rem, 1.1rem + 1.2vw, 1.9rem)' }}
              >
                About {oil.name}
              </h2>
              <div className="mt-4 space-y-4 leading-[1.8] text-text-soft">
                {oil.description.map((para) => <p key={para}>{para}</p>)}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-mute">Specifications</h3>
              <dl className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line">
                {oil.specs.map(([k, val]) => (
                  <div key={k} className="flex justify-between gap-6 bg-paper-inset px-5 py-3.5 text-sm">
                    <dt className="text-text-mute">{k}</dt>
                    <dd className="text-right font-medium text-olive-900">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/shop" className="btn btn-ghost">
              Browse all oils <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
