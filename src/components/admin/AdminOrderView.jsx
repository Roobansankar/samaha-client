import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileDown, Loader2, BadgeCheck, X, Banknote } from 'lucide-react'
import { StatusBadge } from './ui'
import { fetchOrder, markOrderPaid } from './auth'
import { enrichItems, downloadOrderInvoice, orderStatusLabel } from '../../lib/orderInvoice'
import { useProducts } from '../../context/ProductsContext'

const inr = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

export default function AdminOrderView() {
  const { id } = useParams()
  const { getVariant } = useProducts()
  const [order, setOrder] = useState(null)
  const [err, setErr] = useState('')
  const [marking, setMarking] = useState(false)
  const [markError, setMarkError] = useState('')
  const [showPaidModal, setShowPaidModal] = useState(false)

  useEffect(() => {
    let alive = true
    fetchOrder(id)
      .then((d) => { if (alive) setOrder(d) })
      .catch((e) => { if (alive) setErr(e.message || 'Could not load this order.') })
    return () => { alive = false }
  }, [id])

  // Escape closes the confirm popup
  useEffect(() => {
    if (!showPaidModal) return
    const onKey = (e) => { if (e.key === 'Escape') setShowPaidModal(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showPaidModal])

  const markPaid = async () => {
    setMarking(true)
    setMarkError('')
    try {
      const updated = await markOrderPaid(id)
      setOrder(updated)
      setShowPaidModal(false)
    } catch (e) {
      setMarkError(e.message || 'Could not mark this order as paid.')
    } finally {
      setMarking(false)
    }
  }

  if (err) {
    return (
      <div>
        <Link to="/admin/orders" className="a-btn a-btn-sm"><ArrowLeft size={14} /> Orders</Link>
        <p className="mt-8 text-center text-red-600">{err}</p>
      </div>
    )
  }
  if (!order) {
    return <div className="grid place-items-center py-24"><Loader2 size={20} className="animate-spin a-mute" /></div>
  }

  const items = enrichItems(order.items, getVariant)
  const subtotal = order.subtotal ?? items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = order.shipping ?? 0
  const total = order.total ?? subtotal + shipping

  return (
    <div>
      {/* header */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link to="/admin/orders" className="a-iconbtn a-iconbtn--box border" aria-label="Back to orders">
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-[1.3rem] font-semibold tracking-tight">
            {order.order_number != null ? `Order ${order.order_number}` : 'Unconfirmed checkout'}
          </h1>
          <p className="a-mute text-[0.78rem]">{fmtDateTime(order.placed_at)}</p>
        </div>
        <StatusBadge status={orderStatusLabel(order.status, order.payment_method)} />
        {order.payment_method === 'cod' && order.status === 'confirmed' && (
          <button className="a-btn a-btn-sm a-btn-primary" onClick={() => { setMarkError(''); setShowPaidModal(true) }}>
            <BadgeCheck size={14} /> Mark as paid
          </button>
        )}
        {order.status === 'paid' && (
          <button className="a-btn a-btn-sm a-btn-primary" onClick={() => downloadOrderInvoice(order, getVariant)}>
            <FileDown size={14} /> Download PDF
          </button>
        )}
      </div>

      {markError && (
        <p className="mb-5 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{markError}</p>
      )}

      {order.status !== 'paid' && (
        <p className="mb-5 rounded-lg border px-3.5 py-2.5 text-sm" style={{ borderColor: 'var(--a-border-strong)', background: 'var(--a-surface-2)', color: 'var(--a-text-dim)' }}>
          {order.status === 'confirmed'
            ? 'Cash on Delivery — the customer pays when the order arrives. No payment has been collected yet; use "Mark as paid" once it has.'
            : order.status === 'cancelled'
              ? 'The customer closed the payment window before paying. No payment was collected.'
              : order.status === 'failed'
                ? 'The payment attempt did not go through. No payment was collected.'
                : 'This order was created but never confirmed as paid — the customer may still be checking out, or left without completing payment.'}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* items + totals */}
        <div className="space-y-5">
          <Card title={`Items (${order.item_count})`}>
            <ul className="space-y-3.5">
              {items.map((i, idx) => (
                <li key={idx} className="flex gap-3">
                  {i.image ? (
                    <img
                      src={i.image}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-lg border object-contain"
                      style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface-2)' }}
                    />
                  ) : (
                    <span
                      className="h-16 w-16 shrink-0 rounded-lg border"
                      style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface-3)' }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9rem] font-medium leading-snug">{i.display}</p>
                    {i.size && <p className="a-mute text-[0.78rem]">{i.size}</p>}
                    <p className="a-dim text-[0.82rem] mt-0.5">{inr(i.price)} × {i.qty}</p>
                  </div>
                  <p className="a-mono a-dim shrink-0 text-[0.85rem]">{inr(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1.5 border-t pt-4 text-[0.88rem]" style={{ borderColor: 'var(--a-border)' }}>
              <Row k="Subtotal" v={inr(subtotal)} />
              <Row k="Shipping" v={inr(shipping)} />
              <div className="flex items-center justify-between pt-1.5 text-[1.05rem] font-semibold">
                <span>Total</span>
                <span className="a-mono">{inr(total)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* customer / address / payment */}
        <div className="space-y-5">
          <Card title="Customer">
            <p className="font-medium">{order.customer}</p>
            {order.email && <p className="a-dim text-[0.85rem]">{order.email}</p>}
            {order.phone && <p className="a-dim text-[0.85rem]">{order.phone}</p>}
          </Card>

          <Card title="Shipping address">
            <p className="a-dim text-[0.88rem] leading-relaxed whitespace-pre-wrap">{order.address || '—'}</p>
          </Card>
        </div>
      </div>

      {/* Custom confirm popup */}
      {showPaidModal && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Mark order as paid"
          onClick={() => !marking && setShowPaidModal(false)}
        >
          <div
            className="a-card w-full max-w-md p-6"
            style={{ borderRadius: 'var(--a-radius-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                style={{ background: 'var(--a-accent-soft)', color: 'var(--a-text)' }}
              >
                <Banknote size={18} />
              </span>
              <button className="a-iconbtn" aria-label="Close" onClick={() => !marking && setShowPaidModal(false)}>
                <X size={16} />
              </button>
            </div>

            <h2 className="mt-3 text-[1.05rem] font-semibold tracking-tight">
              Mark {order.order_number != null ? `Order ${order.order_number}` : 'this order'} as paid?
            </h2>
            <p className="a-dim mt-1.5 text-[0.85rem] leading-relaxed">
              Confirm cash of <span className="font-semibold a-mono" style={{ color: 'var(--a-text)' }}>{inr(total)}</span>
              {order.customer ? <> from <span className="font-medium" style={{ color: 'var(--a-text)' }}>{order.customer}</span></> : null} has
              actually been collected. This will count toward revenue.
            </p>

            {markError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[0.82rem] text-red-700">{markError}</p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button className="a-btn a-btn-sm" disabled={marking} onClick={() => setShowPaidModal(false)}>
                Cancel
              </button>
              <button className="a-btn a-btn-sm a-btn-primary" disabled={marking} onClick={markPaid}>
                {marking ? <Loader2 size={14} className="animate-spin" /> : <BadgeCheck size={14} />}
                {marking ? 'Marking…' : 'Yes, cash collected'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Card({ title, children }) {
  return (
    <div className="a-card" style={{ borderRadius: 'var(--a-radius-lg)' }}>
      <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--a-border)' }}>
        <h2 className="text-[0.95rem] font-semibold">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between">
      <span className="a-dim">{k}</span>
      <span className="a-mono a-dim">{v}</span>
    </div>
  )
}
