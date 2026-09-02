import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Droplet, Heart, Award, MapPin } from 'lucide-react'

const STATS = [
  { number: '1985', label: 'Making oil since' },
  { number: '40+', label: 'Years of trust' },
  { number: '3', label: 'Cold-pressed oils' },
  { number: '100%', label: 'Sulphur-free copra' },
]

const TIMELINE = [
  {
    year: '1985',
    title: 'MRS Oil Mills opens',
    text: 'N. Rangasamy starts a coconut and coconut-oil business in Coimbatore, selling oil under the MRS name.',
  },
  {
    year: 'Until 2016',
    title: 'A household name across the Nilgiris',
    text: 'Three decades supplying coconut oil under the MRS brand to homes across Coimbatore and the Nilgiri districts.',
  },
  {
    year: '2016',
    title: 'Chekku oils, and the Samaha name',
    text: 'We bring in the wooden-chekku cold-pressing method and launch three cooking oils — groundnut, coconut and gingelly — as Samaha.',
  },
  {
    year: '2016',
    title: 'Madampatti procurement unit',
    text: 'A second unit opens in the Western Ghats to buy quality coconuts and copra directly, making us a major buyer in the region.',
  },
  {
    year: 'Today',
    title: 'Farm to bottle, all in-house',
    text: 'Coconuts come straight from farmers in the Velliangiri Hills to our Sulur unit, pressed cold and bottled by hand in dated lots.',
  },
]

const VALUES = [
  { Icon: Leaf, tint: 'bg-olive-100', title: 'Sulphur-free copra', text: 'The only producer in Coimbatore making sulphur-free copra for oil at any real scale.' },
  { Icon: Droplet, tint: 'bg-gold-200', title: 'Straight from farmers', text: 'Coconuts bought direct from growers in the Velliangiri Hills, pressed at our Sulur unit.' },
  { Icon: Heart, tint: 'bg-paper', title: 'A family legacy', text: 'Four decades of oil-making, handed down from MRS Oil Mills to Samaha.' },
  { Icon: Award, tint: 'bg-paper-2', title: 'Two units, one region', text: 'Sulur for processing, Madampatti for procurement — both in the heart of coconut country.' },
]

const LOCATIONS = [
  {
    name: 'Sulur Unit',
    role: 'Processing & cold-pressing',
    text: 'Where coconuts are turned into copra and cold-pressed into oil, then bottled by hand in dated lots.',
  },
  {
    name: 'Madampatti Unit',
    role: 'Raw material procurement',
    text: 'Our buying hub in the Coimbatore Western Ghats, sourcing quality coconuts and copra since 2016.',
  },
]

const SECTION = 'mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)]'
const HEADING = 'font-display font-medium leading-[1.1] text-olive-900'

