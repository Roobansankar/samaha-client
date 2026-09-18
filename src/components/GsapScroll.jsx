import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP scroll animations for the storefront.
 * - Fade-up reveal for every top-level <section> (same targeting as the
 *   old CSS ScrollReveal, so no markup changes needed).
 * - Stagger for content blocks / grid children inside each section.
 * - Scrubbed parallax for images marked with `data-gsap-parallax`.
 * - Opt-in per-element API: `data-gsap="fade-up|fade|scale|left|right"`
 *   with optional `data-gsap-delay="0.15"`.
 * Without JS, or with reduced-motion, everything stays visible.
 * Skipped entirely on /admin.
 */
export default function GsapScroll() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (pathname.startsWith('/admin')) return

    const ctx = gsap.context(() => {
      // Same section targeting as ScrollReveal: top-level sections only,
      // outside header/footer/nav, minus nested sections and opt-outs.
      const sections = Array.from(document.querySelectorAll('section')).filter(
        (el) =>
          !el.closest('header, footer, .site-top, .admin, [data-no-reveal]') &&
          !el.parentElement?.closest('section'),
      )

      const fold = window.innerHeight * 0.92

      for (const section of sections) {
        // Content blocks mirror the old CSS stagger: direct children of the
        // section's inner wrapper, plus grid children / list items.
        const blocks = section.querySelectorAll(':scope > * > *')
        const cards = section.querySelectorAll(
          ':scope [class*="grid-cols"] > *, :scope ul > li',
        )
        const items = [...new Set([...blocks, ...cards])].filter(
          (el) => !el.closest('[data-gsap]'),
        )

        const alreadyVisible = section.getBoundingClientRect().top < fold

        if (alreadyVisible) {
          // Above the fold — show instantly, no flash, no trigger needed.
          // Only clear the properties this reveal system itself animates
          // (opacity/visibility/transform) — `clearProps: 'all'` was wiping
          // the *entire* inline style attribute, taking React-authored
          // styles (like a heading's inline fontSize) down with it.
          gsap.set([section, ...items], { clearProps: 'opacity,visibility,transform' })
          continue
        }

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', overwrite: 'auto' },
          scrollTrigger: { trigger: section, start: 'top 88%', once: true },
        })
        tl.fromTo(
          section,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          0,
        )
        if (items.length) {
          tl.fromTo(
            items,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 },
            0.1,
          )
        }
      }

      // Opt-in single-element reveals (overrides the section batch above).
      gsap.utils.toArray('[data-gsap]').forEach((el) => {
        const kind = el.dataset.gsap || 'fade-up'
        const delay = parseFloat(el.dataset.gsapDelay || '0')
        const from = { autoAlpha: 0, y: 0, x: 0, scale: 1 }
        if (kind === 'fade-up') from.y = 28
        if (kind === 'left') from.x = -32
        if (kind === 'right') from.x = 32
        if (kind === 'scale') from.scale = 0.94
        // `fade` stays as-is (opacity only).
        gsap.fromTo(el, from, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          overwrite: 'auto',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      // Opt-in parallax: wrap the <img> in an overflow-hidden parent and
      // mark the img with `data-gsap-parallax`. Gentle scrubbed drift.
      gsap.utils.toArray('[data-gsap-parallax]').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('section') || img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      ScrollTrigger.refresh()
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready?.then(refresh).catch(() => {})

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [pathname])

  return null
}
