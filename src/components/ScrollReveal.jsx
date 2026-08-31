import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Progressive scroll-reveal for every page.
 * Adds `.js-anim` to <html>, tags each top-level <section> (outside the nav /
 * footer) with `.sr-section`, then flips `.is-revealed` as it enters view.
 * Without JS, or with reduced-motion, everything is simply visible.
 * Opt out of a section with `data-no-reveal`. Re-scans on every route change.
 */
export default function ScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (pathname.startsWith('/admin')) return // admin has its own styling

    document.documentElement.classList.add('js-anim')

    const targets = Array.from(document.querySelectorAll('section')).filter(
      (el) =>
        !el.closest('header, footer, .site-top, .admin, [data-no-reveal]') &&
        !el.parentElement?.closest('section'), // skip nested sections
    )
    if (!targets.length) return

    targets.forEach((el) => el.classList.add('sr-section'))

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -14% 0px' },
    )

    const fold = window.innerHeight * 0.9
    for (const el of targets) {
      if (el.getBoundingClientRect().top < fold) {
        el.classList.add('is-revealed') // already on screen — no flash
      } else {
        io.observe(el)
      }
    }

    return () => io.disconnect()
  }, [pathname])

  return null
}
