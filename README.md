# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
import { ArrowRight } from 'lucide-react'

const PRODUCTS = [
  {
    n: '01',
    name: 'Coconut Oil',
    desc: 'Cold-pressed from fresh white kernel',
    img: '/products/coconut-oil.png',
    tint: '#e6e1d4',
    offset: 'md:mt-0',
  },
  {
    n: '02',
    name: 'Groundnut Oil',
    desc: 'Wood-pressed — deep, warm and nutty',
    img: '/products/groundnut-oil.png',
    tint: '#e8d8ba',
    offset: 'md:mt-16',
  },
  {
    n: '03',
    name: 'Peanut Oil',
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

        {/* Three products — staggered arches */}
        <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid gap-x-8 gap-y-20 md:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article
              key={p.name}
              className={`group relative mx-auto flex w-full max-w-[24rem] flex-col md:max-w-none ${p.offset}`}
            >
              {/* index rule */}
              <div className="mb-4 flex items-center gap-3">
                <span className="font-display text-sm tracking-widest text-gold-600">{p.n}</span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <a href="#shop" className="relative block" aria-label={p.name}>
                <div
                  className="product-arch relative grid place-items-center overflow-hidden"
                  style={{ background: p.tint }}
                >
                  <BottleGlyph className="h-2/5 w-auto text-olive-900/20" />
                  <img
                    src={p.img}
                    alt={p.name}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* label straddling the arch */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-pill border border-olive-300 bg-paper px-5 py-2 text-sm font-semibold tracking-wide text-olive-900 shadow-sm transition-colors duration-200 group-hover:border-olive-800 group-hover:bg-olive-800 group-hover:text-paper">
                  {p.name}
                </span>
              </a>

              <p className="mt-10 text-center text-sm leading-relaxed text-text-mute">
                {p.desc}
              </p>
            </article>
          ))}
        </div>

        <PalmFrond className="pointer-events-none absolute bottom-0 right-0 w-[clamp(6rem,13vw,11rem)] translate-y-1/4 text-olive-300" />
      </div>
    </section>
  )
}






http://localhost:8000/api/auth/google/callback






-- Samaha: delete ALL orders on the LIVE database and restart numbering from #1.
-- Back up first (Export in phpMyAdmin) — this cannot be undone.

DELETE FROM `order_items`;
DELETE FROM `orders`;
DELETE FROM `notifications` WHERE `type` = 'order';

ALTER TABLE `order_items` AUTO_INCREMENT = 1;
ALTER TABLE `orders` AUTO_INCREMENT = 1;
