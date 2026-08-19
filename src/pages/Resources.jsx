import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import christianValuesImage from '../assets/images/christianvalues.jpeg'
import resourcesConnectImage from '../assets/images/panobible.jpeg'
import witnessCardsImage from '../assets/images/gospelcards_flipped.jpeg'
import EmailSignupForm from '../components/email/EmailSignupForm'
import { bookSnippetCards, pageDescriptions, pageTitles, resourceCards } from '../data/siteContent'
import { isEmailSignupVisible } from '../lib/emailSubscribers'

function Resources() {
  const cardsRef = useRef([])
  const visibleResourceCards = resourceCards.filter((card) => card.published !== false)

  const resourceImages = {
    'christian-values': christianValuesImage,
    'witness-cards': witnessCardsImage,
  }

  const snippetImages = {
    'attributes-of-god': '/images/books/daily-encounters-attributes.png',
    exchange: '/images/books/exchange-lies-of-the-enemy.png',
    'calling-all-leaders': '/images/books/calling-all-leaders.png',
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
    <>
      <section className="resources-page">
        <div className="resources-intro">
          <span className="eyebrow">Resources Hub</span>
          <h1>{pageTitles.resources}</h1>
          <p>{pageDescriptions.resources}</p>
        </div>

        <div className="resources-list" aria-label="Resource categories">
          {visibleResourceCards.map((card, index) => (
            <Link
              key={card.path}
              className="resource-card"
              data-resource={card.key}
              ref={(element) => {
                cardsRef.current[index] = element
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
            <span className="eyebrow">Coming Soon</span>
            <h2 id="book-snippets-title">Book Previews</h2>
          </div>

          <div className="book-snippet-grid">
            {bookSnippetCards.map((card) => (
              <Link
                className="book-snippet-card"
                data-resource={card.key}
                key={card.path}
                to={card.path}
                aria-label={`${card.title}. View preview.`}
              >
                <span className="book-snippet-status">{card.label}</span>
                <div className="book-snippet-image-wrap">
                  <img
                    className="book-snippet-image"
                    src={snippetImages[card.key]}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="book-snippet-hover">View preview</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>

      {isEmailSignupVisible ? (
        <section className="resources-email-signup" aria-labelledby="resources-email-signup-title">
          <div className="resources-email-signup-media" aria-hidden="true">
            <img src={resourcesConnectImage} alt="" />
            <div className="resources-email-signup-overlay" />
          </div>
          <div className="resources-email-signup-inner">
            <div>
              <span className="eyebrow">Stay Connected</span>
              <h2 id="resources-email-signup-title">
                New resources, sent when they are ready.
              </h2>
            </div>
            <div className="resources-email-signup-form">
              <p>
                Receive new teaching, ministry updates, and future Light Overcomes releases.
              </p>
              <EmailSignupForm pagePath="/resources" source="resources-inline" />
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default Resources
