import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="a-h1">{title}</h1>
        {subtitle && <p className="a-sub mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Delta({ value }) {
  if (typeof value !== 'number') return null
  const up = value >= 0
  return (
    <span className={`a-delta a-delta--${up ? 'up' : 'down'}`}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(value)}%
    </span>
  )
}

export function StatCard({ label, value, delta, extra, icon: Icon }) {
  return (
    <div className="a-card a-card-pad">
      <div className="flex items-center justify-between">
        <p className="text-[0.82rem] font-medium a-dim">{label}</p>
        {Icon && (
          <span
            className="grid h-8 w-8 place-items-center rounded-[9px]"
            style={{ background: 'var(--a-accent-soft)', color: 'var(--a-accent)' }}
          >
            <Icon size={16} />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2.5">
        <p className="text-[1.55rem] font-semibold tracking-tight a-mono">{value}</p>
        <Delta value={delta} />
      </div>
      {extra && (
        <p className="mt-3 border-t pt-3 text-[0.78rem] a-dim" style={{ borderColor: 'var(--a-border)' }}>
          You gained an extra{' '}
          <span className="font-semibold" style={{ color: 'var(--a-teal)' }}>
            {extra}
          </span>{' '}
          this month
        </p>
      )}
    </div>
  )
}

const TONE = {
  paid: 'green', completed: 'green', active: 'green', delivered: 'green', 'in stock': 'green',
  processing: 'blue', shipped: 'blue', fulfilled: 'blue',
  pending: 'amber', 'low stock': 'amber', unfulfilled: 'amber', refunded: 'amber',
  cancelled: 'red', failed: 'red', 'out of stock': 'red',
  draft: 'gray', archived: 'gray',
}

export function StatusBadge({ status }) {
  const tone = TONE[String(status).toLowerCase()] || 'gray'
  return <span className={`a-badge a-badge--${tone}`}>{status}</span>
}

export function Pagination({ page, pageCount, total, onPage }) {
  if (pageCount <= 1) {
    return (
      <p className="px-4 py-3 text-[0.8rem] a-mute" style={{ borderTop: '1px solid var(--a-border)' }}>
        {total} {total === 1 ? 'result' : 'results'}
      </p>
    )
  }
  return (
    <div
      className="flex items-center justify-between gap-2 px-4 py-3"
      style={{ borderTop: '1px solid var(--a-border)' }}
    >
      <p className="text-[0.8rem] a-mute">
        Page {page} of {pageCount} · {total} results
      </p>
      <div className="flex items-center gap-1">
        <button
          className="a-iconbtn"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          className="a-iconbtn"
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export function EmptyRow({ colSpan, label = 'Nothing to show' }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center a-mute">
        {label}
      </td>
    </tr>
  )
}
