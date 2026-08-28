import { Link } from 'react-router-dom'

const PRODUCTS = [
  {
    name: 'Coconut Oil',
    desc: 'Cold-pressed from fresh white kernel',
    img: '/products/coconut-oil.png',
    tint: '#e6e1d4',
  },
  {
    name: 'Groundnut Oil',
    desc: 'Wood-pressed — deep, warm and nutty',
    img: '/products/groundnut-oil.png',
    tint: '#e8d8ba',
  },
  {
    name: 'Peanut Oil',
    desc: 'Small batch, clean and high-heat ready',
    img: '/products/peanut-oil.png',
    tint: '#e3c8a3',
  },
]

export default function ShopPage() {
  return (
    <section className="bg-paper-inset" id="shop-page">
      <div className="container-site py-[clamp(3rem,7vw,5rem)]">

        <div className="text-center max-w-[42rem] mx-auto">
          <p className="eyebrow">Shop</p>
          <h1 className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
              style={{ fontSize: 'clamp(2rem, 1.3rem + 3vw, 3.2rem)' }}>
            Our oils
          </h1>
          <p className="mt-3 font-display italic text-text-soft"
             style={{ fontSize: 'clamp(1rem, 0.95rem + 0.3vw, 1.2rem)' }}>
            Cold-pressed, unrefined, and bottled by hand.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article key={p.name} className="group">
              <div
                className="product-card relative grid place-items-center overflow-hidden rounded-2xl"
                style={{ background: p.tint, aspectRatio: '3/4' }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <h2 className="font-display text-lg font-medium text-olive-900">{p.name}</h2>
                <p className="mt-1 text-sm text-text-soft">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="btn btn-ghost">
            Back to home
          </Link>
        </div>

      </div>
    </section>
  )
}
