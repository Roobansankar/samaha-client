import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const PRODUCTS = [
  { name: 'Coconut Oil', slug: 'coconut-oil', img: '/hcoconut.png', color: '#4a5d3a', cover: true },
  { name: 'Groundnut Oil', slug: 'groundnut-oil', img: '/hground.png', color: '#6b5a3e', cover: true },
  { name: 'Sesame Oil', slug: 'sesame-oil', img: '/hseasme.png', color: '#7a6248', cover: true },
]

function Tile({ p, className = '', big = false }) {
  return (
    <Link
      to={`/shop/${p.slug}`}
      className={`group relative block overflow-hidden rounded-2xl ${className}`}
      style={{ background: p.color }}
    >
      <img
        src={p.img}
        alt={p.name}
        loading="lazy"
        decoding="async"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        className={`absolute inset-0 h-full w-full transition-transform duration-500 ease-out group-hover:scale-105 ${
          p.cover ? 'object-cover' : `object-contain ${big ? 'p-10 sm:p-14' : 'p-7'}`
        }`}
      />
      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-5 pb-4 pt-16"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.42), transparent)' }}
      >
        <span className={`font-display font-medium text-white ${big ? 'text-xl' : 'text-base'}`}>
          {p.name}
        </span>
        <ArrowRight
          size={big ? 18 : 15}
          className="text-white/75 transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  )
}

export default function Products() {
  return (
    <section className="bg-paper" id="shop">
      <div className="mx-auto max-w-[1500px] px-[clamp(1.5rem,4vw,3.25rem)] pb-[clamp(1.75rem,3.5vw,3rem)] pt-[clamp(1.5rem,3vw,2.5rem)]">

        <div className="mb-8 flex items-end justify-between gap-4">
          <h2
            className="font-display font-medium leading-[1.1] text-olive-900"
            style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.4rem)' }}
          >
            Our oils
          </h2>
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
            big
            className="aspect-[4/5] sm:col-span-3 sm:row-span-2 sm:aspect-auto sm:min-h-[440px]"
          />
          {PRODUCTS.slice(1).map((p) => (
            <Tile key={p.slug} p={p} className="aspect-[5/3] sm:col-span-2 sm:aspect-auto sm:min-h-[212px]" />
          ))}
        </div>

      </div>
    </section>
  )
}
