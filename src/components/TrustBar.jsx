import { Droplet, Leaf, ShieldPlus, BadgeCheck } from 'lucide-react'

const ITEMS = [
  { Icon: Droplet, label: '100% Pure' },
  { Icon: Leaf, label: 'Naturally Extracted' },
  { Icon: ShieldPlus, label: 'No Additives' },
  { Icon: BadgeCheck, label: 'Trusted Quality' },
]

export default function TrustBar() {
  return (
    <section className="border-y border-line bg-paper-2" aria-label="Why Samaha">
      <div className="py-[clamp(1.5rem,3vw,2rem)] px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <ul className="grid grid-cols-4 gap-x-4 gap-y-6 max-[640px]:grid-cols-2">
          {ITEMS.map(({ Icon, label }) => (
            <li key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon width={26} height={26} className="text-olive-950" />
              <span className="font-semibold tracking-[0.02em] text-olive-900"
                    style={{ fontSize: 'clamp(0.8rem, 0.75rem + 0.2vw, 0.95rem)' }}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
