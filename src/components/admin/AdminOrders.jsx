import { useMemo, useState } from 'react'
import { Search, Download, Plus, ListFilter } from 'lucide-react'
import { Panel, StatusBadge, EmptyRow, ResultCount, Pager } from './ui'

const ORDERS = [
  { id: '#1042', customer: 'Aarti Menon', email: 'aarti@example.com', channel: 'Samaha Coimbatore', payment: 'Captured', fulfillment: 'Not fulfilled', total: 1416, date: '2026-08-31' },
  { id: '#1041', customer: 'Daniel Rowe', email: 'daniel@example.com', channel: 'Samaha Online', payment: 'Authorized', fulfillment: 'Not fulfilled', total: 1416, date: '2026-08-31' },
  { id: '#1040', customer: 'Priya Shah', email: 'priya@example.com', channel: 'Samaha Online', payment: 'Captured', fulfillment: 'Shipped', total: 4248, date: '2026-08-30' },
  { id: '#1039', customer: 'Karthik Rao', email: 'karthik@example.com', channel: 'Samaha Coimbatore', payment: 'Captured', fulfillment: 'Delivered', total: 1652, date: '2026-08-30' },
  { id: '#1038', customer: 'Lena Fischer', email: 'lena@example.com', channel: 'Samaha Online', payment: 'Authorized', fulfillment: 'Not fulfilled', total: 1416, date: '2026-08-29' },
  { id: '#1037', customer: 'Omar Haddad', email: 'omar@example.com', channel: 'Samaha Coimbatore', payment: 'Refunded', fulfillment: 'Canceled', total: 1652, date: '2026-08-29' },
  { id: '#1036', customer: 'Grace Liu', email: 'grace@example.com', channel: 'Samaha Online', payment: 'Captured', fulfillment: 'Delivered', total: 3510, date: '2026-08-28' },
  { id: '#1035', customer: 'Mateo Silva', email: 'mateo@example.com', channel: 'Samaha Online', payment: 'Captured', fulfillment: 'Delivered', total: 890, date: '2026-08-28' },
  { id: '#1034', customer: 'Hannah Berg', email: 'hannah@example.com', channel: 'Samaha Coimbatore', payment: 'Failed', fulfillment: 'Canceled', total: 1240, date: '2026-08-27' },
  { id: '#1033', customer: 'Ravi Kapoor', email: 'ravi@example.com', channel: 'Samaha Online', payment: 'Captured', fulfillment: 'Shipped', total: 2085, date: '2026-08-27' },
  { id: '#1032', customer: 'Sofia Marín', email: 'sofia@example.com', channel: 'Samaha Online', payment: 'Captured', fulfillment: 'Delivered', total: 960, date: '2026-08-26' },
  { id: '#1031', customer: 'Tom Becker', email: 'tom@example.com', channel: 'Samaha Coimbatore', payment: 'Captured', fulfillment: 'Delivered', total: 4620, date: '2026-08-25' },
]

const PER_PAGE = 8
const inr = (n) => `₹ ${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR`
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

export default function AdminOrders() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return ORDERS.filter((o) => {
      const matchesQ =
        !needle ||
        o.id.toLowerCase().includes(needle) ||
        o.customer.toLowerCase().includes(needle) ||
        o.email.toLowerCase().includes(needle)
      const matchesS = status === 'all' || o.fulfillment.toLowerCase() === status
      return matchesQ && matchesS
    })
  }, [q, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const reset = (fn) => (v) => {
    fn(v)
    setPage(1)
  }

  return (
    <Panel
      title="Orders"
      actions={
        <>
          <button className="a-btn a-btn-sm">
            <Download size={14} /> Export
          </button>
          <button className="a-btn a-btn-sm a-btn-primary">
            <Plus size={14} /> Create
          </button>
        </>
      }
      toolbar={
        <>
          <select className="a-select a-select-sm sm:w-40" value={status} onChange={(e) => reset(setStatus)(e.target.value)}>
            <option value="all">Add filter</option>
            <option value="not fulfilled">Not fulfilled</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>
          <div className="flex-1" />
          <div className="a-input-wrap w-full sm:w-64">
            <Search size={15} />
            <input
              className="a-input a-input-sm"
              placeholder="Search"
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
            <th>Sales Channel</th>
            <th>Payment</th>
            <th>Fulfillment</th>
            <th className="text-right">Order Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <EmptyRow colSpan={7} label="No orders match your filters" />}
          {rows.map((o) => (
            <tr key={o.id}>
              <td className="font-medium">{o.id}</td>
              <td className="a-dim">{fmtDate(o.date)}</td>
              <td>{o.customer}</td>
              <td className="a-dim">{o.channel}</td>
              <td><StatusBadge status={o.payment} /></td>
              <td><StatusBadge status={o.fulfillment} /></td>
              <td className="text-right a-mono a-dim">{inr(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}
