import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Play,
  Sparkles,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const SECTION =
  'mx-auto max-w-[1500px] px-[clamp(1.25rem,5vw,5rem)]'

const FILTERS = [
  'All',
  'Products',
  'Ingredients',
  'Lifestyle',
  'Behind the Scenes',
]

function resolveMediaUrl(path) {
  if (!path) return ''

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `/uploads${path.startsWith('/uploads') ? path.slice('/uploads'.length) : path.startsWith('/') ? path : `/${path}`}`
}

function isVideoItem(item) {
  return item.media_type === 'video' || item.mediaType === 'video'
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewerIndex, setViewerIndex] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadGallery() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/gallery', {
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Could not load the gallery.')
        }

        const data = await response.json()

        if (!cancelled) {
          setGallery(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load the gallery.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadGallery()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredGallery = useMemo(() => {
    if (activeFilter === 'All') {
      return gallery
    }

    return gallery.filter((item) => item.category === activeFilter)
  }, [gallery, activeFilter])

  useEffect(() => {
    if (viewerIndex === null) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setViewerIndex(null)
      }

      if (event.key === 'ArrowRight') {
        setViewerIndex((current) =>
          current === null
            ? null
            : (current + 1) % filteredGallery.length,
        )
      }

      if (event.key === 'ArrowLeft') {
        setViewerIndex((current) =>
          current === null
            ? null
            : (current - 1 + filteredGallery.length) %
              filteredGallery.length,
        )
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [viewerIndex, filteredGallery.length])

  const openViewer = (index) => {
    setViewerIndex(index)
  }

  const closeViewer = () => {
    setViewerIndex(null)
  }

  const showPrevious = () => {
    setViewerIndex((current) =>
      current === null
        ? null
        : (current - 1 + filteredGallery.length) % filteredGallery.length,
    )
  }

  const showNext = () => {
    setViewerIndex((current) =>
      current === null
        ? null
        : (current + 1) % filteredGallery.length,
    )
  }

  return (
    <main className="min-h-screen bg-paper">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-olive-950 text-on-olive"
        style={{
          backgroundImage:
            'linear-gradient(rgba(20, 35, 18, 0.72), rgba(20, 35, 18, 0.72)), url("/Gallery-banner.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className={`${SECTION} flex min-h-[70vh] items-center pb-[clamp(3rem,6vw,5rem)] pt-[clamp(4rem,8vw,6rem)]`}
        >
          <div className="max-w-4xl">
            <p className="eyebrow text-gold-300">
              The Samaha Gallery
            </p>

            <h1
              className="mt-5 font-display font-medium leading-[1.02] tracking-[-0.025em] text-white"
              style={{
                fontSize: 'clamp(2.5rem, 5.8vw, 5.5rem)',
              }}
            >
              A closer look at
              <br />
              the Samaha world.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-[1.8] text-white/85 sm:text-lg">
              A visual collection of the ingredients, rituals,
              products and moments that shape the Samaha experience.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full border border-gold-300/10" />
        <div className="pointer-events-none absolute -right-10 top-40 h-48 w-48 rounded-full border border-gold-300/10" />
      </section>

      {/* Gallery */}
      <section className="bg-paper-inset">
        <div
          className={`${SECTION} py-[clamp(4rem,8vw,7rem)]`}
        >
          <div className="flex flex-col gap-7 border-b border-olive-900/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Explore</p>

              <h2
                className="mt-3 font-display font-medium leading-[1.05] text-olive-900"
                style={{
                  fontSize: 'clamp(2rem, 1.3rem + 3vw, 3.5rem)',
                }}
              >
                Moments worth seeing.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-[1.7] text-text-soft">
              A visual collection of the products, ingredients,
              rituals and moments behind Samaha.
            </p>
          </div>

          {/* Filters */}
          <div className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const active = activeFilter === filter

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter)
                    setViewerIndex(null)
                  }}
                  className={`rounded-full px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.13em] transition-all ${
                    active
                      ? 'bg-olive-900 text-on-olive shadow-sm'
                      : 'bg-olive-900/5 text-olive-800 hover:-translate-y-0.5 hover:bg-olive-900/10'
                  }`}
                >
                  {filter}
                </button>
              )
            })}
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-12 flex min-h-[420px] items-center justify-center rounded-[var(--radius-lg)] border border-olive-900/10 bg-paper">
              <div className="text-center">
                <Loader2
                  size={28}
                  strokeWidth={1.5}
                  className="mx-auto animate-spin text-olive-900"
                />

                <p className="eyebrow mt-6 text-clay-600">
                  Loading
                </p>

                <p className="mt-3 text-sm text-text-soft">
                  Preparing the Samaha visual story.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mt-12 flex min-h-[360px] items-center justify-center rounded-[var(--radius-lg)] border border-olive-900/10 bg-paper px-6">
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-olive-900 text-gold-300">
                  <Camera size={24} strokeWidth={1.4} />
                </div>

                <p className="eyebrow mt-6 text-clay-600">
                  Gallery unavailable
                </p>

                <h3 className="mt-3 font-display text-2xl font-medium text-olive-900 sm:text-3xl">
                  We couldn't load the gallery.
                </h3>

                <p className="mt-4 text-sm leading-[1.75] text-text-soft">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Editorial gallery */}
          {!loading && !error && filteredGallery.length > 0 && (
            <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {filteredGallery.map((item, index) => (
                <GalleryTile
                  key={item.id}
                  item={item}
                  index={index}
                  onOpen={openViewer}
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredGallery.length === 0 && (
            <div className="mt-12 flex min-h-[420px] items-center justify-center rounded-[var(--radius-lg)] border border-olive-900/10 bg-paper px-6">
              <div className="text-center">
                <div className="relative mx-auto w-fit">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-olive-900 text-gold-300">
                    <Camera size={28} strokeWidth={1.4} />
                  </div>

                  <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-gold-200 text-olive-900">
                    <Sparkles size={13} strokeWidth={1.8} />
                  </span>
                </div>

                <p className="eyebrow mt-7 text-clay-600">
                  {gallery.length === 0 ? 'Coming soon' : 'No media yet'}
                </p>

                <h3 className="mt-3 max-w-lg font-display text-2xl font-medium text-olive-900 sm:text-3xl">
                  {gallery.length === 0
                    ? 'The Samaha visual story is taking shape.'
                    : `Nothing in ${activeFilter} yet.`}
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-[1.75] text-text-soft">
                  {gallery.length === 0
                    ? "We're preparing a collection of images that brings the Samaha world to life."
                    : 'More photography and films will appear here as the Samaha collection grows.'}
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 flex flex-col gap-5 border-t border-olive-900/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-medium text-olive-900">
                Discover Samaha
              </p>

              <p className="mt-1 text-sm text-text-soft">
                Explore our products while the gallery takes shape.
              </p>
            </div>

            <Link
              to="/shop"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-olive-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-on-olive transition-transform hover:-translate-y-0.5"
            >
              Explore products

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {viewerIndex !== null && filteredGallery[viewerIndex] && (
        <GalleryLightbox
          item={filteredGallery[viewerIndex]}
          index={viewerIndex}
          total={filteredGallery.length}
          onClose={closeViewer}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      )}
    </main>
  )
}

function GalleryTile({ item, index, onOpen }) {
  const [mediaError, setMediaError] = useState(false)
  const video = isVideoItem(item)
  const mediaUrl = resolveMediaUrl(video ? item.video : item.image)
  const posterUrl = resolveMediaUrl(item.poster)

  const aspectClasses = [
    'aspect-[4/5]',
    'aspect-[1/1]',
    'aspect-[4/5]',
    'aspect-[3/4]',
    'aspect-[5/6]',
    'aspect-[4/5]',
  ]

  const aspectClass = aspectClasses[index % aspectClasses.length]

  if (mediaError || !mediaUrl) {
    return (
      <article className="mb-4 break-inside-avoid overflow-hidden rounded-[var(--radius-lg)] bg-olive-900/5">
        <div
          className={`${aspectClass} flex items-center justify-center`}
        >
          <Camera
            size={28}
            strokeWidth={1.3}
            className="text-olive-900/35"
          />
        </div>
      </article>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-[var(--radius-lg)] bg-olive-900/5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-olive-900 focus-visible:ring-offset-4"
      aria-label={`Open ${item.title || 'gallery media'}`}
    >
      <div className={`${aspectClass} relative overflow-hidden`}>
        {video ? (
          <video
            src={mediaUrl}
            poster={posterUrl || undefined}
            preload="metadata"
            muted
            playsInline
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            onError={() => setMediaError(true)}
          />
        ) : (
          <img
            src={mediaUrl}
            alt={item.altText || item.title || ''}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            onError={() => setMediaError(true)}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5 opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

        {video && (
          <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-md">
            <Play size={16} fill="currentColor" className="ml-0.5" />
          </span>
        )}

        {item.isFeatured && (
          <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-olive-900 backdrop-blur">
            Featured
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 translate-y-2 px-5 pb-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/75">
            {item.category}
          </p>

          <p className="mt-1 font-display text-lg font-medium text-white">
            {item.title}
          </p>
        </div>
      </div>
    </button>
  )
}

function GalleryLightbox({
  item,
  index,
  total,
  onClose,
  onPrevious,
  onNext,
}) {
  const video = isVideoItem(item)
  const mediaUrl = resolveMediaUrl(video ? item.video : item.image)
  const posterUrl = resolveMediaUrl(item.poster)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Gallery viewer'}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Close gallery viewer"
      >
        <X size={21} />
      </button>

      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/75 backdrop-blur-md">
        {index + 1} / {total}
      </div>

      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
        aria-label="Previous gallery item"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        onClick={onNext}
        className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
        aria-label="Next gallery item"
      >
        <ChevronRight size={24} />
      </button>

      <div className="flex h-full w-full max-w-7xl items-center justify-center">
        <div className="flex max-h-full max-w-full flex-col items-center">
          <div className="max-h-[78vh] max-w-[92vw] overflow-hidden rounded-[var(--radius-lg)] bg-black shadow-2xl sm:max-w-[88vw]">
            {video ? (
              <video
                key={mediaUrl}
                src={mediaUrl}
                poster={posterUrl || undefined}
                controls
                autoPlay
                playsInline
                className="max-h-[78vh] max-w-full object-contain"
              />
            ) : (
              <img
                src={mediaUrl}
                alt={item.altText || item.title || ''}
                className="max-h-[78vh] max-w-full object-contain"
              />
            )}
          </div>

          <div className="mt-4 max-w-xl text-center">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white/55">
              {item.category}
            </p>

            <h2 className="mt-1 font-display text-xl font-medium text-white sm:text-2xl">
              {item.title}
            </h2>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[0.6rem] uppercase tracking-[0.12em] text-white/35 sm:flex">
        <span>← Previous</span>
        <span>•</span>
        <span>Next →</span>
        <span>•</span>
        <span>Esc to close</span>
      </div>
    </div>
  )
}
