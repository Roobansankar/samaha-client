import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Droplet, Heart, Award, MapPin } from 'lucide-react'

const STATS = [
  { number: '1985', label: 'Year founded' },
  { number: '40+', label: 'Years of trust' },
  { number: '3', label: 'Oil varieties' },
  { number: '100%', label: 'Sulphur-free' },
]

const VALUES = [
  { Icon: Leaf, title: 'Sulphur-free copra', text: 'The only producer in Coimbatore making sulphur-free copra for oil at any real scale.' },
  { Icon: Droplet, title: 'Direct from farmers', text: 'Coconuts bought straight from growers in the Velliangiri Hills, pressed at our Sulur unit.' },
  { Icon: Heart, title: 'Family legacy', text: 'Four decades of oil-making passed down from MRS Oil Mills to Samaha.' },
  { Icon: Award, title: 'Two units', text: 'Sulur for processing, Madampatti for procurement — both in the heart of coconut country.' },
]

const LOCATIONS = [
  {
    name: 'Sulur Unit',
    role: 'Processing & cold-pressing',
    text: 'Where coconuts are turned into copra and cold-pressed into oil, bottled by hand in dated lots.',
  },
  {
    name: 'Madampatti Unit',
    role: 'Raw material procurement',
    text: 'Our buying hub in the Coimbatore Western Ghats, sourcing quality coconuts and copra since 2016.',
  },
]

const STORY = [
  'We have been in the coconut and coconut oil business since 1985. What started as MRS Oil Mills under my father, N. Rangasamy, has grown into a brand trusted by households across Coimbatore and the Nilgiri districts.',
  'Since our establishment we supplied coconut oil under the brand name MRS. After 2016 we introduced the chekku oil concept and launched three cooking oils — groundnut, coconut and gingelly — under the brand name Samaha.',
  'We started a second unit in Madampatti in 2016 to procure quality raw materials from the Western Ghats region, and became a major coconut and copra buyer in that area.',
  'We buy coconuts directly from farmers in the Velliangiri Hills and bring them to our Sulur unit, where we process them into copra ourselves.',
]

export default function AboutPage() {
  return (
    <div className="bg-paper">

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <img
          src="/about.png"
          alt="Samaha oil mill in Coimbatore"
          className="h-[clamp(320px,42vw,440px)] w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(233,240,228,0.86) 0%, rgba(233,240,228,0.45) 42%, rgba(233,240,228,0) 66%)',
          }}
        />
        <div className="absolute inset-0 flex items-center px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
          <div className="w-full">
            <div className="max-w-[34rem]">
              <p className="eyebrow">About</p>
              <h1
                className="mt-2 font-display font-medium leading-[1.02] text-olive-900"
                style={{ fontSize: 'clamp(2rem, 1.5rem + 2.2vw, 3.1rem)' }}
              >
                Samaha
              </h1>
              <div className="mt-3.5 flex items-center gap-3 text-olive-700">
                <span className="h-px w-10 bg-olive-700/40" />
                <Leaf size={14} strokeWidth={1.8} />
                <span className="h-px w-10 bg-olive-700/40" />
              </div>
              <p
                className="mt-3.5 max-w-[34ch] leading-[1.6] text-text-soft"
                style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.25vw, 1.1rem)' }}
              >
                Rooted in tradition. Committed to purity. Crafted for a healthier tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className="px-[var(--spacing-gutter)] py-[clamp(3rem,7vw,5.5rem)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div>

          {/* stats */}
          <div className="grid grid-cols-2 divide-y divide-line rounded-[var(--radius-lg)] border border-line sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {STATS.map((s) => (
              <div key={s.label} className="px-5 py-6 text-center">
                <p className="font-display font-medium text-olive-900" style={{ fontSize: 'clamp(1.7rem, 1.2rem + 1.8vw, 2.4rem)' }}>
                  {s.number}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-text-mute">{s.label}</p>
              </div>
            ))}
          </div>

          {/* story */}
          <div className="mt-[clamp(3rem,7vw,5rem)] grid gap-x-16 gap-y-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="eyebrow">Since 1985</p>
              <h2 className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
                  style={{ fontSize: 'clamp(1.6rem, 1.15rem + 1.8vw, 2.4rem)' }}>
                Four decades of cold-pressed oil
              </h2>
              <p className="mt-4 text-sm text-text-mute">— N. Rangasamy&rsquo;s mill, now Samaha</p>
            </div>
            <div className="space-y-5 leading-[1.8] text-text-soft"
                 style={{ fontSize: 'clamp(0.98rem, 0.92rem + 0.2vw, 1.05rem)' }}>
              {STORY.map((para) => <p key={para}>{para}</p>)}
            </div>
          </div>

          {/* what makes us different — dark panel */}
          <div className="mt-[clamp(3rem,7vw,5rem)] overflow-hidden rounded-[var(--radius-xl)] bg-olive-900">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-[clamp(1.75rem,5vw,3.5rem)]">
                <p className="eyebrow" style={{ color: 'var(--color-gold-300)' }}>What makes us different</p>
                <h2 className="mt-3 font-display font-medium leading-[1.12] text-on-olive"
                    style={{ fontSize: 'clamp(1.4rem, 1rem + 1.9vw, 2.2rem)' }}>
                  The only ones in Coimbatore making sulphur-free copra at scale
                </h2>
                <p className="mt-4 max-w-[52ch] leading-relaxed text-on-olive-soft"
                   style={{ fontSize: 'clamp(0.92rem, 0.88rem + 0.15vw, 1rem)' }}>
                  Anyone can ask what makes us unique. We can say plainly: we are the only ones in Coimbatore
                  &mdash; even across Pollachi and Kangeyam, the copra and coconut-oil hub &mdash; who make
                  copra without sulphur for oil production.
                </p>
              </div>
              <div className="relative hidden min-h-[220px] lg:block">
                <img
                  src="/banner.jpg"
                  alt="Cold-pressed oil"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* values */}
          <div className="mt-[clamp(3rem,7vw,5rem)]">
            <p className="eyebrow">Our values</p>
            <h2 className="mt-3 font-display font-medium text-olive-900"
                style={{ fontSize: 'clamp(1.5rem, 1.1rem + 1.7vw, 2.1rem)' }}>
              What we stand for
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-[var(--radius-lg)] border border-line p-6 transition-colors duration-200 hover:border-olive-300">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-olive-100 text-olive-800">
                    <v.Icon size={19} strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-medium text-olive-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-mute">{v.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* locations */}
          <div className="mt-[clamp(3rem,7vw,5rem)]">
            <p className="eyebrow">Where we work</p>
            <h2 className="mt-3 font-display font-medium text-olive-900"
                style={{ fontSize: 'clamp(1.5rem, 1.1rem + 1.7vw, 2.1rem)' }}>
              Two units, one coconut country
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {LOCATIONS.map((l) => (
                <div key={l.name} className="rounded-[var(--radius-lg)] border border-line bg-paper-2 p-7">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-olive-900 text-paper">
                      <MapPin size={17} strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="font-display font-medium text-olive-900">{l.name}</h3>
                      <p className="text-xs uppercase tracking-[0.1em] text-text-mute">{l.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-text-mute">{l.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-[clamp(3rem,7vw,5rem)] flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-primary">
              Shop our oils <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link to="/" className="btn btn-ghost">Back to home</Link>
          </div>

        </div>
      </div>
    </div>
  )
}
