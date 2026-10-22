import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { PageHeader } from './ui'
import { fetchNotificationPreferences, updateNotificationPreferences } from './auth'

function Switch({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      className="a-switch"
      data-on={checked}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label={label}
      disabled={disabled}
    />
  )
}

function SettingsCard({ title, description, children, onSave }) {
  return (
    <section className="a-card">
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--a-border)' }}>
        <h2 className="a-h2">{title}</h2>
        {description && <p className="a-sub mt-0.5">{description}</p>}
      </div>
      <div className="space-y-4 px-5 py-5">{children}</div>
      {onSave && (
        <div
          className="flex justify-end px-5 py-3"
          style={{ borderTop: '1px solid var(--a-border)', background: 'var(--a-surface-2)' }}
        >
          <button className="a-btn a-btn-primary a-btn-sm" onClick={onSave}>
            Save changes
          </button>
        </div>
      )}
    </section>
  )
}

const NOTIFS = [
  { key: 'order', label: 'New order placed', desc: 'Show order alerts. Open an alert to view the order.' },
  { key: 'low-stock', label: 'Low stock alert', desc: 'Alert when a product has fewer than 15 units, including out of stock.' },
  { key: 'review', label: 'New product review', desc: 'Show new review alerts linking to the product detail page.' },
]

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState(null)
  const [notifBusy, setNotifBusy] = useState(false)
  const [notifError, setNotifError] = useState('')

  useEffect(() => {
    let active = true
    fetchNotificationPreferences()
      .then((data) => { if (active) setNotifs(data) })
      .catch((error) => { if (active) setNotifError(error.message) })
    return () => { active = false }
  }, [])

  const toggleNotification = async (key, enabled) => {
    setNotifBusy(true)
    setNotifError('')
    try {
      const preferences = await updateNotificationPreferences({ ...notifs, [key]: enabled })
      setNotifs(preferences)
      window.dispatchEvent(new CustomEvent('samaha:notification-preferences'))
    } catch (error) {
      setNotifError(error.message)
    } finally {
      setNotifBusy(false)
    }
  }

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Store profile and notification preferences."
        actions={
          saved ? (
            <span className="a-badge a-badge--green">
              <Check size={12} /> Saved
            </span>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SettingsCard
          title="Store details"
          description="Shown on invoices, emails and the storefront footer."
          onSave={save}
        >
          <div className="a-field">
            <label className="a-label">Store name</label>
            <input className="a-input" defaultValue="Samaha" />
          </div>
          <div className="a-field">
            <label className="a-label">Support email</label>
            <input className="a-input" type="email" defaultValue="hello@samaha.com" />
          </div>
          <div className="a-field">
            <label className="a-label">Business address</label>
            <textarea className="a-textarea" defaultValue={'14 Grove Road\nCoimbatore 641004\nTamil Nadu, India'} />
          </div>
        </SettingsCard>

        <SettingsCard
          title="Notifications"
          description="Control alerts in the admin notification bell. Changes save automatically."
        >
          {notifError && <p role="alert" className="text-sm text-red-600">{notifError}</p>}
          {!notifs && !notifError && <p className="a-sub">Loading preferences…</p>}
          {NOTIFS.map((n) => (
            <div key={n.key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.86rem] font-medium">{n.label}</p>
                <p className="a-sub">{n.desc}</p>
              </div>
              <Switch
                checked={!!notifs?.[n.key]}
                disabled={!notifs || notifBusy}
                label={n.label}
                onChange={(v) => toggleNotification(n.key, v)}
              />
            </div>
          ))}
        </SettingsCard>

      </div>
    </div>
  )
}
