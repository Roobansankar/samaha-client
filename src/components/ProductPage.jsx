import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ChevronRight, Minus, Plus, Check, Star, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
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
  const [active, setActive] = useState(0)
  const [broken, setBroken] = useState(() => new Set())
  const markBroken = (i) => setBroken((prev) => new Set(prev).add(i))

  // reset when the product changes
  useEffect(() => {
    setActive(0)
    setBroken(new Set())
  }, [product.slug])

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line"
        style={{ aspectRatio: '1 / 1' }}
      >
        {broken.has(active) ? (
          <Placeholder tint={product.tint} />
        ) : (
          <img
            src={product.images[active]}
            alt={`${product.name} — view ${active + 1}`}
            onError={() => markBroken(active)}
            className="absolute inset-0 h-full w-full object-contain p-8 sm:p-12"
            style={{ background: product.tint }}
          />
        )}
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
        {product.images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={i === active}
            className={`relative overflow-hidden rounded-[var(--radius-sm)] border transition-colors ${
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
                onError={() => markBroken(i)}
                className="absolute inset-0 h-full w-full object-contain p-2"
                style={{ background: product.tint }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function Stars({ rating }) {
  return (
    <span className="flex text-gold-500" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
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

  return (
    <div className="bg-paper">
      <div className="px-[var(--spacing-gutter)] py-[clamp(1.5rem,4vw,2.5rem)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="mx-auto max-w-[1120px]">

          {/* breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-mute">
            <Link to="/" className="hover:text-olive-800">Home</Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-olive-800">Shop</Link>
            <ChevronRight size={12} />
            <span className="text-olive-900">{product.name}</span>
          </nav>

          {/* main */}
          <div className="mt-6 grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-2">
            <Gallery product={product} />

            {/* info */}
            <div>
              <p className="eyebrow">{product.tag} · Cold-pressed</p>
              <h1
                className="mt-2 font-display font-medium leading-[1.05] text-olive-900"
                style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.6vw, 2.9rem)' }}
              >
                {product.name}
              </h1>

              <div className="mt-2.5 flex items-center gap-2">
                <Stars rating={product.rating} />
                <span className="text-sm text-text-mute">
                  {product.rating.toFixed(1)} · {product.reviews} reviews
                </span>
              </div>

              <p className="mt-4 max-w-[46ch] leading-relaxed text-text-soft">
                {product.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-sans text-[1.75rem] font-semibold leading-none text-olive-900">
                  ₹{size.price}
                </span>
                <span className="text-sm text-text-mute">/ {size.label}</span>
              </div>

              {/* size */}
              <fieldset className="mt-6">
                <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-text-mute">
                  Size
                </legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {product.sizes.map((s, i) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => { setSizeIdx(i); setAdded(false) }}
                      aria-pressed={i === sizeIdx}
                      className={`rounded-[var(--radius-sm)] border px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
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
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-pill border border-line bg-paper">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-11 w-11 place-items-center text-olive-800 hover:text-olive-950 disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-olive-900">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="grid h-11 w-11 place-items-center text-olive-800 hover:text-olive-950 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setAdded(true)}
                  className="btn btn-primary min-w-[13rem] flex-1"
                >
                  {added ? <>Added to cart <Check size={16} strokeWidth={2.5} /></> : <>Add to cart — ₹{total}</>}
                </button>
              </div>

              {/* highlights */}
              <ul className="mt-7 grid gap-2.5 border-t border-line pt-6 sm:grid-cols-2">
                {HIGHLIGHTS.map((h) => (
                  <li key={h} className="flex items-center gap-2.5 text-sm text-text-soft">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-olive-100 text-olive-800">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>

              {/* delivery */}
              <ul className="mt-6 space-y-2 rounded-[var(--radius-md)] bg-paper-2 p-4">
                {DELIVERY.map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-xs leading-relaxed text-text-mute">
                    <Icon size={15} className="mt-0.5 shrink-0 text-olive-700" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* details */}
          <div className="mt-[clamp(3rem,7vw,5rem)] grid gap-x-16 gap-y-10 border-t border-line pt-[clamp(2.5rem,5vw,3.5rem)] lg:grid-cols-2">
            <div>
              <h2 className="font-display font-medium text-olive-900" style={{ fontSize: '1.5rem' }}>
                About this oil
              </h2>
              <div className="mt-4 space-y-4 leading-[1.75] text-text-soft"
                   style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.15vw, 1.02rem)' }}>
                {product.description.map((para) => <p key={para}>{para}</p>)}
              </div>
            </div>

            <div>
              <h2 className="font-display font-medium text-olive-900" style={{ fontSize: '1.5rem' }}>
                Details
              </h2>
              <dl className="mt-4 divide-y divide-line">
                {product.specs.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-text-mute">{label}</dt>
                    <dd className="text-right font-medium text-olive-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* related */}
          <div className="mt-[clamp(3rem,7vw,5rem)] border-t border-line pt-[clamp(2.5rem,5vw,3.5rem)]">
            <h2 className="font-display font-medium text-olive-900" style={{ fontSize: '1.5rem' }}>
              More from Samaha
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to={`/shop/${o.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-line bg-paper transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="relative grid place-items-center overflow-hidden" style={{ background: o.tint, aspectRatio: '1 / 1' }}>
                    <img
                      src={o.images[0]}
                      alt={o.name}
                      onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                      className="h-[78%] w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3">
                    <span className="font-display text-sm font-medium text-olive-900 sm:text-base">{o.name}</span>
                    <span className="text-xs text-text-mute">from ₹{fromPrice(o)}</span>
                  </div>
                </Link>
              ))}
              <Link
                to="/shop"
                className="hidden items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-olive-300 p-3 text-sm font-medium text-olive-800 transition-colors hover:bg-paper-2 sm:flex"
              >
                All oils <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
