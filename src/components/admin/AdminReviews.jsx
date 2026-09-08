import { useEffect, useMemo, useState } from 'react'
import { Search, RefreshCw, Loader2, Trash2, Eye, EyeOff } from 'lucide-react'
import { Panel, EmptyRow, ResultCount, Pager } from './ui'
import { fetchReviews, updateReview, deleteReview } from './auth'

const PER_PAGE = 12
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const stars = (n) => '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n)

export default function AdminReviews() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [busyId, setBusyId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setRows(await fetchReviews())
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
      [r.name, r.product_slug, r.title, r.body].some((v) => (v || '').toLowerCase().includes(n)),
    )
  }, [q, rows])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const view = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const toggle = async (r) => {
    setBusyId(r.id)
    try {
      await updateReview(r.id, !r.is_approved)
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
    <Panel
      title="Reviews"
      actions={<button className="a-btn a-btn-sm" onClick={load}><RefreshCw size={14} /> Refresh</button>}
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
            <tr key={r.id}>
              <td className="hidden sm:table-cell a-mono a-dim text-[0.78rem]">{r.product_slug}</td>
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
              <td className="text-right">
                <div className="flex items-center justify-end gap-1">
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
  )
}
