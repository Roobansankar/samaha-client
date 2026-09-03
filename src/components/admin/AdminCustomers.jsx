import { useEffect, useMemo, useState } from 'react'
import { Search, RefreshCw, ListFilter, Loader2 } from 'lucide-react'
import { Panel, StatusBadge, EmptyRow, ResultCount, Pager } from './ui'
import { fetchCustomers } from './auth'

const PER_PAGE = 10

const initials = (n) =>
  (n || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

const fmtWhen = (d) => {
  if (!d) return 'Never'
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  return fmtDate(d)
}

export default function AdminCustomers() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setRows(await fetchCustomers())
    } catch (e) {
      setError(e.message || 'Could not load customers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((c) =>
      [c.name, c.email, c.city].some((v) => (v || '').toLowerCase().includes(needle)),
    )
  }, [q, rows])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  return (
    <Panel
      title="Customers"
      actions={
        <button className="a-btn a-btn-sm" onClick={load}>
          <RefreshCw size={14} /> Refresh
        </button>
      }
      toolbar={
        <>
          <span className="a-dim text-[0.8rem]">{rows.length} registered</span>
          <div className="flex-1" />
          <div className="a-input-wrap w-full sm:w-64">
            <Search size={15} />
            <input
              className="a-input a-input-sm"
              placeholder="Search customers"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1) }}
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
            <th>Sign-up</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Joined</th>
            <th>Last active</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7} className="py-12 text-center a-mute">
                <Loader2 size={16} className="mx-auto animate-spin" />
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={7} className="py-8 text-center text-red-600">{error}</td>
            </tr>
          )}

          {!loading && !error && pageRows.length === 0 && (
            <EmptyRow
              colSpan={7}
              label={q ? 'No customers match your search' : 'No customers have registered yet'}
            />
          )}

          {!loading && !error && pageRows.map((c) => (
            <tr key={c.id}>
              <td>
                <div className="flex items-center gap-3">
                  {c.avatar ? (
                    <img src={c.avatar} alt="" referrerPolicy="no-referrer" className="a-avatar h-9 w-9 object-cover" />
                  ) : (
                    <span className="a-avatar h-9 w-9 text-[0.72rem]">{initials(c.name)}</span>
                  )}
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-[0.75rem] a-mute">{c.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.7rem] font-medium ${
                    c.signup === 'Google'
                      ? 'bg-[#4285F4]/10 text-[#3367d6]'
                      : 'a-muted a-dim'
                  }`}
                >
                  {c.signup === 'Google' ? 'Google' : 'Email'}
                </span>
              </td>
              <td className="a-dim">{c.phone || '—'}</td>
              <td className="a-dim">
                {c.default_address ? (
                  <span title={c.default_address}>
                    {c.default_address.length > 42 ? c.default_address.slice(0, 42) + '…' : c.default_address}
                    {c.address_count > 1 && (
                      <span className="a-mute"> +{c.address_count - 1}</span>
                    )}
                  </span>
                ) : (c.city || '—')}
              </td>
              <td className="a-dim">{fmtDate(c.joined)}</td>
              <td className="a-dim">{fmtWhen(c.last_login_at)}</td>
              <td><StatusBadge status="Active" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}
