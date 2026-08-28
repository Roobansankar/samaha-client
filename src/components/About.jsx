import { ArrowUpRight } from 'lucide-react'

export default function About() {
  return (
    <section className="bg-paper" id="groves">
      <div className="py-[clamp(3.5rem,9vw,7rem)] px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="grid grid-cols-[1fr_1.05fr] items-center gap-[clamp(2rem,6vw,5rem)] max-[768px]:!grid-cols-1 max-[768px]:!gap-8">

          {/* Left: image */}
          <div className="relative h-[clamp(340px,40vw,500px)] overflow-hidden rounded-2xl bg-paper-3 shadow-md max-[768px]:h-[62vw] max-[768px]:min-h-[280px]">
            <img
              src="https://i.pinimg.com/1200x/49/27/81/492781048f8345b774b53472caba0bcd.jpg"
              alt="Samaha olive grove on a terraced hillside"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-olive-900/15 to-transparent" />
          </div>

          {/* Right: copy + link */}
          <div className="max-[768px]:order-2">
            <h2 className="font-sans font-bold text-olive-900 tracking-tight leading-[1.08]"
                style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.6vw, 3.2rem)' }}>
              Grown around the way you{' '}
              <span className="text-gold-600">cook, taste and share</span>
            </h2>

            <p className="mt-5 text-text-soft leading-[1.7]"
               style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.1rem)' }}>
              Every bottle in our harvest is pressed to keep a single grove&rsquo;s
              character intact &mdash; cold-extracted within hours of picking,
              unfiltered, and filled by hand, so the oil on your table is exactly
              the oil we made.
            </p>

            <a href="/about" className="btn btn-ghost group mt-7">
              About us
              <ArrowUpRight
                size={15}
                strokeWidth={2}
                className="transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
              />
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
