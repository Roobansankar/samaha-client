import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const LIFE = ['/life-1.jpg', '/life-2.jpg', '/life-3.jpg', '/life-4.jpg', '/life-5.jpg']

export default function LifeGallery() {
  const [open, setOpen] = useState(null) // index | null

  const go = (dir) => setOpen((i) => (i + dir + LIFE.length) % LIFE.length)

  useEffect(() => {
    if (open === null) return
    document.body.classList.add('no-scroll')
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <section className="bg-paper" aria-label="In the kitchen">
      <div className="mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)] py-[clamp(2.75rem,6vw,4.5rem)]">
        <div className="mb-8">
          <p className="eyebrow">In the kitchen</p>
          <h2
            className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
            style={{ fontSize: 'clamp(1.7rem, 1.2rem + 2vw, 2.6rem)' }}
          >
            A little of the everyday
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {LIFE.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open image ${i + 1}`}
              className={`group cursor-zoom-in overflow-hidden rounded-[var(--radius-md)] border border-line bg-paper-2 ${
                i === 0 ? 'col-span-2 row-span-2' : 'aspect-square'
              }`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
            </button>
          ))}
        </div>
      </div>

      {open !== null && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex flex-col bg-olive-950/92 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery"
          onClick={() => setOpen(null)}
        >
          <div className="flex items-center justify-between px-5 py-4 text-paper">
            <span className="text-sm font-medium">{open + 1} / {LIFE.length}</span>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10 cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-6" onClick={(e) => e.stopPropagation()}>
            <img
              src={LIFE[open]}
              alt=""
              decoding="async"
              className="max-h-[80vh] max-w-full rounded-[var(--radius-md)] object-contain"
            />
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-paper transition hover:bg-white/20 cursor-pointer sm:left-6"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-paper transition hover:bg-white/20 cursor-pointer sm:right-6"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>,
        document.body,
      )}
    </section>
  )
}
