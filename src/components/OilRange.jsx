import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Grid2x2, Square } from 'lucide-react'
import { OIL_VARIANTS } from '../data/products'
import { useVisibleProducts } from '../lib/catalog'
import VariantCard from './VariantCard'

export default function OilRange() {
  const [active, setActive] = useState(0)
  const isVisible = useVisibleProducts()
  const oil = OIL_VARIANTS[active]
  const variants = oil.variants.filter((v) => isVisible(v.slug))

  const [cols, setCols] = useState(() => {
    try { return localStorage.getItem('shopCols') === '2' ? 2 : 1 } catch { return 1 }
  })
  const chooseCols = (n) => {
    setCols(n)
    try { localStorage.setItem('shopCols', String(n)) } catch { /* ignore */ }
  }

  return (
    <section className="bg-paper-inset" id="sizes" aria-label="Shop oils by size">
      <div className="mx-auto max-w-[1500px] px-4 py-[clamp(2.5rem,6vw,4.5rem)] sm:px-[clamp(1.75rem,5vw,5rem)]">

        {/* heading */}
        <div className="mx-auto max-w-[42rem] text-center">
          <p className="eyebrow">Shop by size</p>
          <h2
            className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
            style={{ fontSize: 'clamp(1.7rem, 1.2rem + 2vw, 2.6rem)' }}
          >
            Cold-pressed, in the size you need
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-soft">
            Every oil comes in 500 ml, 1 L, 5 L and 16 L tins — the bigger the
            tin, the more you save.
          </p>
        </div>

        {/* oil tabs */}
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {OIL_VARIANTS.map((o, i) => (
            <button
              key={o.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`rounded-pill px-5 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                i === active
                  ? 'bg-olive-900 text-paper'
                  : 'border border-line bg-paper text-olive-800 hover:border-olive-300'
              }`}
            >
              {o.name}
            </button>
          ))}
        </div>

        <p className="mt-3 text-center text-xs uppercase tracking-[0.16em] text-text-mute">
          {oil.blurb}
        </p>

        {/* mobile: one / two per row */}
        <div className="mt-6 flex justify-center sm:hidden">
          <div className="flex overflow-hidden rounded-lg border border-line bg-paper">
            <button
              type="button"
              onClick={() => chooseCols(1)}
              aria-label="One per row"
              aria-pressed={cols === 1}
              className={`grid h-9 w-11 place-items-center transition-colors ${cols === 1 ? 'bg-olive-900 text-paper' : 'text-olive-700'}`}
            >
              <Square size={15} />
            </button>
            <button
              type="button"
              onClick={() => chooseCols(2)}
              aria-label="Two per row"
              aria-pressed={cols === 2}
              className={`grid h-9 w-11 place-items-center transition-colors ${cols === 2 ? 'bg-olive-900 text-paper' : 'text-olive-700'}`}
            >
              <Grid2x2 size={15} />
            </button>
          </div>
        </div>

        {/* cards for the active oil */}
        <div className={`mt-4 grid gap-3 sm:mt-[clamp(1.5rem,4vw,2.5rem)] sm:gap-5 ${cols === 1 ? 'grid-cols-1' : 'grid-cols-2'} sm:grid-cols-2 lg:grid-cols-4`}>
          {variants.map((v) => (
            <VariantCard key={v.id} v={v} tint={oil.tint} blurb={oil.blurb} />
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 rounded-pill border border-olive-800 px-6 py-3 text-sm font-semibold text-olive-900 transition-colors hover:bg-olive-900 hover:text-paper"
          >
            Shop all oils &amp; sizes
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
