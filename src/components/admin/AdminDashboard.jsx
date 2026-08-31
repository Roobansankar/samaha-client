import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Users, ShoppingBag, CircleDollarSign, ArrowUpRight } from 'lucide-react'
import { PageHeader, StatCard, StatusBadge } from './ui'

const KPIS = [
  { label: 'Store visits', value: '42,236', delta: 59.3, extra: '35,000', icon: Eye },
  { label: 'Customers', value: '78,250', delta: 70.5, extra: '8,900', icon: Users },
  { label: 'Orders', value: '18,800', delta: -27.4, extra: '1,943', icon: ShoppingBag },
  { label: 'Revenue', value: '$35,078', delta: -12.4, extra: '$20,395', icon: CircleDollarSign },
]

const TRAFFIC = {
  Month: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    views: [76, 148, 62, 101, 88, 96, 105, 91, 118, 84, 79, 132],
    sessions: [58, 100, 44, 66, 60, 72, 80, 68, 92, 70, 62, 96],
  },
  Week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    views: [88, 124, 96, 140, 118, 150, 132],
    sessions: [64, 92, 74, 104, 88, 118, 100],
  },
}

const WEEK_INCOME = [
  { d: 'Mon', v: 108 },
  { d: 'Tue', v: 128 },
  { d: 'Wed', v: 95 },
  { d: 'Thu', v: 60 },
  { d: 'Fri', v: 88 },
  { d: 'Sat', v: 76 },
  { d: 'Sun', v: 105 },
]

const RECENT_ORDERS = [
  { id: 'SAM-1042', customer: 'Aarti Menon', total: '$78.00', status: 'Paid', date: 'Aug 31' },
  { id: 'SAM-1041', customer: 'Daniel Rowe', total: '$46.50', status: 'Processing', date: 'Aug 31' },
  { id: 'SAM-1040', customer: 'Priya Shah', total: '$122.00', status: 'Shipped', date: 'Aug 30' },
  { id: 'SAM-1039', customer: 'Karthik Rao', total: '$31.00', status: 'Paid', date: 'Aug 30' },
  { id: 'SAM-1038', customer: 'Lena Fischer', total: '$88.00', status: 'Pending', date: 'Aug 29' },
]

const TOP_PRODUCTS = [
  { name: 'Virgin Coconut Oil · 500 ml', sold: 412, revenue: '$6,180', pct: 100 },
  { name: 'Wood-pressed Groundnut Oil · 1 L', sold: 288, revenue: '$4,320', pct: 70 },
  { name: 'Cold-pressed Peanut Oil · 500 ml', sold: 201, revenue: '$2,613', pct: 49 },
  { name: 'Virgin Coconut Oil · 250 ml', sold: 174, revenue: '$1,392', pct: 42 },
]

function TrafficChart({ data }) {
  const w = 720
  const h = 260
  const pl = 34
  const pr = 8
  const pt_ = 12
  const pb = 22
  const all = [...data.views, ...data.sessions]
  const max = Math.ceil((Math.max(...all) * 1.1) / 20) * 20
  const iw = w - pl - pr
  const ih = h - pt_ - pb
  const x = (i) => pl + (i / (data.labels.length - 1)) * iw
  const y = (v) => pt_ + ih - (v / max) * ih
  const path = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const area = `${path(data.views)} L${x(data.views.length - 1)},${pt_ + ih} L${pl},${pt_ + ih} Z`
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[260px] w-full">
      <defs>
        <linearGradient id="adm-traffic" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--a-teal)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--a-teal)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pl} x2={w - pr} y1={y(t)} y2={y(t)} stroke="var(--a-border)" strokeDasharray="3 4" />
          <text x={pl - 8} y={y(t) + 3} fontSize="9" textAnchor="end" fill="var(--a-text-mute)">
            {Math.round(t)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#adm-traffic)" />
      <path d={path(data.views)} fill="none" stroke="var(--a-teal)" strokeWidth="2.25" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path
        d={path(data.sessions)}
        fill="none"
        stroke="var(--a-teal)"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeDasharray="1 5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {data.labels.map((l, i) => (
        <text key={l} x={x(i)} y={h - 5} fontSize="9" textAnchor="middle" fill="var(--a-text-mute)">
          {l}
        </text>
      ))}
    </svg>
  )
}

function IncomeBars({ data }) {
  const max = Math.max(...data.map((d) => d.v))
  return (
    <div className="flex h-[150px] items-end gap-2.5">
      {data.map((d) => (
        <div key={d.d} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-[5px]"
            style={{ height: `${(d.v / max) * 100}%`, background: 'var(--a-teal)' }}
          />
          <span className="text-[0.68rem] a-mute">{d.d}</span>
        </div>
      ))}
    </div>
  )
}

const initials = (n) => n.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export default function AdminDashboard() {
  const [range, setRange] = useState('Month')

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — here's how the store is doing."
        actions={
          <Link to="/admin/orders" className="a-btn a-btn-primary">
            View orders <ArrowUpRight size={15} />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        {/* Traffic */}
        <div className="a-card">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
            <div>
              <h2 className="text-[0.95rem] font-semibold">Store traffic</h2>
              <p className="a-sub">Page views vs. sessions</p>
            </div>
            <div className="a-seg">
              {['Month', 'Week'].map((r) => (
                <button key={r} data-active={range === r} onClick={() => setRange(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="px-2 pb-3 pt-3">
            <TrafficChart data={TRAFFIC[range]} />
          </div>
        </div>

        {/* Income overview */}
        <div className="a-card a-card-pad">
          <h2 className="text-[0.95rem] font-semibold">Income overview</h2>
          <p className="a-sub">This week statistics</p>
          <p className="mt-3 text-[1.7rem] font-semibold tracking-tight a-mono">$7,650</p>
          <div className="mt-4">
            <IncomeBars data={WEEK_INCOME} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        {/* Recent orders */}
        <div className="a-card overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid var(--a-border)' }}
          >
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
                {RECENT_ORDERS.map((o) => (
                  <tr key={o.id}>
                    <td className="font-semibold a-mono">{o.id}</td>
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
                    <td className="a-dim">{o.date}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="text-right font-semibold a-mono">{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="a-card a-card-pad">
          <h2 className="mb-4 text-[0.95rem] font-semibold">Top products</h2>
          <div className="space-y-3.5">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-[0.82rem]">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="w-3.5 shrink-0 text-[0.72rem] a-mute">{i + 1}</span>
                    <span className="truncate font-medium">{p.name}</span>
                  </span>
                  <span className="shrink-0 font-semibold a-mono">{p.revenue}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="a-progress flex-1">
                    <span style={{ width: `${p.pct}%` }} />
                  </div>
                  <span className="shrink-0 text-[0.7rem] a-mute">{p.sold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
