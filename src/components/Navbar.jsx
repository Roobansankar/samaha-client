import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useScrolled } from '../hooks/useScrolled'
import { Search, User, ShoppingCart, Menu, X, Leaf, ChevronRight } from 'lucide-react'

const LINKS = [
  { label: 'Home', href: '/', isLink: true },
  { label: 'Shop', href: '#shop' },
  { label: 'Health Benefits', href: '#benefits' },
  { label: 'About', href: '/about', isLink: true },
  { label: 'Press', href: '#press' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '/contact', isLink: true },
]

const CART_COUNT = 2

function Wordmark({ light = false, hideTaglineOnMobile = false }) {
  return (
    <a className="inline-flex shrink-0 items-center gap-2.5" href="#top" aria-label="Samaha — home">
      <span
        className="grid place-items-center w-[30px] h-[30px] rounded-full shrink-0"
        style={{
          border: `1.5px solid ${light ? 'rgba(26,46,20,0.2)' : 'var(--color-olive-400)'}`,
          color: light ? 'var(--color-olive-800)' : 'var(--color-olive-700)',
        }}
        aria-hidden="true"
      >
        <Leaf size={15} strokeWidth={2} />
      </span>
      <span className="flex flex-col items-start leading-none">
        <span
          className="font-display text-[1.3rem] font-medium tracking-[-0.01em] sm:text-[1.4rem]"
          style={{ color: 'var(--color-olive-900)' }}
        >
          Samaha
        </span>
        <span
          className={`mt-[2px] whitespace-nowrap font-sans font-semibold uppercase ${hideTaglineOnMobile ? 'hidden sm:block' : ''}`}
          style={{
            fontSize: '0.48rem',
            letterSpacing: '0.2em',
            color: light ? 'var(--color-text-mute)' : 'var(--color-olive-500)',
          }}
        >
          Extra Virgin Olive Oil
        </span>
      </span>
    </a>
  )
}

