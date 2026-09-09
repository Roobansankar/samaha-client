import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, RefreshCw, Loader2, Trash2, Pencil, X, UploadCloud, ExternalLink } from 'lucide-react'
import { Panel, StatusBadge, EmptyRow } from './ui'
import {
  fetchAdminBanners, createBanner, saveBanner, deleteBanner, uploadBannerImage,
} from './auth'

/* Ready-made banners (the ones the site shipped with). Picking one fills the
   whole form — image, link and text — so a bad edit is one click to undo. */
const PRESETS = [
  {
    label: 'Coconut Oil',
    image: '/slide1.webp',
    image_mobile: '/slidem1.webp',
    alt: 'Samaha cold-pressed coconut oil on a stone plinth',
    link: '/shop/coconut-oil',
    eyebrow: 'Cold-pressed · Unrefined',
    title: 'Coconut Oil',
    text: 'Pressed from fresh white kernel within hours of cracking.',
    steps: ['Fresh kernel, milled same day', 'Cold-pressed below 27°C', 'Unfiltered, bottled by hand'],
  },
  {
    label: 'Groundnut Oil',
    image: '/slide2.webp',
    image_mobile: '/slidem2.webp',
    alt: 'Samaha wood-pressed groundnut oil on a stone plinth',
    link: '/shop/groundnut-oil',
    eyebrow: 'Wood-pressed · Small batch',
    title: 'Groundnut Oil',
    text: 'Deep, warm and nutty — the way it was always meant to be made.',
    steps: ['Sun-dried groundnuts', 'Wood-pressed the slow way', 'Small, dated lots'],
  },
  {
    label: 'Sesame Oil',
    image: '/slide3.png',
    image_mobile: '/slidem3.png',
    alt: 'Samaha cold-pressed sesame oil on a stone plinth',
    link: '/shop/sesame-oil',
    eyebrow: 'Stone-ground · Cold-pressed',
    title: 'Sesame Oil',
    text: 'Rich, aromatic and deeply nutty — the finishing oil of choice.',
    steps: ['Stone-ground whole seeds', 'Cold-pressed to keep the aroma', 'A little goes a long way'],
  },
]

