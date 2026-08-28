import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="bg-paper">
      <div className="container-site flex flex-col items-center justify-center py-[clamp(4rem,10vw,8rem)] text-center">
        <p className="font-display text-[clamp(4rem,8vw,7rem)] font-medium text-olive-200 leading-none">404</p>
        <h1 className="mt-4 font-display font-medium text-olive-900" style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.4rem)' }}>
          Page not found
        </h1>
        <p className="mt-4 max-w-[38ch] text-text-soft leading-relaxed" style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1.05rem)' }}>
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </section>
  )
}
