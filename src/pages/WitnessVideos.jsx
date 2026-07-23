import { Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/images/LOnewgreen.jpeg'
import { witnessVideoCards, witnessVideoIntro } from '../data/witnessCards'

function WitnessVideos() {
  const [activeCardId, setActiveCardId] = useState(null)
  const [revealedCardIds, setRevealedCardIds] = useState(() => new Set())
  const cardsRef = useRef([])
  const activeCard = witnessVideoCards.find((card) => card.id === activeCardId)

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.dataset.cardId

            if (cardId) {
              setRevealedCardIds((currentIds) => {
                if (currentIds.has(cardId)) {
                  return currentIds
                }

                const nextIds = new Set(currentIds)
                nextIds.add(cardId)
                return nextIds
              })
            }

            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    cards.forEach((card) => observer.observe(card))

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!activeCardId) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveCardId(null)
      }
    }

    document.body.classList.add('witness-video-modal-open')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('witness-video-modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeCardId])

  return (
    <section className="witness-video-page">
      <div className="witness-video-intro">
        <span className="eyebrow">{witnessVideoIntro.eyebrow}</span>
        <h1>{witnessVideoIntro.title}</h1>
        <p>{witnessVideoIntro.description}</p>
      </div>

      <div className="witness-video-grid" aria-label="Witness card video messages">
        {witnessVideoCards.map((card, index) => (
          <WitnessVideoCard
            key={card.id}
            card={card}
            isRevealed={revealedCardIds.has(card.id)}
            refCallback={(element) => {
              cardsRef.current[index] = element
            }}
            transitionDelay={`${Math.min(index * 40, 220)}ms`}
            onActivate={() => setActiveCardId(card.id)}
          />
        ))}
      </div>

      {activeCard ? (
        <WitnessVideoModal card={activeCard} onClose={() => setActiveCardId(null)} />
      ) : null}
    </section>
  )
}

function WitnessVideoCard({
  card,
  isRevealed,
  refCallback,
  transitionDelay,
  onActivate,
}) {
  const [coverFailed, setCoverFailed] = useState(false)
  const coverSrc = card.coverThumb || card.coverImage
  const showImage = coverSrc && !coverFailed

  return (
    <button
      type="button"
      className={`witness-video-card ${isRevealed ? 'witness-video-card-visible' : ''}`}
      data-card-id={card.id}
      data-tone={card.tone}
      ref={refCallback}
      style={{ transitionDelay }}
      onClick={onActivate}
      aria-label={`Watch ${card.title}`}
    >
      <div className="witness-video-cover">
        {showImage ? (
          <img
            className="witness-video-cover-image"
            src={coverSrc}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <div className="witness-video-cover-fallback">
            <span>Light Overcomes</span>
            <strong>{card.title}</strong>
          </div>
        )}

        <span className="witness-video-play" aria-hidden="true">
          <Play fill="currentColor" />
        </span>
      </div>
    </button>
  )
}

