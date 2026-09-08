import { getToken } from './account'

export async function fetchReviews(slug) {
  const token = getToken()
  const res = await fetch(`/api/products/${slug}/reviews`, {
    headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
  if (!res.ok) throw new Error('Could not load reviews.')
  return res.json()
}

export async function fetchFeaturedReviews() {
  const res = await fetch('/api/reviews/featured', { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Could not load reviews.')
  return res.json()
}

export async function submitReview(slug, data) {
  const token = getToken()
  const res = await fetch(`/api/products/${slug}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.message || body.errors?.body?.[0] || body.errors?.rating?.[0] || 'Could not submit your review.')
  }
  return body
}
