import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  UploadCloud,
  Video,
  X,
} from 'lucide-react'
import { Panel } from './ui'
import {
  fetchAdminGallery,
  createGallery,
  saveGallery,
  deleteGallery,
  uploadGalleryImage,
  uploadGalleryVideo,
} from './auth'
import { compressImage } from './compressImage'

const CATEGORIES = [
  'Products',
  'Ingredients',
  'Lifestyle',
  'Behind the Scenes',
]

const MEDIA_TYPES = [
  {
    value: 'image',
    label: 'Image',
    icon: ImageIcon,
  },
  {
    value: 'video',
    label: 'Video',
    icon: Video,
  },
]

function resolveMediaUrl(path) {
  if (!path) return ''

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return path
}

function isVideoItem(item) {
  return item.media_type === 'video' || item.mediaType === 'video'
}

export default function AdminGallery() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [mediaType, setMediaType] = useState('All')

  const load = async () => {
    setLoading(true)
    setError('')

    try {
      setRows(await fetchAdminGallery())
    } catch (e) {
      setError(e.message || 'Could not load gallery.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (item) => {
    const mediaLabel = isVideoItem(item) ? 'video' : 'image'

    if (
      !window.confirm(
        `Delete this gallery ${mediaLabel}? The uploaded media will also be removed.`,
      )
    ) {
      return
    }

    setBusyId(item.id)

    try {
      await deleteGallery(item.id)
      setRows((list) => list.filter((x) => x.id !== item.id))
    } catch (e) {
      window.alert(
        e.message ||
          `Could not delete the gallery ${mediaLabel}.`,
      )
    } finally {
      setBusyId(null)
    }
  }

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...rows]
      .filter((item) => {
        if (category !== 'All' && item.category !== category) {
          return false
        }

        if (
          mediaType !== 'All' &&
          (item.media_type || 'image') !== mediaType
        ) {
          return false
        }

        if (!query) return true

        return [
          item.title,
          item.category,
          item.description,
          item.alt_text,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query),
          )
      })
      .sort(
        (a, b) =>
          Number(a.display_order || 0) -
          Number(b.display_order || 0),
      )
  }, [rows, search, category, mediaType])

  const stats = useMemo(() => {
    const images = rows.filter((item) => !isVideoItem(item)).length
    const videos = rows.filter((item) => isVideoItem(item)).length
    const active = rows.filter((item) => item.is_active).length
    const featured = rows.filter((item) => item.is_featured).length

    return {
      total: rows.length,
      images,
      videos,
      active,
      featured,
    }
  }, [rows])

  return (
    <>
      <Panel
        title="Gallery"
        description="Manage the visual content displayed across the public Samaha Gallery."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="a-btn a-btn-sm"
              onClick={load}
              disabled={loading}
            >
              <RefreshCw
                size={14}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>

            <button
              className="a-btn a-btn-sm a-btn-primary"
              onClick={() => setEditing('new')}
            >
              <Plus size={14} />
              Add media
            </button>
          </div>
        }
      >
        <div className="border-b px-4 py-4 sm:px-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total media"
              value={stats.total}
              icon={ImageIcon}
            />

            <StatCard
              label="Images"
              value={stats.images}
              icon={ImageIcon}
            />

            <StatCard
              label="Videos"
              value={stats.videos}
              icon={Video}
            />

            <StatCard
              label="Featured"
              value={stats.featured}
              icon={Star}
            />
          </div>
        </div>

        <div className="border-b px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">

              <input
                className="a-input w-full pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search gallery media..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">

                <select
                  className="a-input pl-8 pr-8"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option value="All">All categories</option>

                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <select
                className="a-input"
                value={mediaType}
                onChange={(event) =>
                  setMediaType(event.target.value)
                }
              >
                <option value="All">All media</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center a-mute">
            <Loader2
              size={24}
              className="animate-spin"
            />

            <p className="mt-3 text-sm">
              Loading gallery media...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600">
              <X size={20} />
            </div>

            <p className="mt-4 text-sm font-medium">
              Could not load the gallery
            </p>

            <p className="mt-1 max-w-md text-sm a-mute">
              {error}
            </p>

            <button
              className="a-btn a-btn-sm mt-4"
              onClick={load}
            >
              Try again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          filteredRows.length === 0 && (
            <EmptyGallery
              hasFilters={
                Boolean(search.trim()) ||
                category !== 'All' ||
                mediaType !== 'All'
              }
              onAdd={() => setEditing('new')}
            />
          )}

        {!loading &&
          !error &&
          filteredRows.length > 0 && (
            <div className="grid gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRows.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  busy={busyId === item.id}
                  onEdit={() => setEditing(item)}
                  onDelete={() => remove(item)}
                />
              ))}
            </div>
          )}
      </Panel>

      {editing !== null && (
        <GalleryForm
          item={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
        />
      )}
    </>
  )
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border px-4 py-3"
      style={{
        borderColor: 'var(--a-border)',
        background: 'var(--a-surface-2)',
      }}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
        style={{
          background: 'var(--a-accent-soft)',
          color: 'var(--a-text)',
        }}
      >
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p className="text-lg font-semibold leading-none">
          {value}
        </p>

        <p className="mt-1 text-[0.68rem] a-mute">
          {label}
        </p>
      </div>
    </div>
  )
}

