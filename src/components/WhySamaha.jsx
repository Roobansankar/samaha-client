import { Sun, Sprout, Leaf, Boxes } from 'lucide-react'

const REASONS = [
  {
    n: '01',
    Icon: Sun,
    title: 'Pressed within hours',
    text: 'Harvest to cold press on the same day, so nothing turns on the way to the bottle.',
  },
  {
    n: '02',
    Icon: Sprout,
    title: 'Single origin, never blended',
    text: 'Every oil traces back to one farm and one crop. Nothing is mixed in to stretch it.',
  },
  {
    n: '03',
    Icon: Leaf,
    title: 'Nothing added or stripped',
    text: 'Unrefined, unfiltered, unbleached. No solvents, no deodorising, no shortcuts.',
  },
  {
    n: '04',
    Icon: Boxes,
    title: 'Small, dated lots',
    text: 'Bottled by hand in short runs, stamped with the pressing date so you know its age.',
  },
]

export default function WhySamaha() {
  return (
    <section className="bg-paper-inset" id="why" aria-label="Why choose Samaha">
      <div className="mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)] pb-[clamp(2.75rem,6vw,5rem)] pt-[clamp(1rem,2.5vw,1.75rem)]">

        <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Why Samaha?</p>
            <h2
              className="mt-3 font-display font-medium leading-[1.05] text-olive-950"
              style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.6vw, 3.1rem)' }}
            >
              The Samaha difference
            </h2>
          </div>
          <p className="max-w-[36ch] text-sm leading-[1.65] text-text-soft sm:text-right">
            Honest oil starts with how it is made &mdash; simple, careful and
            traceable from the first press to the final bottle.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {REASONS.map(({ n, Icon, title, text }) => (
            <article
              key={title}
              className="why-col flex flex-col rounded-[var(--radius-md)] border border-line bg-white p-[clamp(1.4rem,2.6vw,1.9rem)]"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-olive-100 text-olive-800">
                  <Icon size={20} strokeWidth={1.6} className="why-col__icon" />
                </span>
                <span className="font-display text-[0.8rem] font-semibold tracking-[0.2em] text-gold-700">
                  {n}
                </span>
              </div>

              <h3 className="mt-6 font-display font-medium text-olive-950" style={{ fontSize: '1.05rem' }}>
                {title}
              </h3>
              <p className="mt-2 text-sm leading-[1.6] text-text-soft">{text}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
