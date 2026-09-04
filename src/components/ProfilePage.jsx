import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, MapPin, User as UserIcon, LogOut,
  Plus, Pencil, Trash2, Check, Loader2, FileDown,
} from 'lucide-react'
import {
  useAccount, updateAccount, logout,
  fetchAddresses, createAddress, updateAddress, deleteAddress, makeAddressDefault,
} from '../lib/account'
import { fetchOrders } from '../lib/checkout'
import { getVariant } from '../data/products'
import { downloadOrderInvoice } from '../lib/orderInvoice'

const money2 = (n) =>
  `₹${(Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const NAV = [
  { key: 'dashboard', label: 'Dashboard', to: '/profile', Icon: LayoutDashboard },
  { key: 'orders', label: 'My orders', to: '/profile/orders', Icon: Package },
  { key: 'addresses', label: 'Addresses', to: '/profile/addresses', Icon: MapPin },
  { key: 'account', label: 'Account details', to: '/profile/account', Icon: UserIcon },
]

const card = 'rounded-2xl bg-white p-[clamp(1.25rem,3.5vw,1.75rem)] shadow-sm'
const inp =
  'w-full rounded-xl border border-olive-900/10 bg-white px-4 py-2.5 text-sm text-olive-900 outline-none transition focus:border-olive-700 focus:ring-4 focus:ring-olive-800/5'

const addressText = (a) => [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(', ')
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

/* ------------------------------------------------------------------ */

export default function ProfilePage({ view = 'dashboard' }) {
  const user = useAccount()
  if (!user) return <Navigate to="/account" replace />

  const firstName = user.name?.trim().split(/\s+/)[0] || 'there'

  return (
    <div className="min-h-[80svh] bg-[#f4f1eb] px-[clamp(1rem,3.5vw,2rem)] py-[clamp(2rem,5vw,3.5rem)]">
      <div className="mx-auto max-w-[1040px]">

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">My account</p>
            <h1
              className="mt-2 font-display font-medium text-olive-900"
              style={{ fontSize: 'clamp(1.6rem, 1.3rem + 1.4vw, 2.2rem)' }}
            >
              Hello, {firstName}
            </h1>
            <p className="mt-1 text-sm text-olive-700/60">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex items-center gap-2 rounded-xl border border-olive-900/15 bg-white/60 px-4 py-2.5 text-sm font-medium text-olive-800 transition-colors hover:bg-white cursor-pointer"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[210px_1fr] lg:items-start">
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {NAV.map(({ key, label, to, Icon }) => (
              <Link
                key={key}
                to={to}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  key === view ? 'bg-olive-900 text-paper' : 'text-olive-800 hover:bg-white'
                }`}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </Link>
            ))}
          </nav>

          <div>
            {view === 'dashboard' && <Dashboard user={user} />}
            {view === 'orders' && (
              <div className={card}>
                <h2 className="font-display text-lg font-medium text-olive-900">My orders</h2>
                <OrderList />
              </div>
            )}
            {view === 'addresses' && <Addresses />}
            {view === 'account' && <AccountDetails user={user} />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Dashboard ---------------- */

function Dashboard({ user }) {
  const [defaultAddr, setDefaultAddr] = useState(null)
  const [loadingAddr, setLoadingAddr] = useState(true)

  useEffect(() => {
    fetchAddresses()
      .then((list) => setDefaultAddr(list.find((a) => a.is_default) || list[0] || null))
      .catch(() => {})
      .finally(() => setLoadingAddr(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium text-olive-900">Account information</h2>
          <Link to="/profile/account" className="text-sm font-semibold text-olive-800 hover:underline">Edit</Link>
        </div>
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row label="Phone" value={user.phone || 'Not added'} />
          <Row label="Member since" value={fmtDate(user.created_at)} />
        </dl>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium text-olive-900">Default address</h2>
          <Link to="/profile/addresses" className="text-sm font-semibold text-olive-800 hover:underline">Manage</Link>
        </div>
        {loadingAddr ? (
          <Loader2 size={16} className="mt-4 animate-spin text-olive-700/40" />
        ) : defaultAddr ? (
          <div className="mt-3 text-sm leading-relaxed">
            <p className="font-medium text-olive-900">{defaultAddr.label || defaultAddr.name}</p>
            <p className="text-olive-700/70">{defaultAddr.name}{defaultAddr.phone ? ` · ${defaultAddr.phone}` : ''}</p>
            <p className="text-olive-700/70">{addressText(defaultAddr)}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-olive-700/60">
            No address saved yet.{' '}
            <Link to="/profile/addresses" className="font-semibold text-olive-900 underline">Add one</Link>.
          </p>
        )}
      </div>

      <div className={card}>
        <h2 className="font-display text-lg font-medium text-olive-900">Recent orders</h2>
        <OrderList limit={3} />
      </div>
    </div>
  )
}

/* ---------------- Addresses ---------------- */

function Addresses() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | address
  const [busy, setBusy] = useState(false)

  const load = () => {
    setLoading(true)
    fetchAddresses()
      .then(setList)
      .catch((e) => setError(e.message || 'Could not load addresses.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const save = async (data) => {
    setBusy(true)
    setError('')
    try {
      if (editing === 'new') await createAddress(data)
      else await updateAddress(editing.id, data)
      setEditing(null)
      load()
    } catch (e) {
      setError(e.message || 'Could not save the address.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Remove this address?')) return
    try {
      await deleteAddress(id)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const setDefault = async (id) => {
    try {
      await makeAddressDefault(id)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className={card}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-olive-900">Addresses</h2>
        {editing === null && (
          <button
            type="button"
            onClick={() => setEditing('new')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-olive-900 px-3.5 py-2 text-sm font-medium text-paper transition-colors hover:bg-olive-800 cursor-pointer"
          >
            <Plus size={15} /> Add address
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      {editing !== null && (
        <AddressForm
          initial={editing === 'new' ? null : editing}
          busy={busy}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}

      {editing === null && (
        loading ? (
          <Loader2 size={18} className="mt-6 animate-spin text-olive-700/40" />
        ) : (
          <div className="mt-4 space-y-3">
            {list.length === 0 && (
              <p className="text-sm text-olive-700/60">You haven’t added any addresses yet.</p>
            )}
            {list.map((a) => (
              <div key={a.id} className="rounded-xl border border-olive-900/10 p-4">
                <p className="text-sm font-medium text-olive-900">
                  {a.label || a.name}
                  {a.is_default && (
                    <span className="ml-2 rounded-full bg-olive-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-olive-800">
                      Default
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-olive-700/70">
                  {a.name}{a.phone ? ` · ${a.phone}` : ''}
                </p>
                <p className="text-sm text-olive-700/70">{addressText(a)}</p>

                <div className="mt-3 flex flex-wrap gap-4 text-[0.8rem] font-medium">
                  {!a.is_default && (
                    <button type="button" onClick={() => setDefault(a.id)} className="text-olive-700 transition-colors hover:text-olive-900 cursor-pointer">
                      Set as default
                    </button>
                  )}
                  <button type="button" onClick={() => setEditing(a)} className="inline-flex items-center gap-1 text-olive-700 transition-colors hover:text-olive-900 cursor-pointer">
                    <Pencil size={13} /> Edit
                  </button>
                  <button type="button" onClick={() => remove(a.id)} className="inline-flex items-center gap-1 text-red-600 transition-colors hover:text-red-700 cursor-pointer">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

function AddressForm({ initial, busy, onCancel, onSave }) {
  const [f, setF] = useState({
    label: initial?.label || '',
    name: initial?.name || '',
    phone: initial?.phone || '',
    line1: initial?.line1 || '',
    line2: initial?.line2 || '',
    city: initial?.city || '',
    state: initial?.state || '',
    pincode: initial?.pincode || '',
    is_default: initial?.is_default || false,
  })

  const set = (k) => (e) =>
    setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(f) }}
      className="mt-4 space-y-3 rounded-xl border border-olive-900/10 bg-[#faf8f3] p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <L label="Label (optional)"><input className={inp} value={f.label} onChange={set('label')} placeholder="Home, Work…" /></L>
        <L label="Full name"><input className={inp} required value={f.name} onChange={set('name')} /></L>
      </div>
      <L label="Phone"><input className={inp} value={f.phone} onChange={set('phone')} placeholder="+91 …" /></L>
      <L label="Address line 1"><input className={inp} required value={f.line1} onChange={set('line1')} /></L>
      <L label="Address line 2 (optional)"><input className={inp} value={f.line2} onChange={set('line2')} /></L>
      <div className="grid gap-3 sm:grid-cols-3">
        <L label="City"><input className={inp} required value={f.city} onChange={set('city')} /></L>
        <L label="State"><input className={inp} value={f.state} onChange={set('state')} /></L>
        <L label="PIN code"><input className={inp} value={f.pincode} onChange={set('pincode')} /></L>
      </div>
      <label className="flex items-center gap-2 text-sm text-olive-800">
        <input type="checkbox" checked={f.is_default} onChange={set('is_default')} className="h-4 w-4 accent-olive-800 cursor-pointer" />
        Set as default address
      </label>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-olive-900 px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-olive-800 disabled:opacity-60 cursor-pointer"
        >
          {busy && <Loader2 size={14} className="animate-spin" />} Save address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-olive-700 transition-colors hover:text-olive-900 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ---------------- Account details ---------------- */

function AccountDetails({ user }) {
  const [f, setF] = useState({ name: user.name || '', phone: user.phone || '', city: user.city || '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => {
    setF((s) => ({ ...s, [k]: e.target.value }))
    setSaved(false)
  }

  const save = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await updateAccount(f)
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Could not save your changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={card}>
      <h2 className="font-display text-lg font-medium text-olive-900">Account details</h2>
      <form onSubmit={save} className="mt-5 space-y-4">
        <L label="Full name"><input className={inp} required value={f.name} onChange={set('name')} /></L>
        <L label="Email"><input className={`${inp} cursor-not-allowed opacity-60`} value={user.email} disabled /></L>
        <div className="grid gap-4 sm:grid-cols-2">
          <L label="Phone"><input className={inp} value={f.phone} onChange={set('phone')} /></L>
          <L label="City"><input className={inp} value={f.city} onChange={set('city')} /></L>
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-olive-900 px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-olive-800 disabled:opacity-60 cursor-pointer"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

/* ---------------- bits ---------------- */

function Row({ label, value }) {
  return (
    <div>
      <dt className="text-[0.68rem] font-medium uppercase tracking-wide text-olive-700/50">{label}</dt>
      <dd className="mt-0.5 text-sm text-olive-900">{value}</dd>
    </div>
  )
}

function L({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.68rem] font-medium uppercase tracking-wide text-olive-700/60">{label}</span>
      {children}
    </label>
  )
}

function OrderList({ limit }) {
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => setOrders([]))
  }, [])

  if (orders === null) {
    return <Loader2 size={18} className="mt-6 animate-spin text-olive-700/40" />
  }

  if (orders.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed border-olive-900/15 py-10 text-center">
        <Package size={22} className="text-olive-700/40" />
        <p className="text-sm text-olive-700/60">You haven’t placed any orders yet.</p>
        <Link to="/shop" className="text-sm font-semibold text-olive-900 underline underline-offset-2">Browse the shop</Link>
      </div>
    )
  }

  const shown = limit ? orders.slice(0, limit) : orders

  return (
    <div className="mt-4 space-y-4">
      {shown.map((o) => (
        <OrderCard key={o.id} order={o} compact={Boolean(limit)} />
      ))}
      {limit && orders.length > limit && (
        <Link to="/profile/orders" className="inline-block text-sm font-semibold text-olive-900 underline underline-offset-2">
          View all {orders.length} orders
        </Link>
      )}
    </div>
  )
}

function OrderCard({ order, compact }) {
  const items = order.items.map((it) => {
    const v = getVariant(it.slug)
    return {
      ...it,
      image: v?.image || null,
      size: v?.sizeLong || null,
      display: v?.shortName || it.name,
    }
  })
  const units = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = order.subtotal ?? items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = order.shipping ?? 0
  const total = order.total ?? subtotal + shipping

  return (
    <div className="overflow-hidden rounded-xl border border-olive-900/10">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-[#faf8f3] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-olive-900">Order #{order.id}</p>
          <p className="text-xs text-olive-700/60">
            {fmtDate(order.placed_at)} · {units} {units === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-olive-100 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-olive-800">
            {order.status === 'paid' ? 'Paid' : order.status}
          </span>
          <span className="text-sm font-semibold text-olive-900">{money2(total)}</span>
        </div>
      </div>

      <ul className="divide-y divide-olive-900/5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            {it.image ? (
              <img
                src={it.image}
                alt=""
                className="h-14 w-14 shrink-0 rounded-lg border border-olive-900/10 bg-white object-contain p-1"
              />
            ) : (
              <span className="h-14 w-14 shrink-0 rounded-lg border border-olive-900/10 bg-olive-100/50" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-olive-900">{it.display}</p>
              {it.size && <p className="text-xs text-olive-700/60">{it.size}</p>}
              <p className="mt-0.5 text-xs text-olive-700/70">{money2(it.price)} × {it.qty}</p>
            </div>
            <p className="shrink-0 text-sm font-medium text-olive-900">{money2(it.price * it.qty)}</p>
          </li>
        ))}
      </ul>

      <div className="space-y-1 border-t border-olive-900/10 bg-[#faf8f3] px-4 py-3 text-sm">
        <div className="flex justify-between text-olive-700/70">
          <span>Subtotal</span>
          <span>{money2(subtotal)}</span>
        </div>
        <div className="flex justify-between text-olive-700/70">
          <span>Shipping</span>
          <span>{money2(shipping)}</span>
        </div>
        <div className="flex justify-between pt-1 font-semibold text-olive-900">
          <span>Total</span>
          <span>{money2(total)}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-olive-900/10 pt-2.5">
          {!compact && order.payment_id ? (
            <p className="text-[0.7rem] text-olive-700/45">
              Payment ID: <span className="font-mono">{order.payment_id}</span>
            </p>
          ) : <span />}
          <DownloadBillButton order={order} />
        </div>
      </div>
    </div>
  )
}

function DownloadBillButton({ order }) {
  const [busy, setBusy] = useState(false)
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        try {
          await downloadOrderInvoice(order)
        } catch {
          alert('Could not generate the bill. Please try again.')
        } finally {
          setBusy(false)
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-olive-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-olive-800 transition-colors hover:bg-olive-900 hover:text-paper disabled:opacity-60 cursor-pointer"
    >
      {busy ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />}
      {busy ? 'Preparing…' : 'Download bill'}
    </button>
  )
}
