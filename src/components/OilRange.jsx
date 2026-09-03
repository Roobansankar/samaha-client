import { Link } from 'react-router-dom'
import { OIL_VARIANTS } from '../data/products'
import VariantCard from './VariantCard'

export default function OilRange() {
  return (
    <section className="bg-paper-inset" id="sizes" aria-label="Shop oils by size">
      <div className="mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)] py-[clamp(2.5rem,6vw,4rem)]">
        {OIL_VARIANTS.map((oil, i) => (
          <div key={oil.slug} className={i > 0 ? 'mt-[clamp(3.5rem,8vw,5.5rem)]' : ''}>

            <div className="mx-auto max-w-[42rem] text-center">
              <h2
                className="font-display font-medium leading-[1.1] text-olive-900"
                style={{ fontSize: 'clamp(1.7rem, 1.2rem + 2vw, 2.6rem)' }}
              >
                {oil.name}
              </h2>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-mute sm:text-sm">
                {oil.blurb}
              </p>
            </div>

            <div className="mt-[clamp(1.75rem,4vw,2.75rem)] grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {oil.variants.map((v) => (
                <VariantCard key={v.id} v={v} tint={oil.tint} blurb={oil.blurb} />
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                to={`/shop/${oil.slug}`}
                className="text-sm font-semibold text-olive-800 transition-colors hover:text-olive-600"
              >
                View {oil.name} details &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
