import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  emailConsentCopy,
  isEmailSignupEnabled,
  isEmailSignupPreview,
  subscribeToUpdates,
} from '../../lib/emailSubscribers'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function EmailSignupForm({
  pagePath,
  source = 'website',
  onSuccess,
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (website) {
      setStatus('success')
      onSuccess?.()
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedName = name.trim()

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
      if (isEmailSignupEnabled) {
        await subscribeToUpdates({
          name: normalizedName,
          email: normalizedEmail,
          source,
          pagePath,
          website,
        })
      } else if (!isEmailSignupPreview) {
        throw new Error()
      }

      setStatus('success')
      setMessage(
        isEmailSignupEnabled
          ? "You're on the list. We'll keep you posted."
          : 'Preview complete. No information was saved.',
      )
      setName('')
      setEmail('')
      onSuccess?.()
    } catch {
      setStatus('error')
      setMessage('We could not complete your signup right now. Please try again shortly.')
    }
  }

  if (status === 'success') {
    return (
      <p className="email-signup-success" role="status">
        {message || "You're on the list. We'll keep you posted."}
      </p>
    )
  }

  return (
    <form className="email-signup-form" onSubmit={handleSubmit} noValidate>
      <div className="email-signup-fields">
        <label className="visually-hidden" htmlFor={`name-signup-${source}`}>
          Name
        </label>
        <input
          id={`name-signup-${source}`}
          className="email-signup-input"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength="120"
          disabled={status === 'submitting'}
          required
        />
        <label className="visually-hidden" htmlFor={`email-signup-${source}`}>
          Email address
        </label>
        <input
          id={`email-signup-${source}`}
          className="email-signup-input"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={`email-signup-consent-${source}`}
          disabled={status === 'submitting'}
          required
        />
        <button
          className="email-signup-submit"
          type="submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Joining...' : 'Join the list'}
        </button>
      </div>

      <div className="email-signup-honeypot" aria-hidden="true">
        <label htmlFor={`email-signup-website-${source}`}>Website</label>
        <input
          id={`email-signup-website-${source}`}
          type="text"
          name="website"
          tabIndex="-1"
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <p id={`email-signup-consent-${source}`} className="email-signup-consent">
        {emailConsentCopy}{' '}
        <Link to="/privacy">Privacy Policy</Link>
      </p>

      {message ? (
        <p className="email-signup-error" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  )
}

export default EmailSignupForm
