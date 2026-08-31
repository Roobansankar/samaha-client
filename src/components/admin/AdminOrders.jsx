import { useMemo, useState } from 'react'
import { Search, Download, Plus, Eye, MoreHorizontal } from 'lucide-react'
import { PageHeader, StatusBadge, Pagination, EmptyRow } from './ui'

const ORDERS = [
  { id: 'SAM-1042', customer: 'Aarti Menon', email: 'aarti@example.com', items: 3, total: 78.0, payment: 'Paid', fulfillment: 'Unfulfilled', date: '2026-08-31' },
  { id: 'SAM-1041', customer: 'Daniel Rowe', email: 'daniel@example.com', items: 2, total: 46.5, payment: 'Paid', fulfillment: 'Processing', date: '2026-08-31' },
  { id: 'SAM-1040', customer: 'Priya Shah', email: 'priya@example.com', items: 4, total: 122.0, payment: 'Paid', fulfillment: 'Shipped', date: '2026-08-30' },
  { id: 'SAM-1039', customer: 'Karthik Rao', email: 'karthik@example.com', items: 1, total: 31.0, payment: 'Paid', fulfillment: 'Delivered', date: '2026-08-30' },
  { id: 'SAM-1038', customer: 'Lena Fischer', email: 'lena@example.com', items: 3, total: 88.0, payment: 'Pending', fulfillment: 'Unfulfilled', date: '2026-08-29' },
  { id: 'SAM-1037', customer: 'Omar Haddad', email: 'omar@example.com', items: 2, total: 54.0, payment: 'Refunded', fulfillment: 'Cancelled', date: '2026-08-29' },
  { id: 'SAM-1036', customer: 'Grace Liu', email: 'grace@example.com', items: 5, total: 164.0, payment: 'Paid', fulfillment: 'Delivered', date: '2026-08-28' },
  { id: 'SAM-1035', customer: 'Mateo Silva', email: 'mateo@example.com', items: 1, total: 15.0, payment: 'Paid', fulfillment: 'Delivered', date: '2026-08-28' },
  { id: 'SAM-1034', customer: 'Hannah Berg', email: 'hannah@example.com', items: 2, total: 62.0, payment: 'Failed', fulfillment: 'Cancelled', date: '2026-08-27' },
  { id: 'SAM-1033', customer: 'Ravi Kapoor', email: 'ravi@example.com', items: 3, total: 93.0, payment: 'Paid', fulfillment: 'Shipped', date: '2026-08-27' },
  { id: 'SAM-1032', customer: 'Sofia Marín', email: 'sofia@example.com', items: 2, total: 48.0, payment: 'Paid', fulfillment: 'Delivered', date: '2026-08-26' },
  { id: 'SAM-1031', customer: 'Tom Becker', email: 'tom@example.com', items: 6, total: 210.0, payment: 'Paid', fulfillment: 'Delivered', date: '2026-08-25' },
]

const PER_PAGE = 8

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
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${ORDERS.length} orders · ${ORDERS.filter((o) => o.fulfillment === 'Unfulfilled').length} awaiting fulfillment`}
        actions={
          <>
            <button className="a-btn">
              <Download size={15} /> Export
            </button>
            <button className="a-btn a-btn-primary">
              <Plus size={15} /> Create order
            </button>
          </>
        }
      />

      <div className="a-card overflow-hidden">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="a-input-wrap flex-1">
            <Search size={15} />
            <input
              className="a-input"
              placeholder="Search by order, customer or email…"
              value={q}
              onChange={(e) => reset(setQ)(e.target.value)}
            />
          </div>
          <select
            className="a-select sm:w-48"
            value={status}
            onChange={(e) => reset(setStatus)(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="unfulfilled">Unfulfilled</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="a-tablewrap" style={{ borderTop: '1px solid var(--a-border)' }}>
          <table className="a-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th>Date</th>
                <th className="text-right">Total</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={8} label="No orders match your filters" />}
              {rows.map((o) => (
                <tr key={o.id}>
                  <td className="font-semibold a-mono">{o.id}</td>
                  <td>
                    <p className="font-medium">{o.customer}</p>
                    <p className="text-[0.75rem] a-mute">{o.email}</p>
                  </td>
                  <td className="a-dim">{o.items}</td>
                  <td><StatusBadge status={o.payment} /></td>
                  <td><StatusBadge status={o.fulfillment} /></td>
                  <td className="a-dim">{o.date}</td>
                  <td className="text-right font-semibold a-mono">${o.total.toFixed(2)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button className="a-iconbtn" aria-label="View order"><Eye size={15} /></button>
                      <button className="a-iconbtn" aria-label="More"><MoreHorizontal size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={safePage}
          pageCount={pageCount}
          total={filtered.length}
          onPage={setPage}
        />
      </div>
    </div>
  )
}
