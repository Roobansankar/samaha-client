const BASE = '/api'

async function request(path) {
  let res
  try {
    res = await fetch(`${BASE}${path}`)
  } catch {
    throw new Error('Could not connect to the server.')
  }
  if (!res.ok) {
    if (res.status === 404) throw new Error('No data available yet.')
    throw new Error('Something went wrong. Please try again.')
  }
  return res.json()
}

export function fetchProducts() {
  return request('/products')
}

export function fetchProduct(slug) {
  return request(`/products/${encodeURIComponent(slug)}`)
}
