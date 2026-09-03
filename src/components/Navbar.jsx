import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useScrolled } from '../hooks/useScrolled'
import { Search, User, ShoppingCart, Menu, X, ChevronRight, ChevronDown } from 'lucide-react'

/* TEMPORARILY DISABLED — "Shop by Category" nav dropdown.
   To re-enable: uncomment CATEGORIES below and the "Shop by Category" entry in LINKS.
   The NavCategory component, the mobile-drawer branch and the .nav-menu CSS are left in place. */
// const CATEGORIES = [
//   { label: 'Coconut Oil', href: '/shop/coconut-oil', note: 'Mild & versatile', img: '/cat-coconut.jpg' },
//   { label: 'Groundnut Oil', href: '/shop/groundnut-oil', note: 'Deep & nutty', img: '/products/groundnut-oil.webp' },
//   { label: 'Sesame Oil', href: '/shop/sesame-oil', note: 'Rich & aromatic', img: '/products/sesame-oil.webp' },
// ]

const LINKS = [
  { label: 'Home', href: '/', exact: true },
  { label: 'Shop', href: '/shop' },
  // { label: 'Shop by Category', href: '/shop', menu: CATEGORIES },
  { label: 'Health Benefits', href: '/health-benefits' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const SEARCH_HINTS = [
  'coconut oil',
  'groundnut oil',
  'sesame oil',
]

const CART_COUNT = 2

/* Typewriter that cycles through phrases; static first phrase if reduced-motion. */
function useTypewriter(words, active) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [text, setText] = useState(reduced ? words[0] : '')
  const state = useRef({ i: 0, deleting: false })

  useEffect(() => {
    if (reduced || !active) return
    let timer
    const tick = () => {
      const { i, deleting } = state.current
      const word = words[i % words.length]
      if (!deleting && text === word) {
        state.current.deleting = true
        timer = setTimeout(tick, 1500)
        return
      }
      if (deleting && text === '') {
        state.current.deleting = false
        state.current.i = i + 1
        timer = setTimeout(tick, 260)
        return
      }
      setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
      timer = setTimeout(tick, deleting ? 34 : 66)
    }
    timer = setTimeout(tick, 400)
    return () => clearTimeout(timer)
  }, [text, words, reduced, active])

  return text
}

function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const typed = useTypewriter(SEARCH_HINTS, open && !query)

  const close = () => {
    setQuery('')
    onClose()
  }

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    document.body.classList.add('no-scroll')
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const go = (value) => {
    const q = value.trim()
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    close()
  }

  return (
    <div
      className={`search-full ${open ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="search-full__inner mx-auto w-full max-w-[1180px] px-[var(--spacing-gutter)]">
        <form
          onSubmit={(e) => { e.preventDefault(); go(query) }}
          role="search"
          className="flex items-center gap-4 pt-[clamp(2.5rem,11vh,6rem)]"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
              className="search-full__input w-full bg-transparent outline-none"
            />
            {!query && (
              <span className="search-full__ghost" aria-hidden="true">
                {typed || 'Search for products'}
                <i className="nav-search__caret" />
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            className="search-full__close"
            aria-label="Close search"
          >
            <X size={28} strokeWidth={1.6} />
          </button>
        </form>

        <span className="search-full__rule" />

        <p className="search-full__hint">
          {query
            ? `Press Enter to search “${query}”`
            : 'Start typing, or pick a popular search below.'}
        </p>

        {!query && (
          <div className="mt-6 flex flex-wrap gap-2">
            {SEARCH_HINTS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => go(h)}
                className="rounded-pill border border-line px-4 py-1.5 text-sm capitalize text-olive-800 transition-colors hover:border-olive-400 hover:bg-olive-100"
              >
                {h}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Wordmark({ className = 'h-11 sm:h-[52px]' }) {
  return (
    <Link
      className="nav-brand inline-flex shrink-0 items-center"
      to="/"
      aria-label="Samaha — home"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <img
        src="/samahalogo.png"
        alt="Samaha"
        width="220"
        height="220"
        className={`w-auto object-contain mix-blend-multiply ${className}`}
      />
    </Link>
  )
}

/* Desktop nav item with a "shop by category" flyout. */
function NavCategory({ link, active }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(null)

  const show = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const scheduleHide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 110)
  }

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  return (
    <div
      className="nav-cat"
      onMouseEnter={show}
      onMouseLeave={scheduleHide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
    >
      <Link
        to={link.href}
        className={`nav-link inline-flex items-center gap-1 font-semibold tracking-wide text-olive-800 hover:text-olive-950 ${
          active ? 'is-active text-olive-950' : ''
        }`}
        style={{ fontSize: 'clamp(0.9rem, 0.86rem + 0.2vw, 1rem)' }}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(false)}
      >
        {link.label}
        <ChevronDown
          size={14}
          strokeWidth={2.4}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Link>

      <div className={`nav-menu ${open ? 'is-open' : ''}`}>
        <div className="nav-menu__inner">
          {link.menu.map((c) => (
            <Link key={c.href} to={c.href} className="nav-menu__card" onClick={() => setOpen(false)}>
              <span className="nav-menu__thumb">
                <img src={c.img} alt="" loading="lazy" />
              </span>
              <span className="nav-menu__text">
                <b>{c.label}</b>
                <span>{c.note}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const scrolled = useScrolled(8)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
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

  // The mobile tab bar's search button opens the full-page overlay via this event.
  useEffect(() => {
    const open = () => setSearchOpen(true)
    window.addEventListener('samaha:search', open)
    return () => window.removeEventListener('samaha:search', open)
  }, [])

  const isActive = (link) =>
    link.exact ? location.pathname === link.href : location.pathname.startsWith(link.href)

  return (
    <header className={`nav-header ${scrolled ? 'is-scrolled' : ''}`} data-open={menuOpen}>
      <div
        className={`mx-auto flex max-w-[1500px] items-center gap-3 ${
          scrolled ? 'py-2.5' : 'py-3.5'
        } sm:gap-6`}
        style={{
          paddingInline: 'clamp(1.75rem, 5vw, 5rem)',
          transition: 'padding var(--duration-2) var(--ease-default)',
        }}
      >
        <button
          type="button"
          className="nav-burger -ml-2 hidden h-[42px] w-[42px] place-items-center rounded-full text-olive-800 transition-colors hover:bg-olive-100 hover:text-olive-950 max-[900px]:grid"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} strokeWidth={1.8} />
        </button>

        <div className="max-[900px]:absolute max-[900px]:left-1/2 max-[900px]:-translate-x-1/2">
          <Wordmark />
        </div>

        <nav className="mx-auto hidden items-center gap-x-5 min-[1180px]:gap-x-7 min-[901px]:flex" aria-label="Primary">
          {LINKS.map((link) =>
            link.menu ? (
              <NavCategory
                key={link.label}
                link={link}
                active={location.pathname.startsWith('/shop/')}
              />
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`nav-link font-semibold tracking-wide text-olive-800 hover:text-olive-950 ${
                  isActive(link) ? 'is-active text-olive-950' : ''
                }`}
                style={{ fontSize: 'clamp(0.9rem, 0.86rem + 0.2vw, 1rem)' }}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="-mr-2 ml-auto flex items-center gap-0.5 min-[901px]:ml-0">
          <button
            type="button"
            className="nav-icon max-[900px]:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} strokeWidth={1.8} />
          </button>
          <Link to="/account" className="nav-icon max-[900px]:hidden" aria-label="Account">
            <User size={20} strokeWidth={1.8} />
          </Link>
          <Link to="/cart" className="nav-icon relative" aria-label={`Cart, ${CART_COUNT} items`}>
            <ShoppingCart size={20} strokeWidth={1.8} />
            {CART_COUNT > 0 && <span className="nav-badge">{CART_COUNT}</span>}
          </Link>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer */}
      <div className="nav-scrim" onClick={() => setMenuOpen(false)} />
      <aside className="nav-drawer" aria-hidden={!menuOpen}>
        <div className="flex items-center justify-between border-b border-olive-200 px-6 py-5">
          <Wordmark />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-olive-100 text-olive-800 transition-colors hover:bg-olive-200"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <nav className="flex flex-grow flex-col px-6 py-6" aria-label="Mobile">
          {LINKS.map((link, i) =>
            link.menu ? (
              <div key={link.label} className="border-b border-olive-100">
                <button
                  type="button"
                  className="nav-drawer-link flex w-full items-center justify-between py-4 text-left text-olive-900"
                  style={{ animationDelay: `${0.12 + i * 0.06}s` }}
                  aria-expanded={shopOpen}
                  onClick={() => setShopOpen((v) => !v)}
                >
                  <span className="font-sans text-lg font-semibold tracking-tight">{link.label}</span>
                  <ChevronDown
                    size={18}
                    strokeWidth={2}
                    className={`text-olive-400 transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {shopOpen && (
                  <div className="flex flex-col gap-1 pb-4 pl-1">
                    {link.menu.map((c) => (
                      <Link
                        key={c.href}
                        to={c.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg py-2 pr-2 text-olive-800 transition-colors hover:bg-olive-100"
                      >
                        <img
                          src={c.img}
                          alt=""
                          loading="lazy"
                          className="h-9 w-9 shrink-0 rounded-md bg-paper-inset object-contain p-0.5"
                        />
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold">{c.label}</span>
                          <span className="text-xs text-text-mute">{c.note}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="nav-drawer-link flex items-center justify-between border-b border-olive-100 py-4 text-olive-900 transition-colors hover:text-olive-700"
                style={{ animationDelay: `${0.12 + i * 0.06}s` }}
                onClick={() => setMenuOpen(false)}
              >
                <span className="font-sans text-lg font-semibold tracking-tight">{link.label}</span>
                <ChevronRight size={18} strokeWidth={2} className="text-olive-400" />
              </Link>
            )
          )}
        </nav>

        <div className="border-t border-olive-200 px-6 pb-8 pt-4">
          <Link
            to="/account"
            onClick={() => setMenuOpen(false)}
            className="btn btn-primary w-full py-3 text-center text-sm"
          >
            Login / Register
          </Link>
        </div>
      </aside>
    </header>
  )
}
