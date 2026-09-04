import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, ListFilter, RefreshCw, Loader2, Pencil, Trash2 } from 'lucide-react'
import { Panel, StatusBadge, EmptyRow, ResultCount, Pager } from './ui'
import { fetchProducts, deleteProduct } from './auth'

const PER_PAGE = 10
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const TINT = { Coconut: '#e6e1d4', Groundnut: '#e8d8ba', Sesame: '#d4b896' }

export default function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('all')
  const [page, setPage] = useState(1)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setProducts(await fetchProducts())
    } catch (e) {
      setError(e.message || 'Could not load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return products.filter((p) => {
      const matchesQ =
        !needle ||
        p.name.toLowerCase().includes(needle) ||
        p.slug.toLowerCase().includes(needle) ||
        (p.oil || '').toLowerCase().includes(needle)
      return matchesQ && (tag === 'all' || p.tag === tag)
    })
  }, [q, tag, products])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const reset = (fn) => (v) => { fn(v); setPage(1) }
  const [busyId, setBusyId] = useState(null)

  const remove = async (p) => {
    if (!window.confirm(`Move "${p.oil} — ${p.size_long}" to Deleted?\n\nYou can restore it from the Deleted products page.`)) return
    setBusyId(p.id)
    try {
      await deleteProduct(p.id)
      setProducts((list) => list.filter((x) => x.id !== p.id))
    } catch (e) {
      alert(e.message || 'Could not delete the product.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Panel
      title="Products"
      actions={
        <>
          <button className="a-btn a-btn-sm" onClick={load}><RefreshCw size={14} /> Refresh</button>
          <button className="a-btn a-btn-sm a-btn-primary" onClick={() => navigate('/admin/products/new')}>
            <Plus size={14} /> Add product
          </button>
        </>
      }
      toolbar={
        <>
          <select className="a-select a-select-sm sm:w-40" value={tag} onChange={(e) => reset(setTag)(e.target.value)}>
            <option value="all">All categories</option>
            <option value="Coconut">Coconut</option>
            <option value="Groundnut">Groundnut</option>
            <option value="Sesame">Sesame</option>
          </select>
          <span className="a-dim text-[0.8rem]">{products.length} products</span>
          <div className="flex-1" />
          <div className="a-input-wrap w-full sm:w-64">
            <Search size={15} />
            <input
              className="a-input a-input-sm"
              placeholder="Search name / slug"
              value={q}
              onChange={(e) => reset(setQ)(e.target.value)}
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
            <th style={{ width: 56 }}>S.No</th>
            <th>Product</th>
            <th>Category</th>
            <th className="text-right">Price</th>
            <th>Inventory</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan={7} className="py-12 text-center a-mute"><Loader2 size={16} className="mx-auto animate-spin" /></td></tr>
          )}
          {!loading && error && (
            <tr><td colSpan={7} className="py-8 text-center text-red-600">{error}</td></tr>
          )}
          {!loading && !error && rows.length === 0 && (
            <EmptyRow colSpan={7} label={q || tag !== 'all' ? 'No products match your filters' : 'No products yet — add your first one'} />
          )}
          {!loading && !error && rows.map((p, i) => (
            <tr key={p.id} className="cursor-pointer" onClick={() => navigate(`/admin/products/${p.id}`)}>
              <td className="a-mono a-dim">{(safePage - 1) * PER_PAGE + i + 1}</td>
              <td>
                <div className="flex items-center gap-3">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-[7px] border object-contain"
                      style={{ borderColor: 'var(--a-border)', background: p.tint || 'var(--a-surface-2)' }}
                    />
                  ) : (
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-[7px] text-[0.7rem] font-bold"
                      style={{ background: TINT[p.tag] || 'var(--a-surface-3)', color: '#5b4a2e' }}
                    >
                      {(p.tag || p.oil || '?')[0]}
                    </span>
                  )}
                  <div>
                    <p className="font-medium">{p.oil}</p>
                    <p className="text-[0.75rem] a-mute">{p.size_long}</p>
                  </div>
                </div>
              </td>
              <td className="a-dim">{p.tag}</td>
              <td className="text-right">
                <span className="a-mono">{inr(p.price)}</span>
                {p.mrp > p.price && <span className="a-mute ml-1.5 text-[0.72rem] line-through">{inr(p.mrp)}</span>}
              </td>
              <td>
                <span className="flex items-center gap-2.5">
                  <span className="a-mono">{p.stock}</span>
                  <StatusBadge status={p.stock_status} />
                </span>
              </td>
              <td><StatusBadge status={p.is_active ? 'Active' : 'Draft'} /></td>
              <td className="text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  <button className="a-iconbtn" title="Edit" onClick={() => navigate(`/admin/products/${p.id}/edit`)}>
                    <Pencil size={14} />
                  </button>
                  <button
                    className="a-iconbtn text-[var(--a-danger)]"
                    title="Delete"
                    onClick={() => remove(p)}
                    disabled={busyId === p.id}
                  >
                    {busyId === p.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
