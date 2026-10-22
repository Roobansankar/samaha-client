const BASE = '/api'
const CATALOG_KEY = 'samahaCatalog:v1'
let productsRequest

export function cachedProducts() {
  try {
    const cached = JSON.parse(localStorage.getItem(CATALOG_KEY) || 'null')
    if (cached?.savedAt > Date.now() - 24 * 60 * 60 * 1000 && Array.isArray(cached.products)) {
      return cached.products
    }
  } catch { /* Storage may be unavailable. */ }
  return null
}

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
  if (!productsRequest) {
    productsRequest = request('/products').then((products) => {
      if (!Array.isArray(products)) throw new Error('Invalid product data.')
      try {
        localStorage.setItem(CATALOG_KEY, JSON.stringify({ savedAt: Date.now(), products }))
      } catch { /* Storage may be full. */ }
      return products
    }).finally(() => { productsRequest = null })
  }
  return productsRequest
}

export function fetchProduct(slug) {
  return request(`/products/${encodeURIComponent(slug)}`)
}

export function fetchCategory(slug) {
  return request(`/categories/${encodeURIComponent(slug)}`)
}
