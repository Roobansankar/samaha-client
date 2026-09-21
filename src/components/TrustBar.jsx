import { Droplet, Leaf, ShieldPlus, BadgeCheck } from 'lucide-react'
import SectionHeading from './SectionHeading'

const ITEMS = [
  { Icon: Droplet, label: '100% Pure' },
  { Icon: Leaf, label: 'Naturally Extracted' },
  { Icon: ShieldPlus, label: 'No Additives' },
  { Icon: BadgeCheck, label: 'Trusted Quality' },
]

// On phones the section is taller and uses the portrait artwork (hwhy), so
// its corner leaves aren't cropped away; wider screens use the banner.
export default function TrustBar() {
  return (
    <section className="relative overflow-hidden bg-paper-2 max-[639px]:flex max-[639px]:min-h-[92vw] max-[639px]:items-center" aria-label="Why Samaha">
      <picture>
        <source media="(max-width: 639px)" srcSet="/hwhy.webp" />
        <img
          src="/why.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover max-[639px]:object-[50%_88%]"
        />
      </picture>
      <div className="relative mx-auto w-full max-w-[1100px] py-[clamp(2.25rem,5vw,3.75rem)] px-[var(--spacing-gutter)]">
        <div className="text-center">
          <SectionHeading as="h2" title="Why choose" accent="us" flourish={true} />
        </div>

        <ul className="mt-[clamp(1.75rem,4vw,2.75rem)] grid grid-cols-4 gap-x-4 gap-y-8 max-[640px]:grid-cols-2">
          {ITEMS.map(({ Icon, label }) => (
            <li key={label} className="flex flex-col items-center gap-3 text-center">
              <Icon width={30} height={30} className="text-olive-900" />
              <span className="font-semibold tracking-[0.02em] text-olive-900"
                    style={{ fontSize: 'clamp(0.85rem, 0.78rem + 0.3vw, 1.05rem)' }}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
