import { ArrowRight } from 'lucide-react'

export default function Banner() {
  return (
    <section className="relative overflow-clip" aria-label="Nature in every bottle">
      <img
        src="/banner.jpg"
        alt="Golden cooking oil poured into a glass bowl surrounded by coconut and peanuts"
        loading="lazy"
        width={1920}
        height={912}
        className="h-[26rem] w-full object-cover lg:h-[32rem]"
      />
      <div className="absolute inset-0 bg-olive-950/65" aria-hidden="true" />

      <div className="absolute inset-0 flex items-center">
        <div className="container-site">
          <h2 className="max-w-[18ch] font-display font-medium leading-[1.1] text-on-olive"
              style={{ fontSize: 'clamp(2rem, 1.4rem + 2.8vw, 3.25rem)' }}>
            Nature goes into every bottle.
          </h2>
          <p className="mt-4 max-w-[42ch] leading-relaxed text-on-olive-soft"
             style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.1rem)' }}>
            Simple ingredients. Thoughtful preparation. Authentic goodness.
          </p>
          <a href="#shop" className="btn btn-cream mt-8">
            Shop Samaha oils <ArrowRight size={16} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  )
}
