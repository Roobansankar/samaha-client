import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const HEADLINE = ['Olive', 'oil', 'worth', 'slowing', 'down', 'for.']

export default function Hero() {
  return (
    <section className="relative overflow-clip bg-paper" id="top">
      {/* soft glow behind the product */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(55% 55% at 60% 46%, var(--color-paper-inset), transparent 72%)',
        }}
      />

      <div className="container-site relative grid items-center gap-x-[clamp(1.5rem,5vw,4rem)] gap-y-10 py-[clamp(3rem,7vw,5rem)] lg:min-h-[clamp(540px,78vh,760px)] lg:grid-cols-[1fr_1.1fr] lg:py-[clamp(2rem,4vw,3.5rem)]">

        {/* ---- Copy ---- */}
        <div className="flex max-w-[34rem] flex-col max-lg:order-2">
          <p className="eyebrow hero-rise" style={{ '--d': '0ms' }}>
            Single estate · Cold-pressed · Unfiltered
          </p>

          <h1
            className="mt-4 font-display font-medium leading-[1.04] tracking-[-0.02em] text-olive-900"
            style={{ fontSize: 'clamp(2.6rem, 1.7rem + 3.8vw, 4.3rem)' }}
          >
            {HEADLINE.map((word, i) => (
              <span key={i}>
                {i > 0 ? ' ' : null}
                <span className="hero-word">
                  <span
                    className={`hero-word-inner ${i === HEADLINE.length - 1 ? 'hero-word-accent' : ''}`}
                    style={{ '--d': `${120 + i * 70}ms` }}
                  >
                    {word}
                  </span>
                </span>
              </span>
            ))}
          </h1>

          <p
            className="hero-rise mt-5 max-w-[40ch] leading-[1.65] text-text-soft"
            style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.1rem)', '--d': '500ms' }}
          >
            Grown on terraced hillside groves, pressed within hours of picking,
            and bottled by hand in small lots you can taste.
          </p>

          <div className="hero-rise mt-8 flex flex-wrap gap-3" style={{ '--d': '650ms' }}>
            <Link className="btn btn-primary" to="/">
              Shop the harvest <ArrowRight size={17} strokeWidth={2} />
            </Link>
            <Link className="btn btn-ghost" to="/about">
              Our story
            </Link>
          </div>
        </div>

        {/* ---- Product ---- */}
        <div className="flex items-center justify-center max-lg:order-1 lg:h-full lg:justify-end">
          <img
            src="/hero.webp"
            alt="Samaha cold-pressed oils"
            className="hero-bottle w-full max-w-[33rem] object-contain lg:max-w-[44rem]"
          />
        </div>
      </div>
    </section>
  )
}
