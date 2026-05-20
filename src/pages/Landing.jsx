import { Link } from 'react-router-dom'
import heroImage from '../assets/images/lightochero.jpeg'

function Landing() {
  return (
    <section className="landing-hero">
      <img
        className="landing-hero-image"
        src={heroImage}
        alt=""
      />
      <div className="landing-hero-overlay" />
      <div className="landing-hero-inner">
        <h1>Light Overcomes</h1>

        <div className="landing-hero-actions">
          <Link className="hero-button hero-button-secondary" to="/about">
            About the Mission
          </Link>
          <Link className="hero-button hero-button-primary" to="/witness-cards">
            View Resources
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Landing
