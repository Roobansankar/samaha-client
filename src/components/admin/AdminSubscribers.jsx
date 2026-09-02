import { useState, useEffect, useMemo } from 'react'
import { Search, Trash2, ToggleLeft, ToggleRight, Mail, Loader2 } from 'lucide-react'
import { Panel, EmptyRow, ResultCount, Pager, Loader } from './ui'
import { fetchSubscribers, toggleSubscriber, deleteSubscriber } from './auth'

const PER_PAGE = 10

export default function AdminSubscribers() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const load = async () => {
    setLoading(true)
    try { setSubs(await fetchSubscribers()) } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const s = q.toLowerCase()
    return subs.filter((m) => !s || m.email.toLowerCase().includes(s))
  }, [subs, q])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const handleToggle = async (id) => {
    try {
      setSubs((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s))
      await toggleSubscriber(id)
    } catch { load() }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this subscriber?')) return
    try {
      setSubs((prev) => prev.filter((s) => s.id !== id))
      await deleteSubscriber(id)
    } catch { load() }
  }

  return (
    <Panel
      title="Subscribers"
      description={`${subs.length} total subscribers`}
      toolbar={
        <div className="a-input-wrap w-full sm:w-64">
          <Search size={15} />
          <input className="a-input a-input-sm" placeholder="Search emails" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        </div>
      }
      footer={
        <>
          <ResultCount page={safePage} perPage={PER_PAGE} total={filtered.length} />
          <Pager page={safePage} pageCount={pageCount} onPage={setPage} />
        </>
      }
    >
      {loading ? <Loader /> : (
        <table className="a-table">
          <thead>
            <tr>
              <th style={{ width: 50 }}>#</th>
              <th>Email</th>
              <th>Subscribed</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && <EmptyRow colSpan={5} label="No subscribers found" />}
            {rows.map((s, i) => (
              <tr key={s.id}>
                <td className="a-mono a-dim">{(safePage - 1) * PER_PAGE + i + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="a-mute" />
                    <span className="font-medium">{s.email}</span>
                  </div>
                </td>
                <td className="a-dim a-mono text-[0.78rem]">{new Date(s.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`a-badge ${s.active ? 'a-badge--green' : 'a-badge--gray'}`}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="a-iconbtn" onClick={() => handleToggle(s.id)} title={s.active ? 'Deactivate' : 'Activate'}>
                      {s.active ? <ToggleRight size={15} className="text-green-500" /> : <ToggleLeft size={15} className="a-mute" />}
                    </button>
                    <button className="a-iconbtn text-[var(--a-danger)]" onClick={() => handleDelete(s.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  )
}
