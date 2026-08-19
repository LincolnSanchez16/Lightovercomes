import { Maximize2, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import witnessCtaImage from '../assets/images/lightochero.jpeg'
import {
  witnessLongFormVideo,
  witnessVideoCards,
  witnessVideoIntro,
} from '../data/witnessCards'

function WitnessVideos() {
  const [activeCardId, setActiveCardId] = useState(null)
  const [revealedCardIds, setRevealedCardIds] = useState(() => new Set())
  const cardsRef = useRef([])
  const activeCard =
    witnessVideoCards.find((card) => card.id === activeCardId) ??
    (activeCardId === witnessLongFormVideo.id ? witnessLongFormVideo : null)

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

      <aside className="witness-video-page-cta" aria-labelledby="lasting-hope-cta-title">
        <div className="witness-video-page-cta-media" aria-hidden="true">
          <img src={witnessCtaImage} alt="" />
          <div className="witness-video-page-cta-overlay" />
        </div>
        <div className="witness-video-page-cta-inner">
          <h2 id="lasting-hope-cta-title">
            Everyone Needs Lasting Hope. Don&apos;t Miss Out!
          </h2>
          <button type="button" onClick={() => setActiveCardId(witnessLongFormVideo.id)}>
            Learn More · {witnessLongFormVideo.duration}
          </button>
        </div>
      </aside>

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
      aria-label={`Watch ${card.title}, ${card.duration}`}
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
      <span className="witness-video-meta" aria-hidden="true">
        <span>Short video</span>
        <strong>{card.duration}</strong>
      </span>
    </button>
  )
}

function WitnessVideoModal({ card, onClose }) {
  const videoRef = useRef(null)
  const [isLandscape, setIsLandscape] = useState(false)

  const openFullscreen = async () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (video.requestFullscreen) {
      await video.requestFullscreen()
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen()
    }
  }

  return (
    <div
      className="witness-video-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <article
        className={`witness-video-modal${isLandscape ? ' witness-video-modal-landscape' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={card.title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="witness-video-modal-actions">
          <button
            className="witness-video-fullscreen"
            type="button"
            onClick={openFullscreen}
            title="View fullscreen"
            aria-label="View video fullscreen"
          >
            <Maximize2 aria-hidden="true" />
          </button>
          <button className="witness-video-modal-close" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="witness-video-player-frame">
          <video
            ref={videoRef}
            key={card.videoSrc}
            className="witness-video-player"
            src={card.videoSrc}
            controls
            autoPlay
            playsInline
            preload="auto"
            onLoadedMetadata={(event) => {
              const video = event.currentTarget
              setIsLandscape(video.videoWidth > video.videoHeight)
            }}
          >
            Your browser does not support this video.
          </video>
        </div>

        <div className="witness-video-active-footer">
          <span>Now playing · {card.duration}</span>
          <h2>{card.title}</h2>
        </div>
      </article>
    </div>
  )
}

export default WitnessVideos
