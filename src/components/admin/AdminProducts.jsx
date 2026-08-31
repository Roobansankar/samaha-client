import { useMemo, useState } from 'react'
import { Search, Plus, ListFilter } from 'lucide-react'
import { Panel, StatusBadge, EmptyRow, ResultCount, Pager } from './ui'

const PRODUCTS = [
  { sku: 'CO-500', name: 'Virgin Coconut Oil', variant: '500 ml', category: 'Coconut', price: 15, stock: 148, status: 'Active' },
  { sku: 'CO-250', name: 'Virgin Coconut Oil', variant: '250 ml', category: 'Coconut', price: 9, stock: 12, status: 'Active' },
  { sku: 'CO-1000', name: 'Virgin Coconut Oil', variant: '1 L', category: 'Coconut', price: 26, stock: 64, status: 'Active' },
  { sku: 'GN-1000', name: 'Wood-pressed Groundnut Oil', variant: '1 L', category: 'Groundnut', price: 18, stock: 6, status: 'Active' },
  { sku: 'GN-500', name: 'Wood-pressed Groundnut Oil', variant: '500 ml', category: 'Groundnut', price: 11, stock: 92, status: 'Active' },
  { sku: 'PN-500', name: 'Cold-pressed Peanut Oil', variant: '500 ml', category: 'Peanut', price: 13, stock: 9, status: 'Active' },
  { sku: 'PN-1000', name: 'Cold-pressed Peanut Oil', variant: '1 L', category: 'Peanut', price: 22, stock: 41, status: 'Active' },
  { sku: 'GB-TRIO', name: 'Gift Box · Trio', variant: '3 × 250 ml', category: 'Bundle', price: 32, stock: 0, status: 'Draft' },
  { sku: 'CO-SOAP', name: 'Coconut Oil Soap Bar', variant: '100 g', category: 'Coconut', price: 6, stock: 210, status: 'Active' },
  { sku: 'GN-OLD', name: 'Groundnut Oil (old label)', variant: '500 ml', category: 'Groundnut', price: 10, stock: 0, status: 'Archived' },
]

const TINT = { Coconut: '#e6e1d4', Groundnut: '#e8d8ba', Peanut: '#e3c8a3', Bundle: '#dfe6da' }
const PER_PAGE = 8

function stockStatus(s) {
  if (s === 0) return 'Out of stock'
  if (s < 15) return 'Low stock'
  return 'In stock'
}

export default function AdminProducts() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return PRODUCTS.filter((p) => {
      const matchesQ =
        !needle || p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle)
      return matchesQ && (cat === 'all' || p.category === cat)
    })
  }, [q, cat])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const reset = (fn) => (v) => {
    fn(v)
    setPage(1)
  }

  return (
    <Panel
      title="Products"
      actions={
        <button className="a-btn a-btn-sm a-btn-primary">
          <Plus size={14} /> Add product
        </button>
      }
      toolbar={
        <>
          <select className="a-select a-select-sm sm:w-40" value={cat} onChange={(e) => reset(setCat)(e.target.value)}>
            <option value="all">Add filter</option>
            <option value="Coconut">Coconut</option>
            <option value="Groundnut">Groundnut</option>
            <option value="Peanut">Peanut</option>
            <option value="Bundle">Bundle</option>
          </select>
          <div className="flex-1" />
          <div className="a-input-wrap w-full sm:w-64">
            <Search size={15} />
            <input
              className="a-input a-input-sm"
              placeholder="Search"
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
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th className="text-right">Price</th>
            <th>Inventory</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <EmptyRow colSpan={6} label="No products match your filters" />}
          {rows.map((p) => (
            <tr key={p.sku}>
              <td>
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-[7px] text-[0.72rem] font-bold"
                    style={{ background: TINT[p.category] || 'var(--a-surface-3)', color: '#5b4a2e' }}
                  >
                    {p.category[0]}
                  </span>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-[0.75rem] a-mute">{p.variant}</p>
                  </div>
                </div>
              </td>
              <td className="a-mono a-dim">{p.sku}</td>
              <td className="a-dim">{p.category}</td>
              <td className="text-right a-mono">${p.price.toFixed(2)}</td>
              <td>
                <span className="flex items-center gap-2.5">
                  <span className="a-mono">{p.stock}</span>
                  <StatusBadge status={stockStatus(p.stock)} />
                </span>
              </td>
              <td><StatusBadge status={p.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}
