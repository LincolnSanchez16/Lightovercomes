import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  isEmailSignupPreview,
  isEmailSignupVisible,
} from '../../lib/emailSubscribers'
import EmailSignupForm from './EmailSignupForm'

const STORAGE_KEY = 'light-overcomes-email-prompt'
const SUBSCRIBED_FOR_MS = 365 * 24 * 60 * 60 * 1000
const SCROLL_REVEAL_RATIO = 0.4
const EXCLUDED_PATHS = new Set(['/privacy', '/privacy-policy', '/terms', '/tos'])

function readHiddenUntil() {
  try {
    return Number(window.localStorage.getItem(STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

function rememberPromptChoice(durationMs) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now() + durationMs))
  } catch {
    // The prompt can still be dismissed for the current page if storage is unavailable.
  }
}

function EmailSignupPrompt() {
  const { pathname } = useLocation()
  const [isVisible, setIsVisible] = useState(isEmailSignupPreview)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFooterDocked, setIsFooterDocked] = useState(false)
  const launcherRef = useRef(null)
  const isPromptAvailable =
    isEmailSignupVisible && isVisible && !EXCLUDED_PATHS.has(pathname)

  useEffect(() => {
    if (!isEmailSignupVisible || isEmailSignupPreview || readHiddenUntil() > Date.now()) {
      return undefined
    }

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollRatio = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0

      if (scrollRatio >= SCROLL_REVEAL_RATIO) {
        setIsVisible(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    root.classList.toggle('has-email-signup-launcher', isPromptAvailable && !isExpanded)

    return () => root.classList.remove('has-email-signup-launcher')
  }, [isExpanded, isPromptAvailable])

  useEffect(() => {
    if (!isPromptAvailable || isExpanded) {
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
  }, [isExpanded, isPromptAvailable, pathname])

  if (!isPromptAvailable) {
    return null
  }

  const close = () => {
    setIsExpanded(false)
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
          onSuccess={() => rememberPromptChoice(SUBSCRIBED_FOR_MS)}
        />
      </aside>
    </div>
  )
}

export default EmailSignupPrompt
