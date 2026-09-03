import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const PRODUCTS = [
  { name: 'Coconut Oil', slug: 'coconut-oil', tag: 'Coconut', img: '/hcoconut.png', pos: '50% 40%' },
  { name: 'Groundnut Oil', slug: 'groundnut-oil', tag: 'Groundnut', img: '/hground.png', pos: '50% 50%' },
  { name: 'Sesame Oil', slug: 'sesame-oil', tag: 'Sesame', img: '/hseasme.png', pos: '50% 50%' },
]

function Tile({ p, className = '' }) {
  return (
    <Link
      to={`/shop?oil=${p.tag.toLowerCase()}`}
      aria-label={`Shop all ${p.name} sizes`}
      className={`group relative block overflow-hidden rounded-[var(--radius-lg)] bg-paper-2 ${className}`}
    >
      <img
        src={p.img}
        alt={p.name}
        loading="lazy"
        decoding="async"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        style={{ objectPosition: p.pos }}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <span
        className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-paper/90 text-olive-900 shadow-sm backdrop-blur transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        <ArrowUpRight size={14} strokeWidth={2} />
      </span>
    </Link>
  )
}

export default function Products() {
  return (
    <section className="bg-paper" id="shop">
      <div className="mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)] pb-[clamp(1.75rem,3.5vw,3rem)] pt-[clamp(1.5rem,3vw,2.5rem)]">

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The range</p>
            <h2
              className="mt-2 font-display font-medium leading-[1.1] text-olive-900"
              style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.4rem)' }}
            >
              Our oils
            </h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex shrink-0 items-center gap-1.5 text-[0.85rem] font-medium text-olive-800 transition-colors hover:text-olive-600"
          >
            View all
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-5">
          <Tile
            p={PRODUCTS[0]}
            className="aspect-[4/3] sm:col-span-3 sm:row-span-2 sm:aspect-auto sm:min-h-[440px]"
          />
          {PRODUCTS.slice(1).map((p) => (
            <Tile
              key={p.slug}
              p={p}
              className="aspect-[5/3] sm:col-span-2 sm:aspect-auto sm:min-h-[212px]"
            />
          ))}
        </div>

      </div>
    </section>
  )
}
