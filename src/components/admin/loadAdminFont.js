let loaded = false

/**
 * Admin uses Inter (see admin.css), the storefront uses DM Sans — loading
 * both globally in index.html would make every storefront visitor pay for
 * a font they never render. Admin is behind a login and already code-split,
 * so it just loads its own font the first time an admin screen mounts.
 */
export function loadAdminFont() {
  if (loaded || typeof document === 'undefined') return
  loaded = true

  if (document.getElementById('admin-font')) return

  const link = document.createElement('link')
  link.id = 'admin-font'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700&display=swap'
  document.head.appendChild(link)
}
