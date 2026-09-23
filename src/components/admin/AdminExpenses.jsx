import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Trash2, Pencil, X, Loader2, Wallet } from 'lucide-react'
import { Panel, EmptyRow, ResultCount, Pager, Loader } from './ui'
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from './auth'

const PER_PAGE = 10
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const todayStr = () => new Date().toISOString().slice(0, 10)

export default function AdminExpenses() {
  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', category: '', amount: '', spent_at: todayStr(), note: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchExpenses()
      setExpenses(data.expenses || [])
      setTotal(data.total || 0)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return expenses
    return expenses.filter((e) =>
      (e.title || '').toLowerCase().includes(needle) ||
      (e.category || '').toLowerCase().includes(needle) ||
      (e.note || '').toLowerCase().includes(needle),
    )
  }, [q, expenses])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', category: '', amount: '', spent_at: todayStr(), note: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (e) => {
    setEditing(e)
    setForm({
      title: e.title || '',
      category: e.category || '',
      amount: e.amount || '',
      spent_at: (e.spent_at || '').slice(0, 10) || todayStr(),
      note: e.note || '',
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category.trim() || null,
        amount: Number(form.amount),
        spent_at: form.spent_at || todayStr(),
        note: form.note.trim() || null,
      }
      if (editing) await updateExpense(editing.id, payload)
      else await createExpense(payload)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.message || 'Could not save expense.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense? This cannot be undone.')) return
    try {
      await deleteExpense(id)
      load()
    } catch { /* ignore */ }
  }

  return (
    <>
      <Panel
        title="Expenses"
        description={`Total spent ${inr(total)} — subtracted from revenue on the dashboard.`}
        actions={
          <>
            <span className="a-badge" style={{ background: 'var(--a-accent-soft)' }}>
              <Wallet size={13} /> {inr(total)}
            </span>
            <button className="a-btn a-btn-sm a-btn-primary" onClick={openCreate}>
              <Plus size={14} /> Add expense
            </button>
          </>
        }
        toolbar={
          <div className="a-input-wrap w-full sm:w-64">
            <Search size={15} />
            <input
              className="a-input a-input-sm"
              placeholder="Search title / category"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1) }}
            />
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
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={6} label={q ? 'No expenses match your search' : 'No expenses yet'} />}
              {rows.map((e, i) => (
                <tr key={e.id}>
                  <td className="a-mono a-dim">{(safePage - 1) * PER_PAGE + i + 1}</td>
                  <td>
                    <p className="font-medium">{e.title}</p>
                    {e.note && <p className="text-[0.75rem] a-mute truncate max-w-64">{e.note}</p>}
                  </td>
                  <td className="a-dim">{e.category || '—'}</td>
                  <td className="a-dim whitespace-nowrap text-[0.82rem]">{fmtDate(e.spent_at || e.created_at)}</td>
                  <td className="text-right font-semibold a-mono">{inr(e.amount)}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="a-iconbtn" title="Edit" onClick={() => openEdit(e)}>
                        <Pencil size={14} />
                      </button>
                      <button className="a-iconbtn text-[var(--a-danger)]" title="Delete" onClick={() => handleDelete(e.id)}>
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

      {showModal && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 px-4" onClick={() => !saving && setShowModal(false)}>
          <div className="a-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()} style={{ borderRadius: 'var(--a-radius-lg)' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">{editing ? 'Edit expense' : 'Add expense'}</h2>
              <button className="a-iconbtn" onClick={() => !saving && setShowModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="a-field">
                <label className="a-label">Title *</label>
                <input
                  className="a-input"
                  placeholder="e.g. Packing boxes, Diesel, Salary"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="a-field">
                  <label className="a-label">Amount (₹) *</label>
                  <input
                    className="a-input"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="500"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="a-field">
                  <label className="a-label">Date</label>
                  <input
                    className="a-input"
                    type="date"
                    value={form.spent_at}
                    onChange={(e) => setForm({ ...form, spent_at: e.target.value })}
                  />
                </div>
              </div>
              <div className="a-field">
                <label className="a-label">Category</label>
                <input
                  className="a-input"
                  placeholder="e.g. Packing, Transport, Staff"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="a-field">
                <label className="a-label">Note</label>
                <textarea
                  className="a-input"
                  rows={2}
                  placeholder="Optional detail"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>

              {error && (
                <p className="rounded-[6px] px-3 py-2 text-[0.82rem]" style={{ background: 'rgba(214,69,69,0.12)', color: 'var(--a-danger)' }}>
                  {error}
                </p>
              )}

              <button type="submit" className="a-btn a-btn-primary a-btn-block" style={{ height: '2.5rem' }} disabled={saving}>
                {saving ? <Loader2 size={15} className="animate-spin" /> : editing ? 'Update expense' : 'Add expense'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
