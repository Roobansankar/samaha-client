import { useEffect, useMemo, useState } from 'react'
import { Search, RefreshCw, ListFilter, Loader2 } from 'lucide-react'
import { Panel, StatusBadge, EmptyRow, ResultCount, Pager } from './ui'
import { fetchOrders } from './auth'

const PER_PAGE = 10
const inr = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'
const badgeFor = (s) => (s === 'created' ? 'Pending' : s === 'paid' ? 'Paid' : 'Failed')

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
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

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return orders.filter((o) => {
      const matchesQ =
        !needle ||
        String(o.id).includes(needle.replace('#', '')) ||
        (o.customer || '').toLowerCase().includes(needle) ||
        (o.email || '').toLowerCase().includes(needle)
      const matchesS = status === 'all' || o.status === status
      return matchesQ && matchesS
    })
  }, [q, status, orders])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const reset = (fn) => (v) => { fn(v); setPage(1) }

  return (
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
            <th>Razorpay ID</th>
            <th className="text-right">Total</th>
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
          {!loading && !error && rows.map((o) => (
            <tr key={o.id}>
              <td className="font-medium">#{o.id}</td>
              <td className="a-dim">{fmtDate(o.placed_at)}</td>
              <td>
                <p className="font-medium">{o.customer}</p>
                <p className="text-[0.75rem] a-mute">{o.email}</p>
              </td>
              <td className="a-dim" title={o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}>
                {o.item_count}
              </td>
              <td><StatusBadge status={badgeFor(o.status)} /></td>
              <td className="a-dim a-mono text-[0.75rem]">{o.payment_id || '—'}</td>
              <td className="text-right a-mono a-dim">{inr(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}
