import { useEffect, useState } from 'react'
import { Search, Trash2, Eye, Reply, X, Loader2 } from 'lucide-react'
import { Panel, EmptyRow, ResultCount, Pager, Loader } from './ui'
import { fetchMessages, markMessageRead, updateMessageStatus, deleteMessage } from './auth'

const STATUS_MAP = {
  unread: { label: 'Unread', color: 'var(--a-accent)' },
  read: { label: 'Read', color: 'var(--a-text-dim)' },
  replied: { label: 'Replied', color: '#1a7f47' },
}

const PER_PAGE = 8

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const load = async () => {
    setLoading(true)
    try { setMessages(await fetchMessages()) } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = messages.filter((m) => {
    const n = q.trim().toLowerCase()
    return !n || m.name.toLowerCase().includes(n) || m.email.toLowerCase().includes(n) || m.subject.toLowerCase().includes(n)
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const openMessage = async (m) => {
    setSelected(m)
    if (m.status === 'unread') {
      await markMessageRead(m.id)
      setMessages((prev) => prev.map((msg) => msg.id === m.id ? { ...msg, status: 'read' } : msg))
    }
  }

  const handleStatus = async (id, status) => {
    await updateMessageStatus(id, status)
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status } : m))
    if (selected?.id === id) setSelected((s) => ({ ...s, status }))
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return
    await deleteMessage(id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <>
      <Panel
        title="Messages"
        toolbar={
          <div className="a-input-wrap w-full sm:w-64">
            <Search size={15} />
            <input className="a-input a-input-sm" placeholder="Search messages" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
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
              <th>From</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && <EmptyRow colSpan={6} label="No messages found" />}
            {rows.map((m, i) => (
              <tr key={m.id} className="cursor-pointer" onClick={() => openMessage(m)}>
                <td className="a-mono a-dim">{(safePage - 1) * PER_PAGE + i + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {m.status === 'unread' && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--a-accent)' }} />}
                    <div>
                      <p className={`font-medium ${m.status === 'unread' ? '' : 'a-dim'}`}>{m.name}</p>
                      <p className="text-[0.75rem] a-mute">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="a-dim">{m.subject}</td>
                <td className="a-dim text-[0.8rem] whitespace-nowrap">
                  {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                </td>
                <td>
                  <span className="a-badge" style={{ background: STATUS_MAP[m.status]?.color + '20', color: STATUS_MAP[m.status]?.color }}>
                    {STATUS_MAP[m.status]?.label}
                  </span>
                </td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button className="a-iconbtn" onClick={() => openMessage(m)} title="View"><Eye size={14} /></button>
                    <button className="a-iconbtn text-[var(--a-danger)]" onClick={() => handleDelete(m.id)} title="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </Panel>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40" onClick={() => setSelected(null)}>
          <div className="a-card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()} style={{ borderRadius: 'var(--a-radius-lg)' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Message from {selected.name}</h2>
              <button className="a-iconbtn" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex gap-4">
                <div><span className="a-mute">From:</span> <span className="font-medium">{selected.name}</span></div>
                <div><span className="a-mute">Email:</span> <a href={`mailto:${selected.email}`} className="font-medium text-[var(--a-accent)]">{selected.email}</a></div>
              </div>
              {selected.phone && <div><span className="a-mute">Phone:</span> <span className="font-medium">{selected.phone}</span></div>}
              <div><span className="a-mute">Subject:</span> <span className="font-medium">{selected.subject}</span></div>
              <div><span className="a-mute">Date:</span> <span className="font-medium">{new Date(selected.created_at).toLocaleString()}</span></div>
              <div className="mt-4 rounded-lg p-4" style={{ background: 'var(--a-surface)' }}>
                <p className="leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2" style={{ borderTop: '1px solid var(--a-border)', paddingTop: '1rem' }}>
              {selected.status !== 'replied' && (
                <button className="a-btn a-btn-sm a-btn-primary" onClick={() => handleStatus(selected.id, 'replied')}>
                  <Reply size={13} /> Mark as replied
                </button>
              )}
              {selected.status !== 'unread' && (
                <button className="a-btn a-btn-sm" onClick={() => handleStatus(selected.id, 'unread')}>
                  Mark as unread
                </button>
              )}
              <div className="flex-1" />
              <button className="a-btn a-btn-sm text-[var(--a-danger)]" onClick={() => handleDelete(selected.id)}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
