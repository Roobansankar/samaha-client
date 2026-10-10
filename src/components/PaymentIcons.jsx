/* Accepted-payment badges for the footer: white pills with each network's mark. */

const logoFont = { fontFamily: 'Arial, Helvetica, sans-serif' }

function Visa() {
  return (
    <span
      className="text-[1.05rem] font-black italic tracking-[-0.02em] text-[#1434cb]"
      style={logoFont}
    >
      VISA
    </span>
  )
}

function Mastercard() {
  return (
    <svg viewBox="0 0 40 24" className="h-6 w-10" aria-hidden="true">
      <circle cx="14" cy="12" r="10" fill="#eb001b" />
      <circle cx="26" cy="12" r="10" fill="#f79e1b" />
      <path d="M20 4a10 10 0 0 1 0 16a10 10 0 0 1 0-16z" fill="#ff5f00" />
    </svg>
  )
}

function Amex() {
  return (
    <span
      className="grid h-7 w-7 place-items-center rounded-[3px] bg-[#1f72cd] text-[0.6rem] font-black italic leading-[0.85] text-white"
      style={logoFont}
    >
      <span className="text-center">AM<br />EX</span>
    </span>
  )
}

function Upi() {
  return (
    <span className="flex flex-col items-center leading-none" style={logoFont}>
      <span className="flex items-center gap-0.5">
        <span className="text-[1rem] font-black italic tracking-[-0.02em] text-[#5f6062]">UPI</span>
        <svg viewBox="0 0 12 14" className="h-3.5 w-3" aria-hidden="true">
          <path d="M3 0l6 7-6 7z" fill="#097939" />
          <path d="M0 0l6 7-6 7z" fill="#ed752e" />
        </svg>
      </span>
      <span className="mt-[2px] text-[0.28rem] font-semibold uppercase tracking-[0.04em] text-[#5f6062]">
        Unified Payments Interface
      </span>
    </span>
  )
}

function GPay() {
  return (
    <span className="flex items-center gap-1" style={logoFont}>
      <svg viewBox="0 0 48 48" className="h-[18px] w-[18px]" aria-hidden="true">
        <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#ff3d00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
      </svg>
      <span className="text-[1rem] text-[#5f6368]">Pay</span>
    </span>
  )
}

function ApplePay() {
  return (
    <span className="flex items-center gap-0.5 text-black" style={logoFont}>
      <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] -translate-y-px" fill="currentColor" aria-hidden="true">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
      </svg>
      <span className="text-[1.05rem] font-medium tracking-[-0.01em]">Pay</span>
    </span>
  )
}

const METHODS = [
  ['Visa', Visa],
  ['Mastercard', Mastercard],
  ['American Express', Amex],
  ['UPI', Upi],
  ['Google Pay', GPay],
  ['Apple Pay', ApplePay],
]

export default function PaymentIcons({ className = '' }) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Accepted payment methods">
      {METHODS.map(([label, Logo]) => (
        <li
          key={label}
          title={label}
          className="grid h-9 min-w-[3.75rem] place-items-center rounded-full bg-white px-3.5 shadow-sm"
        >
          <span className="sr-only">{label}</span>
          <Logo />
        </li>
      ))}
    </ul>
  )
}
