import { useMemo, useState } from 'react'
import { Search, Plus, Pencil, MoreHorizontal } from 'lucide-react'
import { PageHeader, StatusBadge, Pagination, EmptyRow } from './ui'

const PRODUCTS = [
  { sku: 'CO-500', name: 'Virgin Coconut Oil', variant: '500 ml', category: 'Coconut', price: 15.0, stock: 148, status: 'Active' },
  { sku: 'CO-250', name: 'Virgin Coconut Oil', variant: '250 ml', category: 'Coconut', price: 9.0, stock: 12, status: 'Active' },
  { sku: 'CO-1000', name: 'Virgin Coconut Oil', variant: '1 L', category: 'Coconut', price: 26.0, stock: 64, status: 'Active' },
  { sku: 'GN-1000', name: 'Wood-pressed Groundnut Oil', variant: '1 L', category: 'Groundnut', price: 18.0, stock: 6, status: 'Active' },
  { sku: 'GN-500', name: 'Wood-pressed Groundnut Oil', variant: '500 ml', category: 'Groundnut', price: 11.0, stock: 92, status: 'Active' },
  { sku: 'PN-500', name: 'Cold-pressed Peanut Oil', variant: '500 ml', category: 'Peanut', price: 13.0, stock: 9, status: 'Active' },
  { sku: 'PN-1000', name: 'Cold-pressed Peanut Oil', variant: '1 L', category: 'Peanut', price: 22.0, stock: 41, status: 'Active' },
  { sku: 'GB-TRIO', name: 'Gift Box · Trio', variant: '3 × 250 ml', category: 'Bundle', price: 32.0, stock: 0, status: 'Draft' },
  { sku: 'CO-SOAP', name: 'Coconut Oil Soap Bar', variant: '100 g', category: 'Coconut', price: 6.0, stock: 210, status: 'Active' },
  { sku: 'GN-OLD', name: 'Groundnut Oil (old label)', variant: '500 ml', category: 'Groundnut', price: 10.0, stock: 0, status: 'Archived' },
]

const CATEGORY_TINT = {
  Coconut: '#e6e1d4',
  Groundnut: '#e8d8ba',
  Peanut: '#e3c8a3',
  Bundle: '#dfe6da',
}

const PER_PAGE = 8

function stockStatus(stock) {
  if (stock === 0) return 'Out of stock'
  if (stock < 15) return 'Low stock'
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
        !needle ||
        p.name.toLowerCase().includes(needle) ||
        p.sku.toLowerCase().includes(needle)
      const matchesC = cat === 'all' || p.category === cat
      return matchesQ && matchesC
    })
  }, [q, cat])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const reset = (fn) => (v) => {
    fn(v)
    setPage(1)
  }

  const activeCount = PRODUCTS.filter((p) => p.status === 'Active').length

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${activeCount} active · ${PRODUCTS.filter((p) => p.stock === 0).length} out of stock`}
        actions={
          <button className="a-btn a-btn-primary">
            <Plus size={15} /> Add product
          </button>
        }
      />

      <div className="a-card overflow-hidden">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="a-input-wrap flex-1">
            <Search size={15} />
            <input
              className="a-input"
              placeholder="Search by name or SKU…"
              value={q}
              onChange={(e) => reset(setQ)(e.target.value)}
            />
          </div>
          <select
            className="a-select sm:w-44"
            value={cat}
            onChange={(e) => reset(setCat)(e.target.value)}
          >
            <option value="all">All categories</option>
            <option value="Coconut">Coconut</option>
            <option value="Groundnut">Groundnut</option>
            <option value="Peanut">Peanut</option>
            <option value="Bundle">Bundle</option>
          </select>
        </div>

        <div className="a-tablewrap" style={{ borderTop: '1px solid var(--a-border)' }}>
          <table className="a-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th className="text-right">Price</th>
                <th>Inventory</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={7} label="No products match your filters" />}
              {rows.map((p) => (
                <tr key={p.sku}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-[0.72rem] font-bold"
                        style={{
                          background: CATEGORY_TINT[p.category] || 'var(--a-surface-3)',
                          color: '#5b4a2e',
                        }}
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
                  <td className="text-right font-semibold a-mono">${p.price.toFixed(2)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="a-mono font-medium">{p.stock}</span>
                      <StatusBadge status={stockStatus(p.stock)} />
                    </div>
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button className="a-iconbtn" aria-label="Edit product"><Pencil size={15} /></button>
                      <button className="a-iconbtn" aria-label="More"><MoreHorizontal size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={safePage} pageCount={pageCount} total={filtered.length} onPage={setPage} />
      </div>
    </div>
  )
}
