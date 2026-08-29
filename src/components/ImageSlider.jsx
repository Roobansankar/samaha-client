import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// `src`       — landscape image for >=640px, exported 8:3 (2048x768 / 2560x960)
// `srcMobile` — portrait image for <640px, exported ~3:4 (1080x1440). Keep the
//               left third of it clear — the copy is overlaid there on mobile.
const SLIDES = [
  {
    src: '/slide1.webp',
    srcMobile: '/slidem1.webp',
    alt: 'Samaha cold-pressed coconut oil on a stone plinth',
    eyebrow: 'Cold-pressed · Unrefined',
    title: 'Coconut Oil',
    text: 'Pressed from fresh white kernel within hours of cracking.',
    href: '/shop/coconut-oil',
    steps: ['Fresh kernel, milled same day', 'Cold-pressed below 27°C', 'Unfiltered, bottled by hand'],
  },
  {
    src: '/slide2.webp',
    srcMobile: '/slidem2.webp',
    alt: 'Samaha wood-pressed groundnut oil on a stone plinth',
    eyebrow: 'Wood-pressed · Small batch',
    title: 'Groundnut Oil',
    text: 'Deep, warm and nutty — the way it was always meant to be made.',
    href: '/shop/groundnut-oil',
    steps: ['Sun-dried groundnuts', 'Wood-pressed the slow way', 'Small, dated lots'],
  },
  {
    src: '/slide3.webp',
    srcMobile: '/slidem3.webp',
    alt: 'Samaha cold-pressed peanut oil on a stone plinth',
    eyebrow: 'Small batch · High-heat ready',
    title: 'Peanut Oil',
    text: 'Clean, light and stable enough for a hot pan.',
    href: '/shop/peanut-oil',
    steps: ['Hand-sorted peanuts', 'Cold-pressed in small batches', 'Clean, high-heat ready'],
  },
]

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function ImageSlider() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  // Touch swipe (mobile)
  const touch = useRef(null)
  const onTouchStart = (e) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev()
    }
  }

  return (
    // Fixed frame — 4:5 on mobile, 8:3 strip from 640px up.
    <section
      className="relative w-full overflow-hidden bg-paper aspect-[4/5] sm:aspect-[8/3]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Sliding track — the whole row translates one slide-width per step */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: REDUCED_MOTION ? 'none' : 'transform 620ms var(--ease-default)',
          willChange: 'transform',
        }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className="relative h-full w-full shrink-0"
            aria-hidden={i !== current}
            inert={i !== current}
          >
            <picture>
              {s.srcMobile && <source media="(max-width: 639px)" srcSet={s.srcMobile} />}
              <img src={s.src} alt={s.alt} className="absolute inset-0 h-full w-full object-cover" />
            </picture>

            {/* legibility wash — desktop only, from the left */}
            <div
              className="pointer-events-none absolute inset-0 hidden sm:block"
              style={{
                background:
                  'linear-gradient(90deg, rgba(233,240,228,0.78) 0%, rgba(233,240,228,0.34) 36%, rgba(233,240,228,0) 58%)',
              }}
            />

            {/* Caption — overlaid top-left on mobile, vertically centred on desktop */}
            <div className="pointer-events-none absolute inset-x-0 top-0 px-[var(--spacing-gutter)] pt-[18%] sm:inset-0 sm:flex sm:items-center sm:px-0 sm:pt-0">
              <div className="mx-auto w-full sm:max-w-[1260px] sm:px-[var(--spacing-gutter)]">
                <div className="pointer-events-auto max-w-[15rem] sm:max-w-[30rem]">
                  <p className="eyebrow">{s.eyebrow}</p>
                  <h2
                    className="mt-2 font-display font-medium leading-[1.05] text-olive-900"
                    style={{ fontSize: 'clamp(1.95rem, 1.3rem + 2.8vw, 3.4rem)' }}
                  >
                    {s.title}
                  </h2>
                  <p
                    className="mt-2.5 leading-snug text-text-soft sm:max-w-[38ch]"
                    style={{ fontSize: 'clamp(0.9rem, 0.86rem + 0.25vw, 1.05rem)' }}
                  >
                    {s.text}
                  </p>

                  {/* mobile-only process steps */}
                  <ol className="mt-4 space-y-2 sm:hidden">
                    {s.steps.map((step, n) => (
                      <li key={step} className="flex items-center gap-2.5 leading-tight text-text-soft"
                          style={{ fontSize: '0.9rem' }}>
                        <span className="grid h-[1.35rem] w-[1.35rem] shrink-0 place-items-center rounded-full bg-olive-900 text-[0.62rem] font-semibold text-paper">
                          {n + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  <Link to={s.href} className="btn btn-primary mt-4 sm:mt-6">
                    Shop {s.title} <ArrowRight size={15} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows — desktop only */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 sm:grid cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 sm:grid cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 w-2.5 rounded-full transition-colors cursor-pointer ${
              i === current ? 'bg-olive-900' : 'bg-olive-900/35'
            }`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
          />
        ))}
      </div>
    </section>
  )
}
