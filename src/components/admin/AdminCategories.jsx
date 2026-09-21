import { useEffect, useState } from 'react'
import { ChevronDown, ExternalLink, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchCategories, updateCategory } from './auth'
import SeoFields from './SeoFields'
import { seoFromApi, seoToApi } from './seoForm'

export default function AdminCategories() {
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    let alive = true
    fetchCategories()
      .then((r) => alive && setRows(r))
      .catch((e) => alive && setErr(e.message || 'Could not load the categories.'))
    return () => { alive = false }
  }, [])

  const onSaved = (saved) =>
    setRows((list) => list.map((r) => (r.id === saved.id ? { ...r, ...saved } : r)))

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[1.3rem] font-semibold tracking-tight">Categories &amp; SEO</h1>
        <p className="a-mute mt-1 max-w-[62ch] text-[0.85rem]">
          One page per oil (for example <span className="a-mono">/shop/coconut-oil</span>). Edit how each appears in
          Google and add the text shown on the page. Products have their own SEO on the product form.
        </p>
      </div>

      {err && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

      {!rows && !err && (
        <div className="grid place-items-center py-24">
          <Loader2 size={20} className="animate-spin a-mute" />
        </div>
      )}

      <div className="space-y-4">
        {rows?.map((row) => (
          <CategoryCard
            key={row.id}
            row={row}
            open={openId === row.id}
            onToggle={() => setOpenId(openId === row.id ? null : row.id)}
            onSaved={onSaved}
          />
        ))}
      </div>
    </div>
  )
}

function CategoryCard({ row, open, onToggle, onSaved }) {
  const [values, setValues] = useState(() => seoFromApi(row))
  const [busy, setBusy] = useState(false)

  const noindex = (row.robots || '').startsWith('noindex')

  const save = async () => {
    setBusy(true)
    try {
      const saved = await updateCategory(row.id, seoToApi(values))
      onSaved(saved)
      toast.success(`${row.name} saved`)
    } catch (e) {
      toast.error(e.message || 'Could not save')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="a-card" style={{ borderRadius: 'var(--a-radius-lg)' }}>
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 px-5 py-4 text-left" aria-expanded={open}>
        <div className="min-w-0 flex-1">
          <p className="text-[0.95rem] font-semibold">{row.name}</p>
          <p className="a-mute a-mono text-[0.75rem]">/shop/{row.slug} · {row.products} active {row.products === 1 ? 'product' : 'products'}</p>
        </div>
        <span className={`text-[0.72rem] font-semibold ${noindex ? 'text-[var(--a-danger)]' : 'a-mute'}`}>
          {noindex ? 'Hidden from Google' : 'Indexed'}
        </span>
        <ChevronDown size={16} className={`a-mute transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="space-y-4 border-t p-5" style={{ borderColor: 'var(--a-border)' }}>
          <SeoFields
            values={values}
            onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))}
            fallback={{
              title: `${row.name} — Cold-Pressed, Unrefined | Samaha`,
              description: `${row.name} from Samaha, available in several pack sizes.`,
              path: `/shop/${row.slug}`,
            }}
          />
          <div className="flex items-center gap-3">
            <button type="button" className="a-btn a-btn-sm a-btn-primary" onClick={save} disabled={busy}>
              {busy && <Loader2 size={14} className="animate-spin" />}
              Save changes
            </button>
            <a href={`/shop/${row.slug}`} target="_blank" rel="noreferrer" className="a-btn a-btn-sm">
              View page <ExternalLink size={13} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
