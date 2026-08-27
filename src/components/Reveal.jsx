import { useEffect, useRef, useState } from 'react'

const NO_IO = typeof IntersectionObserver === 'undefined'

export default function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  delay = 0,
  ...rest
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(NO_IO)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`.trim()}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
