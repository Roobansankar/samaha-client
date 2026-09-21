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
      <div className="mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)] pb-[clamp(2.75rem,6vw,5rem)] pt-[clamp(2rem,4vw,3.5rem)]">

        <div className="text-center">
          <p className="eyebrow">Why Samaha?</p>
          <h2
            className="mt-3 font-display font-medium leading-[1.05] text-olive-950"
            style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.6vw, 3.1rem)' }}
          >
            The Samaha difference
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-[0.98rem] leading-[1.7] text-text-soft">
            Honest oil starts with how it is made &mdash; simple, careful and
            traceable from the first press to the final bottle.
          </p>
        </div>

        <ol className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ n, Icon, title, text }) => (
            <li
              key={title}
              className="relative rounded-[var(--radius-lg)] border border-line bg-paper p-6 transition-shadow hover:shadow-md sm:p-7"
            >
              <span className="font-display text-[2rem] font-medium leading-none text-gold-600">
                {n}
              </span>
              <div className="mt-4">
                <h3 className="flex items-center gap-2.5 font-display text-[1.05rem] font-medium text-olive-950">
                  <Icon size={18} strokeWidth={1.7} className="shrink-0 text-olive-700" />
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-[1.65] text-text-soft">{text}</p>
              </div>
            </li>
          ))}
        </ol>

      </div>
    </section>
  )
}
