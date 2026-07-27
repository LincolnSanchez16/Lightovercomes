import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import {
  claimResource,
  isResourceClaimEnabled,
  isResourceClaimPreview,
} from '../../lib/resourceClaims'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESOURCE_KEY = 'christian-life-resource'

function ResourceClaimDialog({ isOpen, onClose }) {
  const { pathname } = useLocation()
  const dialogRef = useRef(null)
  const nameInputRef = useRef(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previouslyFocused = document.activeElement
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const focusableElements = Array.from(
          dialogRef.current?.querySelectorAll(
            'a[href], button:not(:disabled), input:not(:disabled):not([tabindex="-1"])',
          ) ?? [],
        )

        if (!focusableElements.length) {
          return
        }

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    window.requestAnimationFrame(() => nameInputRef.current?.focus())

    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (website) {
      setStatus('success')
      return
    }

    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedName) {
      setStatus('error')
      setMessage('Enter your name.')
      return
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setStatus('error')
      setMessage('Enter a valid email address.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      if (isResourceClaimEnabled) {
        await claimResource({
          name: normalizedName,
          email: normalizedEmail,
          resourceKey: RESOURCE_KEY,
          source: 'christian-values-page',
          pagePath: pathname,
          marketingOptIn,
          website,
        })
      } else if (!isResourceClaimPreview) {
        throw new Error()
      }

      setStatus('success')
      setMessage(
        isResourceClaimEnabled
          ? `Your resource is claimed. We'll email it to ${normalizedEmail} as soon as it's ready.`
          : 'Preview complete. No information was saved.',
      )
      setName('')
      setEmail('')
      setMarketingOptIn(false)
    } catch {
      setStatus('error')
      setMessage('We could not save your claim right now. Please try again shortly.')
    }
  }

  return (
    <div className="resource-claim-backdrop" onClick={onClose}>
      <section
        ref={dialogRef}
        className="resource-claim-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resource-claim-title"
        aria-describedby="resource-claim-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="resource-claim-header">
          <div>
            <span className="eyebrow">Free Christian life resource</span>
            <h2 id="resource-claim-title">Claim this resource.</h2>
          </div>
          <button
            className="resource-claim-close"
            type="button"
            aria-label="Close resource claim"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="resource-claim-success" role="status">
            <p>{message}</p>
            <button type="button" onClick={onClose}>
              Back to Christian Values
            </button>
          </div>
        ) : (
          <>
            <p id="resource-claim-description" className="resource-claim-copy">
              This resource is being prepared. Claim it now, and we will deliver it to your
              inbox when it is ready.
            </p>

            <form className="resource-claim-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="resource-claim-name">Name</label>
              <input
                ref={nameInputRef}
                id="resource-claim-name"
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                maxLength="120"
                disabled={status === 'submitting'}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <label htmlFor="resource-claim-email">Email address</label>
              <input
                id="resource-claim-email"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                maxLength="254"
                disabled={status === 'submitting'}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <label className="resource-claim-opt-in">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  disabled={status === 'submitting'}
                  onChange={(event) => setMarketingOptIn(event.target.checked)}
                />
                <span>
                  Also send me ministry updates and new resources from Light Overcomes. I can
                  unsubscribe at any time.
                </span>
              </label>

              <div className="resource-claim-honeypot" aria-hidden="true">
                <label htmlFor="resource-claim-website">Website</label>
                <input
                  id="resource-claim-website"
                  type="text"
                  name="website"
                  tabIndex="-1"
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>

              <p className="resource-claim-privacy">
                We will use your email to fulfill this request. See our{' '}
                <Link to="/privacy">Privacy Policy</Link>.
              </p>

              {message ? (
                <p className="resource-claim-error" role="alert">
                  {message}
                </p>
              ) : null}

              <button
                className="resource-claim-submit"
                type="submit"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Saving your claim...' : 'Claim this resource'}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}

export default ResourceClaimDialog
