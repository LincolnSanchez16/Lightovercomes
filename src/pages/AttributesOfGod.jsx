import { attributesOfGodPage } from '../data/siteContent'

function AttributesOfGod() {
  return (
    <article className="attributes-page book-preview-page">
      <div className="book-preview-layout">
        <aside className="book-preview-cover-panel" aria-label="Book cover">
          <img
            className="book-preview-cover"
            src={attributesOfGodPage.coverImage}
            alt={attributesOfGodPage.title}
          />
        </aside>

        <div className="book-preview-scroll">
          <header className="attributes-hero book-preview-hero">
            <span className="eyebrow">{attributesOfGodPage.eyebrow}</span>
            <h1>{attributesOfGodPage.title}</h1>
          </header>

          <section className="attributes-copy" aria-label="Book preview">
            {attributesOfGodPage.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <p className="book-preview-highlight">{attributesOfGodPage.scripture}</p>
          </section>

          <section className="attributes-list-section" aria-labelledby="attributes-covered-title">
            <div className="attributes-list-header">
              <span className="eyebrow">Attributes Covered</span>
              <h2 id="attributes-covered-title">A daily look at who God is.</h2>
            </div>

            <div className="attributes-grid">
              {attributesOfGodPage.attributes.map((attribute) => (
                <span className="attribute-pill" key={attribute}>
                  {attribute}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  )
}

export default AttributesOfGod
