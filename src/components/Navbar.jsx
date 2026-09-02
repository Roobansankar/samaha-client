import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useScrolled } from '../hooks/useScrolled'
import { Search, User, ShoppingCart, Menu, X, Leaf, ChevronRight } from 'lucide-react'

const LINKS = [
  { label: 'Home', href: '/', exact: true },
  { label: 'Shop', href: '/shop' },
  { label: 'Health Benefits', href: '/health-benefits' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const SEARCH_HINTS = [
  'cold-pressed coconut oil',
  'wood-pressed groundnut oil',
  'cold-pressed peanut oil',
  'stone-ground sesame oil',
]

const CART_COUNT = 2

/* Typewriter that cycles through phrases; static first phrase if reduced-motion. */
function useTypewriter(words) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [text, setText] = useState(reduced ? words[0] : '')
  const state = useRef({ i: 0, deleting: false })

  useEffect(() => {
    if (reduced) return
    let timer
    const tick = () => {
      const { i, deleting } = state.current
      const word = words[i % words.length]
      const done = !deleting && text === word
      const cleared = deleting && text === ''

      if (done) {
        state.current.deleting = true
        timer = setTimeout(tick, 1500)
        return
      }
      if (cleared) {
        state.current.deleting = false
        state.current.i = i + 1
        timer = setTimeout(tick, 260)
        return
      }
      const next = deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)
      setText(next)
      timer = setTimeout(tick, deleting ? 34 : 66)
    }
    timer = setTimeout(tick, 500)
    return () => clearTimeout(timer)
  }, [text, words, reduced])

  return text
}

function SearchField({ query, setQuery, onFocusChange, ghost, typed, onSubmit, className = '' }) {
  return (
    <form onSubmit={onSubmit} role="search" className={`nav-search ${className}`}>
      <Search size={16} strokeWidth={2} className="nav-search__lead" aria-hidden="true" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        aria-label="Search products"
        className="nav-search__input"
      />
      {ghost && (
        <span className="nav-search__ghost" aria-hidden="true">
          <span className="nav-search__typed">{typed}</span>
          <i className="nav-search__caret" />
        </span>
      )}
      <button type="submit" className="nav-search__go" aria-label="Search">
        <ChevronRight size={16} strokeWidth={2.4} />
      </button>
    </form>
  )
}

function Wordmark({ hideTaglineOnMobile = false }) {
  return (
    <Link
      className="nav-brand inline-flex shrink-0 items-center gap-2.5"
      to="/"
      aria-label="Samaha — home"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <span
        className="nav-mark grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full"
        style={{ border: '1.5px solid var(--color-olive-400)', color: 'var(--color-olive-700)' }}
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
          className={`mt-[2px] whitespace-nowrap font-sans font-semibold uppercase ${
            hideTaglineOnMobile ? 'hidden sm:block' : ''
          }`}
          style={{ fontSize: '0.48rem', letterSpacing: '0.2em', color: 'var(--color-olive-500)' }}
        >
          Pure Natural Healthy
        </span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const scrolled = useScrolled(8)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const typed = useTypewriter(SEARCH_HINTS)

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

  const isActive = (link) =>
    link.exact ? location.pathname === '/' : location.pathname.startsWith(link.href)

  const submitSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    setMenuOpen(false)
  }

  const showGhost = !query && !focused

  return (
    <header className={`nav-header ${scrolled ? 'is-scrolled' : ''}`} data-open={menuOpen}>
      <div
        className={`mx-auto flex max-w-[var(--max-w-site)] items-center gap-3 ${
          scrolled ? 'py-2.5' : 'py-3.5'
        } sm:gap-5`}
        style={{ paddingInline: 'var(--spacing-gutter)', transition: 'padding var(--duration-2) var(--ease-default)' }}
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

        <div className="max-[900px]:mx-auto max-[900px]:-translate-x-3">
          <Wordmark hideTaglineOnMobile />
        </div>

        <nav className="mx-auto hidden gap-7 min-[901px]:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`nav-link font-medium tracking-wide text-olive-700 hover:text-olive-950 ${
                isActive(link) ? 'is-active text-olive-950' : ''
              }`}
              style={{ fontSize: 'clamp(0.83rem, 0.8rem + 0.15vw, 0.92rem)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <SearchField
          query={query}
          setQuery={setQuery}
          onFocusChange={setFocused}
          ghost={showGhost}
          typed={typed}
          onSubmit={submitSearch}
          className="hidden w-[clamp(14rem,18vw,17rem)] min-[1180px]:flex"
        />

        <div className="-mr-2 ml-auto flex items-center gap-0.5 min-[901px]:ml-0">
          <Link
            to="/shop"
            className="nav-icon min-[1180px]:hidden"
            aria-label="Search"
          >
            <Search size={20} strokeWidth={1.8} />
          </Link>
          <Link to="/account" className="nav-icon max-[900px]:hidden" aria-label="Account">
            <User size={20} strokeWidth={1.8} />
          </Link>
          <Link to="/cart" className="nav-icon relative" aria-label={`Cart, ${CART_COUNT} items`}>
            <ShoppingCart size={20} strokeWidth={1.8} />
            {CART_COUNT > 0 && <span className="nav-badge">{CART_COUNT}</span>}
          </Link>
        </div>
      </div>

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

        <div className="px-6 pt-4">
          <SearchField
            query={query}
            setQuery={setQuery}
            onFocusChange={setFocused}
            ghost={showGhost}
            typed={typed}
            onSubmit={submitSearch}
          />
        </div>

        <nav className="flex flex-grow flex-col px-6 py-4" aria-label="Mobile">
          {LINKS.map((link, i) => (
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
          ))}
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
