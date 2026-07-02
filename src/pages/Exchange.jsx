import { exchangeBookPage } from '../data/siteContent'

function Exchange() {
  return (
    <article className="attributes-page exchange-page book-preview-page">
      <div className="book-preview-layout">
        <aside className="book-preview-cover-panel" aria-label="Book cover">
          <img
            className="book-preview-cover"
            src={exchangeBookPage.coverImage}
            alt={`${exchangeBookPage.title}: ${exchangeBookPage.subtitle}`}
          />
        </aside>

        <div className="book-preview-scroll">
          <header className="attributes-hero exchange-hero book-preview-hero">
            <span className="eyebrow">{exchangeBookPage.eyebrow}</span>
            <h1>{exchangeBookPage.title}</h1>
            <p>{exchangeBookPage.subtitle}</p>
          </header>

          <section className="attributes-copy" aria-label="Book preview">
            {exchangeBookPage.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <p className="book-preview-highlight">Exchange the lie. Carry the truth.</p>
          </section>

          <section className="exchange-section" aria-labelledby="exchange-inside-title">
            <div className="attributes-list-header">
              <span className="eyebrow">Inside</span>
              <h2 id="exchange-inside-title">{exchangeBookPage.insideTitle}</h2>
              <p>{exchangeBookPage.insideIntro}</p>
            </div>

            <div className="exchange-devotion-grid">
              {exchangeBookPage.devotionParts.map((part) => (
                <article className="exchange-devotion-card" key={part.title}>
                  <h3>{part.title}</h3>
                  <p>{part.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="exchange-section" aria-labelledby="exchange-for-you-title">
            <div className="attributes-list-header">
              <span className="eyebrow">For You</span>
              <h2 id="exchange-for-you-title">{exchangeBookPage.forYouTitle}</h2>
            </div>

            <div className="exchange-lies-list">
              {exchangeBookPage.lies.map((lie) => (
                <span key={lie}>{lie}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  )
}

export default Exchange
