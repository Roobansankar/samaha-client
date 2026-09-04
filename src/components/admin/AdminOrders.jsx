import { useEffect, useMemo, useState } from 'react'
import { Search, RefreshCw, ListFilter, Loader2, X, FileDown, Eye } from 'lucide-react'
import { Panel, StatusBadge, EmptyRow, ResultCount, Pager } from './ui'
import { fetchOrders } from './auth'
import { enrichItems, downloadOrderInvoice } from '../../lib/orderInvoice'

const PER_PAGE = 10
const inr = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
const badgeFor = (s) => (s === 'created' ? 'Pending' : s === 'paid' ? 'Paid' : 'Failed')

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setOrders(await fetchOrders())
    } catch (e) {
      setError(e.message || 'Could not load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return orders.filter((o) => {
      const matchesQ =
        !needle ||
        String(o.id).includes(needle.replace('#', '')) ||
        (o.customer || '').toLowerCase().includes(needle) ||
        (o.email || '').toLowerCase().includes(needle) ||
        (o.payment_id || '').toLowerCase().includes(needle)
      const matchesS = status === 'all' || o.status === status
      return matchesQ && matchesS
    })
  }, [q, status, orders])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const reset = (fn) => (v) => { fn(v); setPage(1) }

  return (
    <>
      <Panel
        title="Orders"
        actions={
          <button className="a-btn a-btn-sm" onClick={load}>
            <RefreshCw size={14} /> Refresh
          </button>
        }
        toolbar={
          <>
            <select className="a-select a-select-sm sm:w-40" value={status} onChange={(e) => reset(setStatus)(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="created">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <span className="a-dim text-[0.8rem]">{orders.length} total</span>
            <div className="flex-1" />
            <div className="a-input-wrap w-full sm:w-64">
              <Search size={15} />
              <input
                className="a-input a-input-sm"
                placeholder="Search order / customer"
                value={q}
                onChange={(e) => reset(setQ)(e.target.value)}
              />
            </div>
            <button className="a-iconbtn a-iconbtn--box border shrink-0" aria-label="Sort">
              <ListFilter size={15} />
            </button>
          </>
        }
        footer={
          <>
            <ResultCount page={safePage} perPage={PER_PAGE} total={filtered.length} />
            <Pager page={safePage} pageCount={pageCount} onPage={setPage} />
          </>
        }
      >
        <table className="a-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Total</th>
              <th className="text-right">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="py-12 text-center a-mute"><Loader2 size={16} className="mx-auto animate-spin" /></td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={7} className="py-8 text-center text-red-600">{error}</td></tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <EmptyRow colSpan={7} label={q || status !== 'all' ? 'No orders match your filters' : 'No orders yet'} />
            )}
            {!loading && !error && rows.map((o) => {
              const items = enrichItems(o.items)
              return (
                <tr key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                  <td className="font-medium">#{o.id}</td>
                  <td className="a-dim whitespace-nowrap">{fmtDate(o.placed_at)}</td>
                  <td>
                    <p className="font-medium">{o.customer}</p>
                    <p className="text-[0.75rem] a-mute">{o.email}</p>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {items.slice(0, 3).map((i, idx) =>
                          i.image ? (
                            <img
                              key={idx}
                              src={i.image}
                              alt=""
                              className="h-8 w-8 rounded-md border-2 object-contain"
                              style={{ borderColor: 'var(--a-surface)', background: 'var(--a-surface-2)' }}
                            />
                          ) : (
                            <span
                              key={idx}
                              className="h-8 w-8 rounded-md border-2"
                              style={{ borderColor: 'var(--a-surface)', background: 'var(--a-surface-3)' }}
                            />
                          ),
                        )}
                      </div>
                      <span className="a-dim text-[0.8rem] whitespace-nowrap">
                        {o.item_count} {o.item_count === 1 ? 'unit' : 'units'}
                        {items.length > 3 && <span className="a-mute"> · +{items.length - 3}</span>}
                      </span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={badgeFor(o.status)} />
                    {o.payment_id && <p className="a-mono a-mute text-[0.68rem] mt-1">{o.payment_id}</p>}
                  </td>
                  <td className="a-mono a-dim whitespace-nowrap">{inr(o.total)}</td>
                  <td className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button className="a-iconbtn" title="View order" onClick={() => setSelected(o)}>
                        <Eye size={15} />
                      </button>
                      <button className="a-iconbtn" title="Download PDF invoice" onClick={() => downloadOrderInvoice(o)}>
                        <FileDown size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Panel>

      {selected && <OrderDrawer order={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

/* ------------------------------------------------------------------ */

function OrderDrawer({ order, onClose }) {
  const items = enrichItems(order.items)
  const subtotal = order.subtotal ?? items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = order.shipping ?? 0
  const total = order.total ?? subtotal + shipping

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="a-card flex h-full w-full max-w-md flex-col"
        style={{ borderRadius: 0, boxShadow: 'var(--a-shadow-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--a-border)' }}>
          <div>
            <h2 className="text-[1.05rem] font-semibold">Order #{order.id}</h2>
            <p className="a-mute text-[0.78rem]">{fmtDateTime(order.placed_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={badgeFor(order.status)} />
            <button className="a-iconbtn" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <Field label="Customer">
            <p className="font-medium">{order.customer}</p>
            {order.email && <p className="a-dim text-[0.82rem]">{order.email}</p>}
            {order.phone && <p className="a-dim text-[0.82rem]">{order.phone}</p>}
          </Field>

          <Field label="Shipping address">
            <p className="a-dim text-[0.85rem] leading-relaxed whitespace-pre-wrap">{order.address || '—'}</p>
          </Field>

          <Field label="Payment">
            <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1 text-[0.8rem]">
              <dt className="a-mute">Razorpay order</dt>
              <dd className="a-mono a-dim break-all">{order.razorpay_order_id || '—'}</dd>
              <dt className="a-mute">Payment ID</dt>
              <dd className="a-mono a-dim break-all">{order.payment_id || '—'}</dd>
            </dl>
          </Field>

          <Field label={`Items (${order.item_count})`}>
            <ul className="space-y-3">
              {items.map((i, idx) => (
                <li key={idx} className="flex gap-3">
                  {i.image ? (
                    <img
                      src={i.image}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-lg border object-contain"
                      style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface-2)' }}
                    />
                  ) : (
                    <span
                      className="h-14 w-14 shrink-0 rounded-lg border"
                      style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface-3)' }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.85rem] font-medium leading-snug">{i.display}</p>
                    {i.size && <p className="a-mute text-[0.75rem]">{i.size}</p>}
                    <p className="a-dim text-[0.8rem] mt-0.5">
                      {inr(i.price)} × {i.qty}
                    </p>
                  </div>
                  <p className="a-mono a-dim shrink-0 text-[0.82rem]">{inr(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>
          </Field>

          <div className="mt-4 space-y-1.5 border-t pt-4 text-[0.85rem]" style={{ borderColor: 'var(--a-border)' }}>
            <Row label="Subtotal" value={inr(subtotal)} />
            <Row label="Shipping" value={inr(shipping)} />
            <div className="flex items-center justify-between pt-1.5 text-[1rem] font-semibold">
              <span>Total</span>
              <span className="a-mono">{inr(total)}</span>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderTop: '1px solid var(--a-border)' }}>
          <button className="a-btn a-btn-sm a-btn-primary flex-1" onClick={() => downloadOrderInvoice(order)}>
            <FileDown size={14} /> Download PDF
          </button>
          <button className="a-btn a-btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-wider a-mute">{label}</p>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="a-dim">{label}</span>
      <span className="a-mono a-dim">{value}</span>
    </div>
  )
}
