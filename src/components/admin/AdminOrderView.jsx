import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileDown, Loader2 } from 'lucide-react'
import { StatusBadge } from './ui'
import { fetchOrder } from './auth'
import { enrichItems, downloadOrderInvoice } from '../../lib/orderInvoice'

const inr = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
const badgeFor = (s) => (s === 'created' ? 'Pending' : s === 'paid' ? 'Paid' : 'Failed')

export default function AdminOrderView() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    fetchOrder(id)
      .then((d) => { if (alive) setOrder(d) })
      .catch((e) => { if (alive) setErr(e.message || 'Could not load this order.') })
    return () => { alive = false }
  }, [id])

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

  const items = enrichItems(order.items)
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
          <h1 className="text-[1.3rem] font-semibold tracking-tight">Order #{order.id}</h1>
          <p className="a-mute text-[0.78rem]">{fmtDateTime(order.placed_at)}</p>
        </div>
        <StatusBadge status={badgeFor(order.status)} />
        <button className="a-btn a-btn-sm a-btn-primary" onClick={() => downloadOrderInvoice(order)}>
          <FileDown size={14} /> Download PDF
        </button>
      </div>

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
