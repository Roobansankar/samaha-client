import { useEffect, useRef, useState } from 'react'

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// One half of the flourish: a flowing double line that ends in a curl.
// Drawn for the left side; the right side is the same shape mirrored.
function Scroll({ inView }) {
  const draw = {
    strokeDasharray: 1,
    strokeDashoffset: inView ? 0 : 1,
    transition: REDUCED_MOTION ? 'none' : 'stroke-dashoffset 1.1s var(--ease-default) 0.2s',
  }
  return (
    <>
      <path
        pathLength="1"
        d="M191,43 C170,52 148,53 128,45 C108,37 86,31 64,37 C46,42 34,49 20,45 C10,42 7,31 15,27 C21,24 28,29 25,34"
        fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={draw}
      />
      <path
        pathLength="1"
        d="M191,43 C168,60 138,62 112,53 C92,46 76,40 62,38"
        fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={draw}
      />
    </>
  )
}

// Lotus + mirrored scrolls, echoing an ornamental divider — used as the
// "underline" beneath section headings. Draws itself in on scroll.
function Flourish({ inView }) {
  const fade = {
    opacity: inView ? 1 : 0,
    transition: REDUCED_MOTION ? 'none' : 'opacity 0.7s var(--ease-default) 0.5s',
  }
  return (
    <svg
      viewBox="0 0 400 66"
      aria-hidden="true"
      className="mx-auto mt-2 h-11 w-[16rem] text-olive-600 sm:h-14 sm:w-[21rem]"
    >
      <Scroll inView={inView} />
      <g transform="translate(400 0) scale(-1 1)">
        <Scroll inView={inView} />
      </g>

      <g style={{ ...fade, color: 'var(--color-gold-500)' }} fill="currentColor">
        {/* centre petal, with a hollow */}
        <path
          fillRule="evenodd"
          d="M200,6 C190,17 183,28 187,41 C192,45 208,45 213,41 C217,28 210,17 200,6 Z M200,17 C195,25 193,33 196,39 C198,41 202,41 204,39 C207,33 205,25 200,17 Z"
        />
        {/* outline side petals */}
        <path d="M168,20 C180,20 189,27 192,38 C182,38 173,31 168,20 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M232,20 C220,20 211,27 208,38 C218,38 227,31 232,20 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        {/* solid lower petals */}
        <path d="M156,43 C168,36 186,36 199,45 C186,52 168,52 156,43 Z" />
        <path d="M244,43 C232,36 214,36 201,45 C214,52 232,52 244,43 Z" />
      </g>
    </svg>
  )
}

/** Centered section title: bold green text, a gold accent word, and (optionally) the lotus flourish beneath. */
export default function SectionHeading({ title, accent, as: Tag = 'h3', flourish = true }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(REDUCED_MOTION)

  useEffect(() => {
    if (!flourish || REDUCED_MOTION || !ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [flourish])

  return (
    <div ref={ref}>
      <Tag className="font-display text-3xl font-bold leading-tight text-olive-800 sm:text-4xl">
        {title} <span className="font-medium text-gold-600">{accent}</span>
      </Tag>
      {flourish && <Flourish inView={inView} />}
    </div>
  )
}
