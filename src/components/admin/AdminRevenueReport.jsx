import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, RefreshCw, CircleDollarSign, Wallet, TrendingUp,
  Search, X, FileDown, FileSpreadsheet, CalendarDays,
} from 'lucide-react'
import { PageHeader, StatCard, EmptyRow, Loader } from './ui'
import { fetchDashboard, fetchExpenses, fetchOrders } from './auth'
import { orderStatusLabel } from '../../lib/orderInvoice'

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
const dayStart = (s) => { const d = new Date(`${s}T00:00:00`); return isNaN(d) ? null : d }
const dayEnd = (s) => { const d = new Date(`${s}T23:59:59.999`); return isNaN(d) ? null : d }

const isPaid = (o) => o.status === 'paid'

export default function AdminRevenueReport() {
  const [dash, setDash] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState('')

  /* ---- filters ---- */
  const [q, setQ] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [pay, setPay] = useState('all') // all | online | cod
  const [cat, setCat] = useState('all')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [d, e, o] = await Promise.all([fetchDashboard(), fetchExpenses(), fetchOrders()])
      setDash(d)
      setExpenses(e.expenses || [])
      setOrders((Array.isArray(o) ? o : []).filter(isPaid))
    } catch (err) {
      setError(err.message || 'Could not load the report.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const categories = useMemo(() => {
    const s = new Set()
    expenses.forEach((e) => { if (e.category) s.add(e.category) })
    return [...s].sort()
  }, [expenses])

  const inRange = (dateStr, f, t) => {
    if (!f && !t) return true
    const d = new Date(dateStr)
    if (isNaN(d)) return true
    if (f && d < f) return false
    if (t && d > t) return false
    return true
  }

  const f = from ? dayStart(from) : null
  const t = to ? dayEnd(to) : null
  const needle = q.trim().toLowerCase()
  const filtersActive = !!(needle || from || to || pay !== 'all' || cat !== 'all')

  const filteredOrders = useMemo(() => orders.filter((o) => {
    if (!inRange(o.placed_at, f, t)) return false
    if (pay !== 'all' && (o.payment_method || 'online') !== pay) return false
    if (!needle) return true
    const hay = `${o.order_number ?? ''} ${o.customer ?? ''} ${o.email ?? ''} ${o.payment_id ?? ''}`.toLowerCase()
    return hay.includes(needle)
  }), [orders, needle, f?.getTime(), t?.getTime(), pay]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredExpenses = useMemo(() => expenses.filter((e) => {
    if (!inRange(e.spent_at || e.created_at, f, t)) return false
    if (cat !== 'all' && (e.category || '') !== cat) return false
    if (!needle) return true
    const hay = `${e.title ?? ''} ${e.category ?? ''} ${e.note ?? ''}`.toLowerCase()
    return hay.includes(needle)
  }), [expenses, needle, f?.getTime(), t?.getTime(), cat]) // eslint-disable-line react-hooks/exhaustive-deps

  const fCollected = filteredOrders.reduce((s, o) => s + Number(o.total || 0), 0)
  const fExpTotal = filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0)
  const fNet = fCollected - fExpTotal

  const monthlyRows = useMemo(() => {
    if (!dash?.monthly) return []
    return dash.monthly
      .map((m, i) => {
        const exp = dash.monthly_expenses?.[i] ?? 0
        return { label: m.label, collected: m.revenue || 0, expenses: exp, net: (m.revenue || 0) - exp }
      })
      .filter((r) => r.collected !== 0 || r.expenses !== 0 || r.net !== 0)
  }, [dash])

  const clearFilters = () => { setQ(''); setFrom(''); setTo(''); setPay('all'); setCat('all') }
  const preset = (kind) => {
    const today = new Date()
    const iso = (d) => d.toISOString().slice(0, 10)
    if (kind === 'today') {
      const s = iso(today)
      setFrom(s); setTo(s)
    } else if (kind === 'week') {
      const end = new Date(today)
      const start = new Date(today); start.setDate(start.getDate() - 6)
      setFrom(iso(start)); setTo(iso(end))
    } else if (kind === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      setFrom(iso(start)); setTo(iso(today))
    }
  }

  /* ---- exports (use filtered rows) ---- */
  const exportExcel = async () => {
    setExporting('excel')
    try {
      const mod = await import('xlsx')
      const XLSX = mod.default || mod
      const wb = XLSX.utils.book_new()
      const rangeLabel = `${from || 'all'} → ${to || 'all'}`
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet([
          { Metric: 'Date range', Value: filtersActive ? rangeLabel : 'All time' },
          { Metric: 'Search', Value: needle || '—' },
          { Metric: 'Collected (paid orders)', Value: fCollected },
          { Metric: 'Expenses', Value: fExpTotal },
          { Metric: 'Net revenue', Value: fNet },
          { Metric: 'Paid orders', Value: filteredOrders.length },
          { Metric: 'Expense entries', Value: filteredExpenses.length },
        ]),
        'Summary',
      )
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet(filteredOrders.map((o) => ({
          Order: o.order_number ?? o.id,
          Date: fmtDateTime(o.placed_at),
          Customer: o.customer,
          Email: o.email,
          Payment: orderStatusLabel(o.status, o.payment_method),
          Method: o.payment_method,
          Total: o.total,
        }))),
        'Orders',
      )
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet(filteredExpenses.map((e) => ({
          Title: e.title,
          Category: e.category || '',
          Date: fmtDate(e.spent_at || e.created_at),
          Amount: e.amount,
          Note: e.note || '',
        }))),
        'Expenses',
      )
      XLSX.writeFile(wb, `Revenue-Report-${from || 'all'}-${to || 'all'}.xlsx`)
    } finally {
      setExporting('')
    }
  }

  const exportPDF = async () => {
    setExporting('pdf')
    try {
      const [{ jsPDF }, autoTableMod] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
      const autoTable = autoTableMod.default || autoTableMod.autoTable
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })
      const M = 14
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('Net Revenue Report', M, 16)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(110)
      doc.text(
        `${filtersActive ? `Filtered (${from || 'all'} to ${to || 'all'}${needle ? `, "${q.trim()}"` : ''})` : 'All time'} · Generated ${fmtDateTime(new Date().toISOString())}`,
        M, 22,
      )
      doc.setTextColor(20)
      doc.setFontSize(11)
      doc.text(`Collected Rs. ${fCollected.toLocaleString('en-IN')}   Expenses Rs. ${fExpTotal.toLocaleString('en-IN')}   Net Rs. ${fNet.toLocaleString('en-IN')}`, M, 30)

      autoTable(doc, {
        startY: 35,
        margin: { left: M, right: M },
        head: [['Order', 'Date', 'Customer', 'Payment', 'Total']],
        body: filteredOrders.map((o) => [
          String(o.order_number ?? o.id),
          fmtDate(o.placed_at),
          o.customer || '',
          orderStatusLabel(o.status, o.payment_method),
          `Rs. ${Number(o.total || 0).toLocaleString('en-IN')}`,
        ]),
        theme: 'plain',
        styles: { fontSize: 8 },
        headStyles: { fontStyle: 'bold', textColor: [110, 110, 110] },
      })
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        margin: { left: M, right: M },
        head: [['Expense', 'Category', 'Date', 'Amount']],
        body: filteredExpenses.map((e) => [
          e.title || '',
          e.category || '',
          fmtDate(e.spent_at || e.created_at),
          `Rs. ${Number(e.amount || 0).toLocaleString('en-IN')}`,
        ]),
        theme: 'plain',
        styles: { fontSize: 8 },
        headStyles: { fontStyle: 'bold', textColor: [110, 110, 110] },
      })
      doc.save(`Revenue-Report-${from || 'all'}-${to || 'all'}.pdf`)
    } finally {
      setExporting('')
    }
  }

  if (loading) return <Loader text="Loading revenue report…" />
  if (error) {
    return (
      <div>
        <PageHeader title="Net Revenue Report" />
        <div className="a-card a-card-pad text-center text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Net Revenue Report"
        subtitle={filtersActive
          ? `Filtered · ${filteredOrders.length} orders (${inr(fCollected)}) · ${filteredExpenses.length} expenses (${inr(fExpTotal)}) · Net ${inr(fNet)}`
          : `Collected − Expenses = Net · ${filteredOrders.length} paid orders · ${filteredExpenses.length} expenses`}
        actions={
          <>
            <Link to="/admin" className="a-btn a-btn-sm"><ArrowLeft size={14} /> Dashboard</Link>
            <button className="a-btn a-btn-sm" onClick={load}><RefreshCw size={14} /> Refresh</button>
            <button className="a-btn a-btn-sm" disabled={!!exporting} onClick={exportExcel}>
              <FileSpreadsheet size={14} /> {exporting === 'excel' ? 'Exporting…' : 'Excel'}
            </button>
            <button className="a-btn a-btn-sm a-btn-primary" disabled={!!exporting} onClick={exportPDF}>
              <FileDown size={14} /> {exporting === 'pdf' ? 'Exporting…' : 'PDF'}
            </button>
          </>
        }
      />

      {/* Summary (reflects filters) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Collection" value={inr(fCollected)} icon={CircleDollarSign} sub={`${filteredOrders.length} paid orders`} accent="green" />
        <StatCard label="Total Expenses" value={inr(fExpTotal)} icon={Wallet} sub={`${filteredExpenses.length} expense entries`} to="/admin/expenses" accent="red" />
        <StatCard label="Net Revenue" value={inr(fNet)} icon={TrendingUp} sub={`${inr(fCollected)} − ${inr(fExpTotal)}`} accent="dark" />
      </div>

      {/* Filters */}
      <div className="a-card a-card-pad mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="a-input-wrap w-full sm:w-56">
            <Search size={15} />
            <input
              className="a-input a-input-sm"
              placeholder="Search order / customer / expense"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-1.5 text-[0.8rem] a-dim">
            <CalendarDays size={14} /> From
            <input type="date" className="a-input a-input-sm w-auto" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="flex items-center gap-1.5 text-[0.8rem] a-dim">
            To
            <input type="date" className="a-input a-input-sm w-auto" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
          </label>
          <select className="a-select a-select-sm w-auto" value={pay} onChange={(e) => setPay(e.target.value)}>
            <option value="all">All payments</option>
            <option value="online">Online</option>
            <option value="cod">COD</option>
          </select>
          <select className="a-select a-select-sm w-auto" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center gap-1">
            {['today', 'week', 'month'].map((p) => (
              <button key={p} className="a-btn a-btn-sm" onClick={() => preset(p)}>
                {p === 'today' ? 'Today' : p === 'week' ? '7 days' : 'Month'}
              </button>
            ))}
          </div>
          {filtersActive && (
            <button className="a-btn a-btn-sm" onClick={clearFilters}>
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Monthly net (overall calendar view) */}
      <div className="a-card mt-4 overflow-hidden">
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--a-border)' }}>
          <h2 className="text-[0.95rem] font-semibold">Month-wise net</h2>
          <p className="a-sub">Collected minus expenses per calendar month (overall, ignores filters)</p>
        </div>
        <div className="a-tablewrap">
          <table className="a-table">
            <thead>
              <tr>
                <th>Month</th>
                <th className="text-right">Collected</th>
                <th className="text-right">Expenses</th>
                <th className="text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRows.length === 0 && <EmptyRow colSpan={4} label="No data yet" />}
              {monthlyRows.map((r) => (
                <tr key={r.label}>
                  <td className="font-medium">{r.label}</td>
                  <td className="text-right a-mono">{inr(r.collected)}</td>
                  <td className="text-right a-mono">{inr(r.expenses)}</td>
                  <td className="text-right a-mono font-semibold">{inr(r.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
        {/* Paid orders */}
        <div className="a-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--a-border)' }}>
            <div>
              <h2 className="text-[0.95rem] font-semibold">Paid orders</h2>
              <p className="a-sub">{filteredOrders.length} orders · {inr(fCollected)}</p>
            </div>
            <Link to="/admin/orders" className="text-[0.8rem] font-medium a-dim hover:underline">View all</Link>
          </div>
          <div className="a-tablewrap" style={{ maxHeight: 420, overflowY: 'auto' }}>
            <table className="a-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 && <EmptyRow colSpan={3} label={filtersActive ? 'No orders match filters' : 'No paid orders yet'} />}
                {filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link to={`/admin/orders/${o.id}`} className="font-semibold a-mono hover:underline">
                        {o.order_number ?? `#${o.id}`}
                      </Link>
                      <p className="text-[0.72rem] a-mute">{o.customer} · {orderStatusLabel(o.status, o.payment_method)}</p>
                    </td>
                    <td className="a-dim text-[0.8rem] whitespace-nowrap">{fmtDate(o.placed_at)}</td>
                    <td className="text-right a-mono font-medium">{inr(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses */}
        <div className="a-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--a-border)' }}>
            <div>
              <h2 className="text-[0.95rem] font-semibold">Expenses</h2>
              <p className="a-sub">{filteredExpenses.length} entries · {inr(fExpTotal)}</p>
            </div>
            <Link to="/admin/expenses" className="text-[0.8rem] font-medium a-dim hover:underline">Manage</Link>
          </div>
          <div className="a-tablewrap" style={{ maxHeight: 420, overflowY: 'auto' }}>
            <table className="a-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 && <EmptyRow colSpan={3} label={filtersActive ? 'No expenses match filters' : 'No expenses yet'} />}
                {filteredExpenses.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <p className="font-medium">{e.title}</p>
                      {e.category && <p className="text-[0.72rem] a-mute">{e.category}</p>}
                    </td>
                    <td className="a-dim text-[0.8rem] whitespace-nowrap">{fmtDate(e.spent_at || e.created_at)}</td>
                    <td className="text-right a-mono font-medium">{inr(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
