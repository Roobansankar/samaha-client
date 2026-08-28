import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Flame, Zap, Sparkles, Droplet, Smile, Leaf } from 'lucide-react'

const PAD = 'px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]'

const BENEFITS = [
  { Icon: Heart, title: 'Heart-friendly fats', text: 'Rich in unsaturated fats with natural antioxidants intact.', color: 'bg-red-50 text-red-600' },
  { Icon: Flame, title: 'Stable at high heat', text: 'Smoke points of 225–230°C — holds together in a hot pan.', color: 'bg-orange-50 text-orange-600' },
  { Icon: Zap, title: 'Fast, clean energy', text: 'Medium-chain fats absorbed quickly and burned for fuel.', color: 'bg-yellow-50 text-yellow-600' },
  { Icon: Sparkles, title: 'Skin nourishment', text: 'Light enough to absorb, rich enough to seal in moisture.', color: 'bg-pink-50 text-pink-600' },
  { Icon: Droplet, title: 'Stronger hair', text: 'Pre-wash oiling coats each strand and cuts protein loss.', color: 'bg-blue-50 text-blue-600' },
  { Icon: Smile, title: 'Oral care ritual', text: 'Oil pulling — a spoon swished each morning.', color: 'bg-green-50 text-green-600' },
]

const OILS = [
  {
    name: 'Coconut Oil',
    img: '/products/coconut-oil.png',
    tint: '#e6e1d4',
    fat: 'Medium-chain triglycerides',
    smoke: '~177°C',
    use: 'Baking, sautéing, skin & hair',
  },
  {
    name: 'Groundnut Oil',
    img: '/products/groundnut-oil.png',
    tint: '#e8d8ba',
    fat: 'Monounsaturated fat',
    smoke: '~230°C',
    use: 'Deep frying, tempering',
  },
  {
    name: 'Peanut Oil',
    img: '/products/peanut-oil.png',
    tint: '#e3c8a3',
    fat: 'Balanced fats',
    smoke: '~225°C',
    use: 'Stir-fry, dressings',
  },
]

export default function HealthBenefitsPage() {
  return (
    <div className="bg-paper">

      {/* Hero */}
      <section className={`${PAD} py-[clamp(2rem,4vw,3rem)] relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-olive-100/50 via-paper to-gold-100/30" />
        <div className="relative max-w-[48rem]">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-olive-900 text-paper text-xs font-semibold">
            <Leaf size={12} strokeWidth={2} />
            100% Natural
          </span>
          <h1 className="mt-5 font-display font-medium leading-[1.05] text-olive-900"
              style={{ fontSize: 'clamp(2rem, 1.3rem + 3.5vw, 3.8rem)' }}>
            The goodness in{' '}
            <span className="italic text-gold-600">every bottle</span>
          </h1>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-text-soft"
             style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.1rem)' }}>
            Honest, unrefined oils — nothing here is a cure. But when pressed cold and
            left alone, they keep far more of what makes them worth eating.
          </p>
          <div className="mt-7 flex gap-3">
            <Link to="/shop" className="btn btn-primary">
              Shop oils <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits - side by side layout */}
      <section className={`${PAD} py-[clamp(2rem,4vw,3rem)]`}>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="flex gap-4 rounded-xl border border-line bg-paper-inset p-5 hover:border-olive-300 transition-colors duration-200">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${b.color}`}>
                <b.Icon size={22} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="font-sans text-sm font-semibold text-olive-900">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-soft">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Oils comparison - no images */}
      <section className={`${PAD} py-[clamp(2rem,4vw,3rem)]`}>
        <div className="max-w-[48rem]">
          <p className="eyebrow">By the oil</p>
          <h2 className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
              style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.4rem)' }}>
            Each oil, and what it&rsquo;s good for
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {OILS.map((o, i) => (
            <div key={o.name} className="rounded-xl border border-line bg-paper p-6 hover:border-olive-300 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-olive-100 text-olive-800 text-xs font-bold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-sans text-base font-semibold text-olive-900">{o.name}</h3>
              </div>
              <dl className="mt-5 space-y-3">
                <div>
                  <dt className="text-xs text-text-mute uppercase tracking-wide">Key fat</dt>
                  <dd className="mt-0.5 text-sm font-medium text-olive-900">{o.fat}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-mute uppercase tracking-wide">Smoke point</dt>
                  <dd className="mt-0.5 text-sm font-medium text-olive-900">{o.smoke}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-mute uppercase tracking-wide">Best for</dt>
                  <dd className="mt-0.5 text-sm font-medium text-olive-900">{o.use}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`${PAD} py-[clamp(2rem,4vw,3rem)]`}>
        <div className="rounded-2xl bg-olive-900 p-[clamp(2rem,5vw,4rem)] text-center">
          <h2 className="font-display font-medium text-paper leading-[1.1]"
              style={{ fontSize: 'clamp(1.5rem, 1rem + 2vw, 2.2rem)' }}>
            Start with one bottle
          </h2>
          <p className="mx-auto mt-3 max-w-[48ch] text-sm leading-relaxed" style={{ color: 'var(--color-on-olive-soft)' }}>
            These are foods, not medicine. Use them as part of a varied diet.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn btn-primary">
              Shop the oils <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link to="/about" className="inline-flex items-center justify-center gap-0.55em px-6 py-3 rounded-full border border-on-olive-mute text-on-olive text-sm font-semibold transition-all duration-200 hover:bg-paper hover:text-olive-900 hover:border-paper cursor-pointer">
              Our story
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