export default function AdminBanners() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | banner

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setRows(await fetchAdminBanners())
    } catch (e) {
      setError(e.message || 'Could not load banners.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (b) => {
    if (!window.confirm('Delete this banner? Its uploaded images are removed too.')) return
    setBusyId(b.id)
    try {
      await deleteBanner(b.id)
      setRows((list) => list.filter((x) => x.id !== b.id))
    } catch (e) {
      alert(e.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <Panel
        title="Home banners"
        description="The rotating hero at the top of the home page. Order top to bottom = order shown."
        actions={
          <>
            <button className="a-btn a-btn-sm" onClick={load}><RefreshCw size={14} /> Refresh</button>
            <button className="a-btn a-btn-sm a-btn-primary" onClick={() => setEditing('new')}>
              <Plus size={14} /> Add banner
            </button>
          </>
        }
      >
        <table className="a-table">
          <thead>
            <tr>
              <th style={{ width: '1%' }}>#</th>
              <th>Banner</th>
              <th className="hidden sm:table-cell">Link</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="py-12 text-center a-mute"><Loader2 size={16} className="mx-auto animate-spin" /></td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={5} className="py-8 text-center text-red-600">{error}</td></tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <EmptyRow colSpan={5} label="No banners yet — add your first one" />
            )}
            {!loading && !error && rows.map((b, i) => (
              <tr key={b.id} className="cursor-pointer" onClick={() => setEditing(b)}>
                <td className="a-mono a-dim">{i + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={b.image}
                      alt=""
                      className="h-11 w-20 shrink-0 rounded-md border object-cover"
                      style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface-2)' }}
                    />
                    <div className="min-w-0">
                      <p className="font-medium">{b.plain ? 'Plain image' : (b.title || 'Untitled')}</p>
                      {!b.plain && b.eyebrow && <p className="a-mute text-[0.75rem]">{b.eyebrow}</p>}
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell a-dim a-mono text-[0.78rem]">{b.link || '—'}</td>
                <td><StatusBadge status={b.is_active ? 'Active' : 'Draft'} /></td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button className="a-iconbtn" title="Edit" onClick={() => setEditing(b)}><Pencil size={14} /></button>
                    <button
                      className="a-iconbtn text-[var(--a-danger)]"
                      title="Delete"
                      onClick={() => remove(b)}
                      disabled={busyId === b.id}
                    >
                      {busyId === b.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {editing !== null && (
        <BannerForm
          banner={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }}
        />
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */

function BannerForm({ banner, onClose, onSaved }) {
  const isNew = !banner
  const [f, setF] = useState(() => ({
    image: banner?.image || '',
    image_mobile: banner?.image_mobile || '',
    alt: banner?.alt || '',
    link: banner?.link || '',
    plain: banner?.plain ?? false,
    eyebrow: banner?.eyebrow || '',
    title: banner?.title || '',
    text: banner?.text || '',
    steps: (banner?.steps || []).join('\n'),
    is_active: banner?.is_active ?? true,
    sort_order: banner?.sort_order ?? 0,
  }))
  const [imageFile, setImageFile] = useState(null)   // picked but not uploaded yet
  const [mobileFile, setMobileFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const set = (k) => (e) =>
    setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const applyPreset = (p) => {
    setImageFile(null)
    setMobileFile(null)
    setF((s) => ({
      ...s,
      image: p.image,
      image_mobile: p.image_mobile,
      alt: p.alt,
      link: p.link,
      plain: false,
      eyebrow: p.eyebrow,
      title: p.title,
      text: p.text,
      steps: p.steps.join('\n'),
    }))
  }

  const save = async () => {
    setErr('')
    if (!f.image && !imageFile) return setErr('Add the desktop / laptop image.')

    setBusy(true)
    try {
      // upload happens only now — on save
      let imageUrl = f.image
      let mobileUrl = f.image_mobile
      if (imageFile) imageUrl = (await uploadBannerImage(imageFile)).url
      if (mobileFile) mobileUrl = (await uploadBannerImage(mobileFile)).url

      const payload = {
        image: imageUrl,
        image_mobile: mobileUrl || null,
        alt: f.alt.trim() || null,
        link: f.link.trim() || null,
        plain: f.plain,
        eyebrow: f.plain ? null : (f.eyebrow.trim() || null),
        title: f.plain ? null : (f.title.trim() || null),
        text: f.plain ? null : (f.text.trim() || null),
        steps: f.plain ? [] : f.steps.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 5),
        is_active: f.is_active,
        sort_order: Number(f.sort_order) || 0,
      }

      if (isNew) await createBanner(payload)
      else await saveBanner(banner.id, payload)
      onSaved()
    } catch (e) {
      setErr(e.message || 'Could not save the banner.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="a-card flex max-h-[90vh] w-full max-w-2xl flex-col"
        style={{ borderRadius: 'var(--a-radius-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--a-border)' }}>
          <h2 className="text-base font-semibold">{isNew ? 'Add banner' : 'Edit banner'}</h2>
          <button className="a-iconbtn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* start from a default */}
          <div className="rounded-lg border p-3.5" style={{ borderColor: 'var(--a-border)' }}>
            <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide a-mute">
              Start from a default banner
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition-colors hover:bg-[var(--a-surface-2)]"
                  style={{ borderColor: 'var(--a-border-strong)' }}
                >
                  <img src={p.image} alt="" className="h-6 w-11 rounded object-cover" />
                  {p.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[0.72rem] a-mute">
              Fills the image, link and text below with the shipped design. Tweak anything after, or click again to reset it.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Dropzone
              label="Laptop / desktop image *"
              hint="Wide — around 2048 × 768"
              url={f.image}
              file={imageFile}
              onFile={setImageFile}
              onClear={() => { setImageFile(null); setF((s) => ({ ...s, image: '' })) }}
            />
            <Dropzone
              label="Mobile image"
              hint="Portrait — around 1080 × 1440"
              url={f.image_mobile}
              file={mobileFile}
              onFile={setMobileFile}
              onClear={() => { setMobileFile(null); setF((s) => ({ ...s, image_mobile: '' })) }}
            />
          </div>
          {(imageFile || mobileFile) && (
            <p className="text-[0.72rem] a-mute">New image will upload when you {isNew ? 'create' : 'save'} the banner.</p>
          )}

          <Field label="Navigate link (where this slide goes)">
            <input className="a-input" value={f.link} onChange={set('link')} placeholder="/shop/coconut-oil" />
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.plain} onChange={set('plain')} className="h-4 w-4 cursor-pointer" />
            Plain image — no text overlay, just the picture
          </label>

          {!f.plain && (
            <div className="space-y-3.5 rounded-lg border p-4" style={{ borderColor: 'var(--a-border)' }}>
              <Field label="Eyebrow">
                <input className="a-input" value={f.eyebrow} onChange={set('eyebrow')} placeholder="Cold-pressed · Unrefined" />
              </Field>
              <Field label="Title">
                <input className="a-input" value={f.title} onChange={set('title')} placeholder="Coconut Oil" />
              </Field>
              <Field label="Text">
                <textarea className="a-textarea" rows={2} value={f.text} onChange={set('text')} maxLength={500} />
              </Field>
              <Field label="Steps (mobile only — one per line, up to 5)">
                <textarea className="a-textarea" rows={3} value={f.steps} onChange={set('steps')} placeholder={'Fresh kernel, milled same day\nCold-pressed below 27°C'} />
              </Field>
            </div>
          )}

          <Field label="Alt text (for screen readers)">
            <input className="a-input" value={f.alt} onChange={set('alt')} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Sort order">
              <input className="a-input" type="number" value={f.sort_order} onChange={set('sort_order')} />
            </Field>
            <label className="flex items-end gap-2 pb-2.5 text-sm">
              <input type="checkbox" checked={f.is_active} onChange={set('is_active')} className="h-4 w-4 cursor-pointer" />
              Active — shown on the home page
            </label>
          </div>

          {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
        </div>

        <div className="flex items-center gap-2 px-6 py-4" style={{ borderTop: '1px solid var(--a-border)' }}>
          <button className="a-btn a-btn-sm a-btn-primary flex-1" onClick={save} disabled={busy}>
            {busy && <Loader2 size={14} className="animate-spin" />}
            {isNew ? 'Create banner' : 'Save changes'}
          </button>
          {f.link && (
            <a href={f.link} target="_blank" rel="noreferrer" className="a-btn a-btn-sm" title="Open link">
              <ExternalLink size={14} />
            </a>
          )}
          <button className="a-btn a-btn-sm" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function Dropzone({ label, hint, url, file, onFile, onClear }) {
  const [over, setOver] = useState(false)
  const inputRef = useRef(null)

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const take = (f) => {
    if (!f) return
    if (!f.type?.startsWith('image/')) { alert('Please choose an image file.'); return }
    onFile(f)
  }

  const shown = preview || url

  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wide a-mute">{label}</span>
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files?.[0]) }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        className="relative grid min-h-[110px] cursor-pointer place-items-center overflow-hidden rounded-lg border-2 border-dashed transition-colors"
        style={{
          borderColor: over ? 'var(--a-accent)' : 'var(--a-border-strong)',
          background: over ? 'var(--a-surface-2)' : 'transparent',
        }}
      >
        {shown ? (
          <>
            <img src={shown} alt="" className="max-h-44 w-full bg-white object-contain" />
            {file && (
              <span
                className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[0.6rem] font-semibold"
                style={{ background: 'var(--a-accent)', color: 'var(--a-accent-fg)' }}
              >
                Not uploaded yet
              </span>
            )}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClear() }}
              className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-[var(--a-danger)] text-white"
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <div className="p-4 text-center text-[0.78rem] a-mute">
            <UploadCloud size={20} className="mx-auto mb-1.5" />
            Drag &amp; drop an image, or click to browse
            {hint && <span className="mt-0.5 block text-[0.7rem]">{hint}</span>}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          hidden
          onChange={(e) => { take(e.target.files?.[0]); e.target.value = '' }}
        />
      </div>
    </label>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wide a-mute">{label}</span>
      {children}
    </label>
  )
}
