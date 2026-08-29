import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight, Minus, Plus, Trash2, ArrowRight,
  Tag, ShieldCheck, Truck, ShoppingBag,
} from 'lucide-react'
import { getProduct } from '../data/products'

const PAD = 'px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]'
const FREE_SHIP = 5000
const SHIP_FEE = 60

const INITIAL = [
  { id: 'coconut-oil::1', slug: 'coconut-oil', sizeIdx: 1, qty: 1 },
  { id: 'groundnut-oil::1', slug: 'groundnut-oil', sizeIdx: 1, qty: 1 },
]

const money = (n) => `₹${n.toLocaleString('en-IN')}`

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-mute">
      <Link to="/" className="transition-colors hover:text-olive-800">Home</Link>
      <ChevronRight size={14} className="text-text-mute/60" />
      <span className="font-medium text-olive-900">Cart</span>
    </nav>
  )
}

export default function CartPage() {
  const [items, setItems] = useState(INITIAL)
  const [promo, setPromo] = useState('')

  const setQty = (id, delta) =>
    setItems((list) =>
      list.map((it) => (it.id === id ? { ...it, qty: Math.max(1, Math.min(99, it.qty + delta)) } : it)),
    )
  const remove = (id) => setItems((list) => list.filter((it) => it.id !== id))

  const lines = items
    .map((it) => {
      const product = getProduct(it.slug)
      if (!product) return null
      const size = product.sizes[it.sizeIdx]
      return { ...it, product, size, lineTotal: size.price * it.qty }
    })
    .filter(Boolean)

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP ? 0 : SHIP_FEE
  const total = subtotal + shipping
  const toFree = Math.max(0, FREE_SHIP - subtotal)

  /* ---------- empty ---------- */
  if (lines.length === 0) {
    return (
      <div className="bg-paper">
        <div className={`${PAD} py-[clamp(2.5rem,6vw,4rem)]`}>
          <div className="mx-auto max-w-[1120px]">
            <Breadcrumb />
            <div className="mt-14 flex flex-col items-center pb-10 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-paper-2 text-olive-700">
                <ShoppingBag size={26} strokeWidth={1.6} />
              </span>
              <h1 className="mt-6 font-display font-medium text-olive-900" style={{ fontSize: 'clamp(1.6rem, 1.2rem + 2vw, 2.4rem)' }}>
                Your cart is empty
              </h1>
              <p className="mt-3 max-w-[38ch] text-text-soft">
                Nothing here yet — the oils are one press away.
              </p>
              <Link to="/shop" className="btn btn-primary mt-8">
                Browse the shop <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- cart ---------- */
  return (
    <div className="bg-paper">
      <div className={`${PAD} py-[clamp(2rem,5vw,3.5rem)]`}>
        <div className="mx-auto max-w-[1120px]">
          <Breadcrumb />

          <h1 className="mt-5 font-display font-medium text-olive-900" style={{ fontSize: 'clamp(1.9rem, 1.4rem + 2vw, 2.8rem)' }}>
            Your cart
            <span className="ml-3 align-middle text-base font-normal text-text-mute">
              {count} {count === 1 ? 'item' : 'items'}
            </span>
          </h1>

          <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_360px]">

            {/* items */}
            <div>
              <ul className="border-t border-line">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-4 border-b border-line py-5">
                    <Link to={`/shop/${l.slug}`} className="shrink-0" aria-label={l.product.name}>
                      <div
                        className="relative h-24 w-24 overflow-hidden rounded-[var(--radius-md)] border border-line sm:h-28 sm:w-28"
                        style={{ background: l.product.tint }}
                      >
                        <img
                          src={l.product.images[0]}
                          alt={l.product.name}
                          onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                          className="absolute inset-0 h-full w-full object-contain p-3"
                        />
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to={`/shop/${l.slug}`} className="font-display text-lg font-medium text-olive-900 transition-colors hover:text-olive-700">
                            {l.product.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-text-mute">
                            {l.size.label} · {money(l.size.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(l.id)}
                          aria-label={`Remove ${l.product.name}`}
                          className="text-text-mute transition-colors hover:text-clay-600 cursor-pointer"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex items-center rounded-pill border border-line">
                          <button
                            type="button"
                            onClick={() => setQty(l.id, -1)}
                            disabled={l.qty <= 1}
                            aria-label="Decrease quantity"
                            className="grid h-9 w-9 place-items-center text-olive-800 transition-colors hover:text-olive-950 disabled:opacity-30 cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold text-olive-900">{l.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(l.id, 1)}
                            aria-label="Increase quantity"
                            className="grid h-9 w-9 place-items-center text-olive-800 transition-colors hover:text-olive-950 cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-sans font-semibold text-olive-900">{money(l.lineTotal)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <Link to="/shop" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-olive-700 transition-colors hover:text-olive-900">
                <ChevronRight size={14} className="rotate-180" /> Continue shopping
              </Link>
            </div>

            {/* summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[var(--radius-lg)] border border-line bg-paper-2 p-6">
                <h2 className="font-display text-lg font-medium text-olive-900">Order summary</h2>

                {toFree > 0 ? (
                  <p className="mt-4 rounded-[var(--radius-md)] bg-paper px-3.5 py-2.5 text-xs leading-relaxed text-text-soft">
                    Add <span className="font-semibold text-olive-900">{money(toFree)}</span> more for free shipping.
                  </p>
                ) : (
                  <p className="mt-4 flex items-center gap-2 rounded-[var(--radius-md)] bg-paper px-3.5 py-2.5 text-xs font-medium text-olive-800">
                    <Truck size={14} /> You&rsquo;ve unlocked free shipping.
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-mute" />
                    <input
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="Promo code"
                      className="w-full rounded-pill border border-line bg-paper py-2.5 pl-10 pr-3 text-sm text-olive-900 outline-none transition placeholder:text-text-mute/70 focus:border-olive-500"
                    />
                  </div>
                  <button
                    type="button"
                    className="rounded-pill bg-olive-900 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-olive-800 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-text-mute">Subtotal</dt>
                    <dd className="font-medium text-olive-900">{money(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-mute">Shipping</dt>
                    <dd className="font-medium text-olive-900">{shipping === 0 ? 'Free' : money(shipping)}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                  <span className="font-display text-lg font-medium text-olive-900">Total</span>
                  <span className="font-sans text-xl font-semibold text-olive-900">{money(total)}</span>
                </div>

                <button type="button" className="btn btn-primary mt-5 w-full">
                  Checkout <ArrowRight size={16} strokeWidth={2} />
                </button>

                <ul className="mt-4 space-y-1.5 text-xs text-text-mute">
                  <li className="flex items-center gap-2"><ShieldCheck size={13} className="text-olive-700" /> Secure checkout</li>
                  <li className="flex items-center gap-2"><Truck size={13} className="text-olive-700" /> Dispatched within 2 working days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
