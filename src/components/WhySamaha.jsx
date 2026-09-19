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
        <div className="grid items-center gap-x-[clamp(2.5rem,6vw,5.5rem)] gap-y-9 lg:grid-cols-[0.92fr_1.08fr]">

          {/* intro + the mill */}
          <div>
            <p className="eyebrow">Why Samaha?</p>
            <h2
              className="mt-3 font-display font-medium leading-[1.05] text-olive-950"
              style={{ fontSize: 'clamp(1.9rem, 1.3rem + 2.6vw, 3.1rem)' }}
            >
              The Samaha difference
            </h2>
            <p className="mt-4 max-w-[44ch] text-[0.98rem] leading-[1.7] text-text-soft">
              Honest oil starts with how it is made &mdash; simple, careful and
              traceable from the first press to the final bottle.
            </p>

            <div className="mt-7 overflow-hidden rounded-[var(--radius-lg)] border border-line">
              <img
                src="/mill.webp"
                alt="The Samaha mill, where every lot is pressed and bottled"
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
                className="img-shimmer aspect-[16/10] w-full object-cover lg:aspect-[4/3]"
              />
            </div>
          </div>

          {/* the four reasons, numbered */}
          <ol>
            {REASONS.map(({ n, Icon, title, text }) => (
              <li
                key={title}
                className="grid grid-cols-[3.25rem_1fr] gap-x-4 border-b border-line py-6 first:border-t sm:grid-cols-[4.5rem_1fr] sm:gap-x-6 sm:py-7"
              >
                <span className="font-display text-[2.4rem] font-medium leading-none text-gold-600 sm:text-[3rem]">
                  {n}
                </span>
                <div>
                  <h3 className="flex items-center gap-2.5 font-display text-[1.1rem] font-medium text-olive-950 sm:text-[1.25rem]">
                    <Icon size={19} strokeWidth={1.7} className="shrink-0 text-olive-700" />
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-[1.65] text-text-soft sm:text-[0.95rem]">{text}</p>
                </div>
              </li>
            ))}
          </ol>

        </div>
      </div>
    </section>
  )
}
