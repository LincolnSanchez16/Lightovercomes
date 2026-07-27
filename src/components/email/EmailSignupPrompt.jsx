import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  isEmailSignupVisible,
} from '../../lib/emailSubscribers'
import { OPEN_EMAIL_SIGNUP_EVENT } from '../../lib/emailSignupPrompt'
import EmailSignupForm from './EmailSignupForm'

const EXCLUDED_PATHS = new Set(['/privacy', '/privacy-policy', '/terms', '/tos'])

function EmailSignupPrompt() {
  const { pathname } = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFooterDocked, setIsFooterDocked] = useState(false)
  const [inlineSignupVisiblePath, setInlineSignupVisiblePath] = useState(null)
  const launcherRef = useRef(null)
  const isPromptAvailable =
    isEmailSignupVisible && !EXCLUDED_PATHS.has(pathname)
  const isInlineSignupVisible = inlineSignupVisiblePath === pathname
  const isLauncherAvailable = isPromptAvailable && !isInlineSignupVisible

  useEffect(() => {
    if (!isPromptAvailable) {
      return undefined
    }

    const openPrompt = () => setIsExpanded(true)

    window.addEventListener(OPEN_EMAIL_SIGNUP_EVENT, openPrompt)
    return () => window.removeEventListener(OPEN_EMAIL_SIGNUP_EVENT, openPrompt)
  }, [isPromptAvailable])

  useEffect(() => {
    if (!isPromptAvailable) {
      return undefined
    }

    const inlineSignupSections = Array.from(
      document.querySelectorAll(
        '.home-connect-section, .resources-email-signup, .about-email-signup',
      ),
    )

    if (inlineSignupSections.length === 0) {
      return undefined
    }

    const visibility = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry.isIntersecting))
        setInlineSignupVisiblePath(
          Array.from(visibility.values()).some(Boolean) ? pathname : null,
        )
      },
      { threshold: 0.08 },
    )

    inlineSignupSections.forEach((section) => {
      visibility.set(section, false)
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [isPromptAvailable, pathname])

  useEffect(() => {
    if (!isExpanded) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsExpanded(false)
      }
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isExpanded])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('has-email-signup-launcher', isLauncherAvailable && !isExpanded)

    return () => root.classList.remove('has-email-signup-launcher')
  }, [isExpanded, isLauncherAvailable])

  useEffect(() => {
    if (!isLauncherAvailable || isExpanded) {
      return undefined
    }

    const footerSlot = document.getElementById('email-signup-footer-slot')

    if (!footerSlot) {
      return undefined
    }

    let animationFrame = 0

    const updateLauncherPosition = () => {
      const launcher = launcherRef.current
      const slotBounds = footerSlot.getBoundingClientRect()
      const shouldDock =
        slotBounds.top < window.innerHeight - 8 && slotBounds.bottom > 0

      setIsFooterDocked((current) => (current === shouldDock ? current : shouldDock))

      if (launcher && shouldDock) {
        launcher.style.setProperty(
          '--email-signup-dock-right',
          `${Math.max(12, window.innerWidth - slotBounds.right)}px`,
        )
        launcher.style.setProperty(
          '--email-signup-dock-bottom',
          `${Math.max(12, window.innerHeight - slotBounds.bottom)}px`,
        )
      }
    }

    const scheduleLauncherUpdate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateLauncherPosition)
    }

    scheduleLauncherUpdate()
    window.addEventListener('scroll', scheduleLauncherUpdate, { passive: true })
    window.addEventListener('resize', scheduleLauncherUpdate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', scheduleLauncherUpdate)
      window.removeEventListener('resize', scheduleLauncherUpdate)
    }
  }, [isExpanded, isLauncherAvailable, pathname])

  if (!isPromptAvailable) {
    return null
  }

  const close = () => {
    setIsExpanded(false)
  }

  if (!isExpanded && !isLauncherAvailable) {
    return null
  }

  if (!isExpanded) {
    return (
      <button
        ref={launcherRef}
        className={
          isFooterDocked
            ? 'email-signup-launcher email-signup-launcher-docked'
            : 'email-signup-launcher'
        }
        type="button"
        aria-expanded="false"
        aria-controls="email-signup-prompt"
        onClick={() => setIsExpanded(true)}
      >
        Stay connected
      </button>
    )
  }

  return (
    <div
      className="email-signup-prompt-backdrop"
      onClick={close}
    >
      <aside
        id="email-signup-prompt"
        className="email-signup-prompt"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-signup-prompt-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="email-signup-prompt-header">
          <div>
            <span className="email-signup-eyebrow">Stay connected</span>
            <h2 id="email-signup-prompt-title">Keep up with Light Overcomes.</h2>
          </div>
          <button
            className="email-signup-dismiss"
            type="button"
            onClick={close}
          >
            Close
          </button>
        </div>

        <p className="email-signup-prompt-copy">
          Get new resources, ministry updates, and future releases in your inbox.
        </p>

        <EmailSignupForm
          pagePath={pathname}
          source="scroll-invitation"
        />
      </aside>
    </div>
  )
}

export default EmailSignupPrompt
