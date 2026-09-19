import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import { useVisibleProducts } from '../lib/catalog'
import VariantCard from './VariantCard'
import TrustBar from './TrustBar'
import SectionHeading from './SectionHeading'

const SECTION_PAD = 'mx-auto max-w-[1500px] px-4 py-[clamp(2.5rem,6vw,4.5rem)] sm:px-[clamp(1.75rem,5vw,5rem)]'

export default function OilRange() {
  const { oilGroups: OIL_VARIANTS, loading: productsLoading } = useProducts()
  const isVisible = useVisibleProducts()

  if (productsLoading) return null

  const groups = OIL_VARIANTS
    .map((oil) => ({ oil, variants: oil.variants.filter((v) => isVisible(v.slug)) }))
    .filter((g) => g.variants.length > 0)

  // nothing to list (e.g. the products API is down) — the trust bar still shows
  if (groups.length === 0) return <TrustBar />

  const [first, ...rest] = groups

  // each oil: heading, cards (scroll sideways on mobile), "view all" button
  const renderGroup = ({ oil, variants }) => (
    <div key={oil.slug}>
      <div className="text-center">
        <SectionHeading title={oil.name} accent="Samaha" />
        <p className="mt-2.5 text-xs uppercase tracking-[0.16em] text-text-mute">{oil.blurb}</p>
      </div>

      <div className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:mt-5 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4">
        {variants.map((v) => (
          <div key={v.id} className="w-[64vw] max-w-[260px] shrink-0 snap-start sm:h-full sm:w-auto sm:max-w-none">
            <VariantCard v={v} tint={oil.tint} blurb={oil.blurb} />
          </div>
        ))}
      </div>

      <div className="mt-5 text-center">
        <Link
          to={`/shop/${oil.slug}`}
          className="group inline-flex items-center gap-1.5 rounded-pill border border-olive-800 px-4 py-2 text-xs font-semibold text-olive-900 transition-colors hover:bg-olive-900 hover:text-paper sm:text-sm"
        >
          View all {oil.name}
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )

  const shopAll = (
    <div className="mt-10 text-center sm:mt-12">
      <Link
        to="/shop"
        className="group inline-flex items-center gap-2 rounded-pill border border-olive-800 px-6 py-3 text-sm font-semibold text-olive-900 transition-colors hover:bg-olive-900 hover:text-paper"
      >
        Shop all oils &amp; sizes
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )

  return (
    <>
      <section className="bg-paper-inset" id="sizes" aria-label="Shop oils by size">
        <div className={SECTION_PAD}>
          {renderGroup(first)}
          {rest.length === 0 && shopAll}
        </div>
      </section>

      {/* sits right after the first oil (Coconut) */}
      <TrustBar />

      {rest.length > 0 && (
        <section className="bg-paper-inset" aria-label="More oils">
          <div className={SECTION_PAD}>
            <div className="space-y-10 sm:space-y-14">{rest.map(renderGroup)}</div>
            {shopAll}
          </div>
        </section>
      )}
    </>
  )
}
