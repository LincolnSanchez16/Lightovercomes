import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <nav className="container footer-inner" aria-label="Legal links">
        <Link className="footer-link" to="/terms">
          Terms of Service
        </Link>
        <Link className="footer-link" to="/privacy">
          Privacy Policy
        </Link>
        <span
          aria-hidden="true"
          className="footer-signup-slot"
          id="email-signup-footer-slot"
        />
      </nav>
    </footer>
  )
}

export default Footer
