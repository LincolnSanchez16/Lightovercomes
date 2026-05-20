import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import christianValuesImage from '../assets/images/christianvalues.jpeg'
import witnessCardsImage from '../assets/images/gospelcards_flipped.jpeg'
import { pageDescriptions, pageTitles, resourceCards } from '../data/siteContent'

function Resources() {
  const cardsRef = useRef([])

  const resourceImages = {
    'christian-values': christianValuesImage,
    'witness-cards': witnessCardsImage,
  }

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('resource-card-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.22,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    cards.forEach((card) => observer.observe(card))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section className="resources-page">
      <div className="resources-intro">
        <span className="eyebrow">Resources Hub</span>
        <h1>{pageTitles.resources}</h1>
        <p>{pageDescriptions.resources}</p>
      </div>

      <div className="resources-list">
        {resourceCards.map((card) => (
          <Link
            key={card.path}
            className="resource-card"
            data-resource={card.key}
            ref={(element) => {
              cardsRef.current[resourceCards.findIndex((item) => item.path === card.path)] = element
            }}
            to={card.path}
          >
            <div
              className="resource-card-background"
              aria-hidden="true"
              style={{ backgroundImage: `url(${resourceImages[card.key]})` }}
            />
            <div className="resource-card-overlay" aria-hidden="true" />

            <div className="resource-card-content">
              <div className="resource-card-copy">
                <span className="resource-card-label">{card.label}</span>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </div>

              <span className="resource-card-button">
                {card.cta}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Resources
