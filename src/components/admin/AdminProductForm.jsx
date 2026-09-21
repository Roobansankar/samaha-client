import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Plus, Sparkles, Trash2, X } from 'lucide-react'
import {
  fetchProduct, createProduct, updateProduct, deleteProduct, uploadProductImage,
} from './auth'
import SeoFields from './SeoFields'
import { seoFromApi, seoToApi } from './seoForm'
import { TEMPLATE_KEYS, buildTemplate, displayNameFor, shortNameFor, suggestMrp } from './productTemplates'

const OILS = {
  'Coconut Oil': { oil_slug: 'coconut-oil', tag: 'Coconut', tint: '#e6e1d4' },
  'Groundnut Oil': { oil_slug: 'groundnut-oil', tag: 'Groundnut', tint: '#e8d8ba' },
  'Sesame Oil': { oil_slug: 'sesame-oil', tag: 'Sesame', tint: '#d4b896' },
}
/* size_long (what you pick)  ->  short label stored in `size` */
const SIZES = { '500 ml': '1/2 L', '1 Litre': '1 L', '5 Litres': '5 L', '16 Litre Tin': '16 L tin' }
const SIZE_SUFFIX = { '500 ml': '500ml', '1 Litre': '1l', '5 Litres': '5l', '16 Litre Tin': '16l' }

const slugify = (s) =>
  String(s || 'oil')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'oil'

const oilMetaFor = (oil) => {
  if (OILS[oil]) return OILS[oil]
  // custom oil: derive slug/tag/tint
  const clean = String(oil || '').trim() || 'Custom Oil'
  const tag = clean.replace(/\s+oil$/i, '').trim() || clean
  return { oil_slug: slugify(clean), tag, tint: '#e6e1d4' }
}

const sizeShortFor = (sizeLong) => {
  if (SIZES[sizeLong]) return SIZES[sizeLong]
  return String(sizeLong || '').trim() || sizeLong
}

const sizeSuffixFor = (sizeLong) => {
  if (SIZE_SUFFIX[sizeLong]) return SIZE_SUFFIX[sizeLong]
  return slugify(sizeLong).replace(/-/g, '')
}

const slugFor = (oil, sizeLong) => `${oilMetaFor(oil).oil_slug}-${sizeSuffixFor(sizeLong) || 'size'}`

