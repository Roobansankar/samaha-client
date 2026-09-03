import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ChevronRight, Loader2, ShieldCheck, Lock } from 'lucide-react'
import { useCart, clearCart } from '../lib/cart'
import { useAccount, fetchAddresses } from '../lib/account'
import { loadRazorpay, createOrder, verifyPayment } from '../lib/checkout'

const PAD = 'px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]'
const money = (n) =>
  `₹${(Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const inp =
  'w-full rounded-lg border border-olive-900/10 bg-white px-3.5 py-2.5 text-sm text-olive-900 outline-none transition focus:border-olive-700 focus:ring-4 focus:ring-olive-800/5'

const fmtAddress = (a) => [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(', ')

export default function CheckoutPage() {
  const account = useAccount()
  const navigate = useNavigate()
  const { items, subtotal, savings } = useCart()

  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState({
    name: account?.name || '',
    email: account?.email || '',
    phone: account?.phone || '',
    address: '',
  })
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

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

  if (items.length === 0) return <Navigate to="/cart" replace />

  const total = subtotal
  const ready = form.name.trim() && /\S+@\S+/.test(form.email) && form.address.trim().length > 8

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const pay = async () => {
    setError('')
    setPaying(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Could not load the payment gateway. Check your connection.')

      const order = await createOrder({
        items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      })

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
            await verifyPayment({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            })
            clearCart()
            navigate(`/checkout/success?order=${order.order_id}`, { replace: true })
          } catch (err) {
            setError(err.message || 'We couldn’t confirm your payment.')
            setPaying(false)
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      })
      rzp.on('payment.failed', (r) => {
        setError(r?.error?.description || 'The payment failed. Please try again.')
        setPaying(false)
      })
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

                <button
                  type="button"
                  onClick={pay}
                  disabled={!ready || paying}
                  className="btn btn-primary mt-5 w-full disabled:opacity-60"
                >
                  {paying ? <Loader2 size={16} className="animate-spin" /> : <><Lock size={15} /> Pay {money(total)}</>}
                </button>

                <ul className="mt-4 space-y-1.5 text-xs text-text-mute">
                  <li className="flex items-center gap-2"><ShieldCheck size={13} className="text-olive-700" /> Secured by Razorpay</li>
                  <li className="flex items-center gap-2"><Lock size={13} className="text-olive-700" /> Test mode — no real charge</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
