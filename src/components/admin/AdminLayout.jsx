import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  Sun,
  Moon,
  Sprout,
  ExternalLink,
} from 'lucide-react'
import { signOut } from './auth'
import { AdminThemeContext } from './theme'

const NAV = [
  {
    group: 'Overview',
    items: [
      { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    ],
  },
  {
    group: 'Catalog',
    items: [{ to: '/admin/products', label: 'Products', icon: Package }],
  },
  {
    group: 'People',
    items: [{ to: '/admin/customers', label: 'Customers', icon: Users }],
  },
  {
    group: 'System',
    items: [{ to: '/admin/settings', label: 'Settings', icon: Settings }],
  },
]

const ALL_ITEMS = NAV.flatMap((g) => g.items)

const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(() => {
    try {
      return localStorage.getItem('adminNavCollapsed') === 'true'
    } catch {
      return false
    }
  })
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('adminTheme') || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('adminTheme', theme)
    } catch { /* ignore */ }
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem('adminNavCollapsed', String(navCollapsed))
    } catch { /* ignore */ }
  }, [navCollapsed])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const closeDrawer = () => setDrawerOpen(false)
  const toggleNav = () => {
    if (isDesktop()) setNavCollapsed((v) => !v)
    else setDrawerOpen((v) => !v)
  }
  const navExpanded = isDesktop() ? !navCollapsed : drawerOpen

  const current = ALL_ITEMS.find((n) =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to),
  )

  const handleSignOut = () => {
    signOut()
    navigate('/admin/login', { replace: true })
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-[8px] px-3 py-2 text-[0.86rem] font-medium transition-colors ${
      isActive
        ? 'font-semibold'
        : 'a-dim hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]'
    }`
  const navLinkStyle = ({ isActive }) =>
    isActive ? { background: 'var(--a-accent-soft)', color: 'var(--a-accent)' } : undefined

  return (
    <AdminThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
      <div className={`admin ${theme === 'dark' ? 'theme-dark' : ''} min-h-screen`}>
        <div className="flex">
          {drawerOpen && (
            <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeDrawer} />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-[248px] shrink-0 overflow-hidden transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:transition-[width] ${
              drawerOpen ? 'translate-x-0' : '-translate-x-full'
            } ${navCollapsed ? 'lg:w-0' : 'lg:w-[248px]'}`}
          >
            <div
              className="flex h-full w-[248px] flex-col"
              style={{ background: 'var(--a-surface)', borderRight: '1px solid var(--a-border)' }}
            >
              <div className="flex h-16 items-center px-5">
                <Link to="/admin" onClick={closeDrawer} className="flex items-center gap-2.5">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-[10px]"
                    style={{ background: 'var(--a-accent-soft)', color: 'var(--a-accent)' }}
                  >
                    <Sprout size={18} />
                  </span>
                  <span className="text-[1.05rem] font-semibold tracking-tight">Samaha</span>
                </Link>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 pb-4">
                {NAV.map((g) => (
                  <div key={g.group}>
                    <p className="a-navgroup">{g.group}</p>
                    <div className="space-y-0.5">
                      {g.items.map(({ to, end, label, icon: Icon }) => (
                        <NavLink
                          key={to}
                          to={to}
                          end={end}
                          onClick={closeDrawer}
                          className={navLinkClass}
                          style={navLinkStyle}
                        >
                          <Icon size={18} />
                          {label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="border-t p-3" style={{ borderColor: 'var(--a-border)' }}>
                <div className="flex items-center gap-2.5 rounded-[8px] px-2 py-2">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.72rem] font-semibold"
                    style={{ background: 'var(--a-accent-soft)', color: 'var(--a-accent)' }}
                  >
                    SA
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.82rem] font-semibold">Store Admin</p>
                    <p className="truncate text-[0.72rem] a-mute">admin@samaha.com</p>
                  </div>
                  <button
                    className="a-iconbtn"
                    onClick={handleSignOut}
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header
              className="sticky top-0 z-30 flex h-16 items-center gap-2 px-4 sm:px-5"
              style={{
                background: 'var(--a-surface)',
                borderBottom: '1px solid var(--a-border)',
              }}
            >
              <button
                className="a-iconbtn a-iconbtn--box border"
                onClick={toggleNav}
                aria-label="Toggle navigation"
                aria-expanded={navExpanded}
              >
                {navExpanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
              </button>

              <label
                className="ml-1 hidden items-center gap-2 rounded-[9px] px-3 sm:flex"
                style={{ background: 'var(--a-surface-2)', height: '2.4rem', width: 'min(320px, 34vw)' }}
              >
                <Search size={15} className="a-mute shrink-0" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-[0.83rem] outline-none"
                  placeholder="Search orders, products…"
                />
                <span className="a-kbd shrink-0">Ctrl + K</span>
              </label>

              <div className="hidden items-center gap-1.5 text-sm sm:max-lg:flex lg:hidden">
                <span className="a-mute">Samaha</span>
                <span className="a-mute">/</span>
                <span className="font-medium">{current?.label ?? 'Admin'}</span>
              </div>

              <div className="flex-1" />

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="a-btn hidden text-[0.82rem] md:inline-flex"
              >
                <ExternalLink size={14} /> View store
              </a>

              <button className="a-iconbtn relative" aria-label="Notifications">
                <Bell size={18} />
                <span
                  className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[0.6rem] font-bold text-white"
                  style={{ background: 'var(--a-danger)' }}
                >
                  3
                </span>
              </button>

              <button className="a-iconbtn" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <span
                className="ml-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[0.7rem] font-semibold"
                style={{
                  background: 'var(--a-accent-soft)',
                  color: 'var(--a-text-dim)',
                  boxShadow: '0 0 0 2px var(--a-surface), 0 0 0 3px var(--a-border-strong)',
                }}
              >
                SA
              </span>
            </header>

            <main className="w-full flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
              <div className="mx-auto w-full max-w-[1600px]">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </AdminThemeContext.Provider>
  )
}
