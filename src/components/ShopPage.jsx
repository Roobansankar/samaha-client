import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Leaf, ShieldCheck, Truck, SlidersHorizontal, X, Grid2x2, Square } from 'lucide-react'
import { OIL_VARIANTS } from '../data/products'
import { useVisibleProducts } from '../lib/catalog'
import VariantCard from './VariantCard'

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const CATEGORIES = ['Coconut', 'Groundnut', 'Sesame']
const SIZES = ['500 ml', '1 Litre', '5 Litres', '16 Litre Tin']
const SIZE_SLUG = { '500 ml': '500ml', '1 Litre': '1l', '5 Litres': '5l', '16 Litre Tin': '16l' }
const SLUG_SIZE = Object.fromEntries(Object.entries(SIZE_SLUG).map(([k, v]) => [v, k]))

const PRICE_BANDS = [
  { id: 'all', label: 'Any price', test: () => true },
  { id: 'u250', label: 'Under ₹250', test: (p) => p < 250 },
  { id: 'mid', label: '₹250 – ₹1,000', test: (p) => p >= 250 && p < 1000 },
  { id: 'high', label: '₹1,000 – ₹3,000', test: (p) => p >= 1000 && p < 3000 },
  { id: 'top', label: 'Over ₹3,000', test: (p) => p >= 3000 },
]

const PERKS = [
  { Icon: Leaf, title: 'Cold-pressed & unrefined', text: 'Extracted below 27°C so nothing good is lost.' },
  { Icon: ShieldCheck, title: 'Nothing added', text: 'No preservatives, no sulphur, no shortcuts.' },
  { Icon: Truck, title: 'Free shipping over ₹5000', text: 'Dispatched within two working days.' },
]

const setFrom = (raw, resolve) =>
  new Set(
    String(raw || '')
      .toLowerCase()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map(resolve)
      .filter(Boolean),
  )

