import { useEffect, useRef } from 'react'

/**
 * Writes the current scroll position (px) onto a CSS custom property on the
 * returned ref's element, so CSS can drive a transform-only parallax.
 * rAF-throttled, passive, and disabled when the user prefers reduced motion.
 */
export function useParallax(varName = '--sy') {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let ticking = false
    const update = () => {
      el.style.setProperty(varName, String(window.scrollY))
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [varName])

  return ref
}
