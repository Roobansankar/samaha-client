import { Link } from 'react-router-dom'
import {
  DollarSign,
  ShoppingBag,
  Users,
  Receipt,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react'
import { PageHeader, StatCard, StatusBadge } from './ui'

const KPIS = [
  { label: 'Revenue · 30d', value: '$18,420', delta: 12.4, hint: 'vs. prev 30d', icon: DollarSign },
  { label: 'Orders · 30d', value: '284', delta: 8.1, hint: 'vs. prev 30d', icon: ShoppingBag },
  { label: 'New customers', value: '96', delta: 5.7, hint: 'this month', icon: Users },
  { label: 'Avg. order value', value: '$64.85', delta: -2.3, hint: 'vs. prev 30d', icon: Receipt },
]

const REVENUE = [820, 940, 760, 1180, 1020, 1340, 1240, 1560, 1420, 1680, 1580, 1920]
const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']

const RECENT_ORDERS = [
  { id: 'SAM-1042', customer: 'Aarti Menon', total: '$78.00', status: 'Paid', date: 'Aug 31' },
  { id: 'SAM-1041', customer: 'Daniel Rowe', total: '$46.50', status: 'Processing', date: 'Aug 31' },
  { id: 'SAM-1040', customer: 'Priya Shah', total: '$122.00', status: 'Shipped', date: 'Aug 30' },
  { id: 'SAM-1039', customer: 'Karthik Rao', total: '$31.00', status: 'Paid', date: 'Aug 30' },
  { id: 'SAM-1038', customer: 'Lena Fischer', total: '$88.00', status: 'Pending', date: 'Aug 29' },
  { id: 'SAM-1037', customer: 'Omar Haddad', total: '$54.00', status: 'Cancelled', date: 'Aug 29' },
]

const TOP_PRODUCTS = [
  { name: 'Virgin Coconut Oil · 500 ml', sold: 412, revenue: '$6,180' },
  { name: 'Wood-pressed Groundnut Oil · 1 L', sold: 288, revenue: '$4,320' },
  { name: 'Cold-pressed Peanut Oil · 500 ml', sold: 201, revenue: '$2,613' },
  { name: 'Virgin Coconut Oil · 250 ml', sold: 174, revenue: '$1,392' },
]

const LOW_STOCK = [
  { name: 'Groundnut Oil · 1 L', left: 6 },
  { name: 'Peanut Oil · 500 ml', left: 9 },
  { name: 'Coconut Oil · 250 ml', left: 12 },
]

function RevenueChart({ data, labels }) {
  const w = 640
  const h = 200
  const pad = 8
  const max = Math.max(...data) * 1.1
  const step = (w - pad * 2) / (data.length - 1)
  const pt = (v, i) => [pad + i * step, h - pad - (v / max) * (h - pad * 2)]
  const line = data.map((v, i) => pt(v, i).join(',')).join(' ')
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[200px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="adm-rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--a-accent)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--a-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={pad}
          x2={w - pad}
          y1={pad + f * (h - pad * 2)}
          y2={pad + f * (h - pad * 2)}
          stroke="var(--a-border)"
          strokeWidth="1"
        />
      ))}
      <polygon points={area} fill="url(#adm-rev)" />
      <polyline
        points={line}
        fill="none"
        stroke="var(--a-accent)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {data.map((v, i) => {
        const [x, y] = pt(v, i)
        return <circle key={i} cx={x} cy={y} r="2.5" fill="var(--a-accent)" />
      })}
      {labels.map((l, i) => (
        <text
          key={l}
          x={pad + i * step}
          y={h - 1}
          fontSize="9"
          textAnchor="middle"
          fill="var(--a-text-mute)"
        >
          {l}
        </text>
      ))}
    </svg>
  )
}

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Store performance for the last 30 days."
        actions={
          <Link to="/admin/orders" className="a-btn a-btn-primary">
            View all orders <ArrowUpRight size={15} />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Revenue */}
        <div className="a-card">
          <div className="flex items-center justify-between px-5 pt-4">
            <div>
              <h2 className="a-h2">Revenue</h2>
              <p className="a-sub">Weekly, last 12 weeks</p>
            </div>
            <span className="text-[0.78rem] font-semibold a-mono" style={{ color: '#1a7f47' }}>
              +12.4%
            </span>
          </div>
          <div className="px-3 pb-3 pt-4">
            <RevenueChart data={REVENUE} labels={WEEKS} />
          </div>
        </div>

        {/* Top products */}
        <div className="a-card">
          <div className="px-5 pt-4">
            <h2 className="a-h2">Top products</h2>
            <p className="a-sub">By units sold this month</p>
          </div>
          <div className="mt-2 px-5 pb-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div
                key={p.name}
                className="flex items-center gap-3 py-2.5"
                style={{ borderTop: i ? '1px solid var(--a-border)' : 'none' }}
              >
                <span className="a-avatar h-8 w-8 text-[0.72rem]">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.83rem] font-medium">{p.name}</p>
                  <p className="text-[0.75rem] a-mute">{p.sold} units</p>
                </div>
                <p className="text-[0.83rem] font-semibold a-mono">{p.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent orders */}
        <div className="a-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="a-h2">Recent orders</h2>
            <Link to="/admin/orders" className="text-[0.8rem] font-medium text-[var(--a-accent)] hover:underline">
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
                    <td className="font-medium a-mono">{o.id}</td>
                    <td>{o.customer}</td>
                    <td className="a-dim">{o.date}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="text-right font-semibold a-mono">{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="a-card a-card-pad">
          <div className="flex items-center gap-2">
            <span
              className="grid h-7 w-7 place-items-center rounded-md"
              style={{ background: 'rgba(183,121,31,0.14)', color: '#b7791f' }}
            >
              <AlertTriangle size={15} />
            </span>
            <h2 className="a-h2">Low stock</h2>
          </div>
          <p className="a-sub mt-1">Below the 15-unit reorder point</p>
          <div className="mt-3">
            {LOW_STOCK.map((s, i) => (
              <div
                key={s.name}
                className="flex items-center justify-between py-2.5 text-[0.83rem]"
                style={{ borderTop: i ? '1px solid var(--a-border)' : 'none' }}
              >
                <span className="truncate pr-3">{s.name}</span>
                <span className="a-badge a-badge--amber">{s.left} left</span>
              </div>
            ))}
          </div>
          <Link to="/admin/products" className="a-btn a-btn-sm mt-3 w-full">
            Manage inventory
          </Link>
        </div>
      </div>
    </div>
  )
}
