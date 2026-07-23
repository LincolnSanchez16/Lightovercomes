import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/images/LOnewgreen.jpeg'
import EmailSignupForm from '../components/email/EmailSignupForm'
import { aboutContent, shopStoreUrl } from '../data/siteContent'
import { isEmailSignupVisible } from '../lib/emailSubscribers'

const aboutVideoSrc = '/videos/about-us.mp4'
const aboutVideoPoster = '/images/about-video-poster.jpg'

function AboutDisclosure({ children, eyebrow, title }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()

  return (
    <div className={`about-disclosure${isOpen ? ' is-open' : ''}`}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="about-disclosure-summary"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span>
          <small>{eyebrow}</small>
          <strong>{title}</strong>
        </span>
        <ChevronDown className="about-disclosure-icon" aria-hidden="true" />
      </button>
      <div aria-hidden={!isOpen} className="about-disclosure-panel" id={panelId}>
        <div className="about-disclosure-panel-clip">
          <div className="about-disclosure-content">{children}</div>
        </div>
      </div>
    </div>
  )
}

function About() {
  return (
    <section className="about-page">
      <div className="about-opening">
        <div className="about-intro">
          <h1>{aboutContent.title}</h1>
          <p>{aboutContent.description}</p>
        </div>

        <section className="about-video-section" aria-labelledby="about-video-title">
          <h2 className="visually-hidden" id="about-video-title">
            {aboutContent.video.label}
          </h2>
          <div className="about-video-frame">
            <video
              className="about-video"
              controls
              playsInline
              preload="metadata"
              poster={aboutVideoPoster}
              src={aboutVideoSrc}
            />
          </div>
        </section>
      </div>

      <section className="about-section" aria-labelledby="about-purpose-title">
        <div className="about-section-header">
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

      <section className="about-disclosures" aria-labelledby="about-discover-title">
        <div className="about-section-header">
          <span className="eyebrow">Discover</span>
          <h2 id="about-discover-title">Explore Light Overcomes</h2>
        </div>

        <div className="about-disclosure-list">
          <AboutDisclosure eyebrow="Kingdom Investment" title="Invest in the Kingdom">
            <div className="about-disclosure-intro">
              <h3>{aboutContent.investing.title}</h3>
              <p>{aboutContent.investing.description}</p>
            </div>
            <div className="about-card-grid about-card-grid-three about-kingdom-grid">
              {aboutContent.kingdomPurposes.map((purpose) => (
                <article className="about-info-card" key={purpose.title}>
                  <h3>{purpose.title}</h3>
                </article>
              ))}
            </div>
            <div className="about-section-action">
              <a className="inline-page-button" href={shopStoreUrl} target="_blank" rel="noreferrer">
                Shop with Purpose
              </a>
            </div>
          </AboutDisclosure>

          <AboutDisclosure eyebrow="Resources" title="Get Free Resources">
            <div className="about-disclosure-intro">
              <h3>Choose what will help you grow and share your faith.</h3>
              <p>Explore free values, witness messages, book previews, and practical tools.</p>
            </div>
            <div className="about-section-action">
              <Link className="inline-page-button" to="/resources">
                Choose Resources
              </Link>
            </div>
          </AboutDisclosure>

          <AboutDisclosure eyebrow="Serve" title="Join the Team">
            <div className="about-disclosure-intro">
              <h3>{aboutContent.joinTeam.title}</h3>
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
              <a className="inline-page-button" href={aboutContent.joinTeam.contactHref}>
                Contact Us
              </a>
            </div>
          </AboutDisclosure>

          <AboutDisclosure eyebrow="Current Tools" title="Content Available">
            <div className="about-card-grid about-card-grid-three">
              {aboutContent.availableContent.map((item) => (
                <Link className="about-link-card" key={item.path} to={item.path}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span>Open</span>
                </Link>
              ))}
            </div>
          </AboutDisclosure>

          <AboutDisclosure eyebrow="In Development" title="Coming Soon">
            <div className="about-soon-grid">
              {aboutContent.comingSoon.map((item) => (
                <div className="about-soon-item" key={item}>
                  <span>{item}</span>
                  <small>In development</small>
                </div>
              ))}
            </div>
            <div className="about-print-options">
              <h3>Witness Card Options</h3>
              <p>
                Downloadable print-shop files are being explored as a more affordable option. Shipped
                witness cards are already available through the Light Overcomes store.
              </p>
              <a className="inline-page-button" href={shopStoreUrl} target="_blank" rel="noreferrer">
                Order Shipped Cards
              </a>
            </div>
          </AboutDisclosure>

          <AboutDisclosure eyebrow="Start Here" title="Explore the Resources">
            <div className="about-disclosure-intro">
              <h3>{aboutContent.cta.title}</h3>
              <p>{aboutContent.cta.description}</p>
            </div>
            <div className="about-section-action">
              <Link className="inline-page-button" to={aboutContent.cta.path}>
                {aboutContent.cta.label}
              </Link>
            </div>
          </AboutDisclosure>

          <AboutDisclosure eyebrow="Core Beliefs" title="What We Believe">
            <div className="about-disclosure-intro">
              <h3>Find a Church That Follows the Core Beliefs of the Christian Faith</h3>
              <p>Look for a church that teaches Scripture clearly and helps people follow Jesus.</p>
            </div>
            <div className="about-beliefs-grid">
              {aboutContent.coreBeliefs.map((belief) => (
                <article className="about-belief-card" key={belief.title}>
                  <h3>{belief.title}</h3>
                  <p>{belief.description}</p>
                </article>
              ))}
            </div>
          </AboutDisclosure>
        </div>
      </section>

      {isEmailSignupVisible ? (
        <section className="about-email-signup" aria-labelledby="about-email-signup-title">
          <div className="about-email-signup-media" aria-hidden="true">
            <img src={heroImage} alt="" />
            <div className="about-email-signup-overlay" />
          </div>
          <div className="about-email-signup-inner">
            <div>
              <span className="eyebrow">Stay Connected</span>
              <h2 id="about-email-signup-title">Stay close to what is being built.</h2>
            </div>
            <div className="about-email-signup-form">
              <p>
                Receive new resources, ministry updates, and opportunities to take part in the
                mission of Light Overcomes.
              </p>
              <EmailSignupForm pagePath="/about" source="about-inline" />
            </div>
          </div>
        </section>
      ) : null}
    </section>
  )
}

export default About
