/**
 * Shrinks an image in the browser before upload: caps the longest side and
 * re-encodes to WebP (JPEG if the browser can't encode WebP). Big phone photos
 * drop from ~10 MB to a few hundred KB, so they upload fast and stay under the
 * server's upload limit. The server still re-encodes, so this is purely a
 * transfer-size win. Returns the original file when compressing doesn't help.
 */
export async function compressImage(file, { maxSize = 2400, quality = 0.85 } = {}) {
  if (!file?.type?.startsWith('image/') || file.type === 'image/gif') {
    return file
  }

  let bitmap

  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file // format the browser can't decode (e.g. some AVIF) — let the server handle it
  }

  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  const toBlob = (type) =>
    new Promise((resolve) => canvas.toBlob(resolve, type, quality))

  let blob = await toBlob('image/webp')
  if (!blob || blob.type !== 'image/webp') {
    blob = await toBlob('image/jpeg')
  }

  if (!blob || (blob.size >= file.size && scale === 1)) {
    return file
  }

  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  const base = file.name.replace(/\.[^.]+$/, '') || 'image'

  return new File([blob], `${base}.${ext}`, {
    type: blob.type,
    lastModified: Date.now(),
  })
}
