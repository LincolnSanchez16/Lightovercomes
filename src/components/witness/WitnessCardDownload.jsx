import { useEffect, useState } from 'react'
import { Download, Printer, X } from 'lucide-react'
import { witnessCards } from '../../data/witnessCards'

const FORMATS = [
  { id: 'pdf', label: 'PDF' },
  { id: 'png', label: 'PNG' },
  { id: 'jpeg', label: 'JPEG' },
]

const RESOLUTIONS = [
  {
    id: 'print',
    label: 'Print-ready',
    detail: '300 DPI · 1050 × 600',
    width: 1050,
    height: 600,
    dpi: 300,
  },
  {
    id: 'standard',
    label: 'Standard',
    detail: '150 DPI · 525 × 300',
    width: 525,
    height: 300,
    dpi: 150,
  },
]

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function getCardFileName(card) {
  return card.imageFull.split('/').pop().replace(/\.[^.]+$/, '')
}

async function renderCard(card, resolution, format) {
  const response = await fetch(card.imageFull)

  if (!response.ok) {
    throw new Error('A witness card could not be loaded.')
  }

  const sourceBlob = await response.blob()
  const sourceUrl = URL.createObjectURL(sourceBlob)
  const image = new Image()
  image.decoding = 'async'

  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = reject
      image.src = sourceUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = resolution.width
    canvas.height = resolution.height
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('This browser could not prepare the card files.')
    }

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result)
          } else {
            reject(new Error('This browser could not prepare the card files.'))
          }
        },
        mimeType,
        format === 'png' ? undefined : 0.94,
      )
    })

    return { blob, canvas }
  } finally {
    URL.revokeObjectURL(sourceUrl)
  }
}

async function createCardDownload(format, resolution) {
  const renderedCards = await Promise.all(
    witnessCards.map((card) =>
      renderCard(card, resolution, format === 'png' ? 'png' : 'jpeg'),
    ),
  )

  if (format === 'pdf') {
    const { jsPDF } = await import('jspdf')
    const document = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [3.5, 2],
      compress: true,
    })

    renderedCards.forEach(({ canvas }, index) => {
      if (index > 0) {
        document.addPage([3.5, 2], 'landscape')
      }

      document.addImage(canvas.toDataURL('image/jpeg', 0.96), 'JPEG', 0, 0, 3.5, 2)
    })

    downloadBlob(
      document.output('blob'),
      `light-overcomes-witness-cards-${resolution.dpi}dpi.pdf`,
    )
    return
  }

  const { default: JSZip } = await import('jszip')
  const archive = new JSZip()
  const extension = format === 'png' ? 'png' : 'jpg'

  renderedCards.forEach(({ blob }, index) => {
    archive.file(`${getCardFileName(witnessCards[index])}.${extension}`, blob)
  })

  const archiveBlob = await archive.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  })

  downloadBlob(
    archiveBlob,
    `light-overcomes-witness-cards-${resolution.dpi}dpi-${format}.zip`,
  )
}

function WitnessCardDownload() {
  const [isOpen, setIsOpen] = useState(false)
  const [format, setFormat] = useState('pdf')
  const [resolutionId, setResolutionId] = useState('print')
  const [isPreparing, setIsPreparing] = useState(false)
  const [error, setError] = useState('')
  const resolution =
    RESOLUTIONS.find((option) => option.id === resolutionId) || RESOLUTIONS[0]

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isPreparing) {
        setIsOpen(false)
      }
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isPreparing])

  const open = () => {
    setError('')
    setIsOpen(true)
  }

  const close = () => {
    if (!isPreparing) {
      setIsOpen(false)
    }
  }

  const handleDownload = async () => {
    setError('')
    setIsPreparing(true)

    try {
      await createCardDownload(format, resolution)
    } catch {
      setError('The download could not be prepared. Please try again.')
    } finally {
      setIsPreparing(false)
    }
  }

  return (
    <>
      <section className="witness-download-callout" aria-labelledby="witness-download-title">
        <div className="witness-download-icon" aria-hidden="true">
          <Printer size={22} strokeWidth={1.8} />
        </div>
        <div className="witness-download-copy">
          <span className="eyebrow">Print at home</span>
          <h2 id="witness-download-title">Have your own printer?</h2>
          <p>Download the complete set in the format and resolution you need.</p>
        </div>
        <button className="witness-download-open" type="button" onClick={open}>
          Choose download
          <Download size={17} aria-hidden="true" />
        </button>
      </section>

      {isOpen ? (
        <div className="witness-download-backdrop" onClick={close}>
          <section
            className="witness-download-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="witness-download-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="witness-download-modal-header">
              <div>
                <span className="eyebrow">All six cards</span>
                <h2 id="witness-download-modal-title">Choose your download.</h2>
              </div>
              <button
                className="witness-download-close"
                type="button"
                aria-label="Close download options"
                onClick={close}
                disabled={isPreparing}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <fieldset className="witness-download-fieldset">
              <legend>File format</legend>
              <div className="witness-download-segments">
                {FORMATS.map((option) => (
                  <label key={option.id}>
                    <input
                      type="radio"
                      name="witness-download-format"
                      value={option.id}
                      checked={format === option.id}
                      onChange={() => setFormat(option.id)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="witness-download-fieldset">
              <legend>Resolution</legend>
              <div className="witness-download-resolution-list">
                {RESOLUTIONS.map((option) => (
                  <label key={option.id}>
                    <input
                      type="radio"
                      name="witness-download-resolution"
                      value={option.id}
                      checked={resolutionId === option.id}
                      onChange={() => setResolutionId(option.id)}
                    />
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.detail}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="witness-download-note">
              {format === 'pdf'
                ? 'One 3.5 × 2 inch card per page. Printer margins may vary.'
                : `Six ${format.toUpperCase()} files packaged in one ZIP.`}
            </p>

            {error ? <p className="witness-download-error">{error}</p> : null}

            <button
              className="witness-download-submit"
              type="button"
              onClick={handleDownload}
              disabled={isPreparing}
            >
              <Download size={18} aria-hidden="true" />
              {isPreparing ? 'Preparing files…' : `Download ${format.toUpperCase()}`}
            </button>
          </section>
        </div>
      ) : null}
    </>
  )
}

export default WitnessCardDownload
