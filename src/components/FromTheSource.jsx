const BODY = { fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.08rem)' }

export default function FromTheSource() {
  return (
    <section className="bg-paper" id="source" aria-labelledby="source-heading">
      <div className="mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)] pb-[clamp(3rem,7vw,5.5rem)] pt-[clamp(0.5rem,1.5vw,1rem)]">
        <div className="grid gap-y-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-[clamp(2.5rem,6vw,5.5rem)] lg:gap-y-6">

          {/* Heading — mobile: 1st · desktop: top of left column */}
          <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="eyebrow">From the source</p>
            <h2
              id="source-heading"
              className="mt-5 max-w-[16ch] font-sans font-bold leading-[1.08] tracking-tight text-olive-900"
              style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.6vw, 3.1rem)' }}
            >
              Directly from the farmers{' '}
              <span className="text-clay-500">who grow it</span>
            </h2>
          </div>

          {/* Image — mobile: 2nd · desktop: right column */}
          <figure className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] bg-paper-3 shadow-md sm:aspect-[16/9] lg:aspect-auto lg:h-[clamp(360px,32vw,460px)]">
              <img
                src="/isha.jpeg"
                alt="The Adiyogi statue at Isha, rising out of morning mist over the forested Velliangiri foothills"
                width={806}
                height={1353}
                loading="lazy"
                className="h-full w-full object-cover object-[50%_30%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-olive-900/25 to-transparent" />
            </div>
            <figcaption className="mt-3.5 flex items-center gap-3 text-xs text-text-mute">
              <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
              Velliangiri foothills, Coimbatore
            </figcaption>
          </figure>

          {/* Body — mobile: 3rd · desktop: below the heading */}
          <div className="max-w-[46ch] lg:col-start-1 lg:row-start-2 lg:self-start">
            <p className="leading-[1.7] text-text-soft" style={BODY}>
              Among the farmers we buy from is the Isha Sangha Vivasi farming
              community &mdash; the people who grow what goes into every Samaha
              bottle, with no one standing in between.
            </p>
            <p className="mt-4 leading-[1.7] text-text-soft" style={BODY}>
              Knowing who grew it, and where, keeps us close to the care that
              happens long before the press &mdash; and lets us carry it,
              unchanged, to your kitchen.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
