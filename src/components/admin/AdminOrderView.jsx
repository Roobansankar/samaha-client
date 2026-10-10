import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileDown, Loader2, X, Truck, PackageCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { StatusBadge } from './ui'
import { fetchOrder, updateOrderDeliveryStatus } from './auth'
import {
  enrichItems,
  downloadOrderInvoice,
  orderInvoiceBlob,
  asDelivered,
  invoiceFilename,
  orderStatusLabel,
  deliveryStatusLabel,
  isDeliverableOrder,
  nextDeliveryStep,
} from '../../lib/orderInvoice'
import { useProducts } from '../../context/ProductsContext'

const inr = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

export default function AdminOrderView() {
  const { id } = useParams()
  const { getVariant } = useProducts()
  const [order, setOrder] = useState(null)
  const [err, setErr] = useState('')
  const [deliveryStep, setDeliveryStep] = useState(null) // the step awaiting confirmation
  const [updatingDelivery, setUpdatingDelivery] = useState(false)

  useEffect(() => {
    let alive = true
    fetchOrder(id)
      .then((d) => { if (alive) setOrder(d) })
      .catch((e) => { if (alive) setErr(e.message || 'Could not load this order.') })
    return () => { alive = false }
  }, [id])

  // The backend is the source of truth: the badge only changes from its response. On failure,
  // re-fetch so the page reflects whatever the order's real delivery status is now.
  const advanceDelivery = async () => {
    setUpdatingDelivery(true)
    // "Delivered" sends the customer this order's invoice on WhatsApp — the same PDF as the
    // Download PDF button, drawn as the order will be once delivered (a COD order shows as
    // paid). If it can't be built, stop here: nothing has been changed yet.
    let invoice = null
    if (deliveryStep.status === 'delivered') {
      try {
        invoice = await orderInvoiceBlob(asDelivered(order), getVariant)
      } catch {
        toast.error('Could not generate the invoice, so the order was not updated. Please try again.')
        setUpdatingDelivery(false)
        return
      }
    }
    try {
      const updated = await updateOrderDeliveryStatus(id, deliveryStep.status, invoice, invoiceFilename(order))
      setOrder(updated)
      setDeliveryStep(null)
      toast.success(`Order marked as ${deliveryStatusLabel(updated.delivery_status).toLowerCase()}`)
    } catch (e) {
      toast.error(e.message || 'Could not update the delivery status.')
      setDeliveryStep(null)
      fetchOrder(id).then(setOrder).catch(() => {})
    } finally {
      setUpdatingDelivery(false)
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
  const deliverable = isDeliverableOrder(order)
  const nextStep = deliverable ? nextDeliveryStep(order.delivery_status) : null
  const orderName = order.order_number != null ? `Order ${order.order_number}` : 'this order'

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
        {deliverable && (
          <span className="flex items-center gap-1.5" title="Delivery status">
            <span className="a-mute text-[0.75rem]">Delivery</span>
            <StatusBadge status={deliveryStatusLabel(order.delivery_status)} />
          </span>
        )}
        {nextStep && (
          <button className="a-btn a-btn-sm" disabled={updatingDelivery} onClick={() => setDeliveryStep(nextStep)}>
            {nextStep.status === 'delivered' ? <PackageCheck size={14} /> : <Truck size={14} />} {nextStep.label}
          </button>
        )}
        {order.status === 'paid' && (
          <button className="a-btn a-btn-sm a-btn-primary" onClick={() => downloadOrderInvoice(order, getVariant)}>
            <FileDown size={14} /> Download PDF
          </button>
        )}
      </div>

      {order.status !== 'paid' && (
        <p className="mb-5 rounded-lg border px-3.5 py-2.5 text-sm" style={{ borderColor: 'var(--a-border-strong)', background: 'var(--a-surface-2)', color: 'var(--a-text-dim)' }}>
          {order.status === 'confirmed'
            ? 'Cash on Delivery — the customer pays when the order arrives. No payment has been collected yet; it\'s registered as paid when the order is marked delivered.'
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
      {deliveryStep && (
        <ConfirmDialog
          label={deliveryStep.label}
          icon={deliveryStep.status === 'delivered' ? <PackageCheck size={18} /> : <Truck size={18} />}
          title={`Mark ${orderName} as ${deliveryStatusLabel(deliveryStep.status).toLowerCase()}?`}
          busy={updatingDelivery}
          confirmIcon={deliveryStep.status === 'delivered' ? <PackageCheck size={14} /> : <Truck size={14} />}
          confirmLabel={`Yes, ${deliveryStatusLabel(deliveryStep.status).toLowerCase()}`}
          busyLabel="Updating…"
          onCancel={() => setDeliveryStep(null)}
          onConfirm={advanceDelivery}
        >
          {deliveryStep.status === 'dispatched' && 'Confirm the parcel has left with the courier. '}
          {deliveryStep.status === 'out_for_delivery' && 'Confirm the parcel is out with the courier for delivery today. '}
          {deliveryStep.status === 'delivered' && 'Confirm the parcel has reached the customer. '}
          {deliveryStep.status === 'delivered' && order.payment_method === 'cod' && order.status === 'confirmed' && (
            <>This also registers the Cash on Delivery payment of <span className="font-semibold a-mono" style={{ color: 'var(--a-text)' }}>{inr(total)}</span> as
            collected, and it will count toward revenue. </>
          )}
          {order.phone
            ? <>{order.customer || 'The customer'} will get a WhatsApp update{deliveryStep.status === 'delivered' ? ' with their invoice' : ''} on <span className="a-mono" style={{ color: 'var(--a-text)' }}>{order.phone}</span>. </>
            : 'There’s no phone number on this order, so no WhatsApp update will be sent. '}
          This can’t be undone.
        </ConfirmDialog>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function ConfirmDialog({ label, icon, title, children, error, busy, confirmIcon, confirmLabel, busyLabel, onCancel, onConfirm }) {
  // Escape closes the popup (not mid-request)
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={() => !busy && onCancel()}
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
            {icon}
          </span>
          <button className="a-iconbtn" aria-label="Close" onClick={() => !busy && onCancel()}>
            <X size={16} />
          </button>
        </div>

        <h2 className="mt-3 text-[1.05rem] font-semibold tracking-tight">{title}</h2>
        <p className="a-dim mt-1.5 text-[0.85rem] leading-relaxed">{children}</p>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[0.82rem] text-red-700">{error}</p>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button className="a-btn a-btn-sm" disabled={busy} onClick={onCancel}>
            Cancel
          </button>
          <button className="a-btn a-btn-sm a-btn-primary" disabled={busy} onClick={onConfirm}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : confirmIcon}
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

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
