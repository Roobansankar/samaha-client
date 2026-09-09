export async function fetchBanners() {
  const res = await fetch('/api/banners', { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Could not load banners.')
  return res.json()
}
