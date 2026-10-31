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
  const form = new FormData()
  form.append('rating', data.rating)
  form.append('title', data.title || '')
  form.append('body', data.body)
  for (const photo of data.photos || []) form.append('photos[]', photo)
  const res = await fetch(`/api/products/${slug}/reviews`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(Object.values(body.errors || {}).flat()[0] || body.message || 'Could not submit your review.')
  }
  return body
}
