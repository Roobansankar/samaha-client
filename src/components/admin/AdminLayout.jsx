import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react'
import { signOut } from './auth'
import { AdminThemeContext } from './theme'

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches

export default function AdminLayout() {
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

  const handleSignOut = () => {
    signOut()
    navigate('/admin/login', { replace: true })
  }

  const navLinkClass = ({ isActive }) => `a-navitem ${isActive ? 'is-active' : ''}`

  return (
    <AdminThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
      <div className={`admin ${theme === 'dark' ? 'theme-dark' : ''} min-h-screen`}>
        <div className="flex">
          {drawerOpen && (
            <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeDrawer} />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-[244px] shrink-0 overflow-hidden transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:transition-[width] ${
              drawerOpen ? 'translate-x-0' : '-translate-x-full'
            } ${navCollapsed ? 'lg:w-0' : 'lg:w-[244px]'}`}
          >
            <div
              className="flex h-full w-[244px] flex-col"
              style={{ background: 'var(--a-bg)', borderRight: '1px solid var(--a-border)' }}
            >
              {/* Brand */}
              <div
                className="flex h-14 shrink-0 items-center px-3"
                style={{ borderBottom: '1px solid var(--a-border)' }}
              >
                <Link to="/admin" onClick={closeDrawer} className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] text-[0.78rem] font-bold"
                    style={{ background: 'var(--a-accent)', color: 'var(--a-accent-fg)' }}
                  >
                    S
                  </span>
                  <span className="truncate text-[0.9rem] font-semibold tracking-tight">Samaha</span>
                </Link>
              </div>

              {/* Nav */}
              <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 pt-3">
                {NAV.map(({ to, end, label, icon: Icon }) => (
                  <NavLink key={to} to={to} end={end} onClick={closeDrawer} className={navLinkClass}>
                    <Icon size={16} />
                    {label}
                  </NavLink>
                ))}
              </nav>

              {/* Footer */}
              <div className="space-y-1.5 px-3 py-2">
                <NavLink to="/admin/settings" onClick={closeDrawer} className={navLinkClass}>
                  <Settings size={16} />
                  Settings
                </NavLink>
              </div>

              <div className="flex items-center gap-2 border-t px-3 py-2.5" style={{ borderColor: 'var(--a-border)' }}>
                <span className="a-avatar h-7 w-7 text-[0.68rem]">SA</span>
                <p className="min-w-0 flex-1 truncate text-[0.8rem] font-medium">admin@samaha.com</p>
                <button className="a-iconbtn h-7 w-7" onClick={handleSignOut} aria-label="Sign out" title="Sign out">
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header
              className="sticky top-0 z-30 flex h-14 items-center gap-3 px-4 sm:px-6"
              style={{ background: 'var(--a-bg)', borderBottom: '1px solid var(--a-border)' }}
            >
              <button
                className="a-iconbtn"
                onClick={toggleNav}
                aria-label="Toggle navigation"
                aria-expanded={navExpanded}
              >
                <Menu size={18} />
              </button>

              <div className="flex-1" />

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="a-btn a-btn-sm hidden sm:inline-flex"
              >
                <ExternalLink size={14} /> View store
              </a>
              <button className="a-iconbtn relative" aria-label="Notifications">
                <Bell size={17} />
                <span
                  className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full px-1 text-[0.58rem] font-bold text-white"
                  style={{ background: 'var(--a-danger)' }}
                >
                  3
                </span>
              </button>
              <button className="a-iconbtn" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </header>

            <main className="w-full flex-1 p-4 sm:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </AdminThemeContext.Provider>
  )
}
