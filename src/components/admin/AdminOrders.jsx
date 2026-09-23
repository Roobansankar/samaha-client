import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, RefreshCw, Eye, X, FileDown, CalendarDays, Loader2 } from 'lucide-react'
import { Panel, StatusBadge, EmptyRow, ResultCount, Pager } from './ui'
import { fetchOrders } from './auth'
import { enrichItems, downloadOrderInvoice, orderStatusLabel } from '../../lib/orderInvoice'
import { useProducts } from '../../context/ProductsContext'

const PER_PAGE = 10
const inr = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'

const TABS = [
  { key: 'paid', label: 'Orders', hint: 'Paid orders, and confirmed Cash on Delivery orders — ready to fulfil.' },
  { key: 'incomplete', label: 'Incomplete payments', hint: 'Checkouts that never resulted in a payment — cancelled, failed, or abandoned mid-checkout. No money was collected for these.' },
]

// a real order that needs fulfilling — either paid, or a confirmed COD order (cash due on
// delivery, not an abandoned attempt). Everything else (created/cancelled/failed online
// attempts) is incomplete.
const isRealOrder = (o) => o.status === 'paid' || o.status === 'confirmed'

export default function AdminOrders() {
  const navigate = useNavigate()
  const { getVariant } = useProducts()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('paid')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [pay, setPay] = useState('all') // all | online | cod (paid tab only)
  const [page, setPage] = useState(1)

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

  const paidOrders = useMemo(() => orders.filter(isRealOrder), [orders])
  const incompleteOrders = useMemo(() => orders.filter((o) => !isRealOrder(o)), [orders])
  const base = tab === 'paid' ? paidOrders : incompleteOrders

  const switchTab = (next) => { setTab(next); setStatus('all'); setQ(''); setFrom(''); setTo(''); setPay('all'); setPage(1) }

  const fromTs = from ? new Date(`${from}T00:00:00`).getTime() : null
  const toTs = to ? new Date(`${to}T23:59:59.999`).getTime() : null
  const filtersActive = !!(q.trim() || from || to || pay !== 'all' || status !== 'all')

  const clearFilters = () => { setQ(''); setFrom(''); setTo(''); setPay('all'); setStatus('all'); setPage(1) }
  const preset = (kind) => {
    const today = new Date()
    const iso = (d) => d.toISOString().slice(0, 10)
    if (kind === 'today') {
      const s = iso(today)
      setFrom(s); setTo(s)
    } else if (kind === 'week') {
      const start = new Date(today); start.setDate(start.getDate() - 6)
      setFrom(iso(start)); setTo(iso(today))
    } else if (kind === 'month') {
      setFrom(iso(new Date(today.getFullYear(), today.getMonth(), 1))); setTo(iso(today))
    }
    setPage(1)
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return base.filter((o) => {
      const matchesQ =
        !needle ||
        (o.order_number != null && String(o.order_number).toLowerCase().includes(needle.replace('#', ''))) ||
        (o.customer || '').toLowerCase().includes(needle) ||
        (o.email || '').toLowerCase().includes(needle) ||
        (o.payment_id || '').toLowerCase().includes(needle)
      const matchesS = tab === 'paid' || status === 'all' || o.status === status
      const matchesPay = tab !== 'paid' || pay === 'all' || (o.payment_method || 'online') === pay
      let matchesD = true
      if (fromTs != null || toTs != null) {
        const ts = o.placed_at ? new Date(o.placed_at).getTime() : NaN
        if (isNaN(ts)) matchesD = false
        else {
          if (fromTs != null && ts < fromTs) matchesD = false
          if (toTs != null && ts > toTs) matchesD = false
        }
      }
      return matchesQ && matchesS && matchesPay && matchesD
    })
  }, [q, status, pay, fromTs, toTs, base, tab])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const reset = (fn) => (v) => { fn(v); setPage(1) }
  const open = (id) => navigate(`/admin/orders/${id}`)
  const activeTab = TABS.find((t) => t.key === tab)
  const showOrderCol = tab === 'paid' // incomplete payments never have an order number to show
  const colCount = showOrderCol ? 8 : 7

  return (
    <Panel
      title="Orders"
      description={activeTab.hint}
      actions={
        <button className="a-btn a-btn-sm" onClick={load}>
          <RefreshCw size={14} /> Refresh
        </button>
      }
      toolbar={
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex gap-1.5">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => switchTab(t.key)}
                  className={`a-btn a-btn-sm ${t.key === tab ? 'a-btn-primary' : ''}`}
                >
                  {t.label} ({t.key === 'paid' ? paidOrders.length : incompleteOrders.length})
                </button>
              ))}
            </div>

            {tab === 'incomplete' && (
              <select className="a-select a-select-sm sm:w-40" value={status} onChange={(e) => reset(setStatus)(e.target.value)}>
                <option value="all">All</option>
                <option value="created">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="failed">Failed</option>
              </select>
            )}

            {tab === 'paid' && (
              <select className="a-select a-select-sm sm:w-40" value={pay} onChange={(e) => reset(setPay)(e.target.value)}>
                <option value="all">All payments</option>
                <option value="online">Online</option>
                <option value="cod">COD</option>
              </select>
            )}

            <div className="flex-1" />
            <div className="a-input-wrap w-full sm:w-64">
              <Search size={15} />
              <input
                className="a-input a-input-sm"
                placeholder="Search order / customer / email"
                value={q}
                onChange={(e) => reset(setQ)(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-[0.8rem] a-dim">
              <CalendarDays size={14} /> From
              <input type="date" className="a-input a-input-sm w-auto" value={from} max={to || undefined} onChange={(e) => reset(setFrom)(e.target.value)} />
            </span>
            <span className="flex items-center gap-1.5 text-[0.8rem] a-dim">
              To
              <input type="date" className="a-input a-input-sm w-auto" value={to} min={from || undefined} onChange={(e) => reset(setTo)(e.target.value)} />
            </span>
            {['today', 'week', 'month'].map((p) => (
              <button key={p} type="button" className="a-btn a-btn-sm" onClick={() => preset(p)}>
                {p === 'today' ? 'Today' : p === 'week' ? '7 days' : 'This month'}
              </button>
            ))}
            {filtersActive && (
              <>
                <span className="a-badge">{filtered.length} match{filtersActive && filtered.length === 1 ? '' : 'es'}</span>
                <button type="button" className="a-btn a-btn-sm" onClick={clearFilters}>
                  <X size={14} /> Clear
                </button>
              </>
            )}
          </div>
        </div>
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
            <th style={{ width: 56 }}>S.No</th>
            {showOrderCol && <th>Order</th>}
            <th>Date</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Payment</th>
            <th>Total</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan={colCount} className="py-12 text-center a-mute"><Loader2 size={16} className="mx-auto animate-spin" /></td></tr>
          )}
          {!loading && error && (
            <tr><td colSpan={colCount} className="py-8 text-center text-red-600">{error}</td></tr>
          )}
          {!loading && !error && rows.length === 0 && (
            <EmptyRow
              colSpan={colCount}
              label={
                filtersActive
                  ? 'No orders match your filters'
                  : tab === 'paid' ? 'No orders yet' : 'No cancelled, failed or abandoned checkouts'
              }
            />
          )}
          {!loading && !error && rows.map((o, idx) => {
            const items = enrichItems(o.items, getVariant)
            return (
              <tr key={o.id} className="cursor-pointer" onClick={() => open(o.id)}>
                <td className="a-mono a-dim">{(safePage - 1) * PER_PAGE + idx + 1}</td>
                {showOrderCol && <td className="font-medium a-mono">{o.order_number}</td>}
                <td className="a-dim whitespace-nowrap">{fmtDate(o.placed_at)}</td>
                <td>
                  <p className="font-medium">{o.customer}</p>
                  <p className="text-[0.75rem] a-mute">{o.email}</p>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {items.slice(0, 3).map((i, k) =>
                        i.image ? (
                          <img
                            key={k}
                            src={i.image}
                            alt=""
                            className="h-8 w-8 rounded-md border-2 object-contain"
                            style={{ borderColor: 'var(--a-surface)', background: 'var(--a-surface-2)' }}
                          />
                        ) : (
                          <span
                            key={k}
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
                  <StatusBadge status={orderStatusLabel(o.status, o.payment_method)} />
                </td>
                <td className="a-mono a-dim whitespace-nowrap">{inr(o.total)}</td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button className="a-iconbtn" title="View order" onClick={() => open(o.id)}>
                      <Eye size={15} />
                    </button>
                    {o.status === 'paid' && (
                      <button className="a-iconbtn" title="Download PDF invoice" onClick={() => downloadOrderInvoice(o, getVariant)}>
                        <FileDown size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Panel>
  )
}
