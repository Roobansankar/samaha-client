import { useState } from 'react'
import { Check } from 'lucide-react'
import { PageHeader } from './ui'

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      className="a-switch"
      data-on={checked}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
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
  { key: 'new-order', label: 'New order placed', desc: 'Email the team whenever an order comes in.' },
  { key: 'low-stock', label: 'Low stock alert', desc: 'Notify when a SKU drops below its reorder point.' },
  { key: 'refund', label: 'Refund requested', desc: 'Flag refund and return requests for review.' },
  { key: 'review', label: 'New product review', desc: 'Get a digest of new customer reviews.' },
]

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({ 'new-order': true, 'low-stock': true, refund: true, review: false })
  const [freeShip, setFreeShip] = useState(true)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Store profile, shipping, payments and alerts."
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="a-field">
              <label className="a-label">Currency</label>
              <select className="a-select" defaultValue="USD">
                <option>USD</option>
                <option>INR</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <div className="a-field">
              <label className="a-label">Timezone</label>
              <select className="a-select" defaultValue="Asia/Kolkata">
                <option>Asia/Kolkata</option>
                <option>Europe/London</option>
                <option>America/New_York</option>
              </select>
            </div>
          </div>
          <div className="a-field">
            <label className="a-label">Business address</label>
            <textarea className="a-textarea" defaultValue={'14 Grove Road\nCoimbatore 641004\nTamil Nadu, India'} />
          </div>
        </SettingsCard>

        <div className="space-y-4">
          <SettingsCard
            title="Shipping"
            description="Rates applied at checkout."
            onSave={save}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.86rem] font-medium">Free shipping threshold</p>
                <p className="a-sub">Waive shipping above a cart value.</p>
              </div>
              <Switch checked={freeShip} onChange={setFreeShip} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="a-field">
                <label className="a-label">Threshold</label>
                <input className="a-input" defaultValue="$60.00" disabled={!freeShip} />
              </div>
              <div className="a-field">
                <label className="a-label">Flat rate</label>
                <input className="a-input" defaultValue="$5.00" />
              </div>
            </div>
            <div className="a-field">
              <label className="a-label">Dispatch time</label>
              <select className="a-select" defaultValue="1-2 business days">
                <option>Same day</option>
                <option>1-2 business days</option>
                <option>3-5 business days</option>
              </select>
            </div>
          </SettingsCard>

          <SettingsCard title="Payments" description="Providers accepted at checkout." onSave={save}>
            {[
              ['Stripe', 'Cards, Apple Pay, Google Pay', true],
              ['PayPal', 'PayPal balance and cards', true],
              ['Razorpay', 'UPI, netbanking, wallets', false],
              ['Cash on delivery', 'India only', false],
            ].map(([name, desc, on]) => (
              <PaymentRow key={name} name={name} desc={desc} defaultOn={on} />
            ))}
          </SettingsCard>
        </div>

        <SettingsCard
          title="Notifications"
          description="Where operational alerts are sent."
          onSave={save}
        >
          {NOTIFS.map((n) => (
            <div key={n.key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.86rem] font-medium">{n.label}</p>
                <p className="a-sub">{n.desc}</p>
              </div>
              <Switch
                checked={!!notifs[n.key]}
                onChange={(v) => setNotifs((s) => ({ ...s, [n.key]: v }))}
              />
            </div>
          ))}
        </SettingsCard>

        <SettingsCard title="Danger zone" description="Irreversible actions.">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.86rem] font-medium">Put store in maintenance mode</p>
              <p className="a-sub">Storefront shows a holding page; admin stays open.</p>
            </div>
            <button className="a-btn a-btn-sm">Enable</button>
          </div>
          <hr className="a-divider" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.86rem] font-medium" style={{ color: 'var(--a-danger)' }}>
                Delete all demo data
              </p>
              <p className="a-sub">Removes sample orders, products and customers.</p>
            </div>
            <button className="a-btn a-btn-sm a-btn-danger" style={{ borderColor: 'var(--a-border-strong)' }}>
              Delete data
            </button>
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}

function PaymentRow({ name, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[0.86rem] font-medium">{name}</p>
        <p className="a-sub">{desc}</p>
      </div>
      <Switch checked={on} onChange={setOn} />
    </div>
  )
}
