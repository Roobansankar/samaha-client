import { Leaf, AtSign, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

const COLS = [
  {
    title: 'Shop',
    links: [
      ['All oils', '/shop'],
      ['Coconut oil', '/shop/coconut-oil'],
      ['Groundnut oil', '/shop/groundnut-oil'],
      ['Sesame oil', '/shop/sesame-oil'],
    ],
  },
  {
    title: 'Samaha',
    links: [
      ['Our story', '/about'],
      ['Why Samaha', '/'],
      ['Journal', '/'],
      ['Reviews', '/'],
    ],
  },
  {
    title: 'Policies',
    links: [
      ['Shipping & delivery', '/shipping-policy'],
      ['Refund & cancellation', '/refund-policy'],
      ['Terms & conditions', '/terms-and-conditions'],
      ['Privacy policy', '/privacy-policy'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-olive-950 text-on-olive-soft">
      <div className="py-[clamp(3rem,7vw,5rem)] px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="Samaha — home">
              <span className="grid h-[30px] w-[30px] place-items-center rounded-full border border-line-on-olive text-gold-300">
                <Leaf size={15} strokeWidth={2} />
              </span>
              <span className="flex flex-col items-start leading-none">
                <span className="font-display text-[1.4rem] font-medium text-on-olive">Samaha</span>
                <span className="mt-[2px] text-[0.48rem] font-semibold uppercase tracking-[0.2em] text-on-olive-mute">
                  Pure Natural Healthy
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-[32ch] text-sm leading-relaxed text-on-olive-mute">
              Single-origin oils, cold-pressed within hours of harvest and bottled
              by hand in small, dated lots.
            </p>
            <div className="mt-5 flex gap-2">
              {[AtSign, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line-on-olive text-on-olive-soft transition-colors duration-200 hover:border-gold-300 hover:text-gold-300"
                >
                  <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-on-olive-mute">
                {col.title}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-on-olive-soft transition-colors duration-200 hover:text-on-olive">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-[clamp(2.5rem,6vw,4rem)] flex flex-col gap-3 border-t border-line-on-olive pt-6 text-xs text-on-olive-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Samaha. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="transition-colors duration-200 hover:text-on-olive-soft">Privacy</Link>
            <Link to="/terms-and-conditions" className="transition-colors duration-200 hover:text-on-olive-soft">Terms</Link>
            <Link to="/refund-policy" className="transition-colors duration-200 hover:text-on-olive-soft">Refund policy</Link>
            <Link to="/shipping-policy" className="transition-colors duration-200 hover:text-on-olive-soft">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
