import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  isContactFormEnabled,
  isContactFormPreview,
  submitContactMessage,
} from '../../lib/contactMessages'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ContactForm({ pagePath, source = 'website-contact' }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (website) {
      setStatus('success')
      return
    }

    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedMessage = message.trim()

    if (!normalizedName) {
      setStatus('error')
      setFeedback('Enter your name.')
      return
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setStatus('error')
      setFeedback('Enter a valid email address.')
      return
    }

    if (normalizedMessage.length < 10) {
      setStatus('error')
      setFeedback('Tell us a little more before sending your message.')
      return
    }

    setStatus('submitting')
    setFeedback('')

    try {
      if (isContactFormEnabled) {
        await submitContactMessage({
          name: normalizedName,
          email: normalizedEmail,
          message: normalizedMessage,
          source,
          pagePath,
          website,
        })
      } else if (!isContactFormPreview) {
        throw new Error()
      }

      setStatus('success')
      setFeedback(
        isContactFormEnabled
          ? 'Thank you. Your message has been sent.'
          : 'Preview complete. No information was saved.',
      )
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
      setFeedback('We could not send your message right now. Please try again shortly.')
    }
  }

  if (status === 'success') {
    return (
      <p className="contact-form-success" role="status">
        {feedback || 'Thank you. Your message has been sent.'}
      </p>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-row">
        <div className="contact-form-field">
          <label htmlFor={`contact-name-${source}`}>Name</label>
          <input
            id={`contact-name-${source}`}
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength="120"
            disabled={status === 'submitting'}
            required
          />
        </div>

        <div className="contact-form-field">
          <label htmlFor={`contact-email-${source}`}>Email address</label>
          <input
            id={`contact-email-${source}`}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength="254"
            disabled={status === 'submitting'}
            required
          />
        </div>
      </div>

      <div className="contact-form-field">
        <label htmlFor={`contact-message-${source}`}>Message</label>
        <textarea
          id={`contact-message-${source}`}
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          minLength="10"
          maxLength="5000"
          rows="6"
          disabled={status === 'submitting'}
          required
        />
      </div>

      <div className="contact-form-honeypot" aria-hidden="true">
        <label htmlFor={`contact-website-${source}`}>Website</label>
        <input
          id={`contact-website-${source}`}
          type="text"
          name="website"
          tabIndex="-1"
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="contact-form-footer">
        <p>
          We will use this information to respond to your message. See our{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
        <button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending...' : 'Send message'}
        </button>
      </div>

      {feedback ? (
        <p className="contact-form-error" role="alert">
          {feedback}
        </p>
      ) : null}
    </form>
  )
}

export default ContactForm
