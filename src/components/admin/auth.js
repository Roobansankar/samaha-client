// Lightweight client-side gate for the demo admin console.
// Swap these for a real auth call + httpOnly cookie/session in production.

const KEY = 'adminAuth'

export const DEMO_CREDENTIALS = {
  email: 'admin@samaha.com',
  password: 'samaha123',
}

export function isAuthed() {
  try {
    return localStorage.getItem(KEY) === 'true'
  } catch {
    return false
  }
}

export function signIn(email, password) {
  const ok =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  if (ok) {
    try {
      localStorage.setItem(KEY, 'true')
    } catch {
      /* storage unavailable — session lives for this tab only */
    }
  }
  return ok
}

export function signOut() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
