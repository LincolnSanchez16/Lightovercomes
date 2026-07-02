import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import christianValuesImage from '../assets/images/christianvalues.jpeg'
import witnessCardsImage from '../assets/images/gospelcards_flipped.jpeg'
import { bookSnippetCards, pageDescriptions, pageTitles, resourceCards } from '../data/siteContent'

function Resources() {
  const cardsRef = useRef([])

  const resourceImages = {
    'christian-values': christianValuesImage,
    'witness-cards': witnessCardsImage,
  }

  const snippetImages = {
    'attributes-of-god': '/images/books/daily-encounters-attributes.png',
    exchange: '/images/books/exchange-lies-of-the-enemy.png',
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

      <div className="resources-list" aria-label="Resource categories">
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

      <section className="book-snippets-section" aria-labelledby="book-snippets-title">
        <div className="resources-section-heading">
          <span className="eyebrow">Book Previews</span>
          <h2 id="book-snippets-title" className="visually-hidden">
            Book previews
          </h2>
        </div>

        <div className="book-snippet-grid">
          {bookSnippetCards.map((card) => (
            <Link
              className="book-snippet-card"
              data-resource={card.key}
              key={card.path}
              to={card.path}
              aria-label={`${card.title}. Click me.`}
            >
              <div className="book-snippet-image-wrap">
                <img
                  className="book-snippet-image"
                  src={snippetImages[card.key]}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                />
                <span className="book-snippet-hover">Click me</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  )
}

export default Resources
