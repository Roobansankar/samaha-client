import { useEffect, useState } from 'react'

/**
 * Returns true once the page has scrolled past `threshold` px.
 * Scroll handler is passive + rAF-throttled so it never blocks the main thread.
 */
export function useScrolled(threshold = 6) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false

    const update = () => {
      setScrolled(window.scrollY > threshold)
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
  }, [threshold])

  return scrolled
}
