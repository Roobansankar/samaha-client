import { getVariant } from '../data/products'

/* jsPDF's built-in fonts have no ₹ glyph, so the PDF uses "Rs." */
const rs = (n) =>
  `Rs. ${(Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'

const STATUS_LABEL = { created: 'Payment pending', paid: 'Paid', failed: 'Payment failed' }
const STATUS_RGB = { paid: [26, 127, 71], failed: [192, 57, 43], created: [167, 106, 18] }

const OLIVE = [36, 61, 30]
const INK = [26, 46, 20]
const MUTE = [107, 120, 100]
const LINE = [217, 226, 209]

/** Attach the storefront image / size / oil name to each order line. */
export function enrichItems(items = []) {
  return items.map((it) => {
    const v = getVariant(it.slug)
    return {
      ...it,
      image: v?.image || null,
      size: v?.sizeLong || null,
      oil: v?.oil || null,
      display: v?.shortName || it.name,
    }
  })
}

/** Load an image URL and return a white-matted JPEG data URL (or null). */
function loadThumb(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const S = 180
        const c = document.createElement('canvas')
        c.width = S
        c.height = S
        const ctx = c.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, S, S)
        const r = Math.min(S / img.naturalWidth, S / img.naturalHeight) || 1
        const w = img.naturalWidth * r
        const h = img.naturalHeight * r
        ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h)
        resolve(c.toDataURL('image/jpeg', 0.92))
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/**
 * Build a branded PDF invoice for one order and download it straight away
 * (no print dialog). Works for both the admin order shape and the
 * customer /profile/orders shape.
 */
export async function downloadOrderInvoice(order) {
  if (!order) return

  const [{ jsPDF }, autoTableMod] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const autoTable = autoTableMod.default || autoTableMod.autoTable

  const items = enrichItems(order.items)
  const thumbs = await Promise.all(items.map((i) => (i.image ? loadThumb(i.image) : Promise.resolve(null))))

  const subtotal = order.subtotal ?? items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = order.shipping ?? 0
  const total = order.total ?? subtotal + shipping
  const units = order.item_count ?? items.reduce((s, i) => s + i.qty, 0)
  const placed = fmtDate(order.placed_at)
  const statusLabel = STATUS_LABEL[order.status] || order.status || 'Order'

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const M = 15
  const half = W / 2 + 4

  /* ---- header band ---- */
  doc.setFillColor(...OLIVE)
  doc.rect(0, 0, W, 30, 'F')
  doc.setTextColor(238, 243, 234)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.text('SAMAHA', M, 15)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(198, 214, 194)
  doc.text('COLD-PRESSED EDIBLE OILS', M, 21)

  doc.setTextColor(238, 243, 234)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('INVOICE', W - M, 13, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Order #${order.id}`, W - M, 19, { align: 'right' })
  doc.text(placed, W - M, 24, { align: 'right' })

  let y = 42

  /* ---- status ---- */
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...(STATUS_RGB[order.status] || MUTE))
  doc.text(String(statusLabel).toUpperCase(), M, y)
  y += 9

  /* ---- billed to / shipping ---- */
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...MUTE)
  doc.text('BILLED TO', M, y)
  doc.text('SHIPPING ADDRESS', half, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...INK)
  const billLines = [order.customer, order.email, order.phone].filter(Boolean).map(String)
  const addrLines = doc.splitTextToSize(String(order.address || '-'), W / 2 - M - 4)
  billLines.forEach((t, i) => doc.text(t, M, y + i * 4.6))
  addrLines.forEach((t, i) => doc.text(t, half, y + i * 4.6))
  y += Math.max(billLines.length, addrLines.length) * 4.6 + 7

  /* ---- payment / summary ---- */
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...MUTE)
  doc.text('PAYMENT', M, y)
  doc.text('SUMMARY', half, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...INK)
  doc.text(`Razorpay order:  ${order.razorpay_order_id || '-'}`, M, y)
  doc.text(`Payment ID:  ${order.payment_id || '-'}`, M, y + 4.6)
  doc.text(`${items.length} product${items.length === 1 ? '' : 's'}  -  ${units} unit${units === 1 ? '' : 's'}`, half, y)
  doc.text(`Placed ${placed}`, half, y + 4.6)
  y += 12

  /* ---- items table ---- */
  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [['', 'Item', 'Unit price', 'Qty', 'Amount']],
    body: items.map((i) => [
      '',
      i.size ? `${i.display}\n${i.size}` : i.display,
      rs(i.price),
      String(i.qty),
      rs(i.price * i.qty),
    ]),
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: { top: 3.5, bottom: 3.5, left: 2, right: 2 }, valign: 'middle', textColor: INK },
    headStyles: {
      fontStyle: 'bold',
      fontSize: 7.5,
      textColor: MUTE,
      lineWidth: { bottom: 0.5 },
      lineColor: OLIVE,
      cellPadding: { top: 1, bottom: 3, left: 2, right: 2 },
    },
    bodyStyles: { minCellHeight: 16, lineWidth: { bottom: 0.1 }, lineColor: LINE },
    columnStyles: {
      0: { cellWidth: 16 },
      1: { cellWidth: 'auto' },
      2: { halign: 'right', cellWidth: 24 },
      3: { halign: 'right', cellWidth: 14 },
      4: { halign: 'right', cellWidth: 26 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 1 && typeof data.cell.raw === 'string' && data.cell.raw.includes('\n')) {
        data.cell.styles.minCellHeight = 16
      }
    },
    didDrawCell: (data) => {
      if (data.section !== 'body' || data.column.index !== 0) return
      const t = thumbs[data.row.index]
      if (!t) return
      const s = 12
      try {
        doc.addImage(t, 'JPEG', data.cell.x + 2, data.cell.y + (data.cell.height - s) / 2, s, s)
      } catch {
        /* ignore a bad image */
      }
    },
  })

  y = (doc.lastAutoTable?.finalY || y) + 10

  /* ---- totals ---- */
  const tLabel = W - M - 62
  const tVal = W - M
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...MUTE)
  doc.text('Subtotal', tLabel, y)
  doc.text(rs(subtotal), tVal, y, { align: 'right' })
  doc.text('Shipping', tLabel, y + 6)
  doc.text(rs(shipping), tVal, y + 6, { align: 'right' })
  y += 11
  doc.setDrawColor(...OLIVE)
  doc.setLineWidth(0.5)
  doc.line(tLabel, y, tVal, y)
  y += 6.5
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11.5)
  doc.setTextColor(...INK)
  doc.text('Total paid', tLabel, y)
  doc.text(rs(total), tVal, y, { align: 'right' })

  /* ---- footer ---- */
  y += 16
  doc.setDrawColor(...LINE)
  doc.setLineWidth(0.2)
  doc.line(M, y, W - M, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MUTE)
  doc.text('Samaha Natural Oils  -  thank you for your order.', M, y)
  doc.text('This is a computer-generated invoice. For any query, reply to your order confirmation email.', M, y + 4)

  doc.save(`Samaha-Invoice-${order.id}.pdf`)
}
