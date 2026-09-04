import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Loader2, RotateCcw, Trash2, ArrowLeft } from 'lucide-react'
import { Panel, EmptyRow, ResultCount, Pager } from './ui'
import { fetchTrashedProducts, restoreProduct, forceDeleteProduct } from './auth'

const PER_PAGE = 10
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const fmtWhen = (d) => {
  if (!d) return '—'
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminProductsTrash() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [busyId, setBusyId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setRows(await fetchTrashedProducts())
    } catch (e) {
      setError(e.message || 'Could not load deleted products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const restore = async (p) => {
    setBusyId(p.id)
    try {
      await restoreProduct(p.id)
      setRows((r) => r.filter((x) => x.id !== p.id))
    } catch (e) {
      alert(e.message || 'Could not restore.')
    } finally {
      setBusyId(null)
    }
  }

  const forceDelete = async (p) => {
    if (!window.confirm(`Permanently delete "${p.oil} — ${p.size_long}"?\n\nThis removes the product and its uploaded images for good. It cannot be undone.`)) return
    setBusyId(p.id)
    try {
      await forceDeleteProduct(p.id)
      setRows((r) => r.filter((x) => x.id !== p.id))
    } catch (e) {
      alert(e.message || 'Could not delete.')
    } finally {
      setBusyId(null)
    }
  }

  const pageCount = Math.max(1, Math.ceil(rows.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const view = rows.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  return (
    <Panel
      title="Deleted products"
      description="Restore a product to put it back on the storefront, or delete it permanently."
      actions={
        <>
          <Link to="/admin/products" className="a-btn a-btn-sm"><ArrowLeft size={14} /> Products</Link>
          <button className="a-btn a-btn-sm" onClick={load}><RefreshCw size={14} /> Refresh</button>
        </>
      }
      footer={
        <>
          <ResultCount page={safePage} perPage={PER_PAGE} total={rows.length} />
          <Pager page={safePage} pageCount={pageCount} onPage={setPage} />
        </>
      }
    >
      <table className="a-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th className="text-right">Price</th>
            <th>Deleted</th>
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
            <EmptyRow colSpan={5} label="Nothing in the trash" />
          )}
          {!loading && !error && view.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="flex items-center gap-3">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-[7px] border object-contain opacity-70"
                      style={{ borderColor: 'var(--a-border)', background: p.tint || 'var(--a-surface-2)' }}
                    />
                  ) : (
                    <span className="h-10 w-10 shrink-0 rounded-[7px]" style={{ background: 'var(--a-surface-3)' }} />
                  )}
                  <div>
                    <p className="font-medium">{p.oil}</p>
                    <p className="text-[0.75rem] a-mute">{p.size_long}</p>
                  </div>
                </div>
              </td>
              <td className="a-dim">{p.tag}</td>
              <td className="text-right a-mono a-dim">{inr(p.price)}</td>
              <td className="a-dim">{fmtWhen(p.deleted_at)}</td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    className="a-btn a-btn-sm"
                    onClick={() => restore(p)}
                    disabled={busyId === p.id}
                  >
                    {busyId === p.id ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                    Restore
                  </button>
                  <button
                    className="a-btn a-btn-sm text-[var(--a-danger)]"
                    onClick={() => forceDelete(p)}
                    disabled={busyId === p.id}
                  >
                    <Trash2 size={13} /> Delete forever
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