export default function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const [cols, setCols] = useState(() => {
    try { return localStorage.getItem('shopCols') === '2' ? 2 : 1 } catch { return 1 }
  })
  const [phase, setPhase] = useState('idle')
  const timerRef = useRef(null)
  const chooseCols = (n) => {
    setCols(n)
    try { localStorage.setItem('shopCols', String(n)) } catch { /* ignore */ }
  }

  // filters live in the URL — shareable & back-button friendly
  const cats = setFrom(params.get('cat') || params.get('oil'), (s) => CATEGORIES.find((c) => c.toLowerCase() === s))
  const sizes = setFrom(params.get('size'), (s) => SLUG_SIZE[s])
  const band = PRICE_BANDS.find((b) => b.id === params.get('price'))?.id || 'all'
  const activeCount = cats.size + sizes.size + (band !== 'all' ? 1 : 0)

  const apply = (c, s, b) => {
    const p = new URLSearchParams()
    if (c.size) p.set('cat', [...c].map((x) => x.toLowerCase()).join(','))
    if (s.size) p.set('size', [...s].map((x) => SIZE_SLUG[x]).join(','))
    if (b !== 'all') p.set('price', b)
    setParams(p, { replace: true })
  }
  const triggerFilter = useCallback((c, s, b) => {
    if (REDUCED_MOTION) { apply(c, s, b); return }
    setPhase('exiting')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      apply(c, s, b)
      setPhase('entering')
      timerRef.current = setTimeout(() => setPhase('idle'), 320)
    }, 160)
  }, [])
  const toggleCat = (v) => { const n = new Set(cats); n.has(v) ? n.delete(v) : n.add(v); triggerFilter(n, sizes, band) }
  const toggleSize = (v) => { const n = new Set(sizes); n.has(v) ? n.delete(v) : n.add(v); triggerFilter(cats, n, band) }
  const pickBand = (v) => triggerFilter(cats, sizes, v)
  const clearAll = () => {
    if (REDUCED_MOTION) { setParams({}, { replace: true }); return }
    setPhase('exiting')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setParams({}, { replace: true })
      setPhase('entering')
      timerRef.current = setTimeout(() => setPhase('idle'), 320)
    }, 160)
  }

  const isVisible = useVisibleProducts()
  const bandTest = PRICE_BANDS.find((b) => b.id === band).test
  const items = OIL_VARIANTS
    .filter((o) => cats.size === 0 || cats.has(o.tag))
    .flatMap((o) =>
      o.variants
        .filter((v) => isVisible(v.slug) && (sizes.size === 0 || sizes.has(v.sizeLong)) && bandTest(v.price))
        .map((v) => ({ ...v, tint: o.tint, blurb: o.blurb })),
    )
  const total = items.length

  // lock scroll + close on Escape while the mobile drawer is open
  useEffect(() => {
    document.body.classList.toggle('no-scroll', drawer)
    const onKey = (e) => e.key === 'Escape' && setDrawer(false)
    if (drawer) window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
  }, [drawer])

  // arriving with a filter in the URL — jump past the hero
  const catRef = useRef(null)
  useEffect(() => {
    if (activeCount > 0 && catRef.current) catRef.current.scrollIntoView({ block: 'start' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const controls = (scope) => (
    <FilterControls
      scope={scope}
      cats={cats}
      sizes={sizes}
      band={band}
      onToggleCat={toggleCat}
      onToggleSize={toggleSize}
      onBand={pickBand}
    />
  )

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
      <section ref={catRef} className="scroll-mt-24 px-[var(--spacing-gutter)] py-[clamp(3rem,7vw,5rem)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-6">
            <div>
              <p className="eyebrow">Catalogue</p>
              <h2 className="mt-2 font-display font-medium leading-[1.1] text-olive-900"
                  style={{ fontSize: 'clamp(1.7rem, 1.2rem + 2vw, 2.5rem)' }}>
                Every size, every oil
              </h2>
            </div>
            <p className="text-sm text-text-mute">
              {total} {total === 1 ? 'product' : 'products'}{activeCount > 0 ? ' match your filters' : ''}
            </p>
          </div>

          <div className="mt-8 lg:grid lg:grid-cols-[220px_1fr] lg:gap-x-12">
            {/* ----- Desktop sidebar ----- */}
            <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-olive-900">Filters</h3>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="text-xs font-medium text-clay-600 hover:underline cursor-pointer">
                    Clear all
                  </button>
                )}
              </div>
              {controls('d')}
            </aside>

            {/* ----- Results ----- */}
            <div>
              {/* mobile: filters + layout toggle */}
              <div className="mb-6 flex items-center gap-2.5 lg:hidden">
                <button
                  type="button"
                  onClick={() => setDrawer(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-olive-900/15 bg-paper px-4 py-3 text-sm font-semibold text-olive-900"
                >
                  <SlidersHorizontal size={15} />
                  Filters{activeCount > 0 ? ` · ${activeCount}` : ''}
                </button>
                <div className="flex shrink-0 overflow-hidden rounded-xl border border-olive-900/15 bg-paper">
                  <button
                    type="button"
                    onClick={() => chooseCols(1)}
                    aria-label="One product per row"
                    aria-pressed={cols === 1}
                    className={`grid h-[46px] w-[44px] place-items-center transition-colors ${cols === 1 ? 'bg-olive-900 text-paper' : 'text-olive-700'}`}
                  >
                    <Square size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => chooseCols(2)}
                    aria-label="Two products per row"
                    aria-pressed={cols === 2}
                    className={`grid h-[46px] w-[44px] place-items-center transition-colors ${cols === 2 ? 'bg-olive-900 text-paper' : 'text-olive-700'}`}
                  >
                    <Grid2x2 size={16} />
                  </button>
                </div>
              </div>

              {total === 0 ? (
                <div className="rounded-[var(--radius-lg)] border border-dashed border-line py-20 text-center">
                  <p className="text-sm text-text-mute">No products match these filters.</p>
                  <button onClick={clearAll} className="mt-3 text-sm font-semibold text-olive-900 underline underline-offset-2 cursor-pointer">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-3 sm:gap-5 ${cols === 1 ? 'grid-cols-1' : 'grid-cols-2'} sm:grid-cols-2 xl:grid-cols-3 ${
                  phase === 'exiting' ? 'cards-exit' : phase === 'entering' ? 'cards-enter' : ''
                }`}>
                  {items.map((v, i) => (
                    <div
                      key={v.id}
                      className={phase === 'entering' ? 'card-enter' : ''}
                      style={phase === 'entering' ? { animationDelay: `${i * 40}ms` } : undefined}
                    >
                      <VariantCard v={v} tint={v.tint} blurb={v.blurb} />
                    </div>
                  ))}
                </div>
              )}
            </div>
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

      {/* ---------- Mobile filter sidebar ---------- */}
      <div className={`fixed inset-0 z-[200] lg:hidden ${drawer ? '' : 'pointer-events-none'}`} aria-hidden={!drawer}>
        <div
          className={`absolute inset-0 bg-olive-950/45 transition-opacity duration-300 ${drawer ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setDrawer(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[min(86vw,340px)] flex-col bg-paper shadow-2xl transition-transform duration-300 ease-out ${
            drawer ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-olive-900">Filters</h3>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Close filters"
              className="grid h-9 w-9 place-items-center rounded-full text-olive-800 transition-colors hover:bg-olive-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">{controls('m')}</div>

          <div className="flex items-center gap-3 border-t border-line px-5 py-4">
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-sm font-medium text-clay-600 hover:underline cursor-pointer">
                Clear all
              </button>
            )}
            <button onClick={() => setDrawer(false)} className="btn btn-primary ml-auto flex-1">
              Show {total} {total === 1 ? 'result' : 'results'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function FilterControls({ scope, cats, sizes, band, onToggleCat, onToggleSize, onBand }) {
  return (
    <div className="space-y-7">
      <FilterGroup title="Category">
        {CATEGORIES.map((c) => (
          <CheckRow key={c} label={c} checked={cats.has(c)} onChange={() => onToggleCat(c)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Pack size">
        {SIZES.map((s) => (
          <CheckRow key={s} label={s} checked={sizes.has(s)} onChange={() => onToggleSize(s)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Price">
        {PRICE_BANDS.map((b) => (
          <RadioRow key={b.id} name={`price-${scope}`} label={b.label} checked={band === b.id} onChange={() => onBand(b.id)} />
        ))}
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-text-mute">{title}</h4>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded border-line accent-olive-800 cursor-pointer"
      />
      {label}
    </label>
  )
}

function RadioRow({ name, label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-soft">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-olive-800 cursor-pointer"
      />
      {label}
    </label>
  )
}
