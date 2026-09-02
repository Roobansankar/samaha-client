import { useEffect, useState } from 'react'
import { Search, Plus, Trash2, X, Loader2 } from 'lucide-react'
import { Panel, EmptyRow, ResultCount, Pager, Loader } from './ui'
import { fetchStaff, createStaff, updateStaff, deleteStaff } from './auth'

const PAGE_OPTIONS = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'orders', label: 'Orders' },
  { value: 'products', label: 'Products' },
  { value: 'customers', label: 'Customers' },
  { value: 'settings', label: 'Settings' },
  { value: 'staff', label: 'Staff' },
]

const PER_PAGE = 8

export default function AdminStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', permissions: [] })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchStaff()
      setStaff(data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = staff.filter((s) => {
    const needle = q.trim().toLowerCase()
    return !needle || s.name.toLowerCase().includes(needle) || s.email.toLowerCase().includes(needle)
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', email: '', password: '', permissions: [] })
    setError('')
    setShowModal(true)
  }

  const openEdit = (s) => {
    setEditing(s)
    setForm({ name: s.name, email: s.email, password: '', permissions: s.permissions || [] })
    setError('')
    setShowModal(true)
  }

  const togglePerm = (val) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(val)
        ? f.permissions.filter((p) => p !== val)
        : [...f.permissions, val],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editing) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await updateStaff(editing.id, payload)
      } else {
        await createStaff(form)
      }
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this staff member?')) return
    try {
      await deleteStaff(id)
      load()
    } catch { /* ignore */ }
  }

  return (
    <>
      <Panel
        title="Staff"
        actions={
          <button className="a-btn a-btn-sm a-btn-primary" onClick={openCreate}>
            <Plus size={14} /> Add staff
          </button>
        }
        toolbar={
          <div className="a-input-wrap w-full sm:w-64">
            <Search size={15} />
            <input className="a-input a-input-sm" placeholder="Search staff" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
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
              <th>Name</th>
              <th>Email</th>
              <th>Access</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && <EmptyRow colSpan={5} label="No staff members found" />}
            {rows.map((s, i) => (
              <tr key={s.id}>
                <td className="a-mono a-dim">{(safePage - 1) * PER_PAGE + i + 1}</td>
                <td className="font-medium">{s.name}</td>
                <td className="a-dim">{s.email}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {(s.permissions || []).map((p) => (
                      <span key={p} className="a-badge">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="a-btn a-btn-sm" onClick={() => openEdit(s)}>Edit</button>
                    <button className="a-iconbtn text-[var(--a-danger)]" onClick={() => handleDelete(s.id)}>
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
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="a-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()} style={{ borderRadius: 'var(--a-radius-lg)' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">{editing ? 'Edit Staff' : 'Add Staff'}</h2>
              <button className="a-iconbtn" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="a-field">
                <label className="a-label">Name</label>
                <input className="a-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="a-field">
                <label className="a-label">Email</label>
                <input className="a-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="a-field">
                <label className="a-label">{editing ? 'New Password (leave blank to keep)' : 'Password'}</label>
                <input className="a-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} {...(!editing && { required: true })} />
              </div>
              <div className="a-field">
                <label className="a-label">Page Access</label>
                <div className="flex flex-wrap gap-2">
                  {PAGE_OPTIONS.map((p) => (
                    <label key={p.value} className={`a-badge cursor-pointer select-none ${form.permissions.includes(p.value) ? 'a-badge--active' : ''}`} onClick={() => togglePerm(p.value)}>
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              {error && <p className="rounded-[6px] px-3 py-2 text-[0.82rem]" style={{ background: 'rgba(214,69,69,0.12)', color: 'var(--a-danger)' }}>{error}</p>}

              <button type="submit" className="a-btn a-btn-primary a-btn-block" style={{ height: '2.5rem' }} disabled={saving}>
                {saving ? <Loader2 size={15} className="animate-spin" /> : editing ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
