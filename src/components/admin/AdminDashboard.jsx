import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, ShoppingBag, CircleDollarSign, MessageSquare, ArrowUpRight, RefreshCw } from 'lucide-react'
import { PageHeader, StatCard, StatusBadge, Loader } from './ui'
import { fetchDashboard } from './auth'

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : '—'
const badgeFor = (s) => (s === 'created' ? 'Pending' : s === 'paid' ? 'Paid' : 'Failed')
const initials = (n) => (n || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

/* ---------- charts ---------- */

function AreaChart({ labels, values, height = 210, id = 'adm-rev' }) {
  const wrapRef = useRef(null)
  const [hover, setHover] = useState(null)

  const w = 720
  const h = height
  const pl = 10
  const pr = 10
  const pt = 12
  const pb = 4
  const max = Math.max(1, Math.ceil((Math.max(...values, 1) * 1.15) / 10) * 10)
  const iw = w - pl - pr
  const ih = h - pt - pb
  const x = (i) => (values.length <= 1 ? pl + iw / 2 : pl + (i / (values.length - 1)) * iw)
  const y = (v) => pt + ih - (v / max) * ih
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const area = `${line} L${x(values.length - 1)},${pt + ih} L${x(0)},${pt + ih} Z`
  const ticks = [0, max / 2, max]

  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = ((e.clientX - rect.left) / rect.width) * w
    let best = 0
    let bd = Infinity
    values.forEach((_, i) => {
      const d = Math.abs(x(i) - px)
      if (d < bd) { bd = d; best = i }
    })
    setHover(best)
  }

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative cursor-crosshair"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${w} ${h}`} style={{ height }} className="block w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--a-teal)" stopOpacity="0.28" />
              <stop offset="1" stopColor="var(--a-teal)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <line key={t} x1={pl} x2={w - pr} y1={y(t)} y2={y(t)} stroke="var(--a-border)" strokeDasharray="3 4" />
          ))}
          <path d={area} fill={`url(#${id})`} />
          <path d={line} fill="none" stroke="var(--a-teal)" strokeWidth="2.25" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {hover != null && (
            <line x1={x(hover)} x2={x(hover)} y1={pt} y2={pt + ih} stroke="var(--a-border-strong)" />
          )}
        </svg>

        {hover != null && (
          <>
            <span
              className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2"
              style={{
                left: `${(x(hover) / w) * 100}%`,
                top: `${(y(values[hover]) / h) * 100}%`,
                background: 'var(--a-teal)',
                ['--tw-ring-color']: 'var(--a-surface)',
              }}
            />
            <span
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md px-2 py-1 text-[0.7rem] font-semibold whitespace-nowrap shadow"
              style={{
                left: `${Math.min(88, Math.max(12, (x(hover) / w) * 100))}%`,
                top: `${(y(values[hover]) / h) * 100}%`,
                marginTop: -10,
                background: 'var(--a-text)',
                color: 'var(--a-bg)',
              }}
            >
              {labels[hover]} · {inr(values[hover])}
            </span>
          </>
        )}
      </div>

      <div className="mt-1.5 flex justify-between px-1 text-[0.65rem] a-mute">
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </div>
  )
}