function GalleryCard({
  item,
  busy,
  onEdit,
  onDelete,
}) {
  const [mediaError, setMediaError] = useState(false)
  const video = isVideoItem(item)
  const mediaUrl = resolveMediaUrl(
    video ? item.video : item.image,
  )
  const posterUrl = resolveMediaUrl(item.poster)

  return (
    <article
      className="group overflow-hidden rounded-xl border"
      style={{
        borderColor: 'var(--a-border)',
        background: 'var(--a-bg)',
      }}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{
          background: 'var(--a-surface-2)',
        }}
      >
        {!mediaError && mediaUrl ? (
          video ? (
            <video
              src={mediaUrl}
              poster={posterUrl || undefined}
              preload="metadata"
              muted
              playsInline
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              onError={() => setMediaError(true)}
            />
          ) : (
            <img
              src={mediaUrl}
              alt={item.alt_text || item.title || ''}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              onError={() => setMediaError(true)}
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center a-mute">
            {video ? (
              <Video size={28} strokeWidth={1.4} />
            ) : (
              <ImageIcon size={28} strokeWidth={1.4} />
            )}
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[0.62rem] font-medium text-white backdrop-blur">
              {video ? (
                <Video size={10} />
              ) : (
                <ImageIcon size={10} />
              )}
              {video ? 'Video' : 'Image'}
            </span>

            {item.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[0.62rem] font-medium text-white backdrop-blur">
                <Star
                  size={9}
                  fill="currentColor"
                />
                Featured
              </span>
            )}
          </div>

          <span
            className={`rounded-full px-2 py-1 text-[0.62rem] font-medium backdrop-blur ${
              item.is_active
                ? 'bg-emerald-500/90 text-white'
                : 'bg-black/55 text-white'
            }`}
          >
            {item.is_active ? 'Active' : 'Draft'}
          </span>
        </div>

        {video && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Play
                size={16}
                fill="currentColor"
                className="ml-0.5"
              />
            </span>
          </div>
        )}

        <span className="absolute bottom-3 right-3 rounded-md bg-black/55 px-2 py-1 text-[0.62rem] font-medium text-white backdrop-blur">
          #{item.display_order ?? 0}
        </span>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-end gap-1 bg-gradient-to-t from-black/65 to-transparent px-3 pb-3 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-slate-900 transition hover:bg-white"
            title="Edit"
            onClick={onEdit}
          >
            <Pencil size={13} />
          </button>

          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg bg-red-500/90 text-white transition hover:bg-red-500"
            title="Delete"
            onClick={onDelete}
            disabled={busy}
          >
            {busy ? (
              <Loader2
                size={13}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        </div>
      </div>

      <div className="px-3.5 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">
              {item.title || 'Untitled'}
            </h3>

            <p className="mt-1 truncate text-[0.68rem] a-mute">
              {item.category || 'Uncategorized'}
            </p>
          </div>

          {item.is_featured && (
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
              style={{
                background: 'var(--a-accent-soft)',
                color: 'var(--a-text)',
              }}
              title="Featured"
            >
              <Star
                size={12}
                fill="currentColor"
              />
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function EmptyGallery({ hasFilters, onAdd }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="grid h-16 w-16 place-items-center rounded-2xl"
        style={{
          background: 'var(--a-accent-soft)',
          color: 'var(--a-text)',
        }}
      >
        <ImageIcon size={26} />
      </div>

      <h3 className="mt-5 text-base font-semibold">
        {hasFilters
          ? 'No matching media'
          : 'Your gallery is empty'}
      </h3>

      <p className="mt-2 max-w-md text-sm a-mute">
        {hasFilters
          ? 'Try another search or filter, or clear the filters to see all gallery media.'
          : 'Add your first image or video to start building the public Samaha Gallery.'}
      </p>

      {!hasFilters && (
        <button
          className="a-btn a-btn-sm a-btn-primary mt-5"
          onClick={onAdd}
        >
          <Plus size={14} />
          Add media
        </button>
      )}
    </div>
  )
}

function GalleryForm({ item, onClose, onSaved }) {
  const isNew = !item

  const [form, setForm] = useState(() => ({
    title: item?.title || '',
    media_type: item?.media_type || 'image',
    image: item?.image || '',
    video: item?.video || '',
    poster: item?.poster || '',
    category: item?.category || 'Products',
    alt_text: item?.alt_text || '',
    description: item?.description || '',
    display_order: item?.display_order ?? 0,
    is_featured: item?.is_featured ?? false,
    is_active: item?.is_active ?? true,
  }))

  const [mediaFile, setMediaFile] = useState(null)
  const [posterFile, setPosterFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState('')
  const [error, setError] = useState('')

  const isVideo = form.media_type === 'video'

  const set = (key) => (event) => {
    const { type, checked, value } = event.target

    setForm((current) => ({
      ...current,
      [key]:
        type === 'checkbox' ? checked : value,
    }))
  }

  const changeMediaType = (event) => {
    const mediaType = event.target.value

    setForm((current) => ({
      ...current,
      media_type: mediaType,
      image:
        mediaType === 'image' ? current.image : '',
      video:
        mediaType === 'video' ? current.video : '',
      poster:
        mediaType === 'video' ? current.poster : '',
    }))

    setMediaFile(null)
    setPosterFile(null)
    setError('')
  }

  const save = async () => {
    setError('')

    if (!form.title.trim()) {
      setError('Enter a title.')
      return
    }

    if (!form.category) {
      setError('Choose a category.')
      return
    }

    if (isVideo) {
      if (!form.video && !mediaFile) {
        setError('Choose a video.')
        return
      }
    } else if (!form.image && !mediaFile) {
      setError('Choose an image.')
      return
    }

    setBusy(true)

    try {
      let imageUrl = form.image
      let videoUrl = form.video
      let posterUrl = form.poster

      if (mediaFile) {
        if (isVideo) {
          setStage('Uploading & compressing video…')

          const uploaded = await uploadGalleryVideo(
            mediaFile,
            form.title.trim(),
          )

          videoUrl = uploaded.url
          imageUrl = null
        } else {
          setStage('Compressing image…')
          const compressed = await compressImage(mediaFile)

          setStage('Uploading image…')
          const uploaded = await uploadGalleryImage(
            compressed,
            form.title.trim(),
          )

          imageUrl = uploaded.url
          videoUrl = null
          posterUrl = null
        }
      }

      if (posterFile && isVideo) {
        setStage('Uploading poster…')

        const uploadedPoster = await uploadGalleryImage(
          await compressImage(posterFile),
          `${form.title.trim()} poster`,
        )

        posterUrl = uploadedPoster.url
      }

      const payload = {
        title: form.title.trim(),
        media_type: form.media_type,
        image: isVideo
          ? null
          : imageUrl || null,
        video: isVideo
          ? videoUrl || null
          : null,
        poster: isVideo
          ? posterUrl || null
          : null,
        category: form.category,
        alt_text:
          form.alt_text.trim() || null,
        description:
          form.description.trim() || null,
        display_order:
          Number(form.display_order) || 0,
        is_featured: form.is_featured,
        is_active: form.is_active,
      }

      if (isNew) {
        await createGallery(payload)
      } else {
        await saveGallery(item.id, payload)
      }

      onSaved()
    } catch (e) {
      setError(
        e.message ||
          `Could not save the gallery ${
            isVideo ? 'video' : 'image'
          }.`,
      )
      setBusy(false)
      setStage('')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="a-card flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden"
        style={{
          borderRadius: 'var(--a-radius-lg)',
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom:
              '1px solid var(--a-border)',
          }}
        >
          <div>
            <h2 className="text-base font-semibold">
              {isNew
                ? 'Add gallery media'
                : 'Edit gallery media'}
            </h2>

            <p className="mt-0.5 text-[0.72rem] a-mute">
              Add an image or video for the public
              Gallery page.
            </p>
          </div>

          <button
            type="button"
            className="a-iconbtn"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <Field label="Media type *">
            <div className="grid grid-cols-2 gap-2">
              {MEDIA_TYPES.map((type) => {
                const Icon = type.icon
                const selected =
                  form.media_type === type.value

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      changeMediaType({
                        target: {
                          value: type.value,
                        },
                      })
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition"
                    style={{
                      borderColor: selected
                        ? 'var(--a-accent)'
                        : 'var(--a-border)',
                      background: selected
                        ? 'var(--a-accent-soft)'
                        : 'var(--a-bg)',
                      color: 'var(--a-text)',
                    }}
                  >
                    <Icon size={16} />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </Field>

          {isVideo ? (
            <>
              <MediaDropzone
                label="Gallery video *"
                hint="MP4, WebM or MOV — maximum 100 MB, compressed automatically"
                type="video"
                url={form.video}
                file={mediaFile}
                onFile={setMediaFile}
                onClear={() => {
                  setMediaFile(null)
                  setForm((current) => ({
                    ...current,
                    video: '',
                  }))
                }}
              />

              <MediaDropzone
                label="Video poster"
                hint="Optional JPG, PNG, WebP or AVIF image — compressed automatically"
                type="image"
                url={form.poster}
                file={posterFile}
                onFile={setPosterFile}
                onClear={() => {
                  setPosterFile(null)
                  setForm((current) => ({
                    ...current,
                    poster: '',
                  }))
                }}
              />
            </>
          ) : (
            <MediaDropzone
              label="Gallery image *"
              hint="JPG, PNG, WebP or AVIF — compressed automatically"
              type="image"
              url={form.image}
              file={mediaFile}
              onFile={setMediaFile}
              onClear={() => {
                setMediaFile(null)
                setForm((current) => ({
                  ...current,
                  image: '',
                }))
              }}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title *">
              <input
                className="a-input"
                value={form.title}
                onChange={set('title')}
                placeholder="Traditional sesame oil extraction"
                maxLength={160}
              />
            </Field>

            <Field label="Category *">
              <select
                className="a-input"
                value={form.category}
                onChange={set('category')}
              >
                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Alt text">
            <input
              className="a-input"
              value={form.alt_text}
              onChange={set('alt_text')}
              placeholder="Describe the visual for screen readers"
              maxLength={255}
            />
          </Field>

          <Field label="Description">
            <textarea
              className="a-textarea"
              rows={4}
              value={form.description}
              onChange={set('description')}
              placeholder="Optional internal description."
              maxLength={2000}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Display order">
              <input
                className="a-input"
                type="number"
                min="0"
                value={form.display_order}
                onChange={set('display_order')}
              />
            </Field>

            <label className="flex items-end gap-2 pb-2.5 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={set('is_featured')}
                className="h-4 w-4 cursor-pointer"
              />
              Featured
            </label>

            <label className="flex items-end gap-2 pb-2.5 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={set('is_active')}
                className="h-4 w-4 cursor-pointer"
              />
              Active
            </label>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        <div
          className="flex items-center gap-2 px-6 py-4"
          style={{
            borderTop:
              '1px solid var(--a-border)',
          }}
        >
          <button
            type="button"
            className="a-btn a-btn-sm a-btn-primary flex-1"
            onClick={save}
            disabled={busy}
          >
            {busy && (
              <Loader2
                size={14}
                className="animate-spin"
              />
            )}

            {busy && stage
              ? stage
              : isNew
              ? `Create ${
                  isVideo ? 'video' : 'image'
                }`
              : 'Save changes'}
          </button>

          <button
            type="button"
            className="a-btn a-btn-sm"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function MediaDropzone({
  label,
  hint,
  type,
  url,
  file,
  onFile,
  onClear,
}) {
  const [over, setOver] = useState(false)

  const choose = (selected) => {
    const next = selected?.[0]

    if (!next) return

    if (type === 'image') {
      if (!next.type.startsWith('image/')) {
        window.alert(
          'Please choose an image file.',
        )
        return
      }

      if (next.size > 50 * 1024 * 1024) {
        window.alert(
          'That image is over 50 MB — please use a smaller image.',
        )
        return
      }
    }

    if (type === 'video') {
      const allowed = [
        'video/mp4',
        'video/webm',
        'video/quicktime',
      ]

      if (
        !next.type.startsWith('video/') &&
        !allowed.includes(next.type)
      ) {
        window.alert(
          'Please choose an MP4, WebM or MOV video.',
        )
        return
      }

      if (next.size > 100 * 1024 * 1024) {
        window.alert(
          'That video is over 100 MB — please use a smaller video.',
        )
        return
      }
    }

    onFile(next)
  }

  const previewUrl = file
    ? URL.createObjectURL(file)
    : url

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">
        {label}
      </span>

      <label
        className={`block cursor-pointer overflow-hidden rounded-xl border transition ${
          over
            ? 'ring-2 ring-[var(--a-accent)]'
            : ''
        }`}
        style={{
          borderColor: over
            ? 'var(--a-accent)'
            : 'var(--a-border)',
          background: 'var(--a-surface-2)',
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setOver(false)
          choose(event.dataTransfer.files)
        }}
      >
        <input
          type="file"
          accept={
            type === 'video'
              ? 'video/mp4,video/webm,video/quicktime'
              : 'image/jpeg,image/png,image/webp,image/avif'
          }
          className="sr-only"
          onChange={(event) => {
            choose(event.target.files)
            event.target.value = ''
          }}
        />

        {previewUrl ? (
          <div className="relative aspect-[4/3]">
            {type === 'video' ? (
              <video
                src={previewUrl}
                controls
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={previewUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-black/60 px-3 py-2 text-xs text-white">
              <span className="min-w-0 truncate">
                {file
                  ? file.name
                  : `Current ${type} — click to replace`}
              </span>

              {url && !file && (
                <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[0.6rem]">
                  Saved
                </span>
              )}
            </div>

            {(file || url) && (
              <button
                type="button"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onClear()
                }}
                aria-label={`Remove ${type}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center px-5 py-8 text-center">
            <span
              className="mb-3 grid h-11 w-11 place-items-center rounded-full"
              style={{
                background:
                  'var(--a-accent-soft)',
                color: 'var(--a-text)',
              }}
            >
              {type === 'video' ? (
                <Video size={18} />
              ) : (
                <UploadCloud size={18} />
              )}
            </span>

            <p className="text-sm font-medium">
              Drop a {type} here or click to browse
            </p>

            <p className="mt-1 max-w-sm text-[0.72rem] a-mute">
              {hint}
            </p>
          </div>
        )}
      </label>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
      </span>

      {children}
    </label>
  )
}
