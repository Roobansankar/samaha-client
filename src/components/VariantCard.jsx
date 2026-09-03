import { useState } from 'react'
import { Link } from 'react-router-dom'

const rupees = (n) => `₹${n.toLocaleString('en-IN')}`

export default function VariantCard({ v, tint, blurb }) {
  const [broken, setBroken] = useState(false)

  return (
    <article className="group flex flex-col overflow-hidden rounded-md border border-line bg-white transition-shadow duration-200 hover:shadow-md">

      {/* image */}
      <div className="relative aspect-[4/3]" style={{ background: tint || 'var(--color-paper-2)' }}>
        <span className="absolute inset-y-0 left-0 z-10 grid w-8 place-items-center overflow-hidden bg-olive-900">
          <span className="rotate-180 whitespace-nowrap px-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-on-olive [writing-mode:vertical-rl]">
            Cold Pressed · {v.sizeLong}
          </span>
        </span>

        {v.image && !broken ? (
          <img
            src={v.image}
            alt={v.title || `${v.oil} ${v.sizeLong}`}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="absolute inset-0 h-full w-full object-contain py-3 pl-10 pr-3 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center pl-8 text-center text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-olive-900/25">
            Image coming soon
          </div>
        )}

        <span className="absolute right-3 top-3 z-10 rounded-md bg-clay-500 px-2.5 py-1 text-[0.66rem] font-semibold text-white">
          Save {rupees(v.save)}
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-[0.9rem] font-semibold leading-snug text-olive-900">
          {v.title || v.name || `${v.oil} — ${v.sizeLong}`}
        </h4>

        <p className="mt-2.5 text-[0.72rem] font-medium text-text-mute">Bestseller</p>
        {blurb && (
          <span className="mt-1 inline-block self-start rounded border border-line px-2 py-0.5 text-[0.68rem] leading-tight text-text-mute">
            {blurb}
          </span>
        )}

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-semibold text-clay-600">{rupees(v.price)}</span>
          <span className="text-sm text-text-mute line-through">{rupees(v.mrp)}</span>
        </div>

        <Link
          to={`/shop/${v.slug}`}
          className="mt-3.5 rounded bg-olive-900 py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-olive-800"
        >
          Add to cart
        </Link>
      </div>
    </article>
  )
}