const blank = {
  oil: 'Coconut Oil',
  size_long: '1 Litre',
  name: '',
  short_name: '',
  blurb: '',
  tagline: '',
  description: '',
  price: '',
  mrp: '',
  stock: '',
  badge: '',
  is_active: true,
  images: [],
  ...seoFromApi(),
  sku: '',
  gtin: '',
  mpn: '',
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()

  const [f, setF] = useState(blank)
  const [loading, setLoading] = useState(!isNew)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [note, setNote] = useState(null) // { text, oil, size } — shown only while that oil + size is still selected
  const [fedFor, setFedFor] = useState(null) // { oil, size, values } the template last loaded, and exactly what it typed

  useEffect(() => {
    if (isNew) return
    let alive = true
    fetchProduct(id)
      .then((p) => {
        if (!alive) return
        setF({
          oil: p.oil || 'Coconut Oil',
          size_long: p.size_long || '1 Litre',
          name: p.name || '',
          short_name: p.short_name || '',
          blurb: p.blurb || '',
          tagline: p.tagline || '',
          description: p.description || '',
          price: p.price ?? '',
          mrp: p.mrp ?? '',
          stock: p.stock ?? '',
          badge: p.badge || '',
          is_active: p.is_active ?? true,
          images: p.images || [],
          ...seoFromApi(p),
          sku: p.sku || '',
          gtin: p.gtin || '',
          mpn: p.mpn || '',
        })
      })
      .catch((e) => alive && setErr(e.message || 'Could not load this product.'))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [id, isNew])

  const set = (k) => (e) =>
    setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const onOilChange = (e) => {
    const oil = e.target.value
    setF((s) => ({ ...s, oil }))
  }

  const onOilSelect = (e) => {
    const v = e.target.value
    if (v === '__custom') setF((s) => ({ ...s, oil: OILS[s.oil] ? '' : s.oil }))
    else setF((s) => ({ ...s, oil: v }))
  }

  const onSizeChange = (e) => {
    const size_long = e.target.value
    setF((s) => ({ ...s, size_long }))
  }

  const onSizeSelect = (e) => {
    const v = e.target.value
    if (v === '__custom') setF((s) => ({ ...s, size_long: SIZES[s.size_long] ? '' : s.size_long }))
    else setF((s) => ({ ...s, size_long: v }))
  }

  const oilSelectValue = OILS[f.oil] ? f.oil : '__custom'
  const sizeSelectValue = SIZES[f.size_long] ? f.size_long : '__custom'

  const setImageAt = (i, url) =>
    setF((s) => {
      const images = [...s.images]
      if (url) images[i] = url
      else images.splice(i, 1)
      const next = images.filter(Boolean)

      // a share image that is empty, or just mirrors the first photo (or the template's standard photo),
      // follows the first photo; one the admin set to something else is left alone
      const mirrors = !s.og_image || s.og_image === (s.images[0] ?? fedFor?.values.og_image)
      return { ...s, images: next, ...(mirrors && next[0] !== s.images[0] ? { og_image: next[0] ?? '' } : {}) }
    })

  const slug = slugFor(f.oil, f.size_long)

  /* "Auto feed template": fill every field the template can (names, copy, price, stock, SKU, search + share text) for the chosen oil + size. */
  const feedTemplate = () => {
    const oil = f.oil.trim()
    const sizeLong = String(f.size_long || '').trim()
    if (!oil || !sizeLong) {
      setNote(null)
      return setErr('Choose the oil and pack size first, then load the template.')
    }

    const { values, known } = buildTemplate({ oil, sizeLong, slug, firstImage: f.images[0] || '' })
    const fed = fedFor?.values ?? {} // what this button typed last time

    // only ask when it would overwrite something the admin typed (not our own earlier fill)
    const overwritesTyped = TEMPLATE_KEYS.some((k) => {
      if (values[k] === null) return false
      const raw = String(f[k] ?? '')
      return raw.trim() !== '' && raw !== String(values[k]) && raw !== fed[k]
    })
    if (overwritesTyped && !window.confirm('Replace what you have typed with the template?')) return

    setErr('')
    setF((s) => {
      const next = { ...s }
      for (const k of TEMPLATE_KEYS) {
        if (values[k] !== null) next[k] = String(values[k])
        else if (String(s[k] ?? '') === fed[k]) next[k] = '' // an earlier auto-fill that no longer applies
      }
      return next
    })
    setFedFor({
      oil,
      size: sizeLong,
      values: Object.fromEntries(TEMPLATE_KEYS.filter((k) => values[k] !== null).map((k) => [k, String(values[k])])),
    })

    let text = `Template loaded for ${oil} — ${sizeLong}.`
    if (!known) text += ` There is no ready-made blurb, tagline or description for "${oil}" — write those and the price yourself; the name, SKU and search text are filled.`
    else if (values.price === null) text += ` "${sizeLong}" is not in the standard price list — enter the price yourself (an MRP suggestion follows it).`
    else text += ` Price ₹${values.price}, MRP ₹${values.mrp}.`
    text += ` Stock is a placeholder (${values.stock}) — set your real count. Still to do: add product photos; GTIN and MPN stay empty unless you have real barcodes.`
    setNote({ oil, size: sizeLong, text })
  }

  // what is selected now vs. what the template was loaded for
  const oilNow = f.oil.trim()
  const sizeNow = String(f.size_long || '').trim()
  const templateStale = Boolean(fedFor) && (fedFor.oil !== oilNow || fedFor.size !== sizeNow)
  const noteText = note && note.oil === oilNow && note.size === sizeNow ? note.text : ''

  const save = async () => {
    setErr('')
    if (!f.price || Number(f.price) <= 0) return setErr('Enter a selling price.')
    if (f.stock === '' || Number(f.stock) < 0) return setErr('Enter the stock quantity.')

    const meta = oilMetaFor(f.oil)
    const sizeLong = String(f.size_long || '').trim()
    if (!f.oil.trim()) return setErr('Enter oil name.')
    if (!sizeLong) return setErr('Enter pack size.')
    const payload = {
      slug,
      name: f.name.trim() || displayNameFor(f.oil.trim(), sizeLong),
      short_name: f.short_name.trim() || shortNameFor(f.oil.trim(), sizeLong),
      oil: f.oil.trim(),
      oil_slug: meta.oil_slug,
      tag: meta.tag,
      size: sizeShortFor(sizeLong),
      size_long: sizeLong,
      blurb: f.blurb.trim() || null,
      tagline: f.tagline.trim() || null,
      description: f.description.trim() || null,
      price: Number(f.price),
      mrp: f.mrp ? Number(f.mrp) : null,
      stock: Number(f.stock),
      images: f.images.slice(0, 4),
      badge: f.badge.trim() || null,
      tint: meta.tint,
      is_active: f.is_active,
      ...seoToApi(f),
      // the template's canonical is the page's own address: keep it right if the size was changed afterwards
      ...(fedFor && f.canonical_url.trim() === fedFor.values.canonical_url ? { canonical_url: `/shop/${slug}` } : {}),
      sku: f.sku.trim() || null,
      gtin: f.gtin.trim() || null,
      mpn: f.mpn.trim() || null,
    }

    setBusy(true)
    try {
      if (isNew) await createProduct(payload)
      else await updateProduct(id, payload)
      navigate('/admin/products')
    } catch (e) {
      setErr(e.message || 'Could not save the product.')
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!window.confirm(`Delete "${f.oil} — ${f.size_long}"? This cannot be undone.`)) return
    setBusy(true)
    try {
      await deleteProduct(id)
      navigate('/admin/products')
    } catch (e) {
      setErr(e.message)
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 size={20} className="animate-spin a-mute" />
      </div>
    )
  }

  return (
    <div>
      {/* header */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link to="/admin/products" className="a-iconbtn a-iconbtn--box border" aria-label="Back to products">
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-[1.3rem] font-semibold tracking-tight">
            {isNew ? 'Add product' : f.short_name || `${f.oil} — ${f.size_long}`}
          </h1>
          <p className="a-mute a-mono text-[0.75rem]">{slug}</p>
        </div>
        <Link to="/admin/products" className="a-btn a-btn-sm">Cancel</Link>
        <button className="a-btn a-btn-sm a-btn-primary" onClick={save} disabled={busy}>
          {busy && <Loader2 size={14} className="animate-spin" />}
          {isNew ? 'Create product' : 'Save changes'}
        </button>
      </div>

      {err && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

      {templateStale ? (
        <p
          role="status"
          className="mb-4 rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--a-warn)', color: 'var(--a-warn)' }}
        >
          The oil or pack size changed after the template was loaded — click “Auto feed template” again to refresh the auto-filled fields.
        </p>
      ) : (
        noteText && (
          <p
            role="status"
            className="mb-4 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--a-border-strong)', background: 'var(--a-accent-soft)', color: 'var(--a-text-dim)' }}
          >
            {noteText}
          </p>
        )
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* main column */}
        <div className="space-y-5">
          <Card
            title="Basics"
            hint={isNew ? 'Choose the oil and pack size, then click Auto feed template to fill in the names, description, price, stock and search text.' : undefined}
            action={
              isNew ? (
                <button type="button" className="a-btn a-btn-sm" onClick={feedTemplate}>
                  <Sparkles size={14} /> Auto feed template
                </button>
              ) : null
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Oil">
                <select className="a-select" value={oilSelectValue} onChange={onOilSelect}>
                  {Object.keys(OILS).map((o) => <option key={o} value={o}>{o}</option>)}
                  <option value="__custom">Custom… (type manually)</option>
                </select>
                {oilSelectValue === '__custom' && (
                  <input
                    className="a-input mt-2"
                    value={f.oil}
                    onChange={onOilChange}
                    placeholder="e.g. Mustard Oil"
                  />
                )}
              </Field>
              <Field label="Pack size">
                <select className="a-select" value={sizeSelectValue} onChange={onSizeSelect}>
                  {Object.keys(SIZES).map((s) => <option key={s} value={s}>{s}</option>)}
                  <option value="__custom">Custom… (type manually)</option>
                </select>
                {sizeSelectValue === '__custom' && (
                  <input
                    className="a-input mt-2"
                    value={f.size_long}
                    onChange={onSizeChange}
                    placeholder="e.g. 2 Litre"
                  />
                )}
              </Field>
            </div>
            <Field label="Display name" className="mt-4">
              <input
                className="a-input"
                value={f.name}
                onChange={set('name')}
                placeholder={displayNameFor(f.oil, f.size_long)}
              />
            </Field>
            <Field label="Short name" className="mt-4">
              <input
                className="a-input"
                value={f.short_name}
                onChange={set('short_name')}
                placeholder={shortNameFor(f.oil, f.size_long)}
              />
            </Field>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Blurb">
                <input className="a-input" value={f.blurb} onChange={set('blurb')} placeholder="Cold Pressed | Small batch" />
              </Field>
              <Field label="Badge">
                <input className="a-input" value={f.badge} onChange={set('badge')} placeholder="Best seller" />
              </Field>
            </div>
            <Field label="Tagline" className="mt-4">
              <input className="a-input" value={f.tagline} onChange={set('tagline')} />
            </Field>
            <Field label="Description" className="mt-4">
              <textarea className="a-textarea" rows={6} value={f.description} onChange={set('description')} />
            </Field>
          </Card>

          <Card title="Images" hint="Up to 4. First image is used on cards. Recommended: square, at least 1200×1200px, JPG/PNG/WebP, up to 20MB.">
            <div className="flex flex-wrap gap-3">
              {[0, 1, 2, 3].map((i) => (
                <ImageSlot key={i} url={f.images[i]} name={f.name.trim() || `${f.oil} ${f.size_long}`} onChange={(url) => setImageAt(i, url)} />
              ))}
            </div>
          </Card>

          <Card title="Search & sharing (SEO)" hint="How this product looks in Google and when a link is shared. Everything is optional — empty fields use automatic text.">
            <SeoFields
              values={f}
              onChange={(k, v) => setF((s) => ({ ...s, [k]: v }))}
              fallback={{
                title: `${f.short_name.trim() || shortNameFor(f.oil, f.size_long)} | Samaha`,
                description: `Buy ${f.short_name.trim() || shortNameFor(f.oil, f.size_long)} online from Samaha. ${f.tagline.trim()}`.trim(),
                path: `/shop/${slug}`,
              }}
            />
          </Card>
        </div>

        {/* side column */}
        <div className="space-y-5">
          <Card title="Status">
            <label className="flex items-center gap-2.5 text-sm">
              <input type="checkbox" checked={f.is_active} onChange={set('is_active')} className="h-4 w-4 cursor-pointer" />
              Active — visible on the storefront
            </label>
            <div className="mt-4 grid gap-1 text-[0.8rem]">
              <Row k="Category" v={oilMetaFor(f.oil)?.tag} />
              <Row k="Slug" v={slug} mono />
            </div>
          </Card>

          <Card title="Pricing">
            <Field label="Selling price (₹)">
              <input className="a-input" type="number" min="0" value={f.price} onChange={set('price')} />
            </Field>
            <Field label="MRP (₹)" className="mt-4">
              <input
                className="a-input"
                type="number"
                min="0"
                value={f.mrp}
                onChange={set('mrp')}
                placeholder={String(suggestMrp(f.price) || '')}
              />
            </Field>
          </Card>

          <Card title="Inventory">
            <Field label="Stock quantity">
              <input className="a-input" type="number" min="0" value={f.stock} onChange={set('stock')} />
            </Field>
          </Card>

          <Card title="Product identifiers" hint="Optional. Only enter real codes — they are used for Google search and Shopping.">
            <Field label="SKU">
              <input className="a-input" value={f.sku} onChange={set('sku')} placeholder={slug} />
            </Field>
            <Field label="GTIN / barcode" className="mt-4">
              <input className="a-input" inputMode="numeric" value={f.gtin} onChange={set('gtin')} placeholder="8, 12, 13 or 14 digits" />
            </Field>
            <Field label="MPN" className="mt-4">
              <input className="a-input" value={f.mpn} onChange={set('mpn')} />
            </Field>
          </Card>

          {!isNew && (
            <button className="a-btn a-btn-sm w-full text-[var(--a-danger)]" onClick={remove} disabled={busy}>
              <Trash2 size={14} /> Delete product
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Card({ title, hint, action, children }) {
  return (
    <div className="a-card" style={{ borderRadius: 'var(--a-radius-lg)' }}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--a-border)' }}>
        <div className="min-w-0 flex-1 basis-64">
          <h2 className="text-[0.95rem] font-semibold">{title}</h2>
          {hint && <p className="a-mute mt-0.5 text-[0.75rem]">{hint}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Row({ k, v, mono }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="a-mute">{k}</span>
      <span className={mono ? 'a-mono a-dim' : 'a-dim'}>{v || '—'}</span>
    </div>
  )
}

function ImageSlot({ url, name, onChange }) {
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const res = await uploadProductImage(file, name)
      onChange(res.url)
    } catch (err) {
      alert(err.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  if (url) {
    return (
      <div className="relative">
        <img
          src={url}
          alt=""
          className="h-24 w-24 rounded-lg border object-contain"
          style={{ borderColor: 'var(--a-border)', background: '#fff' }}
        />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[var(--a-danger)] text-white"
          aria-label="Remove image"
        >
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="grid h-24 w-24 place-items-center rounded-lg border border-dashed text-[var(--a-text-mute)]"
      style={{ borderColor: 'var(--a-border-strong)' }}
    >
      {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={pick} />
    </button>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wide a-mute">{label}</span>
      {children}
    </label>
  )
}