function WitnessVideoModal({ card, onClose }) {
  const [hasEnded, setHasEnded] = useState(false)
  const watchTimerRef = useRef(null)
  const watchedMsRef = useRef(0)
  const lastPlaybackTimeRef = useRef(0)
  const showEndCta = Boolean(card.cta && hasEnded)

  useEffect(() => (
    () => {
      if (watchTimerRef.current) {
        window.clearInterval(watchTimerRef.current)
      }
    }
  ), [])

  const clearWatchTimer = () => {
    if (watchTimerRef.current) {
      window.clearInterval(watchTimerRef.current)
      watchTimerRef.current = null
    }
  }

  const getCtaTriggerSecond = (video) => {
    if (!card.cta) {
      return null
    }

    if (Number.isFinite(card.cta.triggerAfterSeconds)) {
      return card.cta.triggerAfterSeconds
    }

    if (video && Number.isFinite(video.duration) && video.duration > 0) {
      return Math.max(video.duration - 0.5, 0)
    }

    return null
  }

  const showEndedState = () => {
    clearWatchTimer()
    setHasEnded(true)
  }

  const checkForCtaTrigger = (video) => {
    if (!card.cta || hasEnded) {
      return
    }

    const triggerSecond = getCtaTriggerSecond(video)

    if (triggerSecond === null) {
      return
    }

    if (
      video.currentTime >= triggerSecond ||
      watchedMsRef.current >= triggerSecond * 1000
    ) {
      showEndedState()
    }
  }

  const startWatchTimer = (video) => {
    if (!card.cta || hasEnded || watchTimerRef.current) {
      return
    }

    lastPlaybackTimeRef.current = video.currentTime || 0

    watchTimerRef.current = window.setInterval(() => {
      if (video.ended) {
        showEndedState()
        return
      }

      if (video.paused || video.seeking || video.readyState < 2) {
        lastPlaybackTimeRef.current = video.currentTime || 0
        return
      }

      const currentPlaybackTime = video.currentTime || 0
      const playbackDelta = currentPlaybackTime - lastPlaybackTimeRef.current

      if (playbackDelta > 0) {
        watchedMsRef.current += playbackDelta * 1000
      }

      lastPlaybackTimeRef.current = currentPlaybackTime
      checkForCtaTrigger(video)
    }, 250)
  }

  const handlePlaybackStart = (event) => {
    const video = event.currentTarget

    if (hasEnded) {
      return
    }

    lastPlaybackTimeRef.current = video.currentTime || 0
    startWatchTimer(video)
    checkForCtaTrigger(video)
  }

  const handlePause = (event) => {
    if (event.currentTarget.ended) {
      showEndedState()
      return
    }

    clearWatchTimer()
  }

  const handleSeeked = (event) => {
    const video = event.currentTarget

    lastPlaybackTimeRef.current = video.currentTime || 0
    checkForCtaTrigger(video)

    if (!video.paused && !hasEnded) {
      startWatchTimer(video)
    }
  }

  const handlePlaybackReset = (event) => {
    const video = event.currentTarget
    const triggerSecond = getCtaTriggerSecond(video)

    if (triggerSecond === null || video.currentTime < triggerSecond - 1) {
      setHasEnded(false)
    }
  }

  return (
    <div
      className="witness-video-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <article
        className="witness-video-modal"
        role="dialog"
        aria-modal="true"
        aria-label={card.title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="witness-video-modal-close" type="button" onClick={onClose}>
          Close
        </button>

        <div className="witness-video-player-frame">
          <video
            key={card.videoSrc}
            className="witness-video-player"
            src={card.videoSrc}
            controls
            autoPlay
            playsInline
            preload="auto"
            onEnded={showEndedState}
            onLoadedMetadata={(event) => {
              lastPlaybackTimeRef.current = event.currentTarget.currentTime || 0
              checkForCtaTrigger(event.currentTarget)
            }}
            onPause={handlePause}
            onPlay={handlePlaybackReset}
            onPlaying={handlePlaybackStart}
            onSeeking={clearWatchTimer}
            onSeeked={handleSeeked}
            onTimeUpdate={(event) => checkForCtaTrigger(event.currentTarget)}
            onWaiting={clearWatchTimer}
          >
            Your browser does not support this video.
          </video>

          {showEndCta ? (
            <div className="witness-video-end-card" aria-live="polite">
              <div
                className="witness-video-end-panel"
                style={{ '--witness-video-end-image': `url(${heroImage})` }}
              >
                <span>Keep going</span>
                <h3>Everyone needs lasting hope.</h3>

                <div className="witness-video-end-actions">
                  <button
                    className="witness-video-end-button witness-video-end-button-secondary"
                    type="button"
                    onClick={onClose}
                  >
                    Back to Page
                  </button>
                  <Link
                    className="witness-video-end-button witness-video-end-button-primary"
                    to={card.cta.path}
                  >
                    {card.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="witness-video-active-footer">
          <span>Now playing</span>
          <h2>{card.title}</h2>
        </div>
      </article>
    </div>
  )
}

export default WitnessVideos
