const CACHE_KEY = 'samahaBanners'

/** Last-known banners from a previous visit — shown instantly so a refresh
 *  doesn't flash the bundled fallback slides before the API answers. */
export function cachedBanners() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    return Array.isArray(parsed) && parsed.length ? parsed : null
  } catch {
    return null
  }
}

export async function fetchBanners() {
  const res = await fetch('/api/banners', { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Could not load banners.')
  const data = await res.json()
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(Array.isArray(data) ? data : []))
  } catch {
    /* storage full / disabled — fine */
  }
  return data
}
