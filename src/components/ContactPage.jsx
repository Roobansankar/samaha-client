import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'

const CONTACT_INFO = [
  { Icon: Phone, label: 'Phone', value: '+91 99430 97030', href: 'tel:+919943097030' },
  { Icon: Mail, label: 'Email', value: 'hello@samaha.in', href: 'mailto:hello@samaha.in' },
  { Icon: MapPin, label: 'Address', value: 'Sulur, Coimbatore, Tamil Nadu', href: '#' },
  { Icon: Clock, label: 'Hours', value: 'Mon – Sat, 9 AM – 6 PM', href: '#' },
]

export default function ContactPage() {
  return (
    <section className="bg-paper" id="contact-page">

      {/* Hero banner */}
      <div className="relative h-[clamp(280px,40vw,400px)] overflow-hidden">
        <img
          src="/contact.webp"
          alt="Contact Samaha"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="img-shimmer h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-olive-950/80 via-olive-950/30 to-transparent" />
        <div className="absolute inset-0 flex items-center sm:items-end">
          <div className="w-full py-10 px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
            <p className="eyebrow" style={{ color: 'var(--color-paper)' }}>Contact Us</p>
            <h1 className="mt-3 font-display font-medium leading-[1.08] text-paper max-w-[36rem]"
                style={{ fontSize: 'clamp(2rem, 1.4rem + 2.8vw, 3.6rem)' }}>
              Let&rsquo;s start a conversation
            </h1>
          </div>
        </div>
      </div>

      <div className="py-[clamp(3rem,7vw,5rem)] px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">

          {/* Contact info */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-display font-medium text-olive-900"
                  style={{ fontSize: 'clamp(1.3rem, 1rem + 1.2vw, 1.8rem)' }}>
                Contact details
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-mute">
                Reach out directly or visit us at our mill. We are always happy to talk oil.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {CONTACT_INFO.map((c) => (
                <a key={c.label} href={c.href} className="group flex items-start gap-4 p-4 rounded-xl border border-line hover:border-olive-300 hover:bg-paper-inset transition-all duration-200">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-olive-100 text-olive-800 group-hover:bg-olive-900 group-hover:text-paper transition-colors duration-200">
                    <c.Icon size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-mute">{c.label}</p>
                    <p className="mt-0.5 font-medium text-olive-900">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Map */}
            <div className="mt-2 h-[240px] rounded-2xl bg-paper-2 border border-line overflow-hidden">
              <iframe
                title="Samaha location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15666.123456789!2d77.0669!3d10.8059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85f2e2b1b1b1b%3A0x1234567890abcdef!2sSulur%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-line bg-white p-[clamp(1.5rem,4vw,3rem)] shadow-sm">
            <h2 className="font-display font-medium text-olive-900"
                style={{ fontSize: 'clamp(1.3rem, 1rem + 1.2vw, 1.8rem)' }}>
              Send us a message
            </h2>
            <form className="mt-6 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-olive-800" htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="rounded-xl border border-line bg-paper-inset px-4 py-3 text-sm text-olive-900 placeholder:text-text-mute outline-none focus:border-olive-500 focus:ring-2 focus:ring-olive-200 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-olive-800" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="rounded-xl border border-line bg-paper-inset px-4 py-3 text-sm text-olive-900 placeholder:text-text-mute outline-none focus:border-olive-500 focus:ring-2 focus:ring-olive-200 transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-olive-800" htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="rounded-xl border border-line bg-paper-inset px-4 py-3 text-sm text-olive-900 placeholder:text-text-mute outline-none focus:border-olive-500 focus:ring-2 focus:ring-olive-200 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-olive-800" htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  className="rounded-xl border border-line bg-paper-inset px-4 py-3 text-sm text-olive-900 outline-none focus:border-olive-500 focus:ring-2 focus:ring-olive-200 transition-colors"
                >
                  <option>General inquiry</option>
                  <option>Wholesale partnership</option>
                  <option>Order support</option>
                  <option>Press & media</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-olive-800" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="How can we help?"
                  className="rounded-xl border border-line bg-paper-inset px-4 py-3 text-sm text-olive-900 placeholder:text-text-mute outline-none focus:border-olive-500 focus:ring-2 focus:ring-olive-200 transition-colors resize-none"
                />
              </div>
              <button type="submit" className="btn btn-primary self-start mt-2">
                Send message <Send size={15} strokeWidth={2} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
