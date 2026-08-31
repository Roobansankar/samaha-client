const API_URL = '/api'

async function request(url, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(url, { headers: { ...headers, ...options.headers }, ...options })

  const text = await response.text()
  let data = {}
  if (text) {
    try { data = JSON.parse(text) } catch { throw new Error('Server returned an invalid response. Is the backend running?') }
  }

  if (!response.ok) {
    throw new Error(data.message || data.errors?.email?.[0] || 'Request failed')
  }

  return data
}

export async function signIn(email, password) {
  const data = await request(`${API_URL}/admin/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  localStorage.setItem('adminToken', data.token)
  localStorage.setItem('adminUser', JSON.stringify(data.user))

  return data
}

export function isAuthed() {
  return !!localStorage.getItem('adminToken')
}

export function getToken() {
  return localStorage.getItem('adminToken')
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem('adminUser')) } catch { return null }
}

export function isAdmin() {
  return getUser()?.role === 'admin'
}

export function hasPermission(page) {
  const user = getUser()
  if (!user) return false
  if (user.role === 'admin') return true
  return user.permissions?.includes(page) || user.permissions?.includes('*')
}

export async function signOut() {
  try { await request(`${API_URL}/admin/logout`, { method: 'POST' }) } catch {}
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
}

export async function fetchStaff() {
  return request(`${API_URL}/admin/staff`)
}

export async function createStaff(staff) {
  return request(`${API_URL}/admin/staff`, { method: 'POST', body: JSON.stringify(staff) })
}

export async function updateStaff(id, staff) {
  return request(`${API_URL}/admin/staff/${id}`, { method: 'PUT', body: JSON.stringify(staff) })
}

export async function deleteStaff(id) {
  return request(`${API_URL}/admin/staff/${id}`, { method: 'DELETE' })
}