export default function AboutPage() {
  return (
    <div className="bg-paper">

      {/* ---------- Hero ---------- */}
      <section className="relative flex min-h-[clamp(420px,62vh,660px)] items-center overflow-hidden bg-olive-950 text-on-olive">
        <img
          src="/about1.webp"
          alt="Samaha oil mill in Coimbatore"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="img-shimmer absolute inset-0 h-full w-full object-cover opacity-65"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-olive-950/75 via-olive-950/45 to-olive-950/10"
          aria-hidden="true"
        />
        <div className={`relative w-full ${SECTION} py-[clamp(3rem,8vw,5rem)]`}>
          <p className="eyebrow text-gold-300">Our story</p>
          <h1
            className="mt-4 max-w-[20ch] font-display font-medium leading-[1.03] text-on-olive"
            style={{ fontSize: 'clamp(2.3rem, 1.5rem + 4vw, 4.6rem)' }}
          >
            Honest oil, pressed the way Coimbatore always has
          </h1>
          <p
            className="mt-6 max-w-[46ch] leading-[1.7] text-on-olive-soft"
            style={{ fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.15rem)' }}
          >
            Rooted in tradition, committed to purity — a family mill pressing oil
            in wooden chekku since 1985.
          </p>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="bg-paper-inset">
        <div className={`${SECTION} py-[clamp(2rem,4vw,3rem)]`}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="about-stat rounded-[var(--radius-md)] bg-paper px-5 py-6 text-center">
                <p className="font-display font-medium text-olive-950" style={{ fontSize: 'clamp(1.8rem, 1.2rem + 2vw, 2.6rem)' }}>
                  {s.number}
                </p>
                <p className="mt-1.5 text-[0.68rem] uppercase tracking-[0.14em] text-text-mute">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Lead ---------- */}
      <section className="bg-paper">
        <div className={`${SECTION} py-[clamp(3rem,7vw,5.5rem)]`}>
          <div className="grid gap-x-[clamp(2.5rem,6vw,5rem)] gap-y-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

            <div>
              <p className="eyebrow">The short version</p>
              <p
                className="mt-5 font-display font-medium leading-[1.16] text-olive-900"
                style={{ fontSize: 'clamp(1.9rem, 1.2rem + 3vw, 3.4rem)' }}
              >
                What began as <span className="text-clay-500">MRS Oil Mills</span> in
                1985 is now Samaha.
              </p>
            </div>

            <div
              className="space-y-4 leading-[1.75] text-text-soft lg:pt-2"
              style={{ fontSize: 'clamp(1rem, 0.94rem + 0.25vw, 1.12rem)' }}
            >
              <p>
                N. Rangasamy started the mill in Coimbatore, and for three decades it
                sold coconut oil under the MRS name to homes across the Nilgiris. In
                2016 we brought in traditional wooden-chekku cold pressing and launched
                three cooking oils — groundnut, coconut and gingelly — as Samaha.
              </p>
              <p>
                We buy coconuts straight from farmers in the Velliangiri Hills, make
                our own copra without sulphur, and cold-press every batch in-house.
                From farm to bottle nothing leaves our hands, so every bottle stays
                fully traceable.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ---------- Timeline ---------- */}
      <section className="bg-paper-inset">
        <div className={`${SECTION} py-[clamp(3rem,7vw,5.5rem)]`}>
          <div className="grid gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

            <div>
              <p className="eyebrow">Since 1985</p>
              <h2 className={`mt-3 ${HEADING}`} style={{ fontSize: 'clamp(1.7rem, 1.2rem + 2vw, 2.6rem)' }}>
                Four decades, one process
              </h2>
              <p className="mt-4 max-w-[34ch] text-sm leading-[1.7] text-text-soft">
                One family, one method. From a single wooden press to two units in
                coconut country — every step still done in-house.
              </p>
              <img
                src="/mill.webp"
                alt="Samaha's oil mill in Coimbatore"
                loading="lazy"
                decoding="async"
                className="img-shimmer mt-7 aspect-[4/3] w-full rounded-[var(--radius-lg)] object-cover"
              />
            </div>

            <ol className="about-timeline">
              {TIMELINE.map((t, i) => (
                <li key={i} className="about-timeline__item">
                  <span className="about-timeline__dot" aria-hidden="true" />
                  <span className="about-timeline__year">{t.year}</span>
                  <h3 className="mt-1.5 font-display text-lg font-medium text-olive-950">{t.title}</h3>
                  <p className="mt-2 text-sm leading-[1.7] text-text-soft">{t.text}</p>
                </li>
              ))}
            </ol>

          </div>
        </div>
      </section>

      {/* ---------- What makes us different ---------- */}
      <section className="bg-paper">
        <div className={`${SECTION} py-[clamp(2rem,4vw,3rem)]`}>
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-olive-900 text-on-olive">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-[clamp(1.75rem,5vw,3.5rem)]">
                <p className="eyebrow text-gold-300">What makes us different</p>
                <h2
                  className="mt-3 font-display font-medium leading-[1.14] text-on-olive"
                  style={{ fontSize: 'clamp(1.4rem, 1rem + 1.9vw, 2.2rem)' }}
                >
                  The only ones in Coimbatore making sulphur-free copra at scale
                </h2>
                <p
                  className="mt-4 max-w-[52ch] leading-relaxed text-on-olive-soft"
                  style={{ fontSize: 'clamp(0.92rem, 0.88rem + 0.15vw, 1rem)' }}
                >
                  Anyone can ask what makes us unique. We can say it plainly: we are the
                  only ones in Coimbatore — even across Pollachi and Kangeyam, the copra
                  and coconut-oil hub — who make copra without sulphur for oil production.
                </p>
              </div>
              <div className="relative hidden min-h-[240px] lg:block">
                <img
                  src="/banner.webp"
                  alt="Cold-pressed oil poured into a bowl"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Values ---------- */}
      <section className="bg-paper-inset">
        <div className={`${SECTION} py-[clamp(3rem,7vw,5.5rem)]`}>
          <p className="eyebrow">Our values</p>
          <h2 className={`mt-3 ${HEADING}`} style={{ fontSize: 'clamp(1.5rem, 1.1rem + 1.8vw, 2.2rem)' }}>
            What we stand for
          </h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {VALUES.map((v) => (
              <article
                key={v.title}
                className={`about-card rounded-[var(--radius-md)] p-[clamp(1.25rem,2.6vw,1.75rem)] ${v.tint}`}
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-full text-olive-800"
                  style={{ background: 'rgba(42,49,26,0.08)' }}
                >
                  <v.Icon size={19} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-[1.05rem] font-medium text-olive-950">{v.title}</h3>
                <p className="mt-2 text-sm leading-[1.6] text-text-soft">{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Locations ---------- */}
      <section className="bg-paper">
        <div className={`${SECTION} py-[clamp(3rem,7vw,5.5rem)]`}>
          <p className="eyebrow">Where we work</p>
          <h2 className={`mt-3 ${HEADING}`} style={{ fontSize: 'clamp(1.5rem, 1.1rem + 1.8vw, 2.2rem)' }}>
            Two units, one coconut country
          </h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {LOCATIONS.map((l) => (
              <article key={l.name} className="about-card rounded-[var(--radius-lg)] border border-line bg-paper-inset p-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-olive-900 text-paper">
                    <MapPin size={17} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-display font-medium text-olive-950">{l.name}</h3>
                    <p className="text-[0.68rem] uppercase tracking-[0.12em] text-text-mute">{l.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-[1.7] text-text-soft">{l.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-paper-inset">
        <div className={`${SECTION} py-[clamp(3rem,7vw,5rem)]`}>
          <div className="rounded-[var(--radius-lg)] bg-olive-900 px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4rem)] text-center text-on-olive">
            <h2
              className="mx-auto max-w-[22ch] font-display font-medium leading-[1.12] text-on-olive"
              style={{ fontSize: 'clamp(1.6rem, 1.2rem + 2vw, 2.6rem)' }}
            >
              Taste the difference cold-pressing makes
            </h2>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link to="/shop" className="btn btn-primary">
                Shop our oils <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link to="/" className="text-sm font-semibold text-gold-300 transition-colors hover:text-paper">
                Back to home <span aria-hidden="true">›</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
