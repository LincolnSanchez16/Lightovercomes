import { Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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

      <aside className="witness-video-page-cta" aria-labelledby="lasting-hope-cta-title">
        <span className="eyebrow">Keep going</span>
        <h2 id="lasting-hope-cta-title">Everyone needs lasting hope.</h2>
        <p>Watch a short message about the lasting hope found in Jesus.</p>
        <button type="button" onClick={() => setActiveCardId('lasting-hope')}>
          Learn More
        </button>
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
          >
            Your browser does not support this video.
          </video>
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
