import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  UserCog,
  MessageSquare,
  MailCheck,
  Menu,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Sun,
  Moon,
  ExternalLink,
  Search,
} from 'lucide-react'
import { signOut, getUser, isAdmin, hasPermission, fetchNotifications, markAllNotificationsRead } from './auth'
import { AdminThemeContext } from './theme'

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, page: 'orders' },
  { to: '/admin/products', label: 'Products', icon: Package, page: 'products' },
  { to: '/admin/customers', label: 'Customers', icon: Users, page: 'customers' },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare, page: 'messages', adminOnly: true },
  { to: '/admin/staff', label: 'Staff', icon: UserCog, page: 'staff', adminOnly: true },
  { to: '/admin/subscribers', label: 'Subscribers', icon: MailCheck, page: 'subscribers', adminOnly: true },
]

const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()
  const bellRef = useRef(null)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(() => {
    try { return localStorage.getItem('adminNavCollapsed') === 'true' } catch { return false }
  })
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('adminTheme') || 'light' } catch { return 'light' }
  })
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [dismissed, setDismissed] = useState([])

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications()
      setNotifications(data.notifications || [])
    } catch {}
  }

  const unreadCount = notifications.filter((n) => !n.read && !dismissed.includes(n.id)).length
  const visibleNotifications = showAll ? notifications : notifications.filter((n) => !dismissed.includes(n.id)).slice(0, 8)

  useEffect(() => {
    if (isAdmin()) {
      loadNotifications()
      const interval = setInterval(loadNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    if (!notifOpen) return
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  useEffect(() => {
    try { localStorage.setItem('adminTheme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    try { localStorage.setItem('adminNavCollapsed', String(navCollapsed)) } catch {}
  }, [navCollapsed])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const closeDrawer = () => setDrawerOpen(false)
  const toggleNav = () => {
    if (isDesktop()) setNavCollapsed((v) => !v)
    else setDrawerOpen((v) => !v)
  }
  const navExpanded = isDesktop() ? !navCollapsed : drawerOpen

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  const navLinkClass = ({ isActive }) => `a-navitem ${isActive ? 'is-active' : ''}`

  const visibleNav = NAV.filter((item) => {
    if (item.adminOnly && !isAdmin()) return false
    if (item.page && !hasPermission(item.page)) return false
    return true
  })

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
                {visibleNav.map(({ to, end, label, icon: Icon }) => (
                  <NavLink key={to} to={to} end={end} onClick={closeDrawer} className={navLinkClass}>
                    <Icon size={16} />
                    {label}
                  </NavLink>
                ))}
              </nav>

              {/* Footer */}
              <div className="space-y-1.5 px-3 py-2">
                {isAdmin() || hasPermission('settings') ? (
                  <NavLink to="/admin/settings" onClick={closeDrawer} className={navLinkClass}>
                    <Settings size={16} />
                    Settings
                  </NavLink>
                ) : null}
              </div>

              <div className="flex items-center gap-2 border-t px-3 py-2.5" style={{ borderColor: 'var(--a-border)' }}>
                <span className="a-avatar h-7 w-7 text-[0.68rem]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8rem] font-medium">{user?.name || 'User'}</p>
                  <p className="truncate text-[0.65rem] a-mute">{user?.email || ''}</p>
                </div>
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

              {/* Notifications bell */}
              {isAdmin() && (
                <div className="relative" ref={bellRef}>
                  <button
                    className="a-iconbtn relative cursor-pointer"
                    aria-label="Notifications"
                    onClick={() => setNotifOpen((o) => !o)}
                  >
                    <Bell size={17} />
                    {unreadCount > 0 && (
                      <span
                        className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[0.6rem] font-bold text-white"
                        style={{ background: 'var(--a-danger)' }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl overflow-hidden"
                      style={{ background: 'var(--a-bg)', borderColor: 'var(--a-border)' }}
                    >
                      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--a-border)' }}>
                        <span className="text-sm font-semibold">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[0.7rem] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--a-danger)' }}>
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {visibleNotifications.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <p className="text-sm a-mute">No notifications</p>
                          </div>
                        ) : (
                          visibleNotifications.map((n) => (
                            <div
                              key={n.id}
                              className="flex items-start gap-3 px-4 py-3 transition-colors"
                              style={{ borderBottom: '1px solid var(--a-border)', opacity: n.read && !dismissed.includes(n.id) ? 0.6 : 1 }}
                            >
                              <span
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold"
                                style={{
                                  background: n.type === 'subscriber' ? 'var(--a-teal)' : 'var(--a-accent)',
                                  color: '#fff',
                                }}
                              >
                                {n.type === 'subscriber' ? <MailCheck size={14} /> : <MessageSquare size={14} />}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[0.8rem] font-medium truncate">{n.title}</p>
                                <p className="text-[0.72rem] a-mute truncate">{n.body}</p>
                                <p className="text-[0.68rem] a-mute mt-0.5">{new Date(n.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                              {!n.read && !dismissed.includes(n.id) && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--a-danger)' }} />
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        className="w-full text-center text-[0.8rem] font-medium py-3 hover:bg-[var(--a-surface)] transition-colors"
                        style={{ borderTop: '1px solid var(--a-border)' }}
                        onClick={() => {
                          if (unreadCount > 0) {
                            markAllNotificationsRead().then(() => loadNotifications())
                          }
                          setShowAll((s) => !s)
                        }}
                      >
                        {showAll ? 'Show less' : 'View all notifications'}
                      </button>
                    </div>
                  )}
                </div>
              )}

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
