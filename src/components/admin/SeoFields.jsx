/**
 * Shared SEO editor for products and categories.
 *
 * Every field is optional: empty means "use the generated fallback" (shown as the
 * placeholder and in the preview). Character counts are guidance only — going over
 * never blocks saving, it just turns the counter red.
 */

const TITLE_RECOMMENDED = 60
const DESCRIPTION_RECOMMENDED = 160

function Field({ label, hint, counter, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[0.72rem] font-semibold uppercase tracking-wide a-mute">{label}</span>
        {counter}
      </span>
      {children}
      {hint && <span className="a-mute mt-1 block text-[0.72rem]">{hint}</span>}
    </label>
  )
}

function Counter({ text, max }) {
  const n = text.length
  return (
    <span className={`text-[0.7rem] ${n > max ? 'font-semibold text-[var(--a-danger)]' : 'a-mute'}`}>
      {n}/{max}
    </span>
  )
}

/**
 * @param values    current form values (see SEO_FIELDS)
 * @param onChange  (key, value) => void
 * @param fallback  { title, description, path } — what the site generates when a field is empty
 */
export default function SeoFields({ values, onChange, fallback }) {
  const set = (key) => (e) => onChange(key, e.target.value)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const shownTitle = values.meta_title || fallback.title
  const shownDescription = values.meta_description || fallback.description

  return (
    <div className="space-y-4">
      {/* what Google will roughly show */}
      <div className="rounded-lg border p-3.5" style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface-2, transparent)' }}>
        <p className="a-mute text-[0.7rem] font-semibold uppercase tracking-wide">Search result preview</p>
        <p className="a-mute mt-2 truncate text-[0.78rem]">{(values.canonical_url || `${origin}${fallback.path}`).replace(/^https?:\/\//, '')}</p>
        <p className="mt-0.5 text-[1.05rem] leading-snug" style={{ color: 'var(--a-accent)' }}>{shownTitle || 'Page title'}</p>
        <p className="a-dim mt-0.5 text-[0.82rem] leading-snug">{shownDescription || 'The description search engines may show under the title.'}</p>
      </div>

      <Field
        label="SEO title"
        counter={<Counter text={values.meta_title} max={TITLE_RECOMMENDED} />}
        hint="Roughly 60 characters or fewer reads best in Google. Leave empty to use the generated title."
      >
        <input className="a-input" value={values.meta_title} onChange={set('meta_title')} placeholder={fallback.title} />
      </Field>

      <Field
        label="Meta description"
        counter={<Counter text={values.meta_description} max={DESCRIPTION_RECOMMENDED} />}
        hint="A natural sentence or two that says what the page offers — around 150–160 characters. Not a keyword list."
      >
        <textarea className="a-textarea" rows={3} value={values.meta_description} onChange={set('meta_description')} placeholder={fallback.description} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Search engines" hint="Keep “Index” unless this page should stay out of Google.">
          <select className="a-select" value={values.robots} onChange={set('robots')}>
            <option value="">Index and follow links (default)</option>
            <option value="noindex,follow">Do not index (keep out of search results)</option>
            <option value="index,nofollow">Index, but do not follow links</option>
            <option value="noindex,nofollow">Do not index, do not follow links</option>
          </select>
        </Field>

        <Field label="Canonical URL" hint="Normally the page's own address, e.g. /shop/coconut-oil-1l. Change it only to point at the preferred version of the same page on this site.">
          <input className="a-input" value={values.canonical_url} onChange={set('canonical_url')} placeholder={`${origin}${fallback.path}`} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Social share title (Open Graph)">
          <input className="a-input" value={values.og_title} onChange={set('og_title')} placeholder={shownTitle} />
        </Field>
        <Field label="Social share image URL" hint="Shown when the link is shared on WhatsApp, Facebook or X. Follows the first product photo; empty also uses the main photo.">
          <input className="a-input" value={values.og_image} onChange={set('og_image')} placeholder="/uploads/products/…" />
        </Field>
      </div>

      <Field label="Social share description">
        <textarea className="a-textarea" rows={2} value={values.og_description} onChange={set('og_description')} placeholder={shownDescription} />
      </Field>

      <Field
        label="Page content"
        hint="Extra text shown on the page itself. Separate paragraphs with a blank line. Write for shoppers, and avoid medical or health claims."
      >
        <textarea className="a-textarea" rows={7} value={values.seo_content} onChange={set('seo_content')} />
      </Field>
    </div>
  )
}
