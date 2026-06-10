import { Link } from 'react-router-dom'
import heroImage from '../assets/images/greenheroLO.jpeg'
import { homeContent } from '../data/siteContent'

function Home() {
  return (
    <>
      <section className="landing-hero hero-frame-shell">
        <div className="landing-hero-media hero-frame-media">
          <img
            className="landing-hero-image hero-frame-image"
            src={heroImage}
            alt=""
          />
          <div className="landing-hero-overlay hero-frame-overlay" />
        </div>
        <div className="landing-hero-inner">
          <h1>{homeContent.title}</h1>

          <div className="landing-hero-actions">
            {homeContent.heroActions.map((action) => (
              <Link
                key={action.path}
                className={`hero-button hero-button-${action.variant}`}
                to={action.path}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section-wide">
        <div className="home-section-inner">
          <span className="eyebrow">Mission</span>
          <h2>{homeContent.missionTeaser}</h2>
          <p>{homeContent.visionTeaser}</p>
        </div>
      </section>

      <section className="home-section home-section-narrow">
        <div className="home-section-inner">
          <span className="eyebrow">Resources</span>
          <h2>{homeContent.resourcesCta.title}</h2>
          <p>{homeContent.resourcesCta.description}</p>
          <Link className="inline-page-button" to={homeContent.resourcesCta.path}>
            {homeContent.resourcesCta.label}
          </Link>
        </div>
      </section>

      <section className="home-section home-section-narrow">
        <div className="home-section-inner">
          <span className="eyebrow">About</span>
          <h2>{homeContent.aboutPreview.title}</h2>
          <p>{homeContent.aboutPreview.description}</p>
          <Link className="inline-page-button" to={homeContent.aboutPreview.path}>
            {homeContent.aboutPreview.label}
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home
