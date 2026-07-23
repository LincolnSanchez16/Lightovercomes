import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { navigationLinks, organizationName } from '../../data/siteContent'

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { pathname } = location

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const isResourcesRoute =
    pathname === '/resources' ||
    pathname === '/christian-values' ||
    pathname === '/calling-all-leaders' ||
    pathname === '/called-to-be-warriors-leaders-and-champions' ||
    pathname === '/witness-card-library' ||
    pathname === '/attributes-of-god' ||
    pathname === '/daily-encounters-with-god' ||
    pathname === '/exchange' ||
    pathname === '/lies-of-the-enemy-for-gods-truth'

  const isWitnessRoute =
    pathname === '/witness' ||
    pathname === '/witness-cards' ||
    pathname === '/witness-card-videos' ||
    pathname === '/visitor-center' ||
    pathname === '/qr' ||
    pathname === '/gospel-cards'

  const isStoreRoute = pathname === '/store' || pathname === '/shop'

  return (
    <header
      className={
        isScrolled
          ? 'site-header site-header-scrolled'
          : 'site-header'
      }
    >
      <div className="container header-inner">
        <div className="brand-block">
          <NavLink className="brand-mark" to="/">
            <img
              className="brand-logo"
              src="/brand/light-overcomes-logo-nav.png"
              alt=""
              decoding="async"
            />
            {organizationName}
          </NavLink>
        </div>

        <button
          className="nav-menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
        >
          {isMenuOpen ? (
            <X className="nav-menu-icon" aria-hidden="true" />
          ) : (
            <Menu className="nav-menu-icon" aria-hidden="true" />
          )}
        </button>

        <nav
          id="primary-navigation"
          aria-label="Primary navigation"
          className={isMenuOpen ? 'site-nav site-nav-open' : 'site-nav'}
        >
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              className={() => {
                const isActive =
                  (link.path === '/resources' && isResourcesRoute) ||
                  (link.path === '/witness-cards' && isWitnessRoute) ||
                  (link.path === '/store' && isStoreRoute) ||
                  pathname === link.path ||
                  (link.path === '/' && pathname === '/home')

                return isActive ? 'nav-link nav-link-active' : 'nav-link'
              }}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
