import { TrendingUp, TrendingDown } from 'lucide-react'

/* ---------- Page shell ---------- */

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[1.35rem] font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="a-sub mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/**
 * The single rounded card that wraps a list page (header + toolbar + table + footer).
 */
export function Panel({ title, description, actions, toolbar, footer, children }) {
  return (
    <div className="a-card" style={{ borderRadius: 'var(--a-radius-lg)' }}>
      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-5">
        <div>
          <h1 className="text-[1.3rem] font-semibold tracking-tight">{title}</h1>
          {description && <p className="a-sub mt-1">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {toolbar && (
        <div className="flex flex-col gap-2 px-5 pb-4 sm:flex-row sm:items-center sm:px-6">
          {toolbar}
        </div>
      )}

      <div className="a-tablewrap" style={{ borderTop: '1px solid var(--a-border)' }}>
        {children}
      </div>

      {footer && (
        <div
          className="flex flex-col gap-2 px-5 py-3.5 text-[0.8rem] a-dim sm:flex-row sm:items-center sm:justify-between sm:px-6"
          style={{ borderTop: '1px solid var(--a-border)' }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}

export function Toolbar({ children }) {
  return <>{children}</>
}

/* ---------- Status ---------- */

const TONE = {
  paid: 'green', captured: 'green', completed: 'green', active: 'green',
  delivered: 'green', 'in stock': 'green', fulfilled: 'green',
  processing: 'blue', shipped: 'blue',
  authorized: 'orange', pending: 'orange', 'low stock': 'orange',
  unfulfilled: 'orange', 'not fulfilled': 'orange', refunded: 'orange',
  cancelled: 'red', canceled: 'red', failed: 'red', 'out of stock': 'red',
  draft: 'gray', archived: 'gray',
}

export function StatusBadge({ status }) {
  const tone = TONE[String(status).toLowerCase()] || 'gray'
  return <span className={`a-status a-status--${tone}`}>{status}</span>
}

/* ---------- Trend ---------- */

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
            className="grid h-8 w-8 place-items-center rounded-[8px]"
            style={{ background: 'var(--a-accent-soft)', color: 'var(--a-text)' }}
          >
            <Icon size={16} />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2.5">
        <p className="text-[1.5rem] font-semibold tracking-tight a-mono">{value}</p>
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

/* ---------- Pagination ---------- */

export function ResultCount({ page, perPage, total }) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)
  return (
    <span>
      {from} — {to} of {total} results
    </span>
  )
}

export function Pager({ page, pageCount, onPage }) {
  return (
    <div className="flex items-center gap-3">
      <span>
        {page} of {pageCount} {pageCount === 1 ? 'page' : 'pages'}
      </span>
      <div className="flex items-center gap-1">
        <button
          className="a-btn a-btn-sm"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Prev
        </button>
        <button
          className="a-btn a-btn-sm"
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export function EmptyRow({ colSpan, label = 'Nothing to show' }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center a-mute">
        {label}
      </td>
    </tr>
  )
}

/* ---------- Loader ---------- */

export function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" style={{ color: 'var(--a-accent)' }} />
      <p className="text-[0.8rem] a-mute">{text}</p>
    </div>
  )
}
