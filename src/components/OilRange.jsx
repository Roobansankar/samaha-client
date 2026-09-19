import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import { useVisibleProducts } from '../lib/catalog'
import VariantCard from './VariantCard'

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// One half of the flourish: a flowing double line that ends in a curl.
// Drawn for the left side; the right side is the same shape mirrored.
function Scroll({ inView }) {
  const draw = {
    strokeDasharray: 1,
    strokeDashoffset: inView ? 0 : 1,
    transition: REDUCED_MOTION ? 'none' : 'stroke-dashoffset 1.1s var(--ease-default) 0.2s',
  }
  return (
    <>
      <path
        pathLength="1"
        d="M191,43 C170,52 148,53 128,45 C108,37 86,31 64,37 C46,42 34,49 20,45 C10,42 7,31 15,27 C21,24 28,29 25,34"
        fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={draw}
      />
      <path
        pathLength="1"
        d="M191,43 C168,60 138,62 112,53 C92,46 76,40 62,38"
        fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={draw}
      />
    </>
  )
}

// Lotus + mirrored scrolls, echoing an ornamental divider — used as the
// "underline" beneath each oil heading. Draws itself in on scroll.
function Flourish({ inView }) {
  const fade = {
    opacity: inView ? 1 : 0,
    transition: REDUCED_MOTION ? 'none' : 'opacity 0.7s var(--ease-default) 0.5s',
  }
  return (
    <svg
      viewBox="0 0 400 66"
      aria-hidden="true"
      className="mx-auto mt-2 h-11 w-[16rem] text-olive-600 sm:h-14 sm:w-[21rem]"
    >
      <Scroll inView={inView} />
      <g transform="translate(400 0) scale(-1 1)">
        <Scroll inView={inView} />
      </g>

      <g style={{ ...fade, color: 'var(--color-gold-500)' }} fill="currentColor">
        {/* centre petal, with a hollow */}
        <path
          fillRule="evenodd"
          d="M200,6 C190,17 183,28 187,41 C192,45 208,45 213,41 C217,28 210,17 200,6 Z M200,17 C195,25 193,33 196,39 C198,41 202,41 204,39 C207,33 205,25 200,17 Z"
        />
        {/* outline side petals */}
        <path d="M168,20 C180,20 189,27 192,38 C182,38 173,31 168,20 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M232,20 C220,20 211,27 208,38 C218,38 227,31 232,20 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        {/* solid lower petals */}
        <path d="M156,43 C168,36 186,36 199,45 C186,52 168,52 156,43 Z" />
        <path d="M244,43 C232,36 214,36 201,45 C214,52 232,52 244,43 Z" />
      </g>
    </svg>
  )
}

function OilHeading({ text }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(REDUCED_MOTION)

  useEffect(() => {
    if (REDUCED_MOTION || !ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref}>
      <h3 className="font-display text-3xl font-bold leading-tight text-olive-800 sm:text-4xl">
        {text} <span className="font-medium text-gold-600">Samaha</span>
      </h3>
      <Flourish inView={inView} />
    </div>
  )
}

export default function OilRange() {
  const { oilGroups: OIL_VARIANTS, loading: productsLoading } = useProducts()
  const isVisible = useVisibleProducts()

  if (productsLoading || OIL_VARIANTS.length === 0) return null

  return (
    <section className="bg-paper-inset" id="sizes" aria-label="Shop oils by size">
      <div className="mx-auto max-w-[1500px] px-4 py-[clamp(2.5rem,6vw,4.5rem)] sm:px-[clamp(1.75rem,5vw,5rem)]">

        {/* one section per oil, cards scroll horizontally on mobile */}
        <div className="mt-2 space-y-10 sm:space-y-14">
          {OIL_VARIANTS.map((oil) => {
            const variants = oil.variants.filter((v) => isVisible(v.slug))
            if (variants.length === 0) return null

            return (
              <div key={oil.slug}>
                <div className="text-center">
                  <OilHeading text={oil.name} />
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
          })}
        </div>

        <div className="mt-10 text-center sm:mt-12">
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
