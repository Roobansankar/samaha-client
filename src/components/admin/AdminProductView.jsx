import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, ExternalLink, Loader2, Trash2 } from 'lucide-react'
import { StatusBadge } from './ui'
import { fetchProduct, deleteProduct } from './auth'

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export default function AdminProductView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [p, setP] = useState(null)
  const [err, setErr] = useState('')
  const [active, setActive] = useState(0)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    fetchProduct(id)
      .then((d) => { if (alive) setP(d) })
      .catch((e) => { if (alive) setErr(e.message || 'Could not load this product.') })
    return () => { alive = false }
  }, [id])

  if (err) {
    return (
      <div>
        <Link to="/admin/products" className="a-btn a-btn-sm"><ArrowLeft size={14} /> Products</Link>
        <p className="mt-8 text-center text-red-600">{err}</p>
      </div>
    )
  }
  if (!p) {
    return <div className="grid place-items-center py-24"><Loader2 size={20} className="animate-spin a-mute" /></div>
  }

  const images = Array.isArray(p.images) ? p.images : []

  const remove = async () => {
    if (!window.confirm(`Move "${p.oil} — ${p.size_long}" to Deleted?\n\nYou can restore it from the Deleted products page.`)) return
    setBusy(true)
    try {
      await deleteProduct(p.id)
      navigate('/admin/products')
    } catch (e) {
      alert(e.message || 'Could not delete.')
      setBusy(false)
    }
  }

  return (
    <div>
      {/* header */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link to="/admin/products" className="a-iconbtn a-iconbtn--box border" aria-label="Back to products">
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-[1.3rem] font-semibold tracking-tight">{p.oil} — {p.size_long}</h1>
          <p className="a-mute a-mono text-[0.75rem]">{p.slug}</p>
        </div>
        <a href={`/shop/${p.slug}`} target="_blank" rel="noreferrer" className="a-btn a-btn-sm">
          <ExternalLink size={14} /> View on site
        </a>
        <Link to={`/admin/products/${p.id}/edit`} className="a-btn a-btn-sm a-btn-primary">
          <Pencil size={14} /> Edit
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* main column */}
        <div className="space-y-5">
          <Card title="Images">
            {images.length === 0 ? (
              <p className="a-mute text-sm">No images uploaded yet.</p>
            ) : (
              <>
                <div
                  className="aspect-square overflow-hidden rounded-lg border"
                  style={{ borderColor: 'var(--a-border)', background: p.tint || 'var(--a-surface-2)' }}
                >
                  <img src={images[active]} alt="" className="h-full w-full object-contain p-5" />
                </div>
                {images.length > 1 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActive(i)}
                        className="h-16 w-16 overflow-hidden rounded-md border"
                        style={{ borderColor: i === active ? 'var(--a-accent)' : 'var(--a-border)', background: p.tint || 'var(--a-surface-2)' }}
                      >
                        <img src={src} alt="" className="h-full w-full object-contain p-1" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>

          <Card title="Details">
            <Field label="Display name">{p.name}</Field>
            <Field label="Short name">{p.short_name || '—'}</Field>
            <Field label="Blurb">{p.blurb || '—'}</Field>
            <Field label="Tagline">{p.tagline || '—'}</Field>
            <Field label="Description">
              <span className="whitespace-pre-line">{p.description || '—'}</span>
            </Field>
          </Card>

          {p.specs && p.specs.length > 0 && (
            <Card title="Specifications">
              <dl>
                {p.specs.map(([k, v], i) => (
                  <div
                    key={i}
                    className="flex justify-between gap-6 py-2.5 text-sm"
                    style={{ borderTop: i ? '1px solid var(--a-border)' : 'none' }}
                  >
                    <dt className="a-mute">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}
        </div>

        {/* side column */}
        <div className="space-y-5">
          <Card title="Status">
            <div className="flex items-center gap-2">
              <StatusBadge status={p.is_active ? 'Active' : 'Draft'} />
              {!p.is_active && <span className="a-mute text-xs">hidden from storefront</span>}
            </div>
            <div className="mt-4 space-y-1.5 text-[0.85rem]">
              <Row k="Category" v={p.tag} />
              <Row k="Pack size" v={p.size_long} />
              {p.badge && <Row k="Badge" v={p.badge} />}
            </div>
          </Card>

          <Card title="Pricing & stock">
            <div className="space-y-1.5 text-[0.85rem]">
              <Row k="Selling price" v={inr(p.price)} />
              <Row k="MRP" v={p.mrp ? inr(p.mrp) : '—'} />
              <Row
                k="Stock"
                v={
                  <span className="flex items-center justify-end gap-2">
                    <span className="a-mono">{p.stock}</span>
                    <StatusBadge status={p.stock_status} />
                  </span>
                }
              />
            </div>
          </Card>

          <Card title="Record">
            <div className="space-y-1.5 text-[0.85rem]">
              <Row k="Added" v={fmtDate(p.created_at)} />
              <Row k="Updated" v={fmtDate(p.updated_at)} />
              <Row k="ID" v={<span className="a-mono">#{p.id}</span>} />
            </div>
          </Card>

          <button className="a-btn a-btn-sm w-full text-[var(--a-danger)]" onClick={remove} disabled={busy}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete product
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Card({ title, children }) {
  return (
    <div className="a-card" style={{ borderRadius: 'var(--a-radius-lg)' }}>
      <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--a-border)' }}>
        <h2 className="text-[0.95rem] font-semibold">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wide a-mute">{label}</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="a-mute">{k}</span>
      <span className="a-dim text-right">{v}</span>
    </div>
  )
}
