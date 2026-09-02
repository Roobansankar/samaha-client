import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronRight, ChevronLeft, X,
  Minus, Plus, Check, Star, Truck, RotateCcw, ShieldCheck,
} from 'lucide-react'
import { PRODUCTS, HIGHLIGHTS, getProduct, fromPrice } from '../data/products'
import NotFound from './NotFound'

function BottleGlyph(props) {
  return (
    <svg viewBox="0 0 48 96" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" {...props}>
      <path d="M19 5h10v9c0 3 6 6 6 14v52a6 6 0 0 1-6 6H19a6 6 0 0 1-6-6V28c0-8 6-11 6-14V5Z" />
      <path d="M13.5 46h21" />
    </svg>
  )
}

function Placeholder({ tint, compact = false }) {
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: tint }}>
      <div className="flex flex-col items-center gap-2 text-olive-900/25">
        <BottleGlyph className={compact ? 'h-8 w-auto' : 'h-16 w-auto'} />
        {!compact && (
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em]">
            Image coming soon
          </span>
        )}
      </div>
    </div>
  )
}

function Gallery({ product }) {
  const images = product.images
  const count = images.length
  const [active, setActive] = useState(0)
  const [broken, setBroken] = useState(() => new Set())
  const [zoom, setZoom] = useState(false)
  const touchStart = useRef(null)
  const lightboxTouchStart = useRef(null)

  const markBroken = (i) => setBroken((prev) => new Set(prev).add(i))
  const go = (dir) => setActive((a) => (a + dir + count) % count)

  // Touch swipe for main image
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? go(1) : go(-1)
    }
  }

  // Touch swipe for lightbox
  const onLightboxTouchStart = (e) => {
    lightboxTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onLightboxTouchEnd = (e) => {
    if (!lightboxTouchStart.current) return
    const dx = e.changedTouches[0].clientX - lightboxTouchStart.current.x
    const dy = e.changedTouches[0].clientY - lightboxTouchStart.current.y
    lightboxTouchStart.current = null
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? go(1) : go(-1)
    }
  }

  useEffect(() => {
    setActive(0)
    setBroken(new Set())
    setZoom(false)
  }, [product.slug])

  useEffect(() => {
    if (!zoom) return
    document.body.classList.add('no-scroll')
    const onKey = (e) => {
      if (e.key === 'Escape') setZoom(false)
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
  }, [zoom, count])

  const arrowCls =
    'absolute top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-olive-900 shadow-sm backdrop-blur-sm transition hover:bg-paper cursor-pointer sm:opacity-0 sm:group-hover:opacity-100'

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      {/* main image */}
      <div
        className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line"
        style={{ aspectRatio: '1 / 1' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {broken.has(active) ? (
          <Placeholder tint={product.tint} />
        ) : (
          <img
            src={images[active]}
            alt={`${product.name} — view ${active + 1}`}
            fetchPriority="high"
            decoding="async"
            onError={() => markBroken(active)}
            onClick={() => setZoom(true)}
            className="absolute inset-0 h-full w-full cursor-zoom-in object-contain p-8 sm:p-12"
            style={{ background: product.tint }}
          />
        )}

        <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${arrowCls} left-3`}>
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${arrowCls} right-3`}>
          <ChevronRight size={18} />
        </button>

        <span className="absolute bottom-3 right-3 rounded-pill bg-olive-950/55 px-2.5 py-1 text-[0.65rem] font-medium text-paper">
          {active + 1} / {count}
        </span>
      </div>

      {/* thumbnails */}
      <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={i === active}
            className={`relative overflow-hidden rounded-[var(--radius-sm)] border transition-colors cursor-pointer ${
              i === active ? 'border-olive-700' : 'border-line hover:border-olive-300'
            }`}
            style={{ aspectRatio: '1 / 1' }}
          >
            {broken.has(i) ? (
              <Placeholder tint={product.tint} compact />
            ) : (
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => markBroken(i)}
                className="absolute inset-0 h-full w-full object-contain p-2"
                style={{ background: product.tint }}
              />
            )}
          </button>
        ))}
      </div>

      {/* lightbox */}
      {zoom && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex flex-col bg-olive-950/92 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} images`}
          onClick={() => setZoom(false)}
        >
          <div className="flex items-center justify-between px-5 py-4 text-paper">
            <span className="text-sm font-medium">
              {product.name} · {active + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => setZoom(false)}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10 cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-4 pb-2"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onLightboxTouchStart}
            onTouchEnd={onLightboxTouchEnd}
          >
            {broken.has(active) ? (
              <div
                className="grid aspect-square w-[min(78vw,70vh)] place-items-center rounded-[var(--radius-lg)]"
                style={{ background: product.tint }}
              >
                <div className="relative h-full w-full">
                  <Placeholder tint={product.tint} />
                </div>
              </div>
            ) : (
              <img
                src={images[active]}
                alt={`${product.name} — view ${active + 1}`}
                decoding="async"
                onError={() => markBroken(active)}
                className="max-h-[76vh] max-w-full rounded-[var(--radius-md)] object-contain"
                style={{ background: product.tint }}
              />
            )}

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-paper transition hover:bg-white/20 cursor-pointer sm:left-6"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-paper transition hover:bg-white/20 cursor-pointer sm:right-6"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex justify-center gap-2 p-4" onClick={(e) => e.stopPropagation()}>
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-12 w-12 overflow-hidden rounded border-2 transition cursor-pointer ${
                  i === active ? 'border-paper' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                {broken.has(i) ? (
                  <span className="block h-full w-full" style={{ background: product.tint }} />
                ) : (
                  <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" style={{ background: product.tint }} />
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

function Stars({ rating }) {
  return (
    <span className="flex text-gold-500" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          strokeWidth={0}
          fill={i < Math.round(rating) ? 'currentColor' : 'var(--color-olive-200)'}
        />
      ))}
    </span>
  )
}

const DELIVERY = [
  { Icon: Truck, text: 'Free shipping over ₹5000 · dispatched in 2 working days' },
  { Icon: RotateCcw, text: '7-day replacement on sealed tins' },
  { Icon: ShieldCheck, text: 'Lab-tested every batch · no sulphur, no additives' },
]

export default function ProductPage() {
  const { slug } = useParams()
  const product = getProduct(slug)

  const [sizeIdx, setSizeIdx] = useState(1) // default 1 L
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setSizeIdx(1)
    setQty(1)
    setAdded(false)
  }, [slug])

  if (!product) return <NotFound />

  const size = product.sizes[sizeIdx]
  const total = size.price * qty
  const others = PRODUCTS.filter((p) => p.slug !== product.slug)
  const headingSize = 'clamp(1.35rem, 1.1rem + 1vw, 1.7rem)'

  return (
    <div className="bg-paper">
      <div className="px-[var(--spacing-gutter)] py-[clamp(1.75rem,4vw,3rem)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="mx-auto max-w-[1280px]">

          {/* breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-mute">
            <Link to="/" className="transition-colors hover:text-olive-800">Home</Link>
            <ChevronRight size={14} className="text-text-mute/60" />
            <Link to="/shop" className="transition-colors hover:text-olive-800">Shop</Link>
            <ChevronRight size={14} className="text-text-mute/60" />
            <span className="font-medium text-olive-900">{product.name}</span>
          </nav>

          {/* main */}
          <div className="mt-8 grid gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-2">
            <Gallery product={product} />

            {/* info */}
            <div>
              <p className="eyebrow">{product.tag} · Cold-pressed</p>
              <h1
                className="mt-3 font-display font-medium leading-[1.05] text-olive-900"
                style={{ fontSize: 'clamp(2rem, 1.4rem + 2.6vw, 3rem)' }}
              >
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-2.5">
                <Stars rating={product.rating} />
                <span className="text-sm text-text-mute">
                  {product.rating.toFixed(1)} · {product.reviews} reviews
                </span>
              </div>

              <p className="mt-5 max-w-[48ch] leading-relaxed text-text-soft"
                 style={{ fontSize: 'clamp(1rem, 0.95rem + 0.2vw, 1.08rem)' }}>
                {product.tagline}
              </p>

              <div className="mt-7 flex items-baseline gap-2">
                <span className="font-sans text-[2rem] font-semibold leading-none text-olive-900">
                  ₹{size.price}
                </span>
                <span className="text-sm text-text-mute">/ {size.label}</span>
              </div>

              {/* size */}
              <fieldset className="mt-7">
                <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-text-mute">
                  Size
                </legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {product.sizes.map((s, i) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => { setSizeIdx(i); setAdded(false) }}
                      aria-pressed={i === sizeIdx}
                      className={`rounded-[var(--radius-sm)] border px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                        i === sizeIdx
                          ? 'border-olive-800 bg-olive-900 text-paper'
                          : 'border-line bg-paper text-olive-900 hover:border-olive-300'
                      }`}
                    >
                      {s.label}
                      <span className={`ml-2 text-xs ${i === sizeIdx ? 'text-paper/70' : 'text-text-mute'}`}>
                        ₹{s.price}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* qty + add */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-pill border border-line bg-paper">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-12 w-12 place-items-center text-olive-800 transition-colors hover:text-olive-950 disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold text-olive-900">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="grid h-12 w-12 place-items-center text-olive-800 transition-colors hover:text-olive-950 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setAdded(true)}
                  className="btn btn-primary min-w-[14rem] flex-1"
                >
                  {added ? <>Added to cart <Check size={16} strokeWidth={2.5} /></> : <>Add to cart — ₹{total}</>}
                </button>
              </div>

              {/* about */}
              <section className="mt-10 border-t border-line pt-8">
                <h2 className="font-display font-medium text-olive-900" style={{ fontSize: headingSize }}>
                  About this oil
                </h2>
                <div className="mt-4 space-y-4 leading-[1.75] text-text-soft"
                     style={{ fontSize: 'clamp(0.98rem, 0.92rem + 0.2vw, 1.05rem)' }}>
                  {product.description.map((para) => <p key={para}>{para}</p>)}
                </div>
              </section>

              {/* specifications */}
              <section className="mt-8">
                <h2 className="font-display font-medium text-olive-900" style={{ fontSize: headingSize }}>
                  Specifications
                </h2>
                <dl className="mt-4 overflow-hidden rounded-xl border border-line divide-y divide-line">
                  {product.specs.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-6 px-5 py-4 text-sm bg-paper-inset">
                      <dt className="text-text-mute">{label}</dt>
                      <dd className="text-right font-medium text-olive-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>

          {/* why samaha + shipping */}
          <div className="mt-[clamp(2rem,5vw,3.5rem)] border-t border-line pt-[clamp(2rem,5vw,3.5rem)] space-y-6 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:space-y-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-mute mb-3">Why Samaha</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {HIGHLIGHTS.map((h) => (
                  <div key={h} className="flex items-center gap-3 rounded-lg bg-paper-inset px-4 py-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-900 text-paper">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium text-olive-900">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-paper-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-mute mb-3">Shipping &amp; Returns</p>
              <ul className="space-y-3">
                {DELIVERY.map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-text-soft">
                    <Icon size={16} className="mt-0.5 shrink-0 text-olive-700" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* related */}
          <div className="mt-[clamp(2rem,5vw,3.5rem)] border-t border-line pt-[clamp(2rem,5vw,3.5rem)]">
            <h2 className="font-display font-medium text-olive-900" style={{ fontSize: headingSize }}>
              More from Samaha
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to={`/shop/${o.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="relative overflow-hidden" style={{ background: o.tint, aspectRatio: '1 / 1' }}>
                    <img
                      src={o.images[0]}
                      alt={o.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                      className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-display text-sm font-medium leading-snug text-olive-900 sm:text-base">
                      {o.name}
                    </p>
                    <p className="mt-1 text-xs text-text-mute sm:text-sm">
                      from <span className="font-semibold text-olive-800">₹{fromPrice(o)}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
