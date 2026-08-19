import { Link } from 'react-router-dom'
import aboutHomeImage from '../assets/images/about-forest.jpeg'
import connectImage from '../assets/images/lightochero.jpeg'
import heroImage from '../assets/images/LOnewgreen.jpeg'
import ContactForm from '../components/contact/ContactForm'
import EmailSignupForm from '../components/email/EmailSignupForm'
import { homeContent } from '../data/siteContent'
import { isContactFormVisible } from '../lib/contactMessages'
import { isEmailSignupVisible } from '../lib/emailSubscribers'

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
          <p className="home-vision-statement">{homeContent.visionTeaser}</p>
        </div>
      </section>

      {isEmailSignupVisible ? (
        <section className="home-connect-section" aria-labelledby="home-connect-title">
          <div className="home-connect-media" aria-hidden="true">
            <img src={connectImage} alt="" />
            <div className="home-connect-overlay" />
          </div>
          <div className="home-connect-inner">
            <div className="home-connect-copy">
              <span className="eyebrow">Stay Connected</span>
              <h2 id="home-connect-title">Carry the light forward.</h2>
              <p>
                Receive new resources, ministry updates, and practical ways to know, live, and
                share the hope of Jesus.
              </p>
            </div>
            <EmailSignupForm pagePath="/" source="home-inline" />
          </div>
        </section>
      ) : null}

      <section className="home-section home-feature-section home-feature-resources">
        <div className="home-feature-inner">
          <div className="home-feature-copy">
            <span className="eyebrow">Resources</span>
            <h2>{homeContent.resourcesCta.title}</h2>
          </div>
          <div className="home-feature-action">
            <Link className="inline-page-button" to={homeContent.resourcesCta.path}>
              {homeContent.resourcesCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-feature-section home-feature-about">
        <div className="home-feature-media" aria-hidden="true">
          <img src={aboutHomeImage} alt="" />
          <div className="home-feature-overlay" />
        </div>
        <div className="home-feature-inner">
          <div className="home-feature-copy">
            <span className="eyebrow">About</span>
            <h2>{homeContent.aboutPreview.title}</h2>
          </div>
          <div className="home-feature-action">
            <Link className="inline-page-button" to={homeContent.aboutPreview.path}>
              {homeContent.aboutPreview.label}
            </Link>
          </div>
        </div>
      </section>

      {isContactFormVisible ? (
        <section className="home-contact-section" aria-labelledby="home-contact-title">
          <div className="home-contact-inner">
            <div className="home-contact-copy">
              <span className="eyebrow">Contact Light Overcomes</span>
              <h2 id="home-contact-title">
                What questions, ideas, or success stories would you like to share with us?
              </h2>
              <p>We would be glad to hear from you.</p>
            </div>
            <ContactForm pagePath="/" source="home-contact" />
          </div>
        </section>
      ) : null}
    </>
  )
}

export default Home
