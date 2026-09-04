import { Link, Navigate, useParams } from 'react-router-dom'
import { Mail, Phone, ArrowRight } from 'lucide-react'
import { POLICIES, POLICY_CONTACT } from '../data/policies'

/* exactly the navbar container — edges line up with the nav */
const COL = 'mx-auto w-full max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)]'

export default function PolicyPage({ slug }) {
  const params = useParams()
  const key = slug || params.slug
  const policy = POLICIES[key]

  if (!policy) return <Navigate to="/" replace />

  const tel = POLICY_CONTACT.phone.replace(/\s+/g, '')

  return (
    <article className="bg-paper" id={`policy-${policy.key}`}>
      {/* ---- header ---- */}
      <header className="bg-olive-950 text-on-olive">
        <div className={`${COL} py-[clamp(2.75rem,6vw,4.25rem)]`}>
          <nav className="flex items-center gap-2 text-xs text-on-olive-mute">
            <Link to="/" className="transition-colors hover:text-on-olive-soft">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-on-olive-soft">Legal</span>
          </nav>
          <h1
            className="mt-3 font-display font-medium leading-[1.05] text-on-olive"
            style={{ fontSize: 'clamp(2rem, 1.5rem + 2.4vw, 3.1rem)' }}
          >
            {policy.title}
          </h1>
          <p className="mt-4 text-sm text-on-olive-mute">Last updated {policy.updated}</p>
        </div>
      </header>

      {/* ---- body ---- */}
      <div className={`${COL} py-[clamp(2.5rem,6vw,4rem)]`}>
        <p className="text-[1.05rem] leading-[1.85] text-text-soft">{policy.intro}</p>

        <div className="mt-4 divide-y divide-line">
          {policy.sections.map((s, i) => (
            <section key={i} className="py-8 first:border-t first:border-line">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[0.8rem] font-medium text-gold-700">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-display text-[1.2rem] font-medium leading-snug text-olive-900">
                  {s.h}
                </h2>
              </div>
              <div className="mt-3.5 space-y-3.5 text-[0.95rem] leading-[1.85] text-text-soft">
                {s.body.map((b, j) =>
                  typeof b === 'string' ? (
                    <p key={j}>{b}</p>
                  ) : (
                    <ul key={j} className="ml-1 space-y-2">
                      {b.list.map((li, l) => (
                        <li key={l} className="relative pl-5">
                          <span
                            className="absolute left-0 top-[0.62em] h-1.5 w-1.5 rounded-full bg-olive-400"
                            aria-hidden="true"
                          />
                          {li}
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>

        {/* ---- contact ---- */}
        <div className="mt-10 rounded-2xl border border-line bg-white p-[clamp(1.5rem,4vw,2.25rem)]">
          <h2 className="font-display text-[1.15rem] font-medium text-olive-900">
            Questions about this policy?
          </h2>
          <p className="mt-2 max-w-[52ch] text-[0.92rem] leading-relaxed text-text-mute">
            Our team is happy to help before or after you order. Reach us any working day,
            Monday to Saturday.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${POLICY_CONTACT.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-olive-900 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-olive-800"
            >
              <Mail size={15} strokeWidth={1.9} /> {POLICY_CONTACT.email}
            </a>
            <a
              href={`tel:${tel}`}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-olive-900 transition-colors hover:border-olive-300 hover:bg-paper-inset"
            >
              <Phone size={15} strokeWidth={1.9} /> {POLICY_CONTACT.phone}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-medium text-olive-800 transition-colors hover:text-olive-950"
            >
              Contact page <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
