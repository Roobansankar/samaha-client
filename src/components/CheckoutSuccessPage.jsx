import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const PAD = 'px-[var(--spacing-gutter)] min-[901px]:px-[calc(var(--spacing-gutter)+1.5rem)]'

export default function CheckoutSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order')

  return (
    <div className="bg-paper">
      <div className={`${PAD} py-[clamp(3rem,8vw,6rem)]`}>
        <div className="mx-auto flex max-w-[34rem] flex-col items-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-olive-100 text-olive-800">
            <CheckCircle2 size={30} strokeWidth={1.8} />
          </span>
          <h1
            className="mt-6 font-display font-medium text-olive-900"
            style={{ fontSize: 'clamp(1.7rem, 1.3rem + 1.8vw, 2.4rem)' }}
          >
            Payment received
          </h1>
          <p className="mt-3 leading-relaxed text-text-soft">
            Thank you — your order{orderId ? <> <span className="font-semibold text-olive-900">#{orderId}</span></> : ''}{' '}
            is confirmed. We’ll press, pack and dispatch it within two working days.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link to="/profile/orders" className="btn btn-primary">
              View my orders <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link to="/shop" className="text-sm font-semibold text-olive-800 transition-colors hover:text-olive-600">
              Continue shopping &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
