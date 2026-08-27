import { ArrowRight, Leaf, Droplet, Heart, Award, MapPin, Clock, Star } from 'lucide-react'

const STATS = [
  { number: '1985', label: 'Year Founded' },
  { number: '40+', label: 'Years of Trust' },
  { number: '3', label: 'Oil Varieties' },
  { number: '100%', label: 'Sulphur-Free' },
]

const VALUES = [
  { Icon: Leaf, title: 'Sulphur-Free Copra', text: 'The only producer in Coimbatore making large quantities of sulphur-free copra for oil processing.' },
  { Icon: Droplet, title: 'Direct from Farmers', text: 'We buy coconuts directly from farmers in the Velliangiri Hills and process them at our Sulur unit.' },
  { Icon: Heart, title: 'Family Legacy', text: 'Four decades of oil-making expertise passed down through generations.' },
  { Icon: Award, title: 'Two Locations', text: 'Sulur for processing, Madampatti for raw material procurement — both in the heart of coconut country.' },
]

export default function AboutPage() {
  return (
    <section className="bg-paper" id="about-page">

      {/* Hero banner */}
      <div className="relative h-[clamp(380px,52vw,520px)] overflow-hidden">
        <img
          src="/about.png"
          alt="Samaha oil mill in Coimbatore"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* legibility wash on the left */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(233,240,228,0.82) 0%, rgba(233,240,228,0.4) 40%, rgba(233,240,228,0) 64%)',
          }}
        />

        {/* left-side content */}
        <div className="absolute inset-0 flex items-center px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
          <div className="max-w-[34rem]">
            <p className="eyebrow">About</p>
            <h1
              className="mt-1 font-display font-medium uppercase leading-[0.92] tracking-[0.01em] text-olive-900"
              style={{ fontSize: 'clamp(2.6rem, 1.6rem + 6vw, 5.25rem)' }}
            >
              Samaha
            </h1>

            {/* leaf divider */}
            <div className="mt-4 flex items-center gap-3 text-olive-700">
              <span className="h-px w-12 bg-olive-700/40" />
              <Leaf size={15} strokeWidth={1.8} />
              <span className="h-px w-12 bg-olive-700/40" />
            </div>

            <p
              className="mt-4 max-w-[30ch] leading-[1.6] text-text-soft"
              style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.3vw, 1.15rem)' }}
            >
              Rooted in tradition. Committed to purity. Crafted for a healthier tomorrow.
            </p>
          </div>
        </div>
      </div>

      <div className="py-[clamp(3.5rem,9vw,7rem)] px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 py-8 border-y border-line">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-medium text-olive-900" style={{ fontSize: 'clamp(1.8rem, 1.2rem + 2vw, 2.6rem)' }}>
                {s.number}
              </p>
              <p className="mt-1 text-sm text-text-mute tracking-wide uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="mt-16 grid gap-x-16 gap-y-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow">Since 1985</p>
            <h2 className="mt-3 font-sans font-bold text-olive-900 tracking-tight leading-[1.08]"
                style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.6rem)' }}>
              Four decades of cold-pressed perfection
            </h2>
          </div>
          <div className="space-y-5 text-text-soft leading-[1.8]"
               style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.05rem)' }}>
            <p>
              We have been in the coconut and coconut oil business since 1985. What started as MRS Oil Mills
              under my father, N. Rangasamy, has grown into a brand trusted by households across Coimbatore
              and the Nilgiri districts.
            </p>
            <p>
              Since our establishment, we have been supplying coconut oil under the brand name MRS.
              After 2016, we introduced the chekku oil concept and launched three major cooking oils
              — groundnut oil, coconut oil, and gingelly oil — under the brand name Samaha.
            </p>
            <p>
              We started another unit in Madampatti in 2016 specifically to procure quality raw materials
              from the Coimbatore Western Ghats region. We positioned ourselves as a major coconut and
              copra buyer in that area.
            </p>
            <p>
              We directly buy coconuts from farmers in the Velliangiri Hills area and bring them to
              our Sulur unit, where we process the coconuts into copra.
            </p>
          </div>
        </div>

        {/* Unique point — dark card */}
        <div className="mt-16 rounded-2xl bg-olive-900 overflow-hidden">
          <div className="grid lg:grid-cols-[1.2fr_1fr]">
            <div className="p-[clamp(2rem,5vw,4rem)]">
              <p className="eyebrow" style={{ color: 'var(--color-gold-400)' }}>What makes us different</p>
              <h2 className="mt-3 font-display font-medium leading-[1.1] text-paper"
                  style={{ fontSize: 'clamp(1.5rem, 1rem + 2vw, 2.4rem)' }}>
                We are the only ones in Coimbatore producing sulphur-free copra at scale
              </h2>
              <p className="mt-4 max-w-[55ch] leading-relaxed" style={{ color: 'var(--color-on-olive-soft)' }}>
                Anyone can ask what makes us unique or how we are different from others. We can proudly say
                we are the only ones in Coimbatore — or even in Pollachi and Kangeyam, areas known as the
                copra and coconut oil hub — who make copra without sulphur for coconut oil production.
              </p>
            </div>
            <div className="hidden lg:block relative">
              <img
                src="https://i.pinimg.com/1200x/8e/aa/7f/8eaa7f18cfaedb369dc392453e6ba4a0.jpg"
                alt="Sulphur-free copra production"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16">
          <p className="eyebrow">Our Values</p>
          <h2 className="mt-3 font-sans font-bold text-olive-900 tracking-tight"
              style={{ fontSize: 'clamp(1.4rem, 1rem + 1.6vw, 2rem)' }}>
            What we stand for
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="group p-6 rounded-2xl border border-line hover:border-olive-300 hover:shadow-sm transition-all duration-200">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-olive-100 text-olive-800 group-hover:bg-olive-900 group-hover:text-paper transition-colors duration-200">
                  <v.Icon size={20} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display font-medium text-olive-900" style={{ fontSize: '1.15rem' }}>
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-mute">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <div className="p-8 rounded-2xl bg-paper-2 border border-line">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-olive-900 text-paper">
                <MapPin size={18} strokeWidth={1.8} />
              </span>
              <h3 className="font-display font-medium text-olive-900">Sulur Unit</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-mute">
              Our main processing unit where coconuts are turned into copra and cold-pressed into oil.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-paper-2 border border-line">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-olive-900 text-paper">
                <MapPin size={18} strokeWidth={1.8} />
              </span>
              <h3 className="font-display font-medium text-olive-900">Madampatti Unit</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-mute">
              Our raw material procurement hub in the Western Ghats region for sourcing quality coconuts.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-wrap gap-3">
          <a href="/" className="btn btn-primary">
            Back to home <ArrowRight size={16} strokeWidth={2} />
          </a>
          <a href="/#shop" className="btn btn-ghost">
            Shop our oils
          </a>
        </div>

      </div>
    </section>
  )
}