/* ---------- page ---------- */

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [range, setRange] = useState('Month')

  const load = async () => {
    setError('')
    try {
      setData(await fetchDashboard())
    } catch (e) {
      setError(e.message || 'Could not load the dashboard.')
    }
  }

  useEffect(() => { load() }, [])

  if (error) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <div className="a-card a-card-pad text-center text-red-600">{error}</div>
      </div>
    )
  }
  if (!data) return <Loader text="Loading dashboard…" />

  const k = data.kpis
  const kpis = [
    {
      label: 'Revenue',
      value: inr(k.revenue.value),
      delta: k.revenue.delta,
      extra: k.revenue.this_month ? inr(k.revenue.this_month) : null,
      icon: CircleDollarSign,
    },
    {
      label: 'Paid orders',
      value: k.orders.value.toLocaleString('en-IN'),
      delta: k.orders.delta,
      extra: k.orders.this_month ? `${k.orders.this_month} orders` : null,
      icon: ShoppingBag,
    },
    {
      label: 'Customers',
      value: k.customers.value.toLocaleString('en-IN'),
      delta: k.customers.delta,
      extra: k.customers.this_month ? `${k.customers.this_month} sign-ups` : null,
      icon: Users,
    },
    {
      label: 'Messages',
      value: (k.messages?.value ?? 0).toLocaleString('en-IN'),
      extra: k.messages?.unread ? `${k.messages.unread} unread` : null,
      icon: MessageSquare,
    },
  ]

  const series = range === 'Month' ? data.monthly : data.weekly

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — here's how the store is doing."
        actions={
          <>
            <button className="a-btn a-btn-sm" onClick={load}><RefreshCw size={14} /> Refresh</button>
            <Link to="/admin/orders" className="a-btn a-btn-primary">
              View orders <ArrowUpRight size={15} />
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => <StatCard key={kpi.label} {...kpi} />)}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        {/* Revenue trend */}
        <div className="a-card">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
            <div>
              <h2 className="text-[0.95rem] font-semibold">Revenue</h2>
              <p className="a-sub">From paid orders</p>
            </div>
            <div className="a-seg">
              {['Month', 'Week'].map((r) => (
                <button key={r} data-active={range === r} onClick={() => setRange(r)}>{r}</button>
              ))}
            </div>
          </div>
          <div className="px-3 pb-3 pt-3">
            <AreaChart labels={series.map((s) => s.label)} values={series.map((s) => s.revenue)} />
          </div>
        </div>

        {/* This week */}
        <div className="a-card a-card-pad">
          <h2 className="text-[0.95rem] font-semibold">Income this week</h2>
          <p className="a-sub">Last 7 days</p>
          <p className="mt-3 text-[1.7rem] font-semibold tracking-tight a-mono">{inr(data.week_revenue)}</p>
          <div className="mt-4">
            <AreaChart
              id="adm-week"
              height={150}
              labels={data.weekly.map((d) => d.label)}
              values={data.weekly.map((d) => d.revenue)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        {/* Recent orders */}
        <div className="a-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--a-border)' }}>
            <h2 className="text-[0.95rem] font-semibold">Recent orders</h2>
            <Link to="/admin/orders" className="text-[0.8rem] font-medium a-dim hover:text-[var(--a-text)] hover:underline">
              View all
            </Link>
          </div>
          <div className="a-tablewrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_orders.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-10 text-center a-mute">No orders yet</td></tr>
                )}
                {data.recent_orders.map((o) => (
                  <tr key={o.id} className="cursor-pointer" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                    <td className="font-semibold a-mono">#{o.id}</td>
                    <td>
                      <span className="flex items-center gap-2.5">
                        <span
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.62rem] font-semibold"
                          style={{ background: 'var(--a-accent-soft)', color: 'var(--a-text-dim)' }}
                        >
                          {initials(o.customer)}
                        </span>
                        {o.customer}
                      </span>
                    </td>
                    <td className="a-dim">{fmtDate(o.placed_at)}</td>
                    <td><StatusBadge status={badgeFor(o.status)} /></td>
                    <td className="text-right font-semibold a-mono">{inr(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="a-card a-card-pad">
          <h2 className="mb-4 text-[0.95rem] font-semibold">Top products</h2>
          {data.top_products.length === 0 ? (
            <p className="a-mute text-sm">No sales yet.</p>
          ) : (
            <div className="space-y-3.5">
              {data.top_products.map((p, i) => (
                <div key={i}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-[0.82rem]">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="w-3.5 shrink-0 text-[0.72rem] a-mute">{i + 1}</span>
                      <span className="truncate font-medium">{p.name}</span>
                    </span>
                    <span className="shrink-0 font-semibold a-mono">{inr(p.revenue)}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="a-progress flex-1"><span style={{ width: `${p.pct}%` }} /></div>
                    <span className="shrink-0 text-[0.7rem] a-mute">{p.sold} sold</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
