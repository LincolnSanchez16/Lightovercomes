import { Link } from 'react-router-dom'
import { aboutContent } from '../data/siteContent'

const aboutVideoSrc = '/videos/about-us.mp4'

function About() {
  return (
    <section className="about-page">
      <div className="about-intro">
        <span className="eyebrow">{aboutContent.eyebrow}</span>
        <h1>{aboutContent.title}</h1>
        <p>{aboutContent.description}</p>
      </div>

      <section className="about-video-section" aria-labelledby="about-video-title">
        <div className="about-video-copy">
          <h2 id="about-video-title">{aboutContent.video.label}</h2>
          <p>{aboutContent.video.description}</p>
        </div>

        <div className="about-video-frame">
          <video
            className="about-video"
            controls
            playsInline
            preload="metadata"
            src={aboutVideoSrc}
          />
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-purpose-title">
        <div className="about-section-header">
          <span className="eyebrow">Mission</span>
          <h2 id="about-purpose-title">Mission and Vision</h2>
        </div>
        <div className="about-card-grid about-statement-grid">
          {aboutContent.missionVision.map((block) => (
            <article className="about-info-card about-statement-card" key={block.title}>
              <h3>{block.title}</h3>
              <p>{block.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="investing-title">
        <div className="about-section-header">
          <span className="eyebrow">Kingdom Investment</span>
          <h2 id="investing-title">{aboutContent.investing.title}</h2>
          <p>{aboutContent.investing.description}</p>
        </div>
        <div className="about-allocation-panel">
          <p>{aboutContent.investing.allocationIntro}</p>
          <div className="about-allocation-grid">
            {aboutContent.investing.allocations.map((item) => (
              <div className="about-allocation-item" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="kingdom-purposes-title">
        <div className="about-section-header">
          <span className="eyebrow">Kingdom Purposes</span>
          <h2 id="kingdom-purposes-title">Three Places Profit Is Directed</h2>
        </div>
        <div className="about-card-grid about-card-grid-three">
          {aboutContent.kingdomPurposes.map((purpose) => (
            <article className="about-info-card" key={purpose.title}>
              <h3>{purpose.title}</h3>
              <p>{purpose.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="join-team-title">
        <div className="about-section-header">
          <span className="eyebrow">Serve</span>
          <h2 id="join-team-title">{aboutContent.joinTeam.title}</h2>
          <p>{aboutContent.joinTeam.description}</p>
        </div>
        <div className="about-skill-grid" aria-label="Skills and gifts needed">
          {aboutContent.joinTeam.skills.map((skill) => (
            <span className="about-skill-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>
        <div className="about-section-action">
          <a className="inline-page-button" href="#about-cta-title">
            {aboutContent.joinTeam.cta}
          </a>
        </div>
      </section>

      <section className="about-section" aria-labelledby="core-beliefs-title">
        <div className="about-section-header">
          <span className="eyebrow">Core Beliefs</span>
          <h2 id="core-beliefs-title">
            Find a Church That Follows the Core Beliefs of the Christian Faith
          </h2>
        </div>
        <div className="about-beliefs-grid">
          {aboutContent.coreBeliefs.map((belief) => (
            <article className="about-belief-card" key={belief.title}>
              <h3>{belief.title}</h3>
              <p>{belief.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="external-resources-title">
        <div className="about-section-header">
          <span className="eyebrow">Outside Links</span>
          <h2 id="external-resources-title">Helpful External Resources</h2>
          <p>These are outside tools and teachers, not content owned by Light Overcomes.</p>
        </div>
        <div className="about-external-grid">
          {aboutContent.externalResources.map((group) => (
            <div className="about-external-group" key={group.title}>
              <h3>{group.title}</h3>
              <div className="about-external-links">
                {group.links.map((link) =>
                  link.href ? (
                    <a
                      href={link.href}
                      key={link.label}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span className="about-external-placeholder" key={link.label}>
                      {link.label}
                      <small>Link coming soon</small>
                    </span>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="available-content-title">
        <div className="about-section-header">
          <span className="eyebrow">Current Tools</span>
          <h2 id="available-content-title">Available Content</h2>
        </div>
        <div className="about-card-grid about-card-grid-three">
          {aboutContent.availableContent.map((item) => (
            <Link className="about-link-card" key={item.path} to={item.path}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span>Open</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="coming-soon-title">
        <div className="about-section-header">
          <span className="eyebrow">Future Ideas</span>
          <h2 id="coming-soon-title">Coming Soon</h2>
        </div>
        <div className="about-soon-grid">
          {aboutContent.comingSoon.map((item) => (
            <div className="about-soon-item" key={item}>
              <span>{item}</span>
              <small>Coming soon</small>
            </div>
          ))}
        </div>
      </section>

      <section className="about-cta" aria-labelledby="about-cta-title">
        <h2 id="about-cta-title">{aboutContent.cta.title}</h2>
        <p>{aboutContent.cta.description}</p>
        <Link className="inline-page-button" to={aboutContent.cta.path}>
          {aboutContent.cta.label}
        </Link>
      </section>
    </section>
  )
}

export default About
