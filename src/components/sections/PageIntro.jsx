function PageIntro({ title, description }) {
  return (
    <section className="page-panel">
      <span className="eyebrow">Starter Foundation</span>
      <h1>{title}</h1>
      <p>{description}</p>

      {/* Future section content for this page will be added here. */}
      <div className="placeholder-block">
        <p>This page is ready for future content sections, messaging, and visuals.</p>
      </div>
    </section>
  )
}

export default PageIntro
