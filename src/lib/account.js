import { useEffect, useState } from 'react'

const API = '/api'
const TOKEN_KEY = 'samahaToken'
const USER_KEY = 'samahaUser'

/* ------------------------------------------------------------------ */
/*  low-level request                                                  */
/* ------------------------------------------------------------------ */

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API}${path}`, { ...options, headers: { ...headers, ...options.headers } })
  } catch {
    throw new Error('Could not reach the server. Is the backend running?')
  }

  const text = await res.text()
  let data = {}
  if (text) {
    try { data = JSON.parse(text) } catch { throw new Error('The server returned an unexpected response.') }
  }

  if (!res.ok) {
    if (res.status === 401) signOutLocal()
    const firstError = data.errors && data.errors[Object.keys(data.errors)[0]]?.[0]
    const err = new Error(data.message || firstError || 'Something went wrong.')
    err.status = res.status
    err.errors = data.errors || null
    throw err
  }

  return data
}

/* ------------------------------------------------------------------ */
/*  session helpers                                                    */
/* ------------------------------------------------------------------ */

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
}

export function isAuthed() {
  return !!getToken()
}

function emit() {
  window.dispatchEvent(new Event('samaha:auth'))
}

function persistSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  emit()
}

function persistUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  emit()
}

function signOutLocal() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  emit()
}

/* ------------------------------------------------------------------ */
/*  auth actions                                                       */
/* ------------------------------------------------------------------ */

export async function register(payload) {
  const data = await request('/register', { method: 'POST', body: JSON.stringify(payload) })
  persistSession(data)
  return data.user
}

export async function login(email, password) {
  const data = await request('/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  persistSession(data)
  return data.user
}

/* Where to send the browser to start Google sign-in (proxied to the API). */
export const GOOGLE_LOGIN_URL = '/api/auth/google/redirect'

/* Called by /auth/callback after Google bounces back with a token in the URL. */
export async function completeOAuth(token) {
  localStorage.setItem(TOKEN_KEY, token)
  try {
    await fetchAccount() // stores the user + emits
  } catch (err) {
    signOutLocal()
    throw err
  }
}

export async function fetchAccount() {
  const user = await request('/account')
  persistUser(user)
  return user
}

export async function updateAccount(payload) {
  const user = await request('/account', { method: 'PUT', body: JSON.stringify(payload) })
  persistUser(user)
  return user
}

export async function changePassword(payload) {
  return request('/account/password', { method: 'PUT', body: JSON.stringify(payload) })
}

/* ------------------------------------------------------------------ */
/*  address book                                                       */
/* ------------------------------------------------------------------ */

export async function fetchAddresses() {
  return request('/account/addresses')
}

export async function createAddress(payload) {
  return request('/account/addresses', { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateAddress(id, payload) {
  return request(`/account/addresses/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export async function makeAddressDefault(id) {
  return request(`/account/addresses/${id}/default`, { method: 'PUT' })
}

export async function deleteAddress(id) {
  return request(`/account/addresses/${id}`, { method: 'DELETE' })
}

export async function logout() {
  try { await request('/account/logout', { method: 'POST' }) } catch { /* token may already be gone */ }
  signOutLocal()
}

/* ------------------------------------------------------------------ */
/*  react hook — re-renders on sign in / out / profile change          */
/* ------------------------------------------------------------------ */

export function useAccount() {
  const [user, setUser] = useState(getUser)

  useEffect(() => {
    const sync = () => setUser(getUser())
    window.addEventListener('samaha:auth', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('samaha:auth', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return user
}
