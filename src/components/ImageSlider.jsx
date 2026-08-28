import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Leaf } from 'lucide-react'

// `src`       — landscape image for >=640px, exported 8:3 (2048x768 / 2560x960)
// `srcMobile` — portrait image for <640px, exported ~3:4 (1080x1440). Keep the
//               left third of it clear — the copy is overlaid there on mobile.
const SLIDES = [
  {
    src: '/slide1.png',
    srcMobile: '/slidem1.png',
    alt: 'Samaha cold-pressed coconut oil on a stone plinth',
    eyebrow: 'Cold-pressed · Unrefined',
    title: 'Coconut Oil',
    text: 'Pressed from fresh white kernel within hours of cracking.',
    href: '#coconut-oil',
  },
  {
    src: '/slide2.png',
    srcMobile: '/slidem2.png',
    alt: 'Samaha wood-pressed groundnut oil on a stone plinth',
    eyebrow: 'Wood-pressed · Small batch',
    title: 'Groundnut Oil',
    text: 'Deep, warm and nutty — the way it was always meant to be made.',
    href: '#groundnut-oil',
  },
  {
    src: '/slide3.png',
    srcMobile: '/slidem3.png',
    alt: 'Samaha cold-pressed peanut oil on a stone plinth',
    eyebrow: 'Small batch · High-heat ready',
    title: 'Peanut Oil',
    text: 'Clean, light and stable enough for a hot pan.',
    href: '#peanut-oil',
  },
]

export default function ImageSlider() {
  const [current, setCurrent] = useState(0)
  const slide = SLIDES[current]

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    // Fixed frame — the image stays put. 4:5 on mobile, 8:3 strip from 640px up.
    <section className="relative w-full overflow-hidden bg-paper aspect-[4/5] sm:aspect-[8/3]">
      {SLIDES.map((s, i) => (
        <picture key={s.src}>
          {s.srcMobile && <source media="(max-width: 639px)" srcSet={s.srcMobile} />}
          <img
            src={s.src}
            alt={s.alt}
            aria-hidden={i !== current}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        </picture>
      ))}

      {/* legibility wash — desktop only, from the left */}
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(233,240,228,0.78) 0%, rgba(233,240,228,0.34) 36%, rgba(233,240,228,0) 58%)',
        }}
      />

      {/* Caption — overlaid top-left on mobile, vertically centred on desktop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 px-[var(--spacing-gutter)] pt-[36%] sm:inset-0 sm:flex sm:items-center sm:px-0 sm:pt-0">
        <div className="mx-auto w-full sm:max-w-[1260px] sm:px-[var(--spacing-gutter)]">
          <div className="pointer-events-auto max-w-[15rem] sm:max-w-[30rem]">
            {/* brand accent above the eyebrow — mobile only, same on every slide */}
            <span className="mb-4 grid h-9 w-9 place-items-center rounded-full border border-olive-400/60 bg-paper/40 text-olive-700 sm:hidden">
              <Leaf size={15} strokeWidth={1.8} />
            </span>
            <p className="eyebrow">{slide.eyebrow}</p>
            <h2
              className="mt-2 font-display font-medium leading-[1.05] text-olive-900"
              style={{ fontSize: 'clamp(1.95rem, 1.3rem + 2.8vw, 3.4rem)' }}
            >
              {slide.title}
            </h2>
            <p
              className="mt-2.5 leading-snug text-text-soft sm:max-w-[38ch]"
              style={{ fontSize: 'clamp(0.9rem, 0.86rem + 0.25vw, 1.05rem)' }}
            >
              {slide.text}
            </p>
            <a href={slide.href} className="btn btn-primary mt-4 sm:mt-6">
              Shop {slide.title} <ArrowRight size={15} strokeWidth={2} />
            </a>
          </div>
        </div>
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
