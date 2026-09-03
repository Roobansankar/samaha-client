import { Link, useLocation } from 'react-router-dom'
import { Home, Store, Search, Heart, UserRound } from 'lucide-react'
import { useAccount } from '../lib/account'

const initialOf = (name) => (name || '').trim().charAt(0).toUpperCase() || 'U'

export default function MobileTabBar() {
  const { pathname } = useLocation()
  const account = useAccount()

  const TABS = [
    { label: 'Home', to: '/', Icon: Home, exact: true },
    { label: 'Shop', to: '/shop', Icon: Store },
    { label: 'Search', Icon: Search, action: 'search' },
    { label: 'Wishlist', to: '/wishlist', Icon: Heart },
    account
      ? { label: 'Account', to: '/profile', initial: initialOf(account.name), avatar: account.avatar }
      : { label: 'Account', to: '/account', Icon: UserRound },
  ]

  const isActive = (t) =>
    !!t.to &&
    (t.exact
      ? pathname === t.to
      : t.to === '/profile'
        ? pathname.startsWith('/profile') || pathname === '/account'
        : pathname.startsWith(t.to))

  return (
    <nav className="tabbar min-[901px]:hidden" aria-label="Quick navigation">
      <div className="tabbar__bar">
        {TABS.map((t) => {
          const { Icon } = t
          const inner = (
            <>
              <span className="tabbar__icon">
                {Icon ? (
                  <Icon size={20} strokeWidth={2} />
                ) : t.avatar ? (
                  <img src={t.avatar} alt="" referrerPolicy="no-referrer" className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-olive-900 text-[0.62rem] font-bold text-paper">{t.initial}</span>
                )}
              </span>
              {t.label}
            </>
          )

          if (t.action === 'search') {
            return (
              <button
                key={t.label}
                type="button"
                className="tabbar__tab"
                aria-label="Search products"
                onClick={() => window.dispatchEvent(new CustomEvent('samaha:search'))}
              >
                {inner}
              </button>
            )
          }

          const active = isActive(t)
          return (
            <Link
              key={t.label}
              to={t.to}
              className={`tabbar__tab ${active ? 'is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {inner}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
