import { useState } from 'react'
import { Plus, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    q: 'How soon after harvest is it pressed?',
    a: 'Every batch is cold-pressed the same day the crop is picked, so nothing sits and oxidises before it reaches the bottle.',
  },
  {
    q: 'How should I store it, and how long does it keep?',
    a: 'Keep it in a cool, dark cupboard away from the stove. Unopened, it stays at its best for about 12 months from the pressing date stamped on the base; use within 3 months of opening.',
  },
  {
    q: 'Is it suitable for high-heat cooking?',
    a: 'Groundnut and peanut oils are happy at frying temperatures. Coconut oil is best for medium heat, sautéing and baking. None are refined, so treat them gently for the fullest flavour.',
  },
  {
    q: 'What does “single origin” actually mean here?',
    a: 'Each oil comes from one farm and one crop — never blended with cheaper oils to bulk it out. The lot number on your bottle traces straight back to that pressing.',
  },
  {
    q: 'How does shipping and returns work?',
    a: 'Orders are packed within two working days, with complimentary shipping over $60. If the taste isn’t for you, tell us within 30 days and we’ll refund it — no need to send the bottle back.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="bg-paper-2" id="faq" aria-label="Frequently asked questions">
      <div className="py-[clamp(2rem,4vw,3rem)] px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Left — heading */}
          <div>
            <p className="eyebrow">Good to know</p>
            <h2 className="mt-3 font-display font-medium leading-[1.08] text-olive-900"
                style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.4vw, 3rem)' }}>
              Questions, answered
            </h2>
            <Link to="/contact"
               className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-olive-800 transition-colors duration-200 hover:text-olive-950">
              <span className="underline decoration-1 underline-offset-[5px]">Still stuck? Talk to us</span>
              <ArrowUpRight size={15} strokeWidth={2}
                className="transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
            </Link>
          </div>

          {/* Right — accordion */}
          <ul className="border-t border-line">
            {FAQS.map((item, i) => {
              const isOpen = open === i
              return (
                <li key={item.q} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 py-5 text-left"
                  >
                    <span className="font-display text-olive-900" style={{ fontSize: '1.15rem' }}>
                      {item.q}
                    </span>
                    <Plus
                      size={20}
                      strokeWidth={2}
                      className={`shrink-0 text-olive-600 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[60ch] pb-5 pr-6 leading-relaxed text-text-soft">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
