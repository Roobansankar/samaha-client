import { Link } from 'react-router-dom'
import {
  ChevronRight, Minus, Plus, Trash2, ArrowRight,
  ShieldCheck, Truck, ShoppingBag,
} from 'lucide-react'
import { useCart } from '../lib/cart'

const PAD = 'px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]'

const money = (n) =>
  `₹${(Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

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
  const { items, count, subtotal, savings, setQty, remove } = useCart()

  const shipping = 0
  const total = subtotal + shipping

  /* ---------- empty ---------- */
  if (items.length === 0) {
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
                {items.map(({ slug, qty, product }) => (
                  <li key={slug} className="flex gap-4 border-b border-line py-5">
                    <Link to={`/shop/${slug}`} className="shrink-0" aria-label={product.name}>
                      <div
                        className="relative h-24 w-24 overflow-hidden rounded-[var(--radius-md)] border border-line sm:h-28 sm:w-28"
                        style={{ background: product.tint }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                          className="absolute inset-0 h-full w-full object-contain p-3"
                        />
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to={`/shop/${slug}`} className="text-sm font-semibold leading-snug text-olive-900 transition-colors hover:text-olive-700 sm:text-[0.95rem]">
                            {product.name}
                          </Link>
                          <p className="mt-1 text-xs text-text-mute">
                            {money(product.price)}{' '}
                            <span className="line-through">{money(product.mrp)}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(slug)}
                          aria-label={`Remove ${product.name}`}
                          className="text-text-mute transition-colors hover:text-clay-600 cursor-pointer"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex items-center rounded-pill border border-line">
                          <button
                            type="button"
                            onClick={() => setQty(slug, qty - 1)}
                            aria-label="Decrease quantity"
                            className="grid h-9 w-9 place-items-center text-olive-800 transition-colors hover:text-olive-950 cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold text-olive-900">{qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(slug, qty + 1)}
                            aria-label="Increase quantity"
                            className="grid h-9 w-9 place-items-center text-olive-800 transition-colors hover:text-olive-950 cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-sans font-semibold text-olive-900">{money(product.price * qty)}</span>
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

                <p className="mt-4 flex items-center gap-2 rounded-[var(--radius-md)] bg-paper px-3.5 py-2.5 text-xs font-medium text-olive-800">
                  <Truck size={14} /> Free shipping on every order.
                </p>

                <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-text-mute">Subtotal</dt>
                    <dd className="font-medium text-olive-900">{money(subtotal)}</dd>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-clay-600">
                      <dt>You save</dt>
                      <dd className="font-medium">− {money(savings)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-text-mute">Shipping</dt>
                    <dd className="font-medium text-olive-900">{money(shipping)}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                  <span className="font-display text-lg font-medium text-olive-900">Total</span>
                  <span className="font-sans text-xl font-semibold text-olive-900">{money(total)}</span>
                </div>

                <Link to="/checkout" className="btn btn-primary mt-5 w-full">
                  Checkout <ArrowRight size={16} strokeWidth={2} />
                </Link>

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
