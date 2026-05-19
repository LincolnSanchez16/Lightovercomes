import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navigationLinks, organizationName } from '../../data/siteContent'

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
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
    pathname === '/gospel-cards'

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
            {organizationName}
          </NavLink>
        </div>

        <nav aria-label="Primary navigation" className="site-nav">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              className={() => {
                const isActive =
                  link.path === '/resources'
                    ? isResourcesRoute
                    : pathname === link.path || (link.path === '/' && pathname === '/home')

                return isActive ? 'nav-link nav-link-active' : 'nav-link'
              }}
              to={link.path}
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
