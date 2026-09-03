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

export async function fetchCustomers(q = '') {
  const qs = q ? `?q=${encodeURIComponent(q)}` : ''
  return request(`${API_URL}/admin/customers${qs}`)
}

export async function fetchOrders(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v && v !== 'all'),
  ).toString()
  return request(`${API_URL}/admin/orders${qs ? `?${qs}` : ''}`)
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

export async function fetchMessages() {
  return request(`${API_URL}/admin/messages`)
}

export async function markMessageRead(id) {
  return request(`${API_URL}/admin/messages/${id}`)
}

export async function updateMessageStatus(id, status) {
  return request(`${API_URL}/admin/messages/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
}

export async function deleteMessage(id) {
  return request(`${API_URL}/admin/messages/${id}`, { method: 'DELETE' })
}

export async function fetchSubscribers() {
  return request(`${API_URL}/admin/subscribers`)
}

export async function toggleSubscriber(id) {
  return request(`${API_URL}/admin/subscribers/${id}/toggle`, { method: 'PUT' })
}

export async function deleteSubscriber(id) {
  return request(`${API_URL}/admin/subscribers/${id}`, { method: 'DELETE' })
}

export async function fetchNotifications() {
  return request(`${API_URL}/admin/notifications`)
}

export async function markNotificationsRead(ids) {
  return request(`${API_URL}/admin/notifications/read`, { method: 'PUT', body: JSON.stringify({ ids }) })
}

export async function markAllNotificationsRead() {
  return request(`${API_URL}/admin/notifications/read-all`, { method: 'PUT' })
}

export async function deleteNotification(id) {
  return request(`${API_URL}/admin/notifications/${id}`, { method: 'DELETE' })
}
