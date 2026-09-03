import { getToken } from './account'

const RZP_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

/** Load Razorpay's checkout script once. Resolves false if it can't load. */
export function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const existing = document.querySelector(`script[src="${RZP_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const s = document.createElement('script')
    s.src = RZP_SRC
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

async function post(path, body) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`/api${path}`, { method: 'POST', headers, body: JSON.stringify(body) })
  } catch {
    throw new Error('Could not reach the server. Is the backend running?')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong at checkout.')
    err.status = res.status
    throw err
  }
  return data
}

export const createOrder = (payload) => post('/checkout/order', payload)
export const verifyPayment = (payload) => post('/checkout/verify', payload)

export async function fetchOrders() {
  const res = await fetch('/api/account/orders', {
    headers: { Accept: 'application/json', Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) throw new Error('Could not load your orders.')
  return res.json()
}
