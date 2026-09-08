import { useEffect, useMemo, useState } from 'react'
import { Search, RefreshCw, Loader2, Trash2, Eye, EyeOff, Plus, Pencil, X } from 'lucide-react'
import { Panel, EmptyRow, ResultCount, Pager } from './ui'
import { fetchReviews, createReview, saveReview, deleteReview, fetchProducts } from './auth'

const PER_PAGE = 12
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const stars = (n) => '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n)

export default function AdminReviews() {
  const [rows, setRows] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [busyId, setBusyId] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | review

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [r, p] = await Promise.all([fetchReviews(), fetchProducts().catch(() => [])])
      setRows(r)
      setProducts(p)
    } catch (e) {
      setError(e.message || 'Could not load reviews.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase()
    if (!n) return rows
    return rows.filter((r) =>
      [r.name, r.product, r.product_slug, r.title, r.body].some((v) => (v || '').toLowerCase().includes(n)),
    )
  }, [q, rows])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const view = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const toggle = async (r) => {
    setBusyId(r.id)
    try {
      await saveReview(r.id, { is_approved: !r.is_approved })
      setRows((list) => list.map((x) => (x.id === r.id ? { ...x, is_approved: !x.is_approved } : x)))
    } catch (e) {
      alert(e.message)
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (r) => {
    if (!window.confirm(`Delete ${r.name}'s review? This cannot be undone.`)) return
    setBusyId(r.id)
    try {
      await deleteReview(r.id)
      setRows((list) => list.filter((x) => x.id !== r.id))
    } catch (e) {
      alert(e.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <Panel
        title="Reviews"
        actions={
          <>
            <button className="a-btn a-btn-sm" onClick={load}><RefreshCw size={14} /> Refresh</button>
            <button className="a-btn a-btn-sm a-btn-primary" onClick={() => setEditing('new')}>
              <Plus size={14} /> Add review
            </button>
          </>
        }
        toolbar={
          <>
            <span className="a-dim text-[0.8rem]">{rows.length} total</span>
            <div className="flex-1" />
            <div className="a-input-wrap w-full sm:w-64">
              <Search size={15} />
              <input
                className="a-input a-input-sm"
                placeholder="Search reviews"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1) }}
              />
            </div>
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
              <th className="hidden sm:table-cell">Product</th>
              <th>Review</th>
              <th className="hidden md:table-cell">Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="py-12 text-center a-mute"><Loader2 size={16} className="mx-auto animate-spin" /></td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={5} className="py-8 text-center text-red-600">{error}</td></tr>
            )}
            {!loading && !error && view.length === 0 && (
              <EmptyRow colSpan={5} label={q ? 'No reviews match your search' : 'No reviews yet'} />
            )}
            {!loading && !error && view.map((r) => (
              <tr key={r.id} className="cursor-pointer" onClick={() => setEditing(r)}>
                <td className="hidden sm:table-cell a-dim text-[0.8rem]">
                  {r.product || r.product_slug}
                  <span className="a-mute a-mono block text-[0.68rem]">{r.product_slug}</span>
                </td>
                <td>
                  <p className="text-[0.82rem] text-[var(--a-warn)]">{stars(r.rating)}</p>
                  <p className="font-medium">
                    {r.name}
                    {r.title && <span className="a-dim font-normal"> — {r.title}</span>}
                  </p>
                  <p className="a-mute text-[0.8rem] max-w-[46ch] line-clamp-2">{r.body}</p>
                </td>
                <td className="hidden md:table-cell a-dim whitespace-nowrap">{fmtDate(r.created_at)}</td>
                <td>
                  <span className={`a-badge ${r.is_approved ? 'a-badge--green' : 'a-badge--gray'}`}>
                    {r.is_approved ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button className="a-iconbtn" title="Edit" onClick={() => setEditing(r)}>
                      <Pencil size={14} />
                    </button>
                    <button
                      className="a-iconbtn"
                      title={r.is_approved ? 'Hide from storefront' : 'Publish'}
                      onClick={() => toggle(r)}
                      disabled={busyId === r.id}
                    >
                      {busyId === r.id ? <Loader2 size={14} className="animate-spin" /> : r.is_approved ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      className="a-iconbtn text-[var(--a-danger)]"
                      title="Delete"
                      onClick={() => remove(r)}
                      disabled={busyId === r.id}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {editing !== null && (
        <ReviewForm
          review={editing === 'new' ? null : editing}
          products={products}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }}
        />
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */

function ReviewForm({ review, products, onClose, onSaved }) {
  const isNew = !review
  const [f, setF] = useState(() => ({
    variant_slug: review?.product_slug || products[0]?.slug || '',
    name: review?.name || '',
    rating: review?.rating || 5,
    title: review?.title || '',
    body: review?.body || '',
    is_approved: review?.is_approved ?? true,
  }))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const set = (k) => (e) =>
    setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const save = async () => {
    setErr('')
    if (!f.name.trim()) return setErr('Enter the reviewer name.')
    if (!f.body.trim()) return setErr('Enter the review text.')
    if (!f.variant_slug) return setErr('Pick a product.')

    const payload = {
      variant_slug: f.variant_slug,
      name: f.name.trim(),
      rating: Number(f.rating),
      title: f.title.trim() || null,
      body: f.body.trim(),
      is_approved: f.is_approved,
    }
    setBusy(true)
    try {
      if (isNew) await createReview(payload)
      else await saveReview(review.id, payload)
      onSaved()
    } catch (e) {
      setErr(e.message || 'Could not save the review.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="a-card w-full max-w-lg p-6"
        style={{ borderRadius: 'var(--a-radius-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{isNew ? 'Add review' : 'Edit review'}</h2>
          <button className="a-iconbtn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="space-y-3.5">
          <Field label="Product">
            <select className="a-select" value={f.variant_slug} onChange={set('variant_slug')}>
              {products.length === 0 && <option value="">No products</option>}
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>{p.oil} — {p.size_long}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Field label="Reviewer name">
              <input className="a-input" value={f.name} onChange={set('name')} />
            </Field>
            <Field label="Rating">
              <select className="a-select w-24" value={f.rating} onChange={set('rating')}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </Field>
          </div>

          <Field label="Title (optional)">
            <input className="a-input" value={f.title} onChange={set('title')} maxLength={120} />
          </Field>
          <Field label="Review">
            <textarea className="a-textarea" rows={4} value={f.body} onChange={set('body')} maxLength={2000} />
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.is_approved} onChange={set('is_approved')} className="h-4 w-4 cursor-pointer" />
            Published — visible on the storefront
          </label>

          {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
        </div>

        <div className="mt-5 flex items-center gap-2" style={{ borderTop: '1px solid var(--a-border)', paddingTop: '1rem' }}>
          <button className="a-btn a-btn-sm a-btn-primary flex-1" onClick={save} disabled={busy}>
            {busy && <Loader2 size={14} className="animate-spin" />}
            {isNew ? 'Create review' : 'Save changes'}
          </button>
          <button className="a-btn a-btn-sm" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wide a-mute">{label}</span>
      {children}
    </label>
  )
}
