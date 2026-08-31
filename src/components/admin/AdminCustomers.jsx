import { useMemo, useState } from 'react'
import { Search, Download, ListFilter } from 'lucide-react'
import { Panel, StatusBadge, EmptyRow, ResultCount, Pager } from './ui'

const CUSTOMERS = [
  { name: 'Aarti Menon', email: 'aarti@example.com', location: 'Coimbatore, IN', orders: 8, spent: 512, joined: '2025-11-04', status: 'Active' },
  { name: 'Daniel Rowe', email: 'daniel@example.com', location: 'Bristol, UK', orders: 3, spent: 141.5, joined: '2026-02-18', status: 'Active' },
  { name: 'Priya Shah', email: 'priya@example.com', location: 'Mumbai, IN', orders: 12, spent: 884, joined: '2025-08-22', status: 'Active' },
  { name: 'Karthik Rao', email: 'karthik@example.com', location: 'Madurai, IN', orders: 2, spent: 62, joined: '2026-06-30', status: 'Active' },
  { name: 'Lena Fischer', email: 'lena@example.com', location: 'Berlin, DE', orders: 1, spent: 0, joined: '2026-08-29', status: 'Pending' },
  { name: 'Omar Haddad', email: 'omar@example.com', location: 'Amman, JO', orders: 4, spent: 176, joined: '2026-01-11', status: 'Active' },
  { name: 'Grace Liu', email: 'grace@example.com', location: 'Singapore, SG', orders: 6, spent: 398, joined: '2025-12-07', status: 'Active' },
  { name: 'Mateo Silva', email: 'mateo@example.com', location: 'Lisbon, PT', orders: 1, spent: 15, joined: '2026-08-12', status: 'Active' },
  { name: 'Hannah Berg', email: 'hannah@example.com', location: 'Oslo, NO', orders: 0, spent: 0, joined: '2026-08-27', status: 'Archived' },
  { name: 'Ravi Kapoor', email: 'ravi@example.com', location: 'Delhi, IN', orders: 9, spent: 604, joined: '2025-09-19', status: 'Active' },
  { name: 'Sofia Marín', email: 'sofia@example.com', location: 'Madrid, ES', orders: 3, spent: 132, joined: '2026-03-25', status: 'Active' },
]

const PER_PAGE = 8
const initials = (n) => n.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export default function AdminCustomers() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return CUSTOMERS
    return CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.email.toLowerCase().includes(needle) ||
        c.location.toLowerCase().includes(needle),
    )
  }, [q])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  return (
    <Panel
      title="Customers"
      actions={
        <button className="a-btn a-btn-sm">
          <Download size={14} /> Export
        </button>
      }
      toolbar={
        <>
          <button className="a-btn a-btn-sm">Add filter</button>
          <div className="flex-1" />
          <div className="a-input-wrap w-full sm:w-64">
            <Search size={15} />
            <input
              className="a-input a-input-sm"
              placeholder="Search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setPage(1)
              }}
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
            <th>Customer</th>
            <th>Location</th>
            <th>Orders</th>
            <th className="text-right">Lifetime spend</th>
            <th>Joined</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <EmptyRow colSpan={6} label="No customers match your search" />}
          {rows.map((c) => (
            <tr key={c.email}>
              <td>
                <div className="flex items-center gap-3">
                  <span className="a-avatar h-9 w-9 text-[0.72rem]">{initials(c.name)}</span>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-[0.75rem] a-mute">{c.email}</p>
                  </div>
                </div>
              </td>
              <td className="a-dim">{c.location}</td>
              <td className="a-dim">{c.orders}</td>
              <td className="text-right a-mono">${c.spent.toFixed(2)}</td>
              <td className="a-dim">{c.joined}</td>
              <td><StatusBadge status={c.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}
