import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ChevronRight, Loader2, ShieldCheck, Lock, CheckCircle2, X, Banknote } from 'lucide-react'
import { useCart, clearCart } from '../lib/cart'
import { useProducts } from '../context/ProductsContext'
import { useAccount, fetchAddresses } from '../lib/account'
import { loadRazorpay, createOrder, verifyPayment, abandonOrder, placeCodOrder } from '../lib/checkout'
import { trackBeginCheckout, trackAddPaymentInfo, trackPurchase } from '../lib/analytics'

const PAD = 'px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]'
const money = (n) =>
  `₹${(Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const inp =
  'w-full rounded-lg border border-olive-900/10 bg-white px-3.5 py-2.5 text-sm text-olive-900 outline-none transition focus:border-olive-700 focus:ring-4 focus:ring-olive-800/5'

const fmtAddress = (a) => [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(', ')

function OrderPlacedModal({ orderId, codDue, onClose }) {
  useEffect(() => {
    document.body.classList.add('no-scroll')
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-olive-950/55 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Order placed successfully"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[26rem] rounded-[var(--radius-lg)] bg-paper p-8 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-text-mute transition-colors hover:bg-paper-inset hover:text-olive-900 cursor-pointer"
        >
          <X size={18} />
        </button>

        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-olive-100 text-olive-800">
          <CheckCircle2 size={30} strokeWidth={1.8} />
        </span>

        <h2
          className="mt-5 font-display font-medium text-olive-900"
          style={{ fontSize: 'clamp(1.3rem, 1.1rem + 1vw, 1.6rem)' }}
        >
          Order placed successfully
        </h2>

        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-text-mute">Invoice no.</p>
        <p className="mt-0.5 font-mono text-lg font-semibold text-olive-900">{orderId}</p>

        <p className="mt-4 text-sm leading-relaxed text-text-soft">
          Thank you for your order. We’ll press, pack and dispatch it within two working days.
        </p>

        {codDue > 0 && (
          <p className="mt-3 rounded-lg bg-paper-2 px-3 py-2.5 text-sm font-medium text-olive-900">
            Please keep {money(codDue)} ready in cash for the delivery.
          </p>
        )}

        <button type="button" onClick={onClose} className="btn btn-primary mt-6 w-full">
          Close
        </button>
      </div>
    </div>,
    document.body,
  )
}

export default function CheckoutPage() {
  const account = useAccount()
  const navigate = useNavigate()
  const { getVariant, loading: productsLoading } = useProducts()
  const { items, subtotal, savings } = useCart(getVariant)

  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState({
    name: account?.name || '',
    email: account?.email || '',
    phone: account?.phone || '',
    address: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('online') // 'online' | 'cod'
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(null) // { orderId, codDue } once the order is confirmed

  // funnel: the signed-in visitor reached checkout with items (fires once)
  const startedRef = useRef(false)
  useEffect(() => {
    if (startedRef.current || !account || items.length === 0) return
    startedRef.current = true
    trackBeginCheckout(items)
  }, [account, items])

  useEffect(() => {
    if (!account) return
    fetchAddresses()
      .then((list) => {
        setAddresses(list)
        const d = list.find((a) => a.is_default) || list[0]
        if (d) {
          setForm((f) => ({
            ...f,
            address: f.address || fmtAddress(d),
            phone: f.phone || d.phone || '',
            name: f.name || d.name || '',
          }))
        }
      })
      .catch(() => {})
  }, [account])

  if (!account) return <Navigate to="/account?redirect=/checkout" replace />
  // on a fresh page load (e.g. a bookmark or refresh) the catalogue hasn't loaded yet, so a
  // real cart briefly looks empty (getVariant can't resolve anything) — wait for it rather
  // than bouncing a customer with real items in their cart off to /cart
  if (productsLoading) {
    return (
      <div className="grid min-h-[50svh] place-items-center bg-paper">
        <Loader2 size={22} className="animate-spin text-olive-700" />
      </div>
    )
  }
  // once an order is placed the cart is cleared on purpose — don't bounce back to /cart for that
  if (items.length === 0 && !orderPlaced) return <Navigate to="/cart" replace />

  const total = subtotal
  const ready = form.name.trim() && /\S+@\S+/.test(form.email) && form.address.trim().length > 8

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const placeOrder = { name: form.name, email: form.email, phone: form.phone, address: form.address }

  const payCod = async () => {
    setError('')
    setPaying(true)
    try {
      const result = await placeCodOrder({
        items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        ...placeOrder,
      })
      // real, confirmed order data — no gateway round-trip for COD, it's placed the moment this returns
      trackPurchase({ orderId: result.order.id, value: result.order.total, cartRows: items })
      setOrderPlaced({ orderId: result.order.order_number, codDue: result.order.total })
      setPaying(false)
      clearCart()
    } catch (err) {
      setError(err.message || 'Could not place the order.')
      setPaying(false)
    }
  }

  const pay = async () => {
    if (paymentMethod === 'cod') return payCod()

    setError('')
    setPaying(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Could not load the payment gateway. Check your connection.')

      const order = await createOrder({
        items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        ...placeOrder,
      })

      // tracks whether the attempt already ended one way or another, so a stray
      // ondismiss/payment.failed after a real success or failure can't double-report it
      let settled = false

      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Samaha',
        description: 'Cold-pressed oils',
        order_id: order.razorpay_order_id,
        prefill: order.prefill,
        theme: { color: '#243d1e' },
        handler: async (resp) => {
          try {
            const verified = await verifyPayment({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            })
            settled = true
            // real, confirmed order data only — ids, quantities and the verified total
            trackPurchase({ orderId: order.order_id, value: order.amount / 100, cartRows: items })
            // show the confirmation BEFORE clearing the cart: setting this first means the
            // empty-cart guard above never gets a render where the cart is empty but no order
            // has been recorded yet, so it can't race the confirmation and bounce to /cart
            // — the invoice number is only assigned once payment is actually verified, so it
            // comes from THIS response, not the pre-payment order created before "Pay" was clicked
            setOrderPlaced({ orderId: verified.order?.order_number ?? order.order_id, codDue: 0 })
            setPaying(false)
            clearCart()
          } catch (err) {
            settled = true
            setError(err.message || 'We couldn’t confirm your payment.')
            setPaying(false)
            // a real payment was attempted (we got this far) but couldn't be verified
            abandonOrder({ razorpay_order_id: order.razorpay_order_id, reason: 'failed' }).catch(() => {})
          }
        },
        modal: {
          // fires when the customer closes the popup without paying — never after a
          // successful payment, but `settled` guards against it anyway, belt and braces
          ondismiss: () => {
            setPaying(false)
            if (!settled) {
              settled = true
              abandonOrder({ razorpay_order_id: order.razorpay_order_id, reason: 'cancelled' }).catch(() => {})
            }
          },
        },
      })
      rzp.on('payment.failed', (r) => {
        setError(r?.error?.description || 'The payment failed. Please try again.')
        setPaying(false)
        if (!settled) {
          settled = true
          abandonOrder({ razorpay_order_id: order.razorpay_order_id, reason: 'failed' }).catch(() => {})
        }
      })
      trackAddPaymentInfo(items)
      rzp.open()
    } catch (err) {
      setError(err.message || 'Something went wrong.')
      setPaying(false)
    }
  }

  return (
    <div className="bg-paper">
      <div className={`${PAD} py-[clamp(2rem,5vw,3.5rem)]`}>
        <div className="mx-auto max-w-[1120px]">

          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-mute">
            <Link to="/cart" className="transition-colors hover:text-olive-800">Cart</Link>
            <ChevronRight size={14} className="text-text-mute/60" />
            <span className="font-medium text-olive-900">Checkout</span>
          </nav>

          <h1 className="mt-5 font-display font-medium text-olive-900" style={{ fontSize: 'clamp(1.9rem, 1.4rem + 2vw, 2.8rem)' }}>
            Checkout
          </h1>

          {error && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_360px]">

            {/* details */}
            <div>
              <h2 className="font-display text-lg font-medium text-olive-900">Delivery details</h2>

              {addresses.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {addresses.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, address: fmtAddress(a), phone: a.phone || f.phone, name: a.name || f.name }))}
                      className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                        form.address === fmtAddress(a)
                          ? 'border-olive-800 bg-olive-900 text-paper'
                          : 'border-line bg-white text-olive-800 hover:border-olive-300'
                      }`}
                    >
                      <span className="font-semibold">{a.label || a.name}</span>
                      <span className={`mt-0.5 block ${form.address === fmtAddress(a) ? 'text-paper/70' : 'text-text-mute'}`}>
                        {fmtAddress(a).slice(0, 40)}…
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-olive-700/60">Full name</span>
                  <input className={inp} value={form.name} onChange={set('name')} required />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-olive-700/60">Email</span>
                  <input className={inp} type="email" value={form.email} onChange={set('email')} required />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-olive-700/60">Phone</span>
                  <input className={inp} value={form.phone} onChange={set('phone')} placeholder="+91 …" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-olive-700/60">Delivery address</span>
                  <textarea rows={3} className={`${inp} resize-none`} value={form.address} onChange={set('address')} required />
                </label>
              </div>
            </div>

            {/* summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[var(--radius-lg)] border border-line bg-paper-2 p-6">
                <h2 className="font-display text-lg font-medium text-olive-900">Order summary</h2>

                <ul className="mt-4 space-y-3 border-b border-line pb-4 text-sm">
                  {items.map(({ slug, qty, product }) => (
                    <li key={slug} className="flex justify-between gap-3">
                      <span className="text-text-soft">
                        {product.name} <span className="text-text-mute">× {qty}</span>
                      </span>
                      <span className="shrink-0 font-medium text-olive-900">{money(product.price * qty)}</span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 space-y-2.5 text-sm">
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
                    <dd className="font-medium text-olive-900">{money(0)}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                  <span className="font-display text-lg font-medium text-olive-900">Total</span>
                  <span className="font-sans text-xl font-semibold text-olive-900">{money(total)}</span>
                </div>

                <div className="mt-5 border-t border-line pt-5">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-olive-700/60">Payment method</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      aria-pressed={paymentMethod === 'online'}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                        paymentMethod === 'online'
                          ? 'border-olive-800 bg-olive-900 text-paper'
                          : 'border-line bg-white text-olive-800 hover:border-olive-300'
                      }`}
                    >
                      <Lock size={14} /> Pay online
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      aria-pressed={paymentMethod === 'cod'}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-olive-800 bg-olive-900 text-paper'
                          : 'border-line bg-white text-olive-800 hover:border-olive-300'
                      }`}
                    >
                      <Banknote size={14} /> Cash on delivery
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={pay}
                  disabled={!ready || paying}
                  className="btn btn-primary mt-5 w-full disabled:opacity-60"
                >
                  {paying ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : paymentMethod === 'cod' ? (
                    <>Place order — {money(total)}</>
                  ) : (
                    <><Lock size={15} /> Pay {money(total)}</>
                  )}
                </button>

                <ul className="mt-4 space-y-1.5 text-xs text-text-mute">
                  {paymentMethod === 'cod' ? (
                    <li className="flex items-center gap-2"><Banknote size={13} className="text-olive-700" /> Pay in cash when your order arrives</li>
                  ) : (
                    <>
                      <li className="flex items-center gap-2"><ShieldCheck size={13} className="text-olive-700" /> Secured by Razorpay</li>
                      <li className="flex items-center gap-2"><Lock size={13} className="text-olive-700" /> Test mode — no real charge</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {orderPlaced && (
        <OrderPlacedModal orderId={orderPlaced.orderId} codDue={orderPlaced.codDue} onClose={() => navigate('/profile')} />
      )}
    </div>
  )
}
