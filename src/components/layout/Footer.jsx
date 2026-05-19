import { footerText, organizationName } from '../../data/siteContent'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>{organizationName}</p>
        <p>{footerText}</p>
      </div>
    </footer>
  )
}

export default Footer
