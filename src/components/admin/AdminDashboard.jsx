import { Link } from 'react-router-dom'
import {
  IndianRupee,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { StatusBadge } from './ui'
import { useAdminTheme } from './theme'

const KPIS = [
  { label: 'Revenue', value: '₹18,420', delta: 12.4, icon: IndianRupee, color: '#1a1a1a' },
  { label: 'Orders', value: '284', delta: 8.1, icon: ShoppingBag, color: '#2563eb' },
  { label: 'Customers', value: '96', delta: 5.7, icon: Users, color: '#7c3aed' },
  { label: 'Avg Order', value: '₹64.85', delta: -2.3, icon: TrendingUp, color: '#0891b2' },
]

const REVENUE = [820, 940, 760, 1180, 1020, 1340, 1240, 1560, 1420, 1680, 1580, 1920]
const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']

const RECENT_ORDERS = [
  { id: 'SAM-1042', customer: 'Aarti Menon', total: '₹78.00', status: 'Paid', date: 'Aug 31' },
  { id: 'SAM-1041', customer: 'Daniel Rowe', total: '₹46.50', status: 'Processing', date: 'Aug 31' },
  { id: 'SAM-1040', customer: 'Priya Shah', total: '₹122.00', status: 'Shipped', date: 'Aug 30' },
  { id: 'SAM-1039', customer: 'Karthik Rao', total: '₹31.00', status: 'Paid', date: 'Aug 30' },
  { id: 'SAM-1038', customer: 'Lena Fischer', total: '₹88.00', status: 'Pending', date: 'Aug 29' },
]

const TOP_PRODUCTS = [
  { name: 'Virgin Coconut Oil · 500 ml', sold: 412, revenue: '₹6,180', pct: 100 },
  { name: 'Wood-pressed Groundnut Oil · 1 L', sold: 288, revenue: '₹4,320', pct: 70 },
  { name: 'Cold-pressed Peanut Oil · 500 ml', sold: 201, revenue: '₹2,613', pct: 49 },
  { name: 'Virgin Coconut Oil · 250 ml', sold: 174, revenue: '₹1,392', pct: 42 },
]

const QUICK_STATS = [
  { label: 'Pending orders', value: '12', icon: Clock, color: '#d97706' },
  { label: 'Delivered today', value: '8', icon: CheckCircle2, color: '#16a34a' },
  { label: 'Cancelled', value: '3', icon: XCircle, color: '#dc2626' },
  { label: 'Products', value: '24', icon: Package, color: '#6366f1' },
]

function RevenueChart({ data, labels }) {
  const w = 640
  const h = 180
  const pad = 12
  const max = Math.max(...data) * 1.1
  const step = (w - pad * 2) / (data.length - 1)
  const pt = (v, i) => [pad + i * step, h - pad - (v / max) * (h - pad * 2)]
  const line = data.map((v, i) => pt(v, i).join(',')).join(' ')
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[180px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="adm-rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--a-accent)" stopOpacity="0.15" />
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
          strokeWidth="0.5"
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
  const { theme } = useAdminTheme()
  const hc = theme === 'dark' ? '#ffffff' : undefined

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[1.5rem] font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif", color: hc }}>Dashboard</h1>
          <p className="text-[0.85rem] a-dim">Welcome back. Here's your store overview.</p>
        </div>
        <Link to="/admin/orders" className="a-btn a-btn-primary mt-3 sm:mt-0">
          View orders <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => {
          const Icon = k.icon
          const up = k.delta >= 0
          return (
            <div key={k.label} className="a-card" style={{ padding: '1.1rem 1.25rem' }}>
              <div className="flex items-center justify-between">
                <span className="text-[0.78rem] font-medium a-dim">{k.label}</span>
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg"
                  style={{ background: `${k.color}10`, color: k.color }}
                >
                  <Icon size={15} />
                </span>
              </div>
              <p className="mt-2 text-[1.6rem] font-semibold tracking-tight">{k.value}</p>
              <span
                className="mt-1 inline-flex items-center gap-1 text-[0.75rem] font-medium"
                style={{ color: up ? '#16a34a' : 'var(--a-danger)' }}
              >
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {up ? '+' : ''}{k.delta}% this month
              </span>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="a-card" style={{ padding: '1.25rem' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[0.95rem] font-semibold" style={{ color: hc }}>Revenue</h2>
            <span className="text-[0.72rem] font-medium a-dim">Last 12 weeks</span>
          </div>
          <RevenueChart data={REVENUE} labels={WEEKS} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
          {QUICK_STATS.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="a-card flex items-center gap-3" style={{ padding: '1rem 1.1rem' }}>
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                  style={{ background: `${s.color}12`, color: s.color }}
                >
                  <Icon size={17} />
                </span>
                <div>
                  <p className="text-[1.15rem] font-semibold leading-tight">{s.value}</p>
                  <p className="text-[0.72rem] a-dim leading-tight">{s.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="a-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--a-border)' }}>
            <h2 className="text-[0.95rem] font-semibold" style={{ color: hc }}>Recent orders</h2>
            <Link to="/admin/orders" className="text-[0.78rem] font-medium text-[var(--a-accent)] hover:underline">
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

        <div className="a-card" style={{ padding: '1.25rem' }}>
          <h2 className="text-[0.95rem] font-semibold mb-4" style={{ color: hc }}>Top products</h2>
          <div className="space-y-3.5">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[0.82rem] font-medium truncate pr-3">{p.name}</span>
                  <span className="text-[0.78rem] font-semibold a-mono shrink-0">{p.revenue}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--a-surface-3)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.pct}%`, background: 'var(--a-accent)' }}
                    />
                  </div>
                  <span className="text-[0.7rem] a-mute shrink-0">{p.sold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
