import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Trash2, Pencil, X, Loader2, Wallet, CalendarDays, FileSpreadsheet, FileDown } from 'lucide-react'
import { Panel, EmptyRow, ResultCount, Pager, Loader } from './ui'
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from './auth'

const PER_PAGE = 10
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
const todayStr = () => new Date().toISOString().slice(0, 10)
const dayStart = (s) => { const d = new Date(`${s}T00:00:00`); return isNaN(d) ? null : d }
const dayEnd = (s) => { const d = new Date(`${s}T23:59:59.999`); return isNaN(d) ? null : d }

export default function AdminExpenses() {
  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [cat, setCat] = useState('all')
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState('')
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

  const categories = useMemo(() => {
    const s = new Set()
    expenses.forEach((e) => { if (e.category) s.add(e.category) })
    return [...s].sort()
  }, [expenses])

  const f = from ? dayStart(from) : null
  const t = to ? dayEnd(to) : null
  const needle = q.trim().toLowerCase()
  const filtersActive = !!(needle || from || to || cat !== 'all')

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.spent_at || e.created_at)
      if ((f || t) && !isNaN(d)) {
        if (f && d < f) return false
        if (t && d > t) return false
      }
      if (cat !== 'all' && (e.category || '') !== cat) return false
      if (!needle) return true
      return (
        (e.title || '').toLowerCase().includes(needle) ||
        (e.category || '').toLowerCase().includes(needle) ||
        (e.note || '').toLowerCase().includes(needle)
      )
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, expenses, f?.getTime(), t?.getTime(), cat])

  const filteredTotal = filtered.reduce((s, e) => s + Number(e.amount || 0), 0)

  const clearFilters = () => { setQ(''); setFrom(''); setTo(''); setCat('all'); setPage(1) }
  const preset = (kind) => {
    const today = new Date()
    const iso = (d) => d.toISOString().slice(0, 10)
    if (kind === 'today') {
      const s = iso(today)
      setFrom(s); setTo(s)
    } else if (kind === 'week') {
      const end = new Date(today)
      const start = new Date(today); start.setDate(start.getDate() - 6)
      setFrom(iso(start)); setTo(iso(end))
    } else if (kind === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      setFrom(iso(start)); setTo(iso(today))
    }
    setPage(1)
  }

  /* ---- exports (use filtered rows) ---- */
  const exportExcel = async () => {
    setExporting('excel')
    try {
      const mod = await import('xlsx')
      const XLSX = mod.default || mod
      const wb = XLSX.utils.book_new()
      const rangeLabel = `${from || 'all'} → ${to || 'all'}`
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet([
          { Metric: 'Date range', Value: filtersActive ? rangeLabel : 'All time' },
          { Metric: 'Category', Value: cat === 'all' ? 'All' : cat },
          { Metric: 'Search', Value: needle || '—' },
          { Metric: 'Total (filtered)', Value: filteredTotal },
          { Metric: 'Total (all)', Value: total },
          { Metric: 'Entries', Value: filtered.length },
        ]),
        'Summary',
      )
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet(filtered.map((e) => ({
          Title: e.title,
          Category: e.category || '',
          Date: fmtDate(e.spent_at || e.created_at),
          Amount: Number(e.amount || 0),
          Note: e.note || '',
        }))),
        'Expenses',
      )
      XLSX.writeFile(wb, `Expenses-${from || 'all'}-${to || 'all'}.xlsx`)
    } finally {
      setExporting('')
    }
  }

  const exportPDF = async () => {
    setExporting('pdf')
    try {
      const [{ jsPDF }, autoTableMod] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
      const autoTable = autoTableMod.default || autoTableMod.autoTable
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })
      const M = 14
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('Expenses Report', M, 16)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(110)
      doc.text(
        `${filtersActive ? `Filtered (${from || 'all'} to ${to || 'all'}${cat !== 'all' ? `, ${cat}` : ''}${needle ? `, "${q.trim()}"` : ''})` : 'All time'} · Generated ${fmtDateTime(new Date().toISOString())}`,
        M, 22,
      )
      doc.setTextColor(20)
      doc.setFontSize(11)
      doc.text(`Total Rs. ${filteredTotal.toLocaleString('en-IN')} · ${filtered.length} entries`, M, 30)

      autoTable(doc, {
        startY: 35,
        margin: { left: M, right: M },
        head: [['#', 'Title', 'Category', 'Date', 'Amount']],
        body: filtered.map((e, i) => [
          String(i + 1),
          `${e.title || ''}${e.note ? ` (${e.note})` : ''}`,
          e.category || '—',
          fmtDate(e.spent_at || e.created_at),
          `Rs. ${Number(e.amount || 0).toLocaleString('en-IN')}`,
        ]),
        theme: 'plain',
        styles: { fontSize: 8 },
        headStyles: { fontStyle: 'bold', textColor: [110, 110, 110] },
      })
      doc.save(`Expenses-${from || 'all'}-${to || 'all'}.pdf`)
    } finally {
      setExporting('')
    }
  }

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
        description={filtersActive
          ? `Filtered ${inr(filteredTotal)} across ${filtered.length} entries (total ${inr(total)}) — subtracted from revenue on the dashboard.`
          : `Total spent ${inr(total)} — subtracted from revenue on the dashboard.`}
        actions={
          <>
            <span className="a-badge a-badge--no-dot" style={{ background: 'var(--a-accent-soft)' }}>
              <Wallet size={13} /> Amount spent {inr(filtersActive ? filteredTotal : total)}
            </span>
            <button className="a-btn a-btn-sm" disabled={!!exporting || filtered.length === 0} onClick={exportExcel}>
              <FileSpreadsheet size={14} /> {exporting === 'excel' ? 'Exporting…' : 'Excel'}
            </button>
            <button className="a-btn a-btn-sm" disabled={!!exporting || filtered.length === 0} onClick={exportPDF}>
              <FileDown size={14} /> {exporting === 'pdf' ? 'Exporting…' : 'PDF'}
            </button>
            <button className="a-btn a-btn-sm a-btn-primary" onClick={openCreate}>
              <Plus size={14} /> Add expense
            </button>
          </>
        }
        toolbar={
          <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:flex-wrap">
            <div className="a-input-wrap w-full sm:w-64">
              <Search size={15} />
              <input
                className="a-input a-input-sm"
                placeholder="Search title / category"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1) }}
              />
            </div>
            <label className="flex items-center gap-1.5 text-[0.8rem] a-dim">
              <CalendarDays size={14} /> From
              <input type="date" className="a-input a-input-sm w-auto" value={from} max={to || undefined} onChange={(e) => { setFrom(e.target.value); setPage(1) }} />
            </label>
            <label className="flex items-center gap-1.5 text-[0.8rem] a-dim">
              To
              <input type="date" className="a-input a-input-sm w-auto" value={to} min={from || undefined} onChange={(e) => { setTo(e.target.value); setPage(1) }} />
            </label>
            <select className="a-select a-select-sm w-auto" value={cat} onChange={(e) => { setCat(e.target.value); setPage(1) }}>
              <option value="all">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex items-center gap-1">
              {['today', 'week', 'month'].map((p) => (
                <button key={p} className="a-btn a-btn-sm" onClick={() => preset(p)}>
                  {p === 'today' ? 'Today' : p === 'week' ? '7 days' : 'Month'}
                </button>
              ))}
            </div>
            {filtersActive && (
              <button className="a-btn a-btn-sm" onClick={clearFilters}>
                <X size={14} /> Clear
              </button>
            )}
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
              {rows.length === 0 && <EmptyRow colSpan={6} label={filtersActive ? 'No expenses match filters' : 'No expenses yet'} />}
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
