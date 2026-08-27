import { useEffect, useRef, useState } from 'react'

const MESSAGES = [
  'Complimentary shipping on orders over $60',
  'Harvest 2025 — the first cold press is now bottled',
  'Pressed, tinned & labelled by hand in small lots',
]

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reduced.current) return

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length)
    }, 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-olive-900 text-on-olive-soft text-center" role="region" aria-label="Announcements">
      <div className="relative min-h-[2.7rem] flex items-center justify-center overflow-hidden"
           style={{ paddingBlock: '0.45rem', paddingInline: 'var(--spacing-gutter)' }}>
        <span key={index}
              className="min-w-0 max-w-[48rem] font-medium leading-[1.4] tracking-[0.16em] uppercase animate-[ann-in_0.7s_var(--ease-out)_both]"
              style={{ fontSize: 'clamp(0.72rem, 0.7rem + 0.1vw, 0.78rem)' }}>
          {MESSAGES[index]}
        </span>
      </div>
    </div>
  )
}
