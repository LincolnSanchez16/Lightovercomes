import { callingAllLeadersBook } from '../data/callingAllLeadersContent'

function CallingAllLeaders() {
  return (
    <article className="attributes-page book-preview-page warriors-page">
      <div className="book-preview-layout">
        <aside className="book-preview-cover-panel" aria-label="Book cover">
          <img
            className="book-preview-cover"
            src={callingAllLeadersBook.coverImage}
            alt={`${callingAllLeadersBook.title}: ${callingAllLeadersBook.subtitle}`}
          />
        </aside>

        <div className="book-preview-scroll">
          <header className="attributes-hero book-preview-hero warriors-hero">
            <span className="eyebrow">{callingAllLeadersBook.eyebrow}</span>
            <h1>{callingAllLeadersBook.title}</h1>
            <p>{callingAllLeadersBook.subtitle}</p>
          </header>

          <section className="attributes-copy" aria-label="Book preview">
            <p>{callingAllLeadersBook.shortDescription}</p>
            {callingAllLeadersBook.introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="book-preview-highlight">{callingAllLeadersBook.freedomScripture}</p>
          </section>

          <BookSection title="Why This Book Matters">
            {callingAllLeadersBook.whyItMatters.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="warriors-list warriors-questions">
              {callingAllLeadersBook.deeperQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </BookSection>

          <BookSection title="What Readers Will Find Inside">
            <p>{callingAllLeadersBook.insideIntro}</p>
            <div className="warriors-text-sections">
              {callingAllLeadersBook.devotionalElements.map((element) => (
                <section key={element.title}>
                  <h3>{element.title}</h3>
                  <p>{element.description}</p>
                </section>
              ))}
            </div>
          </BookSection>

          <BookSection title="Who This Book Is For">
            <p>{callingAllLeadersBook.audienceIntro}</p>
            <ul className="warriors-list">
              {callingAllLeadersBook.audiences.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </BookSection>

          <BookSection title="A Message of Hope">
            <div className="warriors-hope-lines">
              {callingAllLeadersBook.hope.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p>{callingAllLeadersBook.identityHope}</p>
            <p className="book-preview-highlight">{callingAllLeadersBook.conquerorsScripture}</p>
          </BookSection>

          <BookSection title="The Goal of This Book">
            {callingAllLeadersBook.goal.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="warriors-list warriors-yes-list">
              {callingAllLeadersBook.freedomYeses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </BookSection>

          <BookSection title="Take the Next Step">
            {callingAllLeadersBook.nextStep.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </BookSection>

          <BookSection title="100 Battle Cries to Break Bondage to Porn and Other Sins">
            <p>{callingAllLeadersBook.battleCriesIntro}</p>
          </BookSection>

          <BookSection title="100 Problems Linked to Pornography">
            <div className="warriors-problem-groups">
              {callingAllLeadersBook.problemGroups.map((group) => (
                <section key={group.title}>
                  <h3>{group.title}</h3>
                  <ul className="warriors-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </BookSection>

          <BookSection title="A Prayer of Surrendering My Sexuality to the Holy Spirit">
            <div className="warriors-prayer">
              {callingAllLeadersBook.prayer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </BookSection>

          <BookSection title="Steps to Freedom from a Stronghold">
            <p>{callingAllLeadersBook.freedomStepsIntro}</p>
            <ol className="warriors-steps">
              {callingAllLeadersBook.freedomSteps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
            <p>{callingAllLeadersBook.freedomStepsClosing}</p>
          </BookSection>

          <BookSection title="100 Quotes to Help People Turn Away from Pornography">
            <ol className="warriors-quotes">
              {callingAllLeadersBook.quotes.map((quote) => (
                <li key={quote}>{quote}</li>
              ))}
            </ol>
          </BookSection>
        </div>
      </div>
    </article>
  )
}

function BookSection({ title, children }) {
  const id = `warriors-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`

  return (
    <section className="warriors-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <div className="warriors-section-copy">{children}</div>
    </section>
  )
}

export default CallingAllLeaders
