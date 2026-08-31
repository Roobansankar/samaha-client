import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const PRODUCTS = [
  {
    n: '01',
    name: 'Coconut Oil',
    slug: 'coconut-oil',
    tag: 'Coconut',
    desc: 'Cold-pressed from fresh white kernel — mild, clean and versatile.',
    img: '/products/coconut-oil.webp',
    tint: '#e6e1d4',
  },
  {
    n: '02',
    name: 'Groundnut Oil',
    slug: 'groundnut-oil',
    tag: 'Groundnut',
    desc: 'Wood-pressed the slow way — deep, warm and nutty.',
    img: '/products/groundnut-oil.webp',
    tint: '#e8d8ba',
  },
  {
    n: '03',
    name: 'Peanut Oil',
    slug: 'peanut-oil',
    tag: 'Peanut',
    desc: 'Small batch, light and clean — stable enough for a hot pan.',
    img: '/products/peanut-oil.webp',
    tint: '#e3c8a3',
  },
  {
    n: '04',
    name: 'Sesame Oil',
    slug: 'sesame-oil',
    tag: 'Sesame',
    desc: 'Rich, aromatic and deeply nutty — the finishing oil of choice.',
    img: '/products/sesame-oil.webp',
    tint: '#d4b896',
  },
]

export default function Products() {
  return (
    <section className="relative bg-[#f4f1eb]" id="shop">
      <div className="container-site py-[clamp(3rem,6vw,5rem)]">

        {/* Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.75rem] uppercase tracking-[0.18em] text-olive-700/60 font-medium">
              Our Oils
            </p>
            <h2 className="mt-2 font-display font-medium text-olive-900 leading-[1.1]"
                style={{ fontSize: 'clamp(1.75rem, 1.2rem + 2.2vw, 2.8rem)' }}>
              Four oils.<br className="hidden sm:block" /> One honest press.
            </h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-[0.85rem] font-medium text-olive-800 hover:text-olive-600 transition-colors"
          >
            View all products
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <Link
              key={p.name}
              to={`/shop/${p.slug}`}
              className="group relative flex flex-col"
            >
              {/* Card */}
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-2xl transition-shadow duration-300 group-hover:shadow-lg"
                style={{ background: p.tint }}
              >
                {/* Number watermark */}
                <span className="absolute top-4 left-4 text-[0.7rem] font-semibold tracking-widest text-olive-900/30 uppercase">
                  {p.n}
                </span>

                {/* Product image */}
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Info */}
              <div className="mt-3.5 px-0.5">
                <span className="text-[0.68rem] uppercase tracking-[0.14em] text-olive-600/60 font-medium">
                  {p.tag}
                </span>
                <h3 className="mt-0.5 font-display text-base font-medium text-olive-900 group-hover:text-olive-700 transition-colors">
                  {p.name}
                </h3>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-olive-700/60 line-clamp-2">
                  {p.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
