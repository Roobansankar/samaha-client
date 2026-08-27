import { ArrowRight } from 'lucide-react'

const PRODUCTS = [
  {
    n: '01',
    name: 'Coconut Oil',
    slug: 'coconut-oil',
    desc: 'Cold-pressed from fresh white kernel',
    img: '/products/coconut-oil.png',
    tint: '#e6e1d4',
    offset: 'md:mt-0',
  },
  {
    n: '02',
    name: 'Groundnut Oil',
    slug: 'groundnut-oil',
    desc: 'Wood-pressed — deep, warm and nutty',
    img: '/products/groundnut-oil.png',
    tint: '#e8d8ba',
    offset: 'md:mt-16',
  },
  {
    n: '03',
    name: 'Peanut Oil',
    slug: 'peanut-oil',
    desc: 'Small batch, clean and high-heat ready',
    img: '/products/peanut-oil.png',
    tint: '#e3c8a3',
    offset: 'md:mt-7',
  },
]

function BottleGlyph(props) {
  return (
    <svg viewBox="0 0 48 96" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" {...props}>
      <path d="M19 5h10v9c0 3 6 6 6 14v52a6 6 0 0 1-6 6H19a6 6 0 0 1-6-6V28c0-8 6-11 6-14V5Z" />
      <path d="M13.5 46h21" />
    </svg>
  )
}

function PalmFrond({ className }) {
  return (
    <svg viewBox="0 0 220 220" className={className} fill="none" stroke="currentColor"
         strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <path d="M214 214C168 190 133 150 116 96" />
      <path d="M116 96c22 5 47 0 70-17M126 120c24 7 50 4 74-10M138 146c24 9 51 8 75-4M152 172c22 11 47 14 70 6" />
      <path d="M116 96c-9 21-8 47 5 74M138 146c-6 23-1 48 12 70M158 182c-2 19 3 38 15 52" />
    </svg>
  )
}

export default function Products() {
  return (
    <section className="relative overflow-clip bg-paper-inset" id="shop">
      <div className="container-site relative py-[clamp(3.5rem,9vw,7rem)]">

        {/* Heading */}
        <div className="mx-auto max-w-[42rem] text-center">
          <h2 className="font-display font-medium leading-[1.1] text-olive-900"
              style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.4vw, 3rem)' }}>
            Three oils. One honest press.
          </h2>
          <p className="mt-3 font-display italic text-text-soft"
             style={{ fontSize: 'clamp(1rem, 0.95rem + 0.3vw, 1.2rem)' }}>
            Cold-pressed, unrefined, and bottled by hand.
          </p>
          <a href="#shop" className="btn btn-primary mt-7">
            Shop all oils <ArrowRight size={16} strokeWidth={2} />
          </a>
        </div>

        {/* Three products — staggered cards */}
        <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid gap-x-6 gap-y-16 md:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article
              key={p.name}
              id={p.slug}
              className={`group relative mx-auto flex w-full max-w-[24rem] scroll-mt-28 flex-col md:max-w-none ${p.offset}`}
            >
              <a href={`#${p.slug}`} className="relative block" aria-label={p.name}>
                <div
                  className="product-card relative grid place-items-center overflow-hidden"
                  style={{ background: p.tint }}
                >
                  <BottleGlyph className="h-2/5 w-auto text-olive-900/15" />
                  <img
                    src={p.img}
                    alt={p.name}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* label below card */}
                <div className="mt-5 text-center">
                  <span className="font-display text-lg font-medium tracking-wide text-olive-900">
                    {p.name}
                  </span>
                  <span className="mx-3 inline-block h-px w-5 align-middle bg-gold-500" />
                  <span className="font-display text-xs tracking-widest text-text-mute">
                    {p.n}
                  </span>
                </div>
              </a>

              <p className="mt-2 text-center text-sm leading-relaxed text-text-mute">
                {p.desc}
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
