import { Link } from 'react-router-dom'

const rupees = (n) => `₹${n.toLocaleString('en-IN')}`

/* Placeholder product image — a simple cold-press bottle silhouette. */
function BottlePlaceholder({ className = '' }) {
  return (
    <svg viewBox="0 0 120 210" className={className} aria-hidden="true">
      <rect x="49" y="4" width="22" height="20" rx="4" fill="currentColor" opacity="0.85" />
      <path
        d="M45 26h30v16l10 16v104a10 10 0 0 1-10 10H45a10 10 0 0 1-10-10V58l10-16z"
        fill="currentColor"
        opacity="0.14"
      />
      <rect x="41" y="92" width="38" height="66" rx="4" fill="currentColor" opacity="0.28" />
    </svg>
  )
}

export default function VariantCard({ v, tint, blurb }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-200 hover:shadow-md">

      {/* image */}
      <div className="relative aspect-[4/3]" style={{ background: tint || 'var(--color-paper-2)' }}>
        <span className="absolute inset-y-0 left-0 flex w-7 rotate-180 items-center justify-center bg-olive-900 text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-on-olive [writing-mode:vertical-rl]">
          Cold-Pressed {v.oil} · {v.sizeLong}
        </span>

        <div className="flex h-full items-center justify-center py-3 pl-7">
          <BottlePlaceholder className="h-full max-h-[150px] w-auto text-olive-900 transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
        </div>

        <span className="absolute right-3 top-3 rounded-md bg-clay-500 px-2.5 py-1 text-[0.66rem] font-semibold text-white">
          Save {rupees(v.save)}
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-[0.9rem] font-semibold leading-snug text-olive-900">
          {v.title}
        </h4>

        <p className="mt-2.5 text-[0.72rem] font-medium text-text-mute">Bestseller</p>
        {blurb && (
          <span className="mt-1 inline-block self-start rounded border border-line px-2 py-0.5 text-[0.68rem] text-text-mute">
            {blurb}
          </span>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-semibold text-clay-600">{rupees(v.price)}</span>
          <span className="text-sm text-text-mute line-through">{rupees(v.mrp)}</span>
        </div>

        <Link
          to={`/shop/${v.slug}`}
          className="mt-3.5 rounded-lg bg-olive-900 py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-olive-800"
        >
          Add to cart
        </Link>
      </div>
    </article>
  )
}
