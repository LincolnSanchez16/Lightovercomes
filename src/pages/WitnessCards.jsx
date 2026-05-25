import { useEffect, useRef, useState } from 'react'
import { witnessCards, witnessCardsIntro } from '../data/witnessCards'

function WitnessCards() {
  const [selectedCard, setSelectedCard] = useState(null)
  const [modalImageFailed, setModalImageFailed] = useState(false)
  const cardsRef = useRef([])

  useEffect(() => {
    if (!selectedCard) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedCard(null)
      }
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedCard])

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('witness-card-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    cards.forEach((card) => observer.observe(card))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <section className="witness-page">
        <div className="witness-intro">
          <span className="eyebrow">{witnessCardsIntro.eyebrow}</span>
          <h1>{witnessCardsIntro.title}</h1>
          <p>{witnessCardsIntro.description}</p>
        </div>

        <div className="witness-grid" aria-label="Witness Cards">
          {witnessCards.map((card, index) => (
            <WitnessCard
              key={card.id}
              card={card}
              refCallback={(element) => {
                cardsRef.current[index] = element
              }}
              transitionDelay={`${Math.min(index * 35, 180)}ms`}
              onSelect={() => {
                setModalImageFailed(false)
                setSelectedCard(card)
              }}
            />
          ))}
        </div>
      </section>

      {selectedCard ? (
        <div
          className="value-modal-backdrop witness-modal-backdrop"
          onClick={() => setSelectedCard(null)}
        >
          <div
            aria-labelledby="witness-modal-title"
            aria-modal="true"
            className="value-modal witness-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="value-modal-header">
              <span className="value-modal-label">Witness Card</span>
              <button
                aria-label={`Close ${selectedCard.title}`}
                className="value-modal-close"
                type="button"
                onClick={() => setSelectedCard(null)}
              >
                Close
              </button>
            </div>

            {selectedCard.imageFull && !modalImageFailed ? (
              <>
                <div className="value-modal-image-frame witness-modal-image-frame">
                  <img
                    className="value-modal-image witness-modal-image"
                    src={selectedCard.imageFull}
                    alt={selectedCard.title}
                    decoding="async"
                    onError={() => setModalImageFailed(true)}
                  />
                </div>
                <h2 id="witness-modal-title">{selectedCard.title}</h2>
                {selectedCard.description ? (
                  <p className="value-modal-description">{selectedCard.description}</p>
                ) : null}
              </>
            ) : (
              <div className="value-modal-placeholder witness-modal-placeholder">
                <span className="value-modal-placeholder-index">
                  {String(selectedCard.id).padStart(2, '0')}
                </span>
                <div>
                  <h2 id="witness-modal-title">{selectedCard.title}</h2>
                  <p className="value-modal-placeholder-copy">
                    The image for this witness card could not be loaded.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}

function WitnessCard({ card, refCallback, transitionDelay, onSelect }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = card.imageThumb && !imageFailed

  return (
    <button
      type="button"
      className="witness-card"
      ref={refCallback}
      style={{ transitionDelay }}
      onClick={onSelect}
    >
      <div className="witness-card-image-frame">
        {showImage ? (
          <img
            className="witness-card-image"
            src={card.imageThumb}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span>{card.title}</span>
        )}
      </div>

      <span className="witness-card-index">{String(card.id).padStart(2, '0')}</span>
      <div className="witness-card-body">
        <h2>{card.title}</h2>
        {card.description ? <p>{card.description}</p> : null}
      </div>
    </button>
  )
}

export default WitnessCards
