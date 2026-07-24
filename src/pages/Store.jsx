import WitnessCardDownload from '../components/witness/WitnessCardDownload'
import { witnessVideoCards } from '../data/witnessCards'
import { shopStoreUrl, storeContent } from '../data/siteContent'

function Store() {
  return (
    <section className="store-page">
      <div className="store-intro">
        <div className="store-intro-copy">
          <span className="eyebrow">{storeContent.eyebrow}</span>
          <h1>{storeContent.title}</h1>
        </div>
        <div className="store-intro-action">
          <p>{storeContent.description}</p>
          <a
            className="store-primary-link"
            href={shopStoreUrl}
            target="_blank"
            rel="noreferrer"
          >
            {storeContent.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <WitnessCardDownload />

      <div className="store-card-grid" aria-label="Witness cards available in the store">
        {witnessVideoCards.map((card) => {
          const cardImage = card.coverThumb || card.coverImage

          return (
            <article className="store-card" key={card.id}>
              <a
                className="store-card-image-link"
                href={shopStoreUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open store for ${card.title}`}
              >
                {cardImage ? (
                  <img
                    className="store-card-image"
                    src={cardImage}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="store-card-fallback">{card.title}</span>
                )}
              </a>

              <div className="store-card-footer">
                <h2>{card.title}</h2>
                <a href={shopStoreUrl} target="_blank" rel="noreferrer">
                  Get cards
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Store