export default function Navbar() {
  const scrolled = useScrolled(8)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('#top')
  const location = useLocation()

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen)
    return () => document.body.classList.remove('no-scroll')
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className={`nav-header ${scrolled ? 'is-scrolled' : ''}`} data-open={menuOpen}>
      <div className="nav-header__inner grid grid-cols-[1fr_auto_1fr] items-center gap-3 min-[901px]:grid-cols-[auto_1fr_auto] min-[901px]:gap-4"
           style={{ paddingInline: 'var(--spacing-gutter)', paddingBlock: scrolled ? '0.8rem' : '1.35rem', transition: 'padding-block var(--duration-2) var(--ease-default)' }}>

        {/* Burger — mobile only, pinned left */}
        <button
          type="button"
          className="nav-burger hidden max-[900px]:grid place-items-center w-[42px] h-[42px] -ml-2 justify-self-start rounded-full bg-transparent text-olive-800 cursor-pointer hover:bg-olive-100 hover:text-olive-950 transition-colors duration-150"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} strokeWidth={1.8} />
        </button>

        {/* Brand — centred on mobile (nudged left to offset the two icons on
            the right), left-aligned on desktop */}
        <div className="justify-self-center -translate-x-[18px] min-[901px]:translate-x-0 min-[901px]:justify-self-start min-[901px]:pl-6">
          <Wordmark hideTaglineOnMobile />
        </div>

        {/* Center: primary links */}
        <nav className="nav-links max-[900px]:hidden flex justify-center gap-8" aria-label="Primary">
          {LINKS.map((link) => (
            link.isLink ? (
              <Link key={link.href}
                 className={`nav-link font-medium tracking-wide text-olive-700 hover:text-olive-950 ${(link.href === '/' ? location.pathname === '/' : location.pathname.startsWith(link.href)) ? 'is-active text-olive-950' : ''}`}
                 style={{ fontSize: 'clamp(0.83rem, 0.8rem + 0.15vw, 0.92rem)' }}
                 to={link.href}>
                {link.label}
              </Link>
            ) : (
              <a key={link.href}
                 className={`nav-link font-medium tracking-wide text-olive-700 hover:text-olive-950 ${active === link.href ? 'is-active text-olive-950' : ''}`}
                 style={{ fontSize: 'clamp(0.83rem, 0.8rem + 0.15vw, 0.92rem)' }}
                 href={link.href}
                 aria-current={active === link.href ? 'page' : undefined}
                 onClick={() => setActive(link.href)}>
                {link.label}
              </a>
            )
          ))}
        </nav>

        {/* Right: icons */}
        <div className="flex items-center justify-end min-w-0 gap-1 min-[901px]:pr-6">
          <button type="button"
                  className="grid place-items-center w-[42px] h-[42px] rounded-full bg-transparent text-olive-800 cursor-pointer hover:bg-olive-100 hover:text-olive-950 transition-colors duration-150"
                  aria-label="Search">
            <Search size={20} strokeWidth={1.8} />
          </button>
          <button type="button"
                  className="nav-account max-[900px]:hidden grid place-items-center w-[42px] h-[42px] rounded-full bg-transparent text-olive-800 cursor-pointer hover:bg-olive-100 hover:text-olive-950 transition-colors duration-150"
                  aria-label="Account">
            <User size={20} strokeWidth={1.8} />
          </button>
          <button type="button"
                  className="nav-bag relative grid place-items-center w-[42px] h-[42px] rounded-full bg-transparent text-olive-800 cursor-pointer hover:bg-olive-100 hover:text-olive-950 transition-colors duration-150"
                  aria-label={`Cart, ${CART_COUNT} items`}>
            <ShoppingCart size={20} strokeWidth={1.8} />
            {CART_COUNT > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-[3px] grid place-items-center text-[10px] font-bold leading-none text-on-olive bg-gold-500 rounded-full">
                {CART_COUNT}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer scrim */}
      <div className="nav-scrim" onClick={() => setMenuOpen(false)} />

      {/* Mobile sidebar */}
      <aside className="nav-drawer" aria-hidden={!menuOpen}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-olive-200">
          <Wordmark />
          <button
            type="button"
            className="grid place-items-center w-10 h-10 rounded-full bg-olive-100 text-olive-800 cursor-pointer hover:bg-olive-200 transition-colors duration-150"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col flex-grow px-6 py-4" aria-label="Mobile">
          {LINKS.map((link, i) => (
            link.isLink ? (
              <Link
                key={link.href}
                to={link.href}
                className="nav-drawer-link flex items-center justify-between py-4 border-b border-olive-100 text-olive-900 hover:text-olive-700 transition-colors"
                style={{ animationDelay: `${0.12 + i * 0.06}s` }}
                onClick={() => setMenuOpen(false)}
              >
                <span className="font-sans font-semibold text-lg tracking-tight">{link.label}</span>
                <ChevronRight size={18} strokeWidth={2} className="text-olive-400" />
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="nav-drawer-link flex items-center justify-between py-4 border-b border-olive-100 text-olive-900 hover:text-olive-700 transition-colors"
                style={{ animationDelay: `${0.12 + i * 0.06}s` }}
                onClick={() => setMenuOpen(false)}
              >
                <span className="font-sans font-semibold text-lg tracking-tight">{link.label}</span>
                <ChevronRight size={18} strokeWidth={2} className="text-olive-400" />
              </a>
            )
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 pb-8 pt-4 border-t border-olive-200 flex flex-col gap-4">
          <a href="#account" className="inline-flex items-center gap-3 font-medium text-sm text-olive-700 hover:text-olive-900 transition-colors">
            <User size={18} strokeWidth={1.8} /> My Account
          </a>
          <p className="text-xs text-olive-500 leading-relaxed">
            Grown on terraced hillside groves · Bottled 2025
          </p>
        </div>
      </aside>
    </header>
  )
}
