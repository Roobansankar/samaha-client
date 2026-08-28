import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

// `src`       — landscape image for >=640px, exported 8:3 (2048x768 / 2560x960)
// `srcMobile` — optional portrait image for <640px, exported 3:4 (1080x1440)
//               omit it and the landscape image is used (centre-cropped) on mobile
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
    alt: 'Samaha wood-pressed groundnut oil on a stone plinth',
    eyebrow: 'Wood-pressed · Small batch',
    title: 'Groundnut Oil',
    text: 'Deep, warm and nutty — the way it was always meant to be made.',
    href: '#groundnut-oil',
  },
  {
    src: '/slide3.png',
    alt: 'Samaha cold-pressed peanut oil on a stone plinth',
    eyebrow: 'Small batch · High-heat ready',
    title: 'Peanut Oil',
    text: 'Clean, light and stable enough for a hot pan.',
    href: '#peanut-oil',
  },
]

export default function ImageSlider() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    // 3:4 portrait frame on phones, 8:3 strip from 640px up. object-cover fills
    // each frame — the matching image is exported at that ratio so nothing crops.
    <section className="relative w-full overflow-hidden bg-paper aspect-[3/4] sm:aspect-[8/3]">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
          inert={i !== current}
        >
          <picture>
            {slide.srcMobile && (
              <source media="(max-width: 639px)" srcSet={slide.srcMobile} />
            )}
            <img src={slide.src} alt={slide.alt} className="absolute inset-0 h-full w-full object-cover" />
          </picture>

          {/* legibility wash — from the top on mobile, from the left on desktop */}
          <div
            className="pointer-events-none absolute inset-0 sm:hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(233,240,228,0.94) 0%, rgba(233,240,228,0.5) 30%, rgba(233,240,228,0) 58%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 hidden sm:block"
            style={{
              background:
                'linear-gradient(90deg, rgba(233,240,228,0.74) 0%, rgba(233,240,228,0.32) 34%, rgba(233,240,228,0) 56%)',
            }}
          />

          {/* caption — upper area on mobile, vertically centred on desktop */}
          <div className="absolute inset-x-0 top-0 pt-24 sm:bottom-0 sm:flex sm:items-center sm:pt-0">
            <div className="container-site">
              <div className="max-w-[24rem]">
                <p className="eyebrow">{slide.eyebrow}</p>
                <h2
                  className="mt-2 font-display font-medium leading-[1.04] text-olive-900"
                  style={{ fontSize: 'clamp(1.5rem, 0.8rem + 3.4vw, 3.4rem)' }}
                >
                  {slide.title}
                </h2>
                <p
                  className="mt-3 max-w-[34ch] leading-snug text-text-soft"
                  style={{ fontSize: 'clamp(0.9rem, 0.85rem + 0.3vw, 1.05rem)' }}
                >
                  {slide.text}
                </p>
                <a href={slide.href} className="btn btn-primary mt-4 sm:mt-6">
                  Shop {slide.title} <ArrowRight size={15} strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Nav arrows */}
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
